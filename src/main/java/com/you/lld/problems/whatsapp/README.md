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

## Design Patterns

| Pattern | Where | Why |
|---------|-------|-----|
| **Facade** | `WhatsApp` | Bundles user + chat services for demo/interview API. |
| **Composite** | `Chat` hierarchy (Direct/Group) | Uniform send/receive across chat types. |

## Run Demo

```bash
mvn -q compile exec:java -Dexec.mainClass="com.you.lld.problems.whatsapp.WhatsAppDemo"
```

## Key Talking Points

- **Message status** — SENT → DELIVERED → READ (double-check marks).
- **Group admin roles** — promote, add/remove participants.
- **Direct chat dedup** — same pair always maps to one ChatId.
