package com.lotus.systems.controlplane.provisioning.api;

public record ProvisioningJobResponse(
        String jobId,
        String status,
        String message
) {
}
