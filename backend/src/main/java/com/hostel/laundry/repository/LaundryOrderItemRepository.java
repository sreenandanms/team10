package com.hostel.laundry.repository;

import com.hostel.laundry.entity.LaundryOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaundryOrderItemRepository extends JpaRepository<LaundryOrderItem, Long> {
    List<LaundryOrderItem> findByOrderId(Long orderId);
}
