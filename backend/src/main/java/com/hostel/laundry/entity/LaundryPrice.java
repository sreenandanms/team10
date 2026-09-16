package com.hostel.laundry.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "laundry_prices")
public class LaundryPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clothing_type", unique = true, nullable = false)
    private String clothingType;

    @Column(name = "price_per_unit", nullable = false)
    private Double pricePerUnit;

    @Column(nullable = false)
    private Boolean active = true;

    public LaundryPrice() {
    }

    public LaundryPrice(String clothingType, Double pricePerUnit, Boolean active) {
        this.clothingType = clothingType;
        this.pricePerUnit = pricePerUnit;
        this.active = active;
    }

    // Business method to calculate subtotal
    public Double calculateSubtotal(int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity cannot be negative");
        }
        return this.pricePerUnit * quantity;
    }

    // Getters and Setters
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

    public Double getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(Double pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
