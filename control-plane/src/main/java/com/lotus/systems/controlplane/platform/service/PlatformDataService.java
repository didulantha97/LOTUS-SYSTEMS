package com.lotus.systems.controlplane.platform.service;

import com.lotus.systems.controlplane.platform.domain.CheckoutSessionRecord;
import com.lotus.systems.controlplane.platform.domain.CustomerAccount;
import com.lotus.systems.controlplane.platform.domain.ProductConfig;
import com.lotus.systems.controlplane.platform.domain.StripeSettings;
import com.lotus.systems.controlplane.platform.domain.SubscriptionRecord;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PlatformDataService {

    private final Map<String, ProductConfig> products = new ConcurrentHashMap<>();
    private final Map<String, CustomerAccount> customers = new ConcurrentHashMap<>();
    private final Map<String, SubscriptionRecord> subscriptions = new ConcurrentHashMap<>();
    private final Map<String, CheckoutSessionRecord> checkoutSessions = new ConcurrentHashMap<>();

    private volatile String stripePublishableKey = "pk_test_lotus_placeholder";
    private volatile String stripeSecretKey = "";
    private volatile String stripeWebhookSecret = "";

    public PlatformDataService() {
        seedProducts();
        seedCustomers();
        seedSubscriptions();
    }

    public List<ProductConfig> listProducts() {
        return new ArrayList<>(products.values());
    }

    public ProductConfig upsertProduct(ProductConfig request) {
        ProductConfig product = new ProductConfig(
                request.key(),
                request.name(),
                request.status(),
                request.startingPrice(),
                request.description(),
                request.repositoryUrl(),
                request.documentationUrl(),
                request.latestVersion(),
                request.downloadUrl()
        );
        products.put(product.key(), product);
        return product;
    }

    public ProductConfig updateProductStatus(String key, String status) {
        ProductConfig current = products.get(key);
        if (current == null) {
            return null;
        }

        ProductConfig updated = new ProductConfig(
                current.key(),
                current.name(),
                status,
                current.startingPrice(),
                current.description(),
                current.repositoryUrl(),
                current.documentationUrl(),
                current.latestVersion(),
                current.downloadUrl()
        );
        products.put(key, updated);
        return updated;
    }

    public List<CustomerAccount> listCustomers() {
        return new ArrayList<>(customers.values());
    }

    public CustomerAccount upsertCustomer(CustomerAccount request) {
        customers.put(request.customerId(), request);
        return request;
    }

    public StripeSettings getStripeSettings() {
        return new StripeSettings(
                !stripeSecretKey.isBlank() && !stripePublishableKey.isBlank(),
                stripePublishableKey,
                stripeWebhookSecret.isBlank() ? "NO" : "YES"
        );
    }

    public StripeSettings updateStripeSettings(String publishableKey, String secretKey, String webhookSecret) {
        stripePublishableKey = publishableKey == null ? "" : publishableKey;
        stripeSecretKey = secretKey == null ? "" : secretKey;
        stripeWebhookSecret = webhookSecret == null ? "" : webhookSecret;
        return getStripeSettings();
    }

    public CheckoutSessionRecord createCheckoutSession(String customerId, String productKey, String planKey, String domainOption, String databaseOption) {
        String sessionId = "cs_" + UUID.randomUUID().toString().replace("-", "");
        String checkoutUrl = "https://checkout.stripe.com/pay/" + sessionId;

        CheckoutSessionRecord record = new CheckoutSessionRecord(
                sessionId,
                customerId,
                productKey,
                planKey,
                domainOption,
                databaseOption,
                "PAYMENT_PENDING",
                checkoutUrl
        );

        checkoutSessions.put(sessionId, record);
        return record;
    }

    public CheckoutSessionRecord markCheckoutPaid(String sessionId) {
        CheckoutSessionRecord current = checkoutSessions.get(sessionId);
        if (current == null) {
            return null;
        }

        CheckoutSessionRecord paid = new CheckoutSessionRecord(
                current.sessionId(),
                current.customerId(),
                current.productKey(),
                current.planKey(),
                current.domainOption(),
                current.databaseOption(),
                "PAYMENT_CONFIRMED",
                current.checkoutUrl()
        );

        checkoutSessions.put(sessionId, paid);

        String subscriptionId = "sub_" + UUID.randomUUID().toString().substring(0, 10);
        SubscriptionRecord subscription = new SubscriptionRecord(
                subscriptionId,
                paid.customerId(),
                paid.productKey(),
                paid.planKey(),
                "ACTIVE",
                "pending-domain-setup",
                paid.databaseOption(),
                "PROVISIONING"
        );
        subscriptions.put(subscription.subscriptionId(), subscription);

        return paid;
    }

    public CustomerAccount getCustomer(String customerId) {
        return customers.get(customerId);
    }

    public List<SubscriptionRecord> listSubscriptionsByCustomer(String customerId) {
        return subscriptions.values().stream()
                .filter(sub -> sub.customerId().equals(customerId))
                .toList();
    }

    public ProductConfig getProduct(String key) {
        return products.get(key);
    }

    private void seedProducts() {
        products.put("smart-pos", new ProductConfig(
                "smart-pos",
                "Smart POS",
                "LIVE",
                "49/mo",
                "Sell, manage inventory, sync orders, and connect optional Salesforce workflows.",
                "https://github.com/lotus-systems/smart-pos",
                "https://docs.lotussystems.example/smart-pos",
                "v3.4.1",
                "https://downloads.lotussystems.example/smart-pos/v3.4.1"
        ));
        products.put("booking-platform", new ProductConfig(
                "booking-platform",
                "Booking Platform",
                "PLANNED",
                "79/mo",
                "Reservations, customer records, and operational dashboards for service businesses.",
                "https://github.com/lotus-systems/booking-platform",
                "https://docs.lotussystems.example/booking-platform",
                "v2.1.0",
                "https://downloads.lotussystems.example/booking-platform/v2.1.0"
        ));
        products.put("inventory-control", new ProductConfig(
                "inventory-control",
                "Inventory Control",
                "PLANNED",
                "custom",
                "Stock movement, supplier visibility, reorder levels, and reporting.",
                "https://github.com/lotus-systems/inventory-control",
                "https://docs.lotussystems.example/inventory-control",
                "v1.8.5",
                "https://downloads.lotussystems.example/inventory-control/v1.8.5"
        ));
    }

    private void seedCustomers() {
        customers.put("demo-customer-001", new CustomerAccount(
                "demo-customer-001",
                "Lotus Mart",
                "ops@lotusmart.com",
                "ACTIVE"
        ));
        customers.put("demo-customer-002", new CustomerAccount(
                "demo-customer-002",
                "Cinnamon Retail",
                "owner@cinnamonretail.com",
                "ONBOARDING"
        ));
    }

    private void seedSubscriptions() {
        subscriptions.put("sub_seed_001", new SubscriptionRecord(
                "sub_seed_001",
                "demo-customer-001",
                "smart-pos",
                "growth",
                "ACTIVE",
                "pos.lotusmart.com",
                "DEDICATED",
                "ACTIVE"
        ));
    }
}
