'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/orders/StatusBadge';
import { StatusTimeline } from '@/components/orders/StatusTimeline';
import { api } from '@/lib/api';
import { LaundryOrder, OrderStatus } from '@/types';
import {
  ArrowLeft,
  User,
  MapPin,
  Building,
  Phone,
  Shirt,
  CheckCircle,
  Save,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

export default function StaffOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState<LaundryOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PENDING');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await api.getOrderById(orderId);
      if (data) {
        setOrder(data);
        setSelectedStatus(data.status);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    try {
      setSaving(true);
      setFeedbackMessage(null);
      // Calls PUT /api/orders/{id}/status
      const updated = await api.updateOrderStatus(order.id, selectedStatus);
      setOrder(updated);
      setSelectedStatus(updated.status);
      setFeedbackMessage(`Status updated to ${updated.status} successfully.`);
    } catch (err: any) {
      setFeedbackMessage(`Error: ${err.message || 'Failed to update status'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="py-16 text-center text-xs text-slate-400">Loading order management...</div>
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
            href="/staff"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Staff Dashboard</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/staff"
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Manage Order #{order.orderNumber}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Hostel Laundry Processing &bull; Student {order.student.name}
              </p>
            </div>
          </div>
        </div>

        {feedbackMessage && (
          <div
            className={`p-3.5 rounded-lg text-xs flex items-center gap-2 border ${
              feedbackMessage.startsWith('Error')
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {feedbackMessage.startsWith('Error') ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Operational Status Action Card */}
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 bg-gradient-to-r from-blue-50/40 to-indigo-50/40">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Update Order Status</h2>
          <p className="text-xs text-slate-500 mb-4">
            Advance the order through its wash and delivery cycle
          </p>

          <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-64">
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Select New Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending (Awaiting Pickup)</option>
                <option value="WASHING">Washing (In Machine)</option>
                <option value="READY">Ready (Cleaned & Packed)</option>
                <option value="DELIVERED">Delivered (Handed to Student)</option>
              </select>
            </div>

            <div className="sm:self-end">
              <button
                type="submit"
                disabled={saving}
                className="py-2 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                {saving ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Current Stage
          </h2>
          <div className="mt-4">
            <StatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </div>
        </div>

        {/* Grid: Items & Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items Table */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Order Items</h2>
              <p className="text-xs text-slate-500">Clothing breakdown and verified billing</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Clothing Item</th>
                  <th className="px-5 py-3 font-semibold text-center">Unit Price</th>
                  <th className="px-5 py-3 font-semibold text-center">Quantity</th>
                  <th className="px-5 py-3 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <Shirt className="w-4 h-4 text-blue-600" />
                        <span>{item.clothingType}</span>
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
                    Total Pieces: {order.items.reduce((sum, it) => sum + it.quantity, 0)}
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-600">Total Billed:</td>
                  <td className="px-5 py-3.5 text-right text-base font-bold text-blue-600">
                    &#8377;{order.totalAmount}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Student Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Student Information
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{order.student.name}</p>
                  <p className="text-[11px] text-slate-400">Student ID: {order.student.studentId}</p>
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
                  <p className="text-[11px] text-slate-400">Department</p>
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
        </div>
      </div>
    </AppLayout>
  );
}
