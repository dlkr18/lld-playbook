package com.you.lld.problems.library.impl;

import com.you.lld.problems.library.api.LibraryService;
import com.you.lld.problems.library.api.NotificationService;
import com.you.lld.problems.library.exceptions.*;
import com.you.lld.problems.library.model.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * In-memory library service with:
 * <ul>
 *   <li>Role-based access control (LIBRARIAN vs MEMBER)</li>
 *   <li>Book (catalog) vs BookItem (physical copy) separation</li>
 *   <li>Fine-grained locking per BookItem for borrow/return/renew</li>
 *   <li>FIFO reservation queue per ISBN, fulfilled on return</li>
 *   <li>Due-date tracking with overdue fine calculation ($1/day)</li>
 *   <li>Renewal support (max 2, blocked if reservation exists)</li>
 *   <li>Observer-based notifications</li>
 * </ul>
 */
public class LibraryServiceImpl implements LibraryService {

    private static final double FINE_PER_DAY = 1.0;

    private final Map<String, Book> books = new ConcurrentHashMap<>();
    private final Map<String, BookItem> bookItems = new ConcurrentHashMap<>();
    private final Map<String, Member> members = new ConcurrentHashMap<>();
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();
    private final List<Transaction> transactions = new CopyOnWriteArrayList<>();

    private final Map<String, List<String>> isbnToBarcodes = new ConcurrentHashMap<>();
    private final Map<String, Queue<Reservation>> reservationQueues = new ConcurrentHashMap<>();
    private final Set<String> registeredEmails = ConcurrentHashMap.newKeySet();

    private final AtomicLong barcodeSeq = new AtomicLong(0);
    private final AtomicLong txnSeq = new AtomicLong(0);
    private final AtomicLong resSeq = new AtomicLong(0);

    private final List<NotificationService> notifiers = new CopyOnWriteArrayList<>();

    public LibraryServiceImpl() {}

    public void addNotifier(NotificationService notifier) {
        notifiers.add(notifier);
    }

    // ==================== Authorization helpers ====================

    private Member requireLibrarian(String accountId) {
        Member account = getMember(accountId);
        if (!account.isLibrarian()) {
            throw new UnauthorizedException(
                    "Only librarians can perform this operation (account: " + accountId + ")");
        }
        return account;
    }

    private Member requireMember(String accountId) {
        Member account = getMember(accountId);
        if (!account.isMember()) {
            throw new UnauthorizedException(
                    "This operation is for members only (account: " + accountId + ")");
        }
        return account;
    }

    // ==================== Catalog (LIBRARIAN only) ====================

    @Override
    public void addBook(String accountId, Book book) {
        requireLibrarian(accountId);
        if (books.containsKey(book.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN " + book.getIsbn() + " already exists");
        }
        books.put(book.getIsbn(), book);
    }

    @Override
    public String addBookItem(String accountId, String isbn, Rack rack) {
        requireLibrarian(accountId);
        Book book = books.get(isbn);
        if (book == null) {
            throw new BookNotFoundException("No catalog entry for ISBN: " + isbn);
        }
        String barcode = "BC-" + barcodeSeq.incrementAndGet();
        BookItem item = new BookItem(barcode, isbn, rack);
        bookItems.put(barcode, item);
        isbnToBarcodes.computeIfAbsent(isbn, k -> new CopyOnWriteArrayList<>()).add(barcode);
        return barcode;
    }

    @Override
    public Book getBook(String isbn) {
        Book book = books.get(isbn);
        if (book == null) throw new BookNotFoundException("ISBN not found: " + isbn);
        return book;
    }

    // ==================== Members ====================

    @Override
    public String registerMember(String accountId, String name, String email) {
        requireLibrarian(accountId);
        return createAccount(name, email, AccountType.MEMBER);
    }

    @Override
    public String registerLibrarian(String name, String email) {
        return createAccount(name, email, AccountType.LIBRARIAN);
    }

    private String createAccount(String name, String email, AccountType type) {
        if (!registeredEmails.add(email.toLowerCase())) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }
        String id = (type == AccountType.LIBRARIAN ? "LIB-" : "MEM-")
                + UUID.randomUUID().toString().substring(0, 8);
        Member account = new Member(id, name, email, type);
        members.put(id, account);
        return id;
    }

    @Override
    public Member getMember(String memberId) {
        Member m = members.get(memberId);
        if (m == null) throw new MemberNotFoundException("Account not found: " + memberId);
        return m;
    }

