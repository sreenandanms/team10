package com.hostel.laundry.dto;

import com.hostel.laundry.entity.Student;

public class StudentResponse {

    private Long id;
    private String role = "STUDENT";
    private String studentId;
    private String name;
    private String phone;
    private String roomNumber;
    private String department;
    private String displayInfo;

    public StudentResponse() {
    }

    public StudentResponse(Student student) {
        this.id = student.getId();
        this.role = student.getRole();
        this.studentId = student.getStudentId();
        this.name = student.getName();
        this.phone = student.getPhone();
        this.roomNumber = student.getRoomNumber();
        this.department = student.getDepartment();
        this.displayInfo = student.getDisplayInfo();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getDisplayInfo() {
        return displayInfo;
    }

    public void setDisplayInfo(String displayInfo) {
        this.displayInfo = displayInfo;
    }
}
