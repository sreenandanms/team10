package com.hostel.laundry.controller;

import com.hostel.laundry.dto.CreateOrderRequest;
import com.hostel.laundry.dto.OrderResponse;
import com.hostel.laundry.dto.UpdateOrderStatusRequest;
import com.hostel.laundry.entity.OrderStatus;
import com.hostel.laundry.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search) {
        List<OrderResponse> orders = orderService.getOrders(studentId, status, search);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        try {
            Long numericId = Long.parseLong(id);
            return ResponseEntity.ok(orderService.getOrderById(numericId));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(orderService.getOrderByOrderNumber(id));
        }
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = orderService.createOrder(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        Long numericId;
        try {
            numericId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            OrderResponse existing = orderService.getOrderByOrderNumber(id);
            numericId = existing.getId();
        }
        OrderResponse updated = orderService.updateOrderStatus(numericId, request);
        return ResponseEntity.ok(updated);
    }
}
