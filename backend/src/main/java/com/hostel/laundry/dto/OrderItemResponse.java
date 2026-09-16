package com.hostel.laundry.dto;

import com.hostel.laundry.entity.LaundryOrderItem;

public class OrderItemResponse {

    private Long id;
    private String clothingType;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(LaundryOrderItem item) {
        this.id = item.getId();
        this.clothingType = item.getClothingType();
        this.quantity = item.getQuantity();
        this.unitPrice = item.getUnitPrice();
        this.subtotal = item.getSubtotal();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClothingType() {
        return clothingType;
    }

    public void setClothingType(String clothingType) {
        this.clothingType = clothingType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
