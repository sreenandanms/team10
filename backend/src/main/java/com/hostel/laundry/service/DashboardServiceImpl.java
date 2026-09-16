package com.hostel.laundry.service;

import com.hostel.laundry.dto.DashboardStatsResponse;
import com.hostel.laundry.entity.LaundryOrder;
import com.hostel.laundry.entity.OrderStatus;
import com.hostel.laundry.repository.LaundryOrderRepository;
import com.hostel.laundry.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final LaundryOrderRepository laundryOrderRepository;
    private final StudentRepository studentRepository;

    public DashboardServiceImpl(LaundryOrderRepository laundryOrderRepository, StudentRepository studentRepository) {
        this.laundryOrderRepository = laundryOrderRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    public DashboardStatsResponse getStats() {
        long totalStudents = studentRepository.count();
        long pending = laundryOrderRepository.countByStatus(OrderStatus.PENDING);
        long washing = laundryOrderRepository.countByStatus(OrderStatus.WASHING);
        long ready = laundryOrderRepository.countByStatus(OrderStatus.READY);
        long delivered = laundryOrderRepository.countByStatus(OrderStatus.DELIVERED);
        long totalOrders = laundryOrderRepository.count();

        List<LaundryOrder> allOrders = laundryOrderRepository.findAll();
        double totalRevenue = allOrders.stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();

        return new DashboardStatsResponse(totalStudents, pending, washing, ready, delivered, totalOrders, totalRevenue);
    }
}
