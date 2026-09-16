package com.hostel.laundry.entity;

import jakarta.persistence.*;

/**
 * Base abstract class representing a system user.
 * Demonstrates:
 * - Inheritance (base for Student and Staff)
 * - Encapsulation (private fields with accessors)
 * - Polymorphism (abstract methods getRole() and getDisplayInfo())
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    // Default constructor for JPA
    protected User() {
    }

    // Parameterized constructor
    public User(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    // Abstract methods to be overridden by subclasses (Polymorphism)
    public abstract String getRole();

    public abstract String getDisplayInfo();

    // Getters and Setters (Encapsulation)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
