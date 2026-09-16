'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { api } from '@/lib/api';
import { LaundryOrder, OrderStatus, DashboardStats } from '@/types';
import {
  Users,
  Clock,
  RefreshCw,
  CheckCircle2,
  PackageCheck,
  IndianRupee,
  Search,
  ArrowUpDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const STATUS_FILTERS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Washing', value: 'WASHING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Delivered', value: 'DELIVERED' },
];

function StaffDashboardContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        api.getOrders({
          status: activeFilter === 'ALL' ? undefined : activeFilter,
          search: searchQuery,
        }),
        api.getDashboardStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load staff data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeFilter, searchQuery]);

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await api.updateOrderStatus(orderId, newStatus);
      // Reload updated orders and stats from backend
      await loadData();
    } catch (err: any) {
      alert(`Failed to update order status: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Operations Portal</h1>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                Laundry Staff
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage hostel laundry queue, update wash statuses, and view operations metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/staff/students"
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Management</span>
            </Link>
          </div>
        </div>

        {/* Operational Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Students</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.totalStudents || 4}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Registered</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-amber-50/20">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-2">{stats?.pendingOrders || 0}</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Awaiting Wash</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm bg-blue-50/20">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-medium">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <span>Washing</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{stats?.washingOrders || 0}</p>
            <p className="text-[11px] text-blue-600 mt-0.5">In Progress</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/20">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Ready</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900 mt-2">{stats?.readyOrders || 0}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Ready for Pickup</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
              <PackageCheck className="w-4 h-4 text-slate-400" />
              <span>Delivered</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.deliveredOrders || 0}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Completed</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
              <IndianRupee className="w-4 h-4 text-slate-400" />
              <span>Revenue</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">&#8377;{stats?.totalRevenue || 0}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total Billed</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeFilter === f.value
                    ? 'bg-white text-blue-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-80 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, student, room..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Laundry Order Queue</h2>
              <p className="text-xs text-slate-500">
                Update wash cycle progression in real time
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {orders.length} order{orders.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400">Loading order queue...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No orders match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order ID</th>
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold">Room</th>
                    <th className="px-5 py-3 font-semibold">Items</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Current Status</th>
                    <th className="px-5 py-3 font-semibold">Update Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => {
                    const itemsSummary = order.items
                      .map((it) => `${it.quantity} ${it.clothingType}`)
                      .join(', ');

                    const isUpdating = updatingOrderId === order.id;

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-900">{order.student.name}</p>
                          <p className="text-[11px] text-slate-400">{order.student.studentId}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium">
                          {order.student.roomNumber}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={itemsSummary}>
                          {itemsSummary}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          &#8377;{order.totalAmount}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="px-5 py-3.5">
                          {/* Inline Status Transition Dropdown */}
                          <select
                            disabled={isUpdating}
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                            className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="WASHING">Washing</option>
                            <option value="READY">Ready</option>
                            <option value="DELIVERED">Delivered</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/staff/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 text-xs"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function StaffDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-slate-400">Loading staff dashboard...</div>}>
      <StaffDashboardContent />
    </Suspense>
  );
}
