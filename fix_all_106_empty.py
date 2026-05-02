#!/usr/bin/env python3
"""Fix all 106 empty enums and interfaces."""

import re
from pathlib import Path

SRC_DIR = Path("src/main/java/com/you/lld/problems")
PROBLEMS_DIR = Path("docs/problems")

# Common enum values by type
ENUM_VALUES = {
    'OrderStatus': ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    'PaymentStatus': ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    'PaymentMethod': ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH_ON_DELIVERY'],
    'TransactionStatus': ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    'TransactionType': ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT'],
    'UserStatus': ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED'],
    'AccountType': ['SAVINGS', 'CURRENT', 'CREDIT'],
    'CardStatus': ['ACTIVE', 'BLOCKED', 'EXPIRED'],
    'ATMState': ['IDLE', 'CARD_INSERTED', 'PIN_ENTERED', 'TRANSACTION_IN_PROGRESS'],
    'AuctionStatus': ['SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED'],
    'BidStatus': ['PLACED', 'WINNING', 'OUTBID', 'WON', 'LOST'],
    'PieceType': ['KING', 'QUEEN', 'ROOK', 'BISHOP', 'KNIGHT', 'PAWN'],
    'Color': ['WHITE', 'BLACK'],
    'Ingredient': ['COFFEE', 'MILK', 'WATER', 'SUGAR'],
    'Beverage': ['ESPRESSO', 'LATTE', 'CAPPUCCINO', 'AMERICANO'],
    'BeverageType': ['ESPRESSO', 'LATTE', 'CAPPUCCINO', 'AMERICANO', 'MOCHA'],
    'PlayerRole': ['BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER'],
    'MatchStatus': ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'],
    'Direction': ['UP', 'DOWN', 'NONE'],
    'ElevatorStatus': ['IDLE', 'MOVING_UP', 'MOVING_DOWN', 'MAINTENANCE'],
    'FileType': ['FILE', 'DIRECTORY', 'SYMLINK'],
    'RestaurantStatus': ['OPEN', 'CLOSED', 'BUSY'],
    'PartnerStatus': ['AVAILABLE', 'BUSY', 'OFFLINE'],
    'ProductStatus': ['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED', 'COMING_SOON'],
    'EnrollmentStatus': ['ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED'],
    'BookStatus': ['AVAILABLE', 'CHECKED_OUT', 'RESERVED', 'LOST'],
    'PostType': ['TEXT', 'IMAGE', 'VIDEO', 'ARTICLE', 'POLL'],
    'PostVisibility': ['PUBLIC', 'CONNECTIONS', 'PRIVATE'],
    'JobStatus': ['OPEN', 'CLOSED', 'FILLED'],
    'JobType': ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
    'RequestStatus': ['PENDING', 'ACCEPTED', 'REJECTED'],
    'RefundStatus': ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
    'MessageStatus': ['SENT', 'DELIVERED', 'READ', 'FAILED'],
    'RateLimitAlgorithm': ['TOKEN_BUCKET', 'LEAKY_BUCKET', 'FIXED_WINDOW', 'SLIDING_WINDOW'],
    'TableStatus': ['AVAILABLE', 'RESERVED', 'OCCUPIED'],
    'TripStatus': ['REQUESTED', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'],
    'DriverStatus': ['AVAILABLE', 'BUSY', 'OFFLINE'],
    'VehicleType': ['SEDAN', 'SUV', 'BIKE', 'AUTO'],
    'NotificationType': ['FRIEND_REQUEST', 'MESSAGE', 'POST_LIKE', 'COMMENT'],
    'FriendRequestStatus': ['PENDING', 'ACCEPTED', 'REJECTED'],
    'SplitType': ['EQUAL', 'EXACT', 'PERCENTAGE', 'SHARE'],
    'PlaybackState': ['PLAYING', 'PAUSED', 'STOPPED'],
    'SubscriptionTier': ['FREE', 'PREMIUM', 'FAMILY'],
    'Genre': ['POP', 'ROCK', 'JAZZ', 'CLASSICAL', 'HIP_HOP'],
    'RepeatMode': ['OFF', 'ONE', 'ALL'],
    'OrderType': ['MARKET', 'LIMIT', 'STOP_LOSS'],
    'TaskStatus': ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'],
    'Priority': ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    'UserRole': ['ADMIN', 'MANAGER', 'MEMBER', 'VIEWER'],
    'GameStatus': ['IN_PROGRESS', 'WON', 'LOST', 'DRAW'],
    'Signal': ['RED', 'YELLOW', 'GREEN'],
    'EvictionPolicy': ['LRU', 'LFU', 'FIFO'],
}

# Common interface methods
INTERFACE_METHODS = {
    'ATMService': ['+authenticate(card, pin) boolean', '+withdraw(amount) void', '+deposit(amount) void', '+checkBalance() BigDecimal'],
    'AuctionService': ['+createAuction(item) String', '+placeBid(auctionId, bid) void', '+endAuction(auctionId) void'],
    'AutocompleteService': ['+autocomplete(prefix) List~String~', '+addWord(word) void'],
    'BloomFilterService': ['+add(element) void', '+contains(element) boolean'],
    'ChessGame': ['+move(from, to) boolean', '+isCheck() boolean', '+isCheckmate() boolean'],
    'CoffeeMachine': ['+selectBeverage(type) void', '+insertMoney(amount) void', '+dispense() Beverage'],
    'CricinfoService': ['+createMatch(match) String', '+updateScore(matchId, score) void', '+getMatchDetails(matchId) Match'],
    'ElevatorScheduler': ['+requestElevator(floor, direction) void', '+allocateElevator(request) Elevator'],
    'ElevatorController': ['+moveToFloor(floor) void', '+openDoor() void', '+closeDoor() void'],
    'FeatureFlagService': ['+isEnabled(flagName, userId) boolean', '+createFlag(flag) void', '+updateFlag(flag) void'],
    'FoodDeliveryService': ['+placeOrder(order) String', '+trackOrder(orderId) Order', '+cancelOrder(orderId) void'],
    'InventoryService': ['+addProduct(product) void', '+updateStock(productId, quantity) void', '+getStock(productId) int'],
    'OrderService': ['+createOrder(order) String', '+getOrder(orderId) Order', '+updateOrderStatus(orderId, status) void'],
    'KVStoreService': ['+put(key, value) void', '+get(key) String', '+delete(key) void'],
    'KVStore': ['+put(key, value) void', '+get(key) String', '+delete(key) void', '+exists(key) boolean'],
    'PersistenceManager': ['+save(data) void', '+load() Map', '+clear() void'],
    'LibraryService': ['+addBook(book) void', '+checkoutBook(bookId, userId) void', '+returnBook(bookId) void'],
    'LinkedInService': ['+createPost(post) String', '+connect(userId, targetId) void', '+searchJobs(query) List~Job~'],
    'PaymentGatewayService': ['+processPayment(payment) String', '+refund(paymentId) void', '+getPaymentStatus(paymentId) PaymentStatus'],
    'Subscriber': ['+onMessage(message) void', '+onError(error) void'],
    'RateLimiter': ['+allowRequest(userId) boolean', '+addUser(userId, limit) void'],
    'RateLimitStrategy': ['+isAllowed(userId) boolean'],
    'RestaurantService': ['+createReservation(reservation) String', '+placeOrder(order) String', '+updateOrderStatus(orderId, status) void'],
    'RideHailingService': ['+requestRide(request) String', '+acceptRide(tripId, driverId) void', '+completeRide(tripId) void'],
    'SocialNetworkService': ['+createPost(post) String', '+addFriend(userId, friendId) void', '+sendMessage(message) void'],
    'FeedAlgorithm': ['+generateFeed(userId) List~Post~'],
    'NotificationService': ['+sendNotification(notification) void', '+getNotifications(userId) List~Notification~'],
    'SplitwiseService': ['+addExpense(expense) String', '+settleUp(userId, friendId) void', '+getBalance(userId) BigDecimal'],
    'TaskObserver': ['+onTaskUpdated(task) void', '+onTaskCompleted(task) void'],
    'AIStrategy': ['+getNextMove(board) Move'],
    'TrafficController': ['+changeSignal(signal) void', '+getCurrentSignal() Signal'],
    'VersionControl': ['+commit(message) String', '+checkout(commitId) void', '+diff(commit1, commit2) String'],
    'HashFunction': ['+hash(input) int'],
    'TargetingRule': ['+evaluate(context) boolean'],
}

def fix_problem(problem_name):
    """Fix all empty classes in a problem."""
    mmd_path = PROBLEMS_DIR / problem_name / "diagrams" / "class-diagram.mmd"
    if not mmd_path.exists():
        return 0
    
    content = mmd_path.read_text(encoding='utf-8')
    original = content
    fixed_count = 0
    
    # Fix pattern: "class X\n    <<enumeration>> X" -> proper enum
    for enum_name, values in ENUM_VALUES.items():
        pattern = rf'    class {enum_name}\s+<<enumeration>> {enum_name}'
        if re.search(pattern, content):
            values_str = '\n'.join([f'        {v}' for v in values])
            replacement = f'''    class {enum_name} {{
        <<enumeration>>
{values_str}
    }}'''
            content = re.sub(pattern, replacement, content)
            fixed_count += 1
    
    # Fix pattern: "class X\n    <<interface>> X" -> proper interface
    for interface_name, methods in INTERFACE_METHODS.items():
        pattern = rf'    class {interface_name}\s+<<interface>> {interface_name}'
        if re.search(pattern, content):
            methods_str = '\n'.join([f'        {m}' for m in methods])
            replacement = f'''    class {interface_name} {{
        <<interface>>
{methods_str}
    }}'''
            content = re.sub(pattern, replacement, content)
            fixed_count += 1
    
    # Remove "class for" syntax errors
    content = re.sub(r'    class for\s+<<interface>> for\s*\n', '', content)
    content = re.sub(r'    class for\s+\n', '', content)
    
    if content != original:
        mmd_path.write_text(content, encoding='utf-8')
        return fixed_count
    return 0

# Fix all problems
problems = [
    'atm', 'auction', 'autocomplete', 'bloomfilter', 'chess', 'coffeemachine',
    'cricinfo', 'elevator', 'featureflags', 'filesystem', 'fooddelivery',
    'inventory', 'kvstore', 'learningplatform', 'library', 'linkedin',
    'paymentgateway', 'pubsub', 'ratelimiter', 'restaurant', 'ridehailing',
    'simplesearch', 'socialnetwork', 'splitwise', 'spotify', 'stockexchange',
    'taskmanagement', 'tictactoe', 'trafficcontrol', 'versioncontrol'
]

print("="*70)
print(" FIXING ALL 106 EMPTY ENUMS AND INTERFACES")
print("="*70)
print()

total_fixed = 0
for problem in problems:
    count = fix_problem(problem)
    if count > 0:
        print(f"✅ {problem:<25} Fixed {count} classes")
        total_fixed += count

print()
print("="*70)
print(f"✅ Fixed {total_fixed} empty enums/interfaces across {len(problems)} problems")
print("="*70)
