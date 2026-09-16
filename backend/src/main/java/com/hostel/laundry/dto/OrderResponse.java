package com.hostel.laundry.dto;

import com.hostel.laundry.entity.LaundryOrder;
import com.hostel.laundry.entity.OrderStatus;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private StudentResponse student;
    private List<OrderItemResponse> items;
    private Double totalAmount;
    private OrderStatus status;
    private String notes;
    private String createdAt;
    private String updatedAt;

    public OrderResponse() {
    }

    public OrderResponse(LaundryOrder order) {
        this.id = order.getId();
        this.orderNumber = order.getOrderNumber();
        if (order.getStudent() != null) {
            this.student = new StudentResponse(order.getStudent());
        }
        if (order.getItems() != null) {
            this.items = order.getItems().stream()
                    .map(OrderItemResponse::new)
                    .collect(Collectors.toList());
        }
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();
        this.notes = order.getNotes();
        if (order.getCreatedAt() != null) {
            this.createdAt = order.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
        if (order.getUpdatedAt() != null) {
            this.updatedAt = order.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public StudentResponse getStudent() {
        return student;
    }

    public void setStudent(StudentResponse student) {
        this.student = student;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
