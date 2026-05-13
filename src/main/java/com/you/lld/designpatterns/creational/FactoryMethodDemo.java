package com.you.lld.designpatterns.creational;

/**
 * Factory Method — defers instantiation to subclasses. Pick concrete type based on input
 * without exposing constructors to the caller.
 * Use cases: payment provider per region, notification channel per type, parser per format.
 */
public class FactoryMethodDemo {

    interface Notification { void send(String msg); }
    static class EmailNotification implements Notification {
        public void send(String msg) { System.out.println("email: " + msg); }
    }
    static class SmsNotification implements Notification {
        public void send(String msg) { System.out.println("sms: " + msg); }
    }
    static class PushNotification implements Notification {
        public void send(String msg) { System.out.println("push: " + msg); }
    }

    enum Channel { EMAIL, SMS, PUSH }

    static class NotificationFactory {
        public Notification create(Channel c) {
            switch (c) {
                case EMAIL: return new EmailNotification();
                case SMS:   return new SmsNotification();
                case PUSH:  return new PushNotification();
                default: throw new IllegalArgumentException("unknown: " + c);
            }
        }
    }

    public static void main(String[] args) {
        NotificationFactory f = new NotificationFactory();
        f.create(Channel.EMAIL).send("welcome");
        f.create(Channel.SMS).send("otp 1234");
        f.create(Channel.PUSH).send("order shipped");
    }
}