    // ==================== Borrow (MEMBER only) ====================

    @Override
    public void borrowBook(String memberId, String barcode) {
        Member member = requireMember(memberId);
        BookItem item = getBookItem(barcode);

        if (!member.canBorrow()) {
            if (member.getTotalFinesOwed() > 0) {
                throw new OutstandingFineException(
                        "Member has $" + String.format("%.2f", member.getTotalFinesOwed())
                                + " in unpaid fines");
            }
            throw new MaxBorrowLimitException(
                    "Member has reached the borrowing limit of " + member.getMaxBooksAllowed());
        }

        // State pattern handles validation:
        //   AvailableState.checkout -> succeeds
        //   ReservedState.checkout  -> succeeds only if memberId matches reserved member
        //   BorrowedState.checkout  -> throws IllegalStateException
        synchronized (item) {
            item.checkout(memberId);
            member.addBorrowedItem(barcode);
        }

        fulfillReservationForMember(item.getIsbn(), memberId);

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.BORROW));
    }

    // ==================== Return (MEMBER only) ====================

    @Override
    public double returnBook(String memberId, String barcode) {
        Member member = requireMember(memberId);
        BookItem item = getBookItem(barcode);

        double fineAmount = 0.0;

        synchronized (item) {
            if (!memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "BookItem " + barcode + " is not borrowed by member " + memberId);
            }

            if (item.isOverdue()) {
                long daysOverdue = ChronoUnit.DAYS.between(item.getDueDate(), LocalDate.now());
                fineAmount = daysOverdue * FINE_PER_DAY;
                member.chargeFine(fineAmount);
            }

            item.returnItem();
            member.removeBorrowedItem(barcode);
        }

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.RETURN, fineAmount));

        if (fineAmount > 0) {
            notifyMember(memberId, "Fine of $" + String.format("%.2f", fineAmount)
                    + " charged for overdue return of " + barcode);
        }

        processReservationQueue(item);
        return fineAmount;
    }

    // ==================== Renew (MEMBER only) ====================

    @Override
    public void renewBook(String memberId, String barcode) {
        requireMember(memberId);
        BookItem item = getBookItem(barcode);

        synchronized (item) {
            if (!memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "BookItem " + barcode + " is not borrowed by member " + memberId);
            }

            // Business rule: can't renew if someone else is waiting
            Queue<Reservation> queue = reservationQueues.get(item.getIsbn());
            if (queue != null && !queue.isEmpty()) {
                throw new IllegalStateException(
                        "Cannot renew -- there is an active reservation for ISBN " + item.getIsbn());
            }

            // State handles max-renewal validation (BorrowedState.renew throws if exceeded)
            item.renew();
        }

        transactions.add(new Transaction(
                nextTxnId(), memberId, barcode, TransactionType.RENEW));
    }

    // ==================== Reservations (MEMBER only) ====================

    @Override
    public String reserveBook(String memberId, String isbn) {
        requireMember(memberId);
        getBook(isbn);

        List<String> barcodes = isbnToBarcodes.getOrDefault(isbn, Collections.emptyList());
        for (String bc : barcodes) {
            BookItem item = bookItems.get(bc);
            if (item != null && memberId.equals(item.getBorrowedBy())) {
                throw new IllegalStateException(
                        "Member already has a copy of ISBN " + isbn + " (barcode: " + bc + ")");
            }
        }

        for (String bc : barcodes) {
            BookItem item = bookItems.get(bc);
            if (item != null && item.isAvailable()) {
                throw new IllegalStateException(
                        "A copy is available (barcode: " + bc + ") -- borrow it directly instead");
            }
        }

        Queue<Reservation> queue = reservationQueues.computeIfAbsent(
                isbn, k -> new LinkedBlockingDeque<>());
        for (Reservation r : queue) {
            if (r.getMemberId().equals(memberId) && r.getStatus() == ReservationStatus.WAITING) {
                throw new IllegalStateException(
                        "Member already has a pending reservation for ISBN " + isbn);
            }
        }

        String resId = "RES-" + resSeq.incrementAndGet();
        Reservation reservation = new Reservation(resId, memberId, isbn);
        reservations.put(resId, reservation);
        queue.add(reservation);

        transactions.add(new Transaction(
                nextTxnId(), memberId, "ISBN:" + isbn, TransactionType.RESERVE));

        notifyMember(memberId, "Reservation " + resId + " placed for ISBN " + isbn
                + ". You are #" + queue.size() + " in the queue.");
        return resId;
    }

    @Override
    public void cancelReservation(String reservationId) {
        Reservation res = reservations.get(reservationId);
        if (res == null) {
            throw new ReservationNotFoundException("Reservation not found: " + reservationId);
        }
        res.setStatus(ReservationStatus.CANCELLED);

        Queue<Reservation> queue = reservationQueues.get(res.getIsbn());
        if (queue != null) {
            queue.removeIf(r -> r.getId().equals(reservationId));
        }
    }

    // ==================== Search (ANY role) ====================

    @Override
    public List<Book> searchByTitle(String keyword) {
        String lower = keyword.toLowerCase();
        return books.values().stream()
                .filter(b -> b.getTitle().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    @Override
    public List<Book> searchByAuthor(String keyword) {
        String lower = keyword.toLowerCase();
        return books.values().stream()
                .filter(b -> b.getAuthor().toLowerCase().contains(lower))
                .collect(Collectors.toList());
    }

    @Override
    public Book searchByIsbn(String isbn) {
        return books.get(isbn);
    }

    @Override
    public List<BookItem> getAvailableCopies(String isbn) {
        List<String> barcodes = isbnToBarcodes.getOrDefault(isbn, Collections.emptyList());
        return barcodes.stream()
                .map(bookItems::get)
                .filter(Objects::nonNull)
                .filter(BookItem::isAvailable)
                .collect(Collectors.toList());
    }

    // ==================== Fines ====================

    @Override
    public double getOutstandingFines(String memberId) {
        return getMember(memberId).getTotalFinesOwed();
    }

    @Override
    public void payFine(String memberId, double amount) {
        Member member = getMember(memberId);
        if (amount <= 0) throw new IllegalArgumentException("Payment amount must be positive");
        if (amount > member.getTotalFinesOwed()) {
            throw new IllegalArgumentException("Payment $" + String.format("%.2f", amount)
                    + " exceeds outstanding fines $"
                    + String.format("%.2f", member.getTotalFinesOwed()));
        }
        member.payFine(amount);
        notifyMember(memberId, "Payment of $" + String.format("%.2f", amount)
                + " received. Remaining fines: $"
                + String.format("%.2f", member.getTotalFinesOwed()));
    }

    // ==================== History ====================

    @Override
    public List<Transaction> getMemberHistory(String memberId) {
        getMember(memberId);
        return transactions.stream()
                .filter(t -> t.getMemberId().equals(memberId))
                .collect(Collectors.toList());
    }

    // ==================== Internal helpers ====================

    private BookItem getBookItem(String barcode) {
        BookItem item = bookItems.get(barcode);
        if (item == null) throw new BookNotFoundException("BookItem not found: " + barcode);
        return item;
    }

    private void processReservationQueue(BookItem returnedItem) {
        Queue<Reservation> queue = reservationQueues.get(returnedItem.getIsbn());
        if (queue == null || queue.isEmpty()) return;

        Reservation next = null;
        while (!queue.isEmpty()) {
            Reservation candidate = queue.peek();
            if (candidate.getStatus() == ReservationStatus.WAITING) {
                next = candidate;
                break;
            }
            queue.poll();
        }

        if (next != null) {
            synchronized (returnedItem) {
                if (returnedItem.isAvailable()) {
                    // State transition: Available -> Reserved (for this member)
                    returnedItem.reserve(next.getMemberId());
                    next.setStatus(ReservationStatus.FULFILLED);
                    queue.poll();

                    notifyMember(next.getMemberId(),
                            "Your reservation for ISBN " + returnedItem.getIsbn()
                                    + " is ready! Barcode: " + returnedItem.getBarcode()
                                    + ". Please pick up within 3 days.");
                }
            }
        }
    }

    private void fulfillReservationForMember(String isbn, String memberId) {
        Queue<Reservation> queue = reservationQueues.get(isbn);
        if (queue != null) {
            queue.removeIf(r -> r.getMemberId().equals(memberId)
                    && r.getStatus() == ReservationStatus.FULFILLED);
        }
    }

    private void notifyMember(String memberId, String message) {
        for (NotificationService ns : notifiers) {
            ns.notify(memberId, message);
        }
    }

    private String nextTxnId() {
        return "TXN-" + txnSeq.incrementAndGet();
    }
}
