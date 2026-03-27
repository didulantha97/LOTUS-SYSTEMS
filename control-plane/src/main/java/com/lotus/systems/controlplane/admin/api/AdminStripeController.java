package com.lotus.systems.controlplane.admin.api;

import com.lotus.systems.controlplane.platform.domain.StripeSettings;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/stripe")
public class AdminStripeController {

    private final PlatformDataService platformDataService;

    public AdminStripeController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @GetMapping("/config")
    public StripeSettings getStripeConfig() {
        return platformDataService.getStripeSettings();
    }

    @PostMapping("/config")
    public StripeSettings updateStripeConfig(@Valid @RequestBody StripeConfigRequest request) {
        return platformDataService.updateStripeSettings(
                request.publishableKey(),
                request.secretKey(),
                request.webhookSecret()
        );
    }

    public record StripeConfigRequest(
            String publishableKey,
            String secretKey,
            String webhookSecret
    ) {
    }
}
