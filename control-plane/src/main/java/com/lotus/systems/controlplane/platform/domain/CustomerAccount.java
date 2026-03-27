package com.lotus.systems.controlplane.platform.domain;

public record CustomerAccount(
        String customerId,
        String companyName,
        String email,
        String lifecycleStatus
) {
}
