package com.hostel.laundry.controller;

import com.hostel.laundry.entity.LaundryPrice;
import com.hostel.laundry.service.LaundryPriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
public class LaundryPriceController {

    private final LaundryPriceService laundryPriceService;

    public LaundryPriceController(LaundryPriceService laundryPriceService) {
        this.laundryPriceService = laundryPriceService;
    }

    @GetMapping
    public ResponseEntity<List<LaundryPrice>> getPrices() {
        return ResponseEntity.ok(laundryPriceService.getAllActivePrices());
    }
}
