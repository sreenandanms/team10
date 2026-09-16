package com.hostel.laundry.service;

import com.hostel.laundry.dto.CreateOrderRequest;
import com.hostel.laundry.dto.OrderItemRequest;
import com.hostel.laundry.dto.OrderResponse;
import com.hostel.laundry.dto.UpdateOrderStatusRequest;
import com.hostel.laundry.entity.*;
import com.hostel.laundry.exception.BadRequestException;
import com.hostel.laundry.exception.ResourceNotFoundException;
import com.hostel.laundry.repository.LaundryOrderRepository;
import com.hostel.laundry.repository.LaundryPriceRepository;
import com.hostel.laundry.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final LaundryOrderRepository laundryOrderRepository;
    private final StudentRepository studentRepository;
    private final LaundryPriceRepository laundryPriceRepository;

    public OrderServiceImpl(LaundryOrderRepository laundryOrderRepository,
                            StudentRepository studentRepository,
                            LaundryPriceRepository laundryPriceRepository) {
        this.laundryOrderRepository = laundryOrderRepository;
        this.studentRepository = studentRepository;
        this.laundryPriceRepository = laundryPriceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String studentId, OrderStatus status, String search) {
        List<LaundryOrder> orders;

        if (search != null && !search.trim().isEmpty()) {
            orders = laundryOrderRepository.searchOrders(search.trim());
        } else if (studentId != null && !studentId.trim().isEmpty() && status != null) {
            orders = laundryOrderRepository.findByStudentStudentIdAndStatusOrderByCreatedAtDesc(studentId.trim(), status);
        } else if (studentId != null && !studentId.trim().isEmpty()) {
            orders = laundryOrderRepository.findByStudentStudentIdOrderByCreatedAtDesc(studentId.trim());
        } else if (status != null) {
            orders = laundryOrderRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            orders = laundryOrderRepository.findAllByOrderByCreatedAtDesc();
        }

        return orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        LaundryOrder order = laundryOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laundry order with ID " + id + " not found"));
        return new OrderResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        String cleanNumber = orderNumber.startsWith("ORD-") ? orderNumber : "ORD-" + orderNumber;
        LaundryOrder order = laundryOrderRepository.findByOrderNumber(cleanNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Laundry order " + orderNumber + " not found"));
        return new OrderResponse(order);
    }

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        // 1. Validate student
        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseGet(() -> {
                    try {
                        Long numId = Long.parseLong(request.getStudentId());
                        return studentRepository.findById(numId)
                                .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + request.getStudentId() + " not found"));
                    } catch (NumberFormatException e) {
                        throw new ResourceNotFoundException("Student with ID " + request.getStudentId() + " not found");
                    }
                });

        // 2. Validate items
        List<OrderItemRequest> validItems = request.getItems().stream()
                .filter(item -> item.getQuantity() != null && item.getQuantity() > 0)
                .collect(Collectors.toList());

        if (validItems.isEmpty()) {
            throw new BadRequestException("At least one clothing item with quantity greater than 0 must be selected");
        }

        // 3. Generate sequential order number
        long count = laundryOrderRepository.count();
        String orderNumber = "ORD-" + (1020 + count + 1);

        LaundryOrder order = new LaundryOrder(orderNumber, student);
        order.setNotes(request.getNotes());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // 4. Calculate prices server-side from database
        for (OrderItemRequest itemReq : validItems) {
            LaundryPrice price = laundryPriceRepository
                    .findByClothingTypeIgnoreCaseAndActiveTrue(itemReq.getClothingType().trim())
                    .orElseThrow(() -> new BadRequestException("Unknown or inactive clothing type: " + itemReq.getClothingType()));

            LaundryOrderItem orderItem = new LaundryOrderItem(
                    order,
                    price.getClothingType(),
                    itemReq.getQuantity(),
                    price.getPricePerUnit()
            );

            order.addItem(orderItem);
        }

        // Recalculate total amount on the server
        order.recalculateTotal();

        // 5. Save transactionally
        LaundryOrder saved = laundryOrderRepository.save(order);
        return new OrderResponse(saved);
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        LaundryOrder order = laundryOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laundry order with ID " + id + " not found"));

        // Validate status progression or update
        order.updateStatus(request.getStatus());
        LaundryOrder saved = laundryOrderRepository.save(order);
        return new OrderResponse(saved);
    }
}
