package com.lotus.systems.controlplane.catalog.api;

public record ProductSummaryResponse(
        String key,
        String name,
        String status,
        String startingPrice
) {
}
