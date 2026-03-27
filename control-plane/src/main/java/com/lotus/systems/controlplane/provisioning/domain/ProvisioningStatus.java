package com.lotus.systems.controlplane.provisioning.domain;

public enum ProvisioningStatus {
    ORDER_CREATED,
    PAYMENT_PENDING,
    PAYMENT_CONFIRMED,
    DOMAIN_IN_PROGRESS,
    DATABASE_IN_PROGRESS,
    DEPLOYMENT_IN_PROGRESS,
    MIGRATION_IN_PROGRESS,
    HEALTHCHECK_IN_PROGRESS,
    ACTIVE,
    FAILED,
    SUSPENDED,
    CANCELLED
}
