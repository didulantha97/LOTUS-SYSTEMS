package com.lotus.systems.controlplane.portal.api;

import com.lotus.systems.controlplane.platform.domain.CustomerAccount;
import com.lotus.systems.controlplane.platform.domain.SubscriptionRecord;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/portal")
public class ClientPortalController {

    private final PlatformDataService platformDataService;

    public ClientPortalController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @GetMapping("/me")
    public Object me(@RequestParam @NotBlank String customerId) {
        CustomerAccount customer = platformDataService.getCustomer(customerId);
        if (customer == null) {
            return Map.of("error", "Customer not found");
        }
        return customer;
    }

    @GetMapping("/subscriptions")
    public List<SubscriptionRecord> subscriptions(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId);
    }

    @GetMapping("/environments")
    public List<Map<String, String>> environments(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId).stream()
                .map(sub -> Map.of(
                        "environmentId", "env-" + sub.subscriptionId(),
                        "productKey", sub.productKey(),
                        "status", sub.environmentStatus(),
                        "domain", sub.domain()
                ))
                .toList();
    }
}
