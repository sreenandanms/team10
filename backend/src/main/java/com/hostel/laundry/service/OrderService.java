package com.hostel.laundry.service;

import com.hostel.laundry.dto.CreateOrderRequest;
import com.hostel.laundry.dto.OrderResponse;
import com.hostel.laundry.dto.UpdateOrderStatusRequest;
import com.hostel.laundry.entity.OrderStatus;

import java.util.List;

public interface OrderService {
    List<OrderResponse> getOrders(String studentId, OrderStatus status, String search);
    OrderResponse getOrderById(Long id);
    OrderResponse getOrderByOrderNumber(String orderNumber);
    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request);
}
