package com.lotus.systems.controlplane.catalog.service;

import com.lotus.systems.controlplane.catalog.api.ProductSummaryResponse;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductCatalogService {

    private final PlatformDataService platformDataService;

    public ProductCatalogService(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    public List<ProductSummaryResponse> listProducts() {
        return platformDataService.listProducts().stream()
                .map(product -> new ProductSummaryResponse(
                        product.key(),
                        product.name(),
                        product.status(),
                        product.startingPrice()
                ))
                .toList();
    }
}
