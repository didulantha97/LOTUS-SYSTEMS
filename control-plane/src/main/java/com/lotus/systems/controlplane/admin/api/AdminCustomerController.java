package com.lotus.systems.controlplane.admin.api;

import com.lotus.systems.controlplane.platform.domain.CustomerAccount;
import com.lotus.systems.controlplane.platform.service.PlatformDataService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/customers")
public class AdminCustomerController {

    private final PlatformDataService platformDataService;

    public AdminCustomerController(PlatformDataService platformDataService) {
        this.platformDataService = platformDataService;
    }

    @GetMapping
    public List<CustomerAccount> listCustomers() {
        return platformDataService.listCustomers();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerAccount createOrUpdate(@Valid @RequestBody CustomerUpsertRequest request) {
        return platformDataService.upsertCustomer(new CustomerAccount(
                request.customerId(),
                request.companyName(),
                request.email(),
                request.lifecycleStatus()
        ));
    }

    public record CustomerUpsertRequest(
            @NotBlank String customerId,
            @NotBlank String companyName,
            @Email String email,
            @NotBlank String lifecycleStatus
    ) {
    }
}
