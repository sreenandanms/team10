package com.hostel.laundry.repository;

import com.hostel.laundry.entity.LaundryOrder;
import com.hostel.laundry.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LaundryOrderRepository extends JpaRepository<LaundryOrder, Long> {

    Optional<LaundryOrder> findByOrderNumber(String orderNumber);

    List<LaundryOrder> findByStudentStudentIdOrderByCreatedAtDesc(String studentId);

    List<LaundryOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    List<LaundryOrder> findByStudentStudentIdAndStatusOrderByCreatedAtDesc(String studentId, OrderStatus status);

    List<LaundryOrder> findAllByOrderByCreatedAtDesc();

    @Query("SELECT o FROM LaundryOrder o WHERE " +
           "LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.student.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(o.student.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY o.createdAt DESC")
    List<LaundryOrder> searchOrders(@Param("query") String query);

    long countByStatus(OrderStatus status);
}
