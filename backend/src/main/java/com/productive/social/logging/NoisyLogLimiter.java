package com.productive.social.logging;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NoisyLogLimiter {

    private static final Map<String, Instant> lastLoggedMap = new ConcurrentHashMap<>();

    // Only log a message if at least `intervalSeconds` passed since last log for that key
    public static boolean shouldLog(String key, long intervalSeconds) {
        Instant now = Instant.now();
        Instant lastTime = lastLoggedMap.get(key);

        if (lastTime == null || now.isAfter(lastTime.plusSeconds(intervalSeconds))) {
            lastLoggedMap.put(key, now);
            return true;
        }
        return false;
    }
}
