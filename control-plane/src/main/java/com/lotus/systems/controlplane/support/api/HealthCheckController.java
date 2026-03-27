package com.lotus.systems.controlplane.support.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/support")
public class HealthCheckController {

    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of(
                "service", "control-plane",
                "status", "UP",
                "timestamp", Instant.now().toString()
        );
    }
}
