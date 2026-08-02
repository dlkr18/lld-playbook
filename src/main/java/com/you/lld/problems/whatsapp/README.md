# WhatsApp — LLD

Design messaging: users, direct/group chats, delivery receipts, typing, blocking.

## Package Structure

```
whatsapp/
  model/          User, Message, DirectChat, GroupChat, MessageContent
  service/        UserService, ChatService
  service/impl/   InMemoryUserService, InMemoryChatService
  WhatsApp.java   Facade
  WhatsAppDemo.java
```

## Class Diagram

```mermaid
classDiagram
    class WhatsApp {
        -UserService users
        -ChatService chats
        +sendMessage(ChatId, UserId, MessageContent) MessageId
        +createDirectChat(UserId, UserId) ChatId
    }
    class ChatService {
        <<interface>>
        +createDirectChat(UserId, UserId) ChatId
        +sendMessage(ChatId, UserId, MessageContent) MessageId
        +markRead(MessageId, UserId)
    }
    class InMemoryChatService {
        -Map~ChatId,Chat~ chats
        -Map~String,ChatId~ directChatIndex
        -Map~MessageId,Message~ messages
    }
    class Chat {
        <<interface>>
        +addMessage(Message)
        +getMessages(int, int) List~Message~
        +getUnreadCount(UserId) int
    }
    class DirectChat {
        -UserId user1
        -UserId user2
        -List~Message~ messages
        +synchronized addMessage(Message)
    }
    class GroupChat {
        -Map~UserId,Participant~ participants
        -List~Message~ messages
        +synchronized addMessage(Message)
        +promoteToAdmin(UserId)
    }
    class Message {
        -MessageId id
        -UserId senderId
        -Map~UserId,LocalDateTime~ deliveredTo
        -Map~UserId,LocalDateTime~ readBy
        -volatile MessageStatus status
        +synchronized markRead(UserId)
    }
    class Participant {
        -UserId userId
        -ParticipantRole role
    }

    WhatsApp --> ChatService
    WhatsApp --> UserService
    ChatService <|.. InMemoryChatService
    InMemoryChatService --> Chat
    Chat <|.. DirectChat
    Chat <|.. GroupChat
    DirectChat --> Message
    GroupChat --> Message
    GroupChat --> Participant
```

## Message Status

```mermaid
stateDiagram-v2
    [*] --> SENT: server accepts
    SENT --> DELIVERED: markDelivered(user)
    DELIVERED --> READ: markRead(user)
    SENT --> DELETED: delete() by sender
    DELIVERED --> DELETED: delete() by sender
    READ --> DELETED: delete() by sender
    DELETED --> [*]

    note right of DELIVERED
        Rolled-up status is derived.
        Truth is per participant:
        deliveredTo / readBy maps.
    end note
```

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `WhatsApp` | Bundles user + chat services for demo/interview API. |
| **Composite** | `Chat` hierarchy (Direct/Group) | Uniform send/receive across chat types — no `instanceof` in the service. |
| **Builder** | `Message.Builder` | 3 required + 4 optional fields (reply, forward, type, timestamp). |
| **Value Object** | `UserId`, `ChatId`, `MessageId`, `PhoneNumber` | Typed ids make swapped arguments a compile error. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.whatsapp.WhatsAppDemo"
```

## Key Talking Points

- **The chat is the lock.** Registries are `ConcurrentHashMap`, but that buys
  nothing for the per-chat message list. Each chat object is its own monitor, so
  sends to one chat serialize while different chats run fully parallel. A plain
  `ArrayList` under that lock beats `CopyOnWriteArrayList` for append-heavy history.
- **Receipts are per participant.** `deliveredTo` / `readBy` are maps, not booleans
  — a group message is delivered *to Bob*, read *by Carol*. The single
  `MessageStatus` is a derived convenience for the sender's tick UI.
- **Direct chat dedup is atomic.** An order-independent pair key plus
  `putIfAbsent` — check-then-act let 32 concurrent callers create 32 chats for one pair.
- **Unread via watermark.** Per-user `lastReadAt` rather than a counter that drifts.
- **Soft delete.** Tombstones keep ordering and receipts coherent ("This message was deleted").

See [INTERVIEW.md](INTERVIEW.md) for the full SDE2/SDE3 walkthrough, including the
measured message-loss and duplicate-chat reproductions.
