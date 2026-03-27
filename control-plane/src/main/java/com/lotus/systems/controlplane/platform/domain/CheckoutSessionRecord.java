package com.lotus.systems.controlplane.platform.domain;

public record CheckoutSessionRecord(
        String sessionId,
        String customerId,
        String productKey,
        String planKey,
        String domainOption,
        String databaseOption,
        String status,
        String checkoutUrl
) {
}
