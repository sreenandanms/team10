package com.hostel.laundry.service;

import com.hostel.laundry.dto.CreateStudentRequest;
import com.hostel.laundry.dto.StudentResponse;

import java.util.List;

public interface StudentService {
    List<StudentResponse> getAllStudents(String search);
    StudentResponse getStudentById(String studentId);
    StudentResponse createStudent(CreateStudentRequest request);
}
