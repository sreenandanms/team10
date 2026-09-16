package com.hostel.laundry.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "laundry_order_items")
public class LaundryOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private LaundryOrder order;

    @Column(name = "clothing_type", nullable = false)
    private String clothingType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private Double subtotal;

    public LaundryOrderItem() {
    }

    public LaundryOrderItem(LaundryOrder order, String clothingType, Integer quantity, Double unitPrice) {
        this.order = order;
        this.clothingType = clothingType;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = unitPrice * quantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LaundryOrder getOrder() {
        return order;
    }

    public void setOrder(LaundryOrder order) {
        this.order = order;
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
        if (this.unitPrice != null) {
            this.subtotal = this.unitPrice * quantity;
        }
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
        if (this.quantity != null) {
            this.subtotal = unitPrice * this.quantity;
        }
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
