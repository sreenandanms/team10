'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { api } from '@/lib/api';
import { LaundryOrder, LaundryPrice } from '@/types';
import {
  FileText,
  ShoppingBag,
  IndianRupee,
  Clock,
  ArrowRight,
  ChevronRight,
  Shirt,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const student = currentUser?.role === 'STUDENT' ? currentUser : null;

  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [prices, setPrices] = useState<LaundryPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [ordersData, pricesData] = await Promise.all([
          api.getOrders({ studentId: student?.studentId }),
          api.getPrices(),
        ]);
        setOrders(ordersData);
        setPrices(pricesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [student?.studentId]);

  const activeOrders = orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'WASHING' || o.status === 'READY'
  );

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Good morning, {student?.name || 'Student'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here's a quick overview of your hostel laundry activity.
            </p>
          </div>
          <div className="mt-3 md:mt-0 text-right">
            <p className="text-xs font-semibold text-slate-500">{currentDateFormatted}</p>
            <p className="text-xs text-blue-600 font-medium">
              Hostel Block A &bull; Room {student?.roomNumber || 'A-101'}
            </p>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{activeOrders.length}</p>
              <p className="text-xs font-medium text-slate-500">Active Orders</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              <p className="text-xs font-medium text-slate-500">Total Orders</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">&#8377;{totalSpent}</p>
              <p className="text-xs font-medium text-slate-500">Total Spent</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">2-3 Days</p>
              <p className="text-xs font-medium text-slate-500">Avg. Turnaround</p>
            </div>
          </div>
        </div>

        {/* Main Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Orders Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Active Orders</h2>
                  <p className="text-xs text-slate-500">Track current status in real-time</p>
                </div>
                <Link
                  href="/student/orders"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-sm text-slate-400">Loading orders...</div>
              ) : activeOrders.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-sm font-medium text-slate-600">No active laundry orders</p>
                  <p className="text-xs text-slate-400 mt-1">Ready to send clothes for wash?</p>
                  <Link
                    href="/student/place-order"
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    <span>Place Laundry Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrders.map((order) => {
                    const itemsSummary = order.items
                      .map((it) => `${it.quantity} ${it.clothingType}${it.quantity > 1 ? 's' : ''}`)
                      .join(', ');

                    return (
                      <Link
                        key={order.id}
                        href={`/student/orders/${order.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Shirt className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                                #{order.orderNumber}
                              </span>
                              <span className="text-xs text-slate-400">&bull;</span>
                              <span className="text-xs text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{itemsSummary}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">&#8377;{order.totalAmount}</p>
                          </div>
                          <StatusBadge status={order.status} />
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Banner card */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-sm flex items-center justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-blue-500/30 border border-blue-400/40 text-[11px] font-semibold rounded uppercase tracking-wider text-blue-200 mb-2">
                  Hostel Service
                </span>
                <h3 className="text-lg font-bold text-white">Clean Clothes, On Time.</h3>
                <p className="text-xs text-blue-200 mt-1 max-w-md">
                  Standard turnaround is 2 days. Drop items off at the Ground Floor laundry room before 10:00 AM for same-day wash cycle.
                </p>
              </div>
              <Link
                href="/student/place-order"
                className="px-4 py-2 bg-white text-blue-900 font-semibold text-xs rounded-lg hover:bg-blue-50 transition-colors shrink-0 shadow-sm"
              >
                Place New Order
              </Link>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                  <p className="text-xs text-slate-500">History of your past hostel laundry requests</p>
                </div>
                <Link
                  href="/student/orders"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Order ID</th>
                      <th className="px-5 py-3 font-semibold">Items</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                      <th className="px-5 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => {
                      const summary = order.items
                        .map((it) => `${it.quantity} ${it.clothingType}`)
                        .join(', ');
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-slate-900">#{order.orderNumber}</td>
                          <td className="px-5 py-3.5 text-slate-700">{summary}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900">&#8377;{order.totalAmount}</td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={order.status} size="sm" />
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              href={`/student/orders/${order.id}`}
                              className="text-blue-600 font-semibold hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Order Action Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900">Quick Order</h2>
              <p className="text-xs text-slate-500 mt-0.5">Need clean clothes this week?</p>

              <div className="mt-4">
                <Link
                  href="/student/place-order"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>Place Laundry Order</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Laundry Rates Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Laundry Rates</h2>
                <span className="text-[11px] font-semibold text-slate-400">Hostel Approved</span>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {prices.map((price) => (
                  <div key={price.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                        <Shirt className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold text-slate-800">{price.clothingType}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      &#8377;{price.pricePerUnit} <span className="font-normal text-slate-400">/ piece</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 leading-snug">
                Prices are set by hostel management and applied automatically at checkout.
              </div>
            </div>

            {/* Order Status Guide */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Status Guide
              </h2>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Pending</p>
                    <p className="text-slate-500 text-[11px]">Order placed and awaiting laundry room dropoff</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Washing</p>
                    <p className="text-slate-500 text-[11px]">Items are in the laundry machine cycle</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Ready</p>
                    <p className="text-slate-500 text-[11px]">Cleaned, folded, and ready for hostel pickup</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Delivered</p>
                    <p className="text-slate-500 text-[11px]">Handed back to the student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
