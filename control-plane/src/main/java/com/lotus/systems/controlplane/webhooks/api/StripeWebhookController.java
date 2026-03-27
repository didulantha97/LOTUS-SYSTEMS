package com.lotus.systems.controlplane.webhooks.api;

import com.lotus.systems.controlplane.platform.domain.CheckoutSessionRecord;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/webhooks/stripe")
public class StripeWebhookController {

    private final PlatformDataService platformDataService;

    public StripeWebhookController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @PostMapping
    public Object handleStripeWebhook(@Valid @RequestBody StripeWebhookEvent request) {
        if (!"checkout.session.completed".equals(request.eventType())) {
            return Map.of(
                    "status", "IGNORED",
                    "message", "Unsupported event type"
            );
        }

        CheckoutSessionRecord session = platformDataService.markCheckoutPaid(request.sessionId());
        if (session == null) {
            return Map.of(
                    "status", "FAILED",
                    "message", "Unknown checkout session"
            );
        }

        return Map.of(
                "status", "PROCESSED",
                "sessionId", session.sessionId(),
                "message", "Payment confirmed and subscription activated"
        );
    }

    public record StripeWebhookEvent(
            @NotBlank String eventType,
            @NotBlank String sessionId
    ) {
    }
}
