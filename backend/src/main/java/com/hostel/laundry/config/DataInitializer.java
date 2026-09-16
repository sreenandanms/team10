package com.hostel.laundry.config;

import com.hostel.laundry.entity.*;
import com.hostel.laundry.repository.LaundryOrderRepository;
import com.hostel.laundry.repository.LaundryPriceRepository;
import com.hostel.laundry.repository.StaffRepository;
import com.hostel.laundry.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;
    private final LaundryPriceRepository laundryPriceRepository;
    private final LaundryOrderRepository laundryOrderRepository;

    public DataInitializer(StudentRepository studentRepository,
                           StaffRepository staffRepository,
                           LaundryPriceRepository laundryPriceRepository,
                           LaundryOrderRepository laundryOrderRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
        this.laundryPriceRepository = laundryPriceRepository;
        this.laundryOrderRepository = laundryOrderRepository;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Laundry Prices if empty
        if (laundryPriceRepository.count() == 0) {
            laundryPriceRepository.saveAll(List.of(
                    new LaundryPrice("Shirt", 10.0, true),
                    new LaundryPrice("Pant", 15.0, true),
                    new LaundryPrice("Bedsheet", 20.0, true),
                    new LaundryPrice("Towel", 8.0, true)
            ));
            System.out.println("Initialized official laundry rates in MySQL: Shirt=10, Pant=15, Bedsheet=20, Towel=8");
        }

        // 2. Seed Students if empty
        if (studentRepository.count() == 0) {
            Student s1 = new Student("STU001", "Sai Krishna", "9876543210", "A-101", "CSE");
            Student s2 = new Student("STU002", "Sanvin Sijo", "9876543211", "A-102", "CSE");
            Student s3 = new Student("STU003", "Savio Aji", "9876543212", "A-103", "CSE");
            Student s4 = new Student("STU004", "Shifa Sherin P", "9876543213", "A-104", "CSE");

            studentRepository.saveAll(List.of(s1, s2, s3, s4));
            System.out.println("Initialized project group students in MySQL: STU001-STU004");
        }

        // 3. Seed Staff if empty
        if (staffRepository.count() == 0) {
            Staff st1 = new Staff("Ramesh Kumar", "9876543220", "Laundry Supervisor");
            Staff st2 = new Staff("Anand P", "9876543221", "Laundry Staff");
            staffRepository.saveAll(List.of(st1, st2));
            System.out.println("Initialized hostel laundry staff in MySQL");
        }

        // 4. Seed Initial Orders if empty
        if (laundryOrderRepository.count() == 0) {
            Student s1 = studentRepository.findByStudentId("STU001").orElse(null);
            Student s2 = studentRepository.findByStudentId("STU002").orElse(null);
            Student s3 = studentRepository.findByStudentId("STU003").orElse(null);

            if (s1 != null) {
                // Order ORD-1024: 3 Shirts (30) + 2 Pants (30) = 60 (WASHING)
                LaundryOrder o1 = new LaundryOrder("ORD-1024", s1);
                o1.setStatus(OrderStatus.WASHING);
                o1.setCreatedAt(LocalDateTime.now().minusDays(2));
                o1.setUpdatedAt(LocalDateTime.now().minusHours(12));
                o1.addItem(new LaundryOrderItem(o1, "Shirt", 3, 10.0));
                o1.addItem(new LaundryOrderItem(o1, "Pant", 2, 15.0));
                laundryOrderRepository.save(o1);

                // Order ORD-1023: 1 Bedsheet (20) + 2 Towels (16) = 36 (PENDING)
                LaundryOrder o2 = new LaundryOrder("ORD-1023", s1);
                o2.setStatus(OrderStatus.PENDING);
                o2.setCreatedAt(LocalDateTime.now().minusHours(18));
                o2.setUpdatedAt(LocalDateTime.now().minusHours(18));
                o2.addItem(new LaundryOrderItem(o2, "Bedsheet", 1, 20.0));
                o2.addItem(new LaundryOrderItem(o2, "Towel", 2, 8.0));
                laundryOrderRepository.save(o2);
            }

            if (s2 != null) {
                // Order ORD-1021: 2 Pants (30) + 1 Towel (8) = 38 (READY)
                LaundryOrder o3 = new LaundryOrder("ORD-1021", s2);
                o3.setStatus(OrderStatus.READY);
                o3.setCreatedAt(LocalDateTime.now().minusDays(4));
                o3.setUpdatedAt(LocalDateTime.now().minusHours(8));
                o3.addItem(new LaundryOrderItem(o3, "Pant", 2, 15.0));
                o3.addItem(new LaundryOrderItem(o3, "Towel", 1, 8.0));
                laundryOrderRepository.save(o3);
            }

            if (s3 != null) {
                // Order ORD-1022: 4 Shirts (40) = 40 (DELIVERED)
                LaundryOrder o4 = new LaundryOrder("ORD-1022", s3);
                o4.setStatus(OrderStatus.DELIVERED);
                o4.setCreatedAt(LocalDateTime.now().minusDays(8));
                o4.setUpdatedAt(LocalDateTime.now().minusDays(6));
                o4.addItem(new LaundryOrderItem(o4, "Shirt", 4, 10.0));
                laundryOrderRepository.save(o4);
            }

            System.out.println("Initialized starter hostel orders in MySQL");
        }
    }
}
