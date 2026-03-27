package com.lotus.systems.controlplane.checkout.api;

import com.lotus.systems.controlplane.platform.domain.CheckoutSessionRecord;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    private final PlatformDataService platformDataService;

    public CheckoutController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @PostMapping("/session")
    public CheckoutSessionResponse createSession(@Valid @RequestBody CheckoutSessionRequest request) {
        CheckoutSessionRecord session = platformDataService.createCheckoutSession(
                request.customerId(),
                request.productKey(),
                request.planKey(),
                request.domainOption(),
                request.databaseOption()
        );

        return new CheckoutSessionResponse(
                session.sessionId(),
                session.status(),
                session.checkoutUrl(),
                "Use Stripe hosted page and then call webhook event checkout.session.completed"
        );
    }

    public record CheckoutSessionRequest(
            @NotBlank String customerId,
            @NotBlank String productKey,
            @NotBlank String planKey,
            @NotBlank String domainOption,
            @NotBlank String databaseOption
    ) {
    }

    public record CheckoutSessionResponse(
            String sessionId,
            String status,
            String checkoutUrl,
            String instruction
    ) {
    }
}
