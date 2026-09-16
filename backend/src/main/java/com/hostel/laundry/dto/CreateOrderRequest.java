package com.hostel.laundry.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreateOrderRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotEmpty(message = "At least one clothing item must be specified")
    @Valid
    private List<OrderItemRequest> items;

    private String notes;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String studentId, List<OrderItemRequest> items, String notes) {
        this.studentId = studentId;
        this.items = items;
        this.notes = notes;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
