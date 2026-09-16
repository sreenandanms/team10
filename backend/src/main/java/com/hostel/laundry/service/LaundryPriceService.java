package com.hostel.laundry.service;

import com.hostel.laundry.entity.LaundryPrice;

import java.util.List;

public interface LaundryPriceService {
    List<LaundryPrice> getAllActivePrices();
    LaundryPrice getPriceByClothingType(String clothingType);
}
