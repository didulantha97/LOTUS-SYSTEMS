package com.lotus.systems.controlplane.admin.api;

import com.lotus.systems.controlplane.platform.domain.ProductConfig;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/products")
public class AdminProductController {

    private final PlatformDataService platformDataService;

    public AdminProductController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @GetMapping
    public List<ProductConfig> listProducts() {
        return platformDataService.listProducts();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductConfig createOrUpdate(@Valid @RequestBody ProductUpsertRequest request) {
        return platformDataService.upsertProduct(new ProductConfig(
                request.key(),
                request.name(),
                request.status(),
                request.startingPrice(),
                request.description(),
                request.repositoryUrl(),
                request.documentationUrl(),
                request.latestVersion(),
                request.downloadUrl()
        ));
    }

    @PutMapping("/{productKey}/status")
    public Object updateStatus(@PathVariable String productKey, @Valid @RequestBody ProductStatusUpdateRequest request) {
        ProductConfig updated = platformDataService.updateProductStatus(productKey, request.status());
        if (updated == null) {
            return Map.of("error", "Product not found");
        }
        return updated;
    }

    public record ProductUpsertRequest(
            @NotBlank String key,
            @NotBlank String name,
            @NotBlank String status,
            @NotBlank String startingPrice,
            @NotBlank String description,
            String repositoryUrl,
            String documentationUrl,
            String latestVersion,
            String downloadUrl
    ) {
    }

    public record ProductStatusUpdateRequest(
            @NotBlank String status
    ) {
    }
}
