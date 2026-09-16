package com.hostel.laundry.dto;

public class DashboardStatsResponse {

    private long totalStudents;
    private long pendingOrders;
    private long washingOrders;
    private long readyOrders;
    private long deliveredOrders;
    private long totalOrders;
    private double totalRevenue;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalStudents, long pendingOrders, long washingOrders,
                                  long readyOrders, long deliveredOrders, long totalOrders,
                                  double totalRevenue) {
        this.totalStudents = totalStudents;
        this.pendingOrders = pendingOrders;
        this.washingOrders = washingOrders;
        this.readyOrders = readyOrders;
        this.deliveredOrders = deliveredOrders;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getWashingOrders() {
        return washingOrders;
    }

    public void setWashingOrders(long washingOrders) {
        this.washingOrders = washingOrders;
    }

    public long getReadyOrders() {
        return readyOrders;
    }

    public void setReadyOrders(long readyOrders) {
        this.readyOrders = readyOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
