package com.you.lld.problems.snakeandladder.observer;

public class LoggingGameEventListener implements GameEventListener {

    @Override
    public void onEvent(GameEvent event) {
        System.out.println("  [EVENT " + event.getType() + "] " + event.getMessage());
    }
}
