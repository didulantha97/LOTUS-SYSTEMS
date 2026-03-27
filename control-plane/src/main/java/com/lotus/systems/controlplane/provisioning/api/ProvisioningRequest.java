package com.lotus.systems.controlplane.provisioning.api;

import jakarta.validation.constraints.NotBlank;

public record ProvisioningRequest(
        @NotBlank String customerId,
        @NotBlank String productKey,
        @NotBlank String planKey,
        @NotBlank String domainOption,
        @NotBlank String databaseOption
) {
}
