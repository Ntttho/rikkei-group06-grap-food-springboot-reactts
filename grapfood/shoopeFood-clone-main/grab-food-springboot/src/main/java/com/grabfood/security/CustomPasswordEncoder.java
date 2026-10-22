package com.grabfood.security;

import org.bouncycastle.crypto.generators.SCrypt;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;

@Component
public class CustomPasswordEncoder implements PasswordEncoder {

    private final BCryptPasswordEncoder bcrypt = new BCryptPasswordEncoder();
    private static final String SCRYPT_PREFIX = "scrypt$";

    @Override
    public String encode(CharSequence rawPassword) {
        return bcrypt.encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }

        String raw = rawPassword.toString();

        // 1. Check if BCrypt
        if (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$")) {
            return bcrypt.matches(rawPassword, encodedPassword);
        }

        // 2. Check if legacy Node.js scrypt format: scrypt$salt$derivedKeyHex
        if (encodedPassword.startsWith(SCRYPT_PREFIX)) {
            try {
                String[] parts = encodedPassword.split("\\$");
                if (parts.length == 3) {
                    byte[] salt = parts[1].getBytes(StandardCharsets.UTF_8);
                    byte[] expectedHash = Hex.decode(parts[2]);
                    // Node.js crypto.scrypt default params: N=16384, r=8, p=1, keyLen=64
                    byte[] actualHash = SCrypt.generate(
                        raw.getBytes(StandardCharsets.UTF_8),
                        salt,
                        16384,
                        8,
                        1,
                        expectedHash.length
                    );
                    return MessageDigest.isEqual(actualHash, expectedHash);
                }
            } catch (Exception ignored) {
                return false;
            }
        }

        // 3. Fallback for plaintext seed data (e.g. "123456", "123")
        return raw.equals(encodedPassword);
    }
}
