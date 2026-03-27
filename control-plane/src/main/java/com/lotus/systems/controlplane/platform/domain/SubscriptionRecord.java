package com.lotus.systems.controlplane.platform.domain;

public record SubscriptionRecord(
        String subscriptionId,
        String customerId,
        String productKey,
        String planKey,
        String status,
        String domain,
        String databaseType,
        String environmentStatus
) {
}
