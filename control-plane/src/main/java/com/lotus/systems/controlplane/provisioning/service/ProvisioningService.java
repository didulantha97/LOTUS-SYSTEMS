package com.lotus.systems.controlplane.provisioning.service;

import com.lotus.systems.controlplane.provisioning.api.ProvisioningJobResponse;
import com.lotus.systems.controlplane.provisioning.api.ProvisioningRequest;
import com.lotus.systems.controlplane.provisioning.domain.ProvisioningStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProvisioningService {

    public ProvisioningJobResponse createJob(ProvisioningRequest request) {
        String jobId = "job-" + UUID.randomUUID();

        return new ProvisioningJobResponse(
                jobId,
                ProvisioningStatus.ORDER_CREATED.name(),
                "Provisioning workflow queued for customer " + request.customerId()
                        + " on product " + request.productKey()
                        + " with plan " + request.planKey()
        );
    }
}
