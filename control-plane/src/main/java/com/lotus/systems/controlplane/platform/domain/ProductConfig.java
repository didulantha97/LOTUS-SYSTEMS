package com.lotus.systems.controlplane.platform.domain;

public record ProductConfig(
        String key,
        String name,
        String status,
        String startingPrice,
        String description,
        String repositoryUrl,
        String documentationUrl,
        String latestVersion,
        String downloadUrl
) {
}
