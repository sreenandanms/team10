package com.hostel.laundry.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateStudentRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Department is required")
    private String department;

    public CreateStudentRequest() {
    }

    public CreateStudentRequest(String studentId, String name, String phone, String roomNumber, String department) {
        this.studentId = studentId;
        this.name = name;
        this.phone = phone;
        this.roomNumber = roomNumber;
        this.department = department;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
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
