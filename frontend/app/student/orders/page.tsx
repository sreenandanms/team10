'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { api } from '@/lib/api';
import { LaundryOrder, OrderStatus } from '@/types';
import {
  Shirt,
  Search,
  Filter,
  ChevronRight,
  PlusCircle,
  Calendar,
  IndianRupee,
} from 'lucide-react';

const FILTER_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All Orders', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Washing', value: 'WASHING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Delivered', value: 'DELIVERED' },
];

export default function MyOrdersPage() {
  const { currentUser } = useAuth();
  const student = currentUser?.role === 'STUDENT' ? currentUser : null;

  const [orders, setOrders] = useState<LaundryOrder[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await api.getOrders({
          studentId: student?.studentId,
          status: activeTab === 'ALL' ? undefined : activeTab,
          search: searchQuery,
        });
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [student?.studentId, activeTab, searchQuery]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Laundry Orders</h1>
            <p className="text-xs text-slate-500">
              Track status, item breakdowns, and past laundry history
            </p>
          </div>
          <Link
            href="/student/place-order"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm self-start"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Place New Order</span>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab.value
                    ? 'bg-white text-blue-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="w-full md:w-72 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Shirt className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'ALL'
                ? "You haven't placed any laundry orders yet."
                : `No orders currently in "${activeTab}" status.`}
            </p>
            <Link
              href="/student/place-order"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Order</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const totalPieces = order.items.reduce((sum, it) => sum + it.quantity, 0);
              const itemsList = order.items
                .map((it) => `${it.quantity} ${it.clothingType}`)
                .join(', ');

              return (
                <Link
                  key={order.id}
                  href={`/student/orders/${order.id}`}
                  className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Shirt className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                            #{order.orderNumber}
                          </span>
                          <StatusBadge status={order.status} size="sm" />
                        </div>

                        <p className="text-xs text-slate-600 mt-1">{itemsList}</p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </span>
                          <span>&bull;</span>
                          <span>{totalPieces} pieces</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">Total Bill</p>
                        <p className="text-base font-bold text-slate-900">&#8377;{order.totalAmount}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
