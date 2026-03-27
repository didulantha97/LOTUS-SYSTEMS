package com.lotus.systems.controlplane.provisioning.api;

import com.lotus.systems.controlplane.provisioning.service.ProvisioningService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/provisioning/jobs")
public class ProvisioningController {

    private final ProvisioningService provisioningService;

    public ProvisioningController(ProvisioningService provisioningService) {
        this.provisioningService = provisioningService;
    }

    @PostMapping
    public ProvisioningJobResponse startProvisioning(@Valid @RequestBody ProvisioningRequest request) {
        return provisioningService.createJob(request);
    }
}
