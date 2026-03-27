package com.lotus.systems.controlplane.platform.domain;

public record StripeSettings(
        boolean configured,
        String publishableKey,
        String webhookSecretConfigured
) {
}
