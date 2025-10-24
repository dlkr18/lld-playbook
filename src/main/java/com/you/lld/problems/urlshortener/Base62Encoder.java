package com.you.lld.problems.urlshortener;

/**
 * Utility class for Base62 encoding/decoding.
 * 
 * <p>Base62 uses [0-9a-zA-Z] = 62 characters for URL-safe encoding.
 * This provides a good balance between short codes and large namespace.
 * 
 * <p>Character mapping:
 * <ul>
 *   <li>0-9 → '0' to '9' (values 0-9)</li>
 *   <li>10-35 → 'a' to 'z' (values 10-35)</li>
 *   <li>36-61 → 'A' to 'Z' (values 36-61)</li>
 * </ul>
 * 
 * <p>Examples:
 * <ul>
 *   <li>1 → "1"</li>
 *   <li>62 → "10"</li>
 *   <li>123 → "1Z"</li>
 *   <li>123456 → "w7e"</li>
 * </ul>
 */
public class Base62Encoder {
    
    private static final String BASE62_CHARS = 
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    private static final int BASE = 62;
    
    /**
     * Encodes a positive long number to Base62 string.
     * 
     * @param num the number to encode (must be >= 0)
     * @return Base62 encoded string
     * @throws IllegalArgumentException if num is negative
     */
    public static String encode(long num) {
        if (num < 0) {
            throw new IllegalArgumentException("Number must be non-negative");
        }
        
        if (num == 0) {
            return "0";
        }
        
        StringBuilder result = new StringBuilder();
        while (num > 0) {
            int remainder = (int) (num % BASE);
            result.append(BASE62_CHARS.charAt(remainder));
            num /= BASE;
        }
        
        return result.reverse().toString();
    }
    
    /**
     * Encodes a number and pads to specified length.
     * 
     * @param num the number to encode
     * @param minLength minimum length of result (pads with '0' if needed)
     * @return Base62 encoded string with padding
     */
    public static String encode(long num, int minLength) {
        String encoded = encode(num);
        if (encoded.length() >= minLength) {
            return encoded;
        }
        
        // Pad with '0' characters
        StringBuilder padded = new StringBuilder();
        for (int i = 0; i < minLength - encoded.length(); i++) {
            padded.append('0');
        }
        padded.append(encoded);
        return padded.toString();
    }
    
    /**
     * Decodes a Base62 string back to a long number.
     * 
     * @param str the Base62 string to decode
     * @return decoded long number
     * @throws IllegalArgumentException if string contains invalid characters
     */
    public static long decode(String str) {
        if (str == null || str.isEmpty()) {
            throw new IllegalArgumentException("String cannot be null or empty");
        }
        
        long result = 0;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            int value = BASE62_CHARS.indexOf(c);
            if (value == -1) {
                throw new IllegalArgumentException("Invalid character in Base62 string: " + c);
            }
            result = result * BASE + value;
        }
        
        return result;
    }
    
    /**
     * Calculates the maximum number that can be represented with given length.
     * 
     * @param length the length of Base62 string
     * @return maximum representable number
     */
    public static long maxValue(int length) {
        return (long) Math.pow(BASE, length) - 1;
    }
}

