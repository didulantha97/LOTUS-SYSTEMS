package com.lotus.systems.controlplane.portal.api;

import com.lotus.systems.controlplane.platform.domain.CustomerAccount;
import com.lotus.systems.controlplane.platform.domain.ProductConfig;
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

    @GetMapping("/updates")
    public List<Map<String, String>> updates(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId).stream()
                .map(subscription -> {
                    ProductConfig product = platformDataService.getProduct(subscription.productKey());
                    String latestVersion = product == null || product.latestVersion() == null ? "Unknown" : product.latestVersion();
                    return Map.of(
                            "productKey", subscription.productKey(),
                            "subscriptionId", subscription.subscriptionId(),
                            "latestVersion", latestVersion,
                            "status", subscription.status()
                    );
                })
                .toList();
    }

    @GetMapping("/documentation")
    public List<Map<String, String>> documentation(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId).stream()
                .map(subscription -> {
                    ProductConfig product = platformDataService.getProduct(subscription.productKey());
                    String docsUrl = product == null || product.documentationUrl() == null ? "" : product.documentationUrl();
                    String repoUrl = product == null || product.repositoryUrl() == null ? "" : product.repositoryUrl();
                    return Map.of(
                            "productKey", subscription.productKey(),
                            "subscriptionId", subscription.subscriptionId(),
                            "documentationUrl", docsUrl,
                            "repositoryUrl", repoUrl
                    );
                })
                .toList();
    }

    @GetMapping("/billing")
    public List<Map<String, String>> billing(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId).stream()
                .map(subscription -> {
                    ProductConfig product = platformDataService.getProduct(subscription.productKey());
                    String downloadUrl = product == null || product.downloadUrl() == null ? "" : product.downloadUrl();
                    String latestVersion = product == null || product.latestVersion() == null ? "Unknown" : product.latestVersion();
                    return Map.of(
                            "invoiceId", "inv-" + subscription.subscriptionId(),
                            "subscriptionId", subscription.subscriptionId(),
                            "amount", subscription.planKey().equalsIgnoreCase("enterprise") ? "$499/mo" : "$149/mo",
                            "billingStatus", subscription.status(),
                            "latestVersion", latestVersion,
                            "downloadUrl", downloadUrl
                    );
                })
                .toList();
    }

    @GetMapping("/support")
    public List<Map<String, String>> support(@RequestParam @NotBlank String customerId) {
        return platformDataService.listSubscriptionsByCustomer(customerId).stream()
                .map(subscription -> Map.of(
                        "ticketId", "tkt-" + subscription.subscriptionId(),
                        "productKey", subscription.productKey(),
                        "priority", "HIGH",
                        "status", "OPEN",
                        "contact", "support@lotussystems.example"
                ))
                .toList();
    }
}
