'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { StatusTimeline } from '@/components/orders/StatusTimeline';
import { api } from '@/lib/api';
import { LaundryOrder } from '@/types';
import {
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Building,
  Shirt,
  Phone,
  Clock,
  Printer,
} from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<LaundryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await api.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-xs text-slate-400">Loading order details...</div>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto py-16 text-center">
          <p className="text-sm font-bold text-slate-800">Order not found</p>
          <p className="text-xs text-slate-500 mt-1">
            Could not find an order with identifier #{orderId}.
          </p>
          <Link
            href="/student/orders"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/student/orders"
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Order #{order.orderNumber}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Visual Status Progression Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Laundry Progress Tracker
          </h2>
          <div className="mt-4">
            <StatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left 2 Cols: Itemized Breakdown Table */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Itemized Breakdown</h2>
                <p className="text-xs text-slate-500">Official laundry rates and calculated subtotals</p>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Clothing Type</th>
                    <th className="px-5 py-3 font-semibold text-center">Unit Price</th>
                    <th className="px-5 py-3 font-semibold text-center">Quantity</th>
                    <th className="px-5 py-3 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Shirt className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-slate-900">{item.clothingType}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center text-slate-600">&#8377;{item.unitPrice}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-900">
                        &#8377;{item.subtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 text-xs font-semibold">
                  <tr>
                    <td colSpan={2} className="px-5 py-3.5 text-slate-600">
                      Total Items ({order.items.reduce((s, it) => s + it.quantity, 0)} pieces)
                    </td>
                    <td className="px-5 py-3.5 text-center text-slate-600">Total Bill</td>
                    <td className="px-5 py-3.5 text-right text-base font-bold text-blue-600">
                      &#8377;{order.totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right 1 Col: Student & Hostel Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Student Details
              </h2>

              <div className="mt-3 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{order.student.name}</p>
                    <p className="text-[11px] text-slate-400">ID: {order.student.studentId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">Room {order.student.roomNumber}</p>
                    <p className="text-[11px] text-slate-400">Hostel Block A</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{order.student.department}</p>
                    <p className="text-[11px] text-slate-400">Academic Department</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{order.student.phone}</p>
                    <p className="text-[11px] text-slate-400">Contact Number</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hostel Support Notice */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1">Laundry Collection</p>
              Collect your cleaned clothes from Laundry Room Counter, Ground Floor, Block A between 4:00 PM and 7:00 PM.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
