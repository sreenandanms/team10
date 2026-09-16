package com.hostel.laundry.entity;

import jakarta.persistence.*;

/**
 * Student entity extending User.
 * Demonstrates:
 * - Inheritance (extends User)
 * - Method Overriding (overrides getRole and getDisplayInfo)
 * - Constructor chaining (super(name, phone))
 */
@Entity
@Table(name = "students")
public class Student extends User {

    @Column(name = "student_id", unique = true, nullable = false)
    private String studentId;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private String department;

    // Default constructor for JPA
    public Student() {
        super();
    }

    // Parameterized constructor
    public Student(String studentId, String name, String phone, String roomNumber, String department) {
        super(name, phone);
        this.studentId = studentId;
        this.roomNumber = roomNumber;
        this.department = department;
    }

    @Override
    public String getRole() {
        return "STUDENT";
    }

    @Override
    public String getDisplayInfo() {
        return "Student: " + getName() + " (" + studentId + ") - Room: " + roomNumber + ", Dept: " + department;
    }

    // Getters and Setters
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
