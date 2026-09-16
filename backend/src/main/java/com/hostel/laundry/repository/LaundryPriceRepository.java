package com.hostel.laundry.repository;

import com.hostel.laundry.entity.LaundryPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LaundryPriceRepository extends JpaRepository<LaundryPrice, Long> {

    List<LaundryPrice> findByActiveTrue();

    Optional<LaundryPrice> findByClothingTypeIgnoreCaseAndActiveTrue(String clothingType);
}
