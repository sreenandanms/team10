package com.hostel.laundry.controller;

import com.hostel.laundry.dto.StudentResponse;
import com.hostel.laundry.entity.Staff;
import com.hostel.laundry.repository.StaffRepository;
import com.hostel.laundry.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentService studentService;
    private final StaffRepository staffRepository;

    public AuthController(StudentService studentService, StaffRepository staffRepository) {
        this.studentService = studentService;
        this.staffRepository = staffRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getDemoUsers() {
        List<StudentResponse> students = studentService.getAllStudents(null);
        List<Staff> staffList = staffRepository.findAll();

        Map<String, Object> response = new HashMap<>();
        response.put("students", students);
        response.put("staff", staffList);

        return ResponseEntity.ok(response);
    }
}
