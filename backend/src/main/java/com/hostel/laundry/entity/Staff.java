package com.hostel.laundry.entity;

import jakarta.persistence.*;

/**
 * Staff entity extending User.
 * Demonstrates:
 * - Inheritance (extends User)
 * - Method Overriding (overrides getRole and getDisplayInfo)
 * - Constructor chaining (super(name, phone))
 */
@Entity
@Table(name = "staff")
public class Staff extends User {

    @Column(name = "staff_type", nullable = false)
    private String staffType;

    // Default constructor for JPA
    public Staff() {
        super();
    }

    // Parameterized constructor
    public Staff(String name, String phone, String staffType) {
        super(name, phone);
        this.staffType = staffType;
    }

    @Override
    public String getRole() {
        return "STAFF";
    }

    @Override
    public String getDisplayInfo() {
        return "Staff: " + getName() + " (" + staffType + ") - Phone: " + getPhone();
    }

    // Getters and Setters
    public String getStaffType() {
        return staffType;
    }

    public void setStaffType(String staffType) {
        this.staffType = staffType;
    }
}
