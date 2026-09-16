package com.hostel.laundry.service;

import com.hostel.laundry.dto.CreateStudentRequest;
import com.hostel.laundry.dto.StudentResponse;
import com.hostel.laundry.entity.Student;
import com.hostel.laundry.exception.BadRequestException;
import com.hostel.laundry.exception.ResourceNotFoundException;
import com.hostel.laundry.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents(String search) {
        List<Student> students;
        if (search != null && !search.trim().isEmpty()) {
            students = studentRepository.searchStudents(search.trim());
        } else {
            students = studentRepository.findAll();
        }
        return students.stream()
                .map(StudentResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + studentId + " not found"));
        return new StudentResponse(student);
    }

    @Override
    public StudentResponse createStudent(CreateStudentRequest request) {
        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new BadRequestException("Student ID " + request.getStudentId() + " already exists");
        }

        Student student = new Student(
                request.getStudentId().toUpperCase().trim(),
                request.getName().trim(),
                request.getPhone().trim(),
                request.getRoomNumber().trim(),
                request.getDepartment().trim()
        );

        Student saved = studentRepository.save(student);
        return new StudentResponse(saved);
    }
}
