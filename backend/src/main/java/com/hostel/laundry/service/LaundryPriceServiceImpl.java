package com.hostel.laundry.service;

import com.hostel.laundry.entity.LaundryPrice;
import com.hostel.laundry.exception.ResourceNotFoundException;
import com.hostel.laundry.repository.LaundryPriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LaundryPriceServiceImpl implements LaundryPriceService {

    private final LaundryPriceRepository laundryPriceRepository;

    public LaundryPriceServiceImpl(LaundryPriceRepository laundryPriceRepository) {
        this.laundryPriceRepository = laundryPriceRepository;
    }

    @Override
    public List<LaundryPrice> getAllActivePrices() {
        return laundryPriceRepository.findByActiveTrue();
    }

    @Override
    public LaundryPrice getPriceByClothingType(String clothingType) {
        return laundryPriceRepository.findByClothingTypeIgnoreCaseAndActiveTrue(clothingType)
                .orElseThrow(() -> new ResourceNotFoundException("Active laundry price for clothing type '" + clothingType + "' not found"));
    }
}
