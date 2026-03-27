package com.lotus.systems.controlplane.catalog.service;

import com.lotus.systems.controlplane.catalog.api.ProductSummaryResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCatalogService {

    public List<ProductSummaryResponse> listProducts() {
        return List.of(
                new ProductSummaryResponse("smart-pos", "Smart POS", "LIVE", "49/mo"),
                new ProductSummaryResponse("booking-platform", "Booking Platform", "PLANNED", "79/mo"),
                new ProductSummaryResponse("inventory-control", "Inventory Control", "PLANNED", "custom")
        );
    }
}
