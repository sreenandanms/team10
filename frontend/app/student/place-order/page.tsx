'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api';
import { LaundryPrice, LaundryOrder } from '@/types';
import {
  Plus,
  Minus,
  Shirt,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export default function PlaceOrderPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const student = currentUser?.role === 'STUDENT' ? currentUser : null;

  const [prices, setPrices] = useState<LaundryPrice[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<LaundryOrder | null>(null);

  useEffect(() => {
    async function loadPrices() {
      try {
        const rates = await api.getPrices();
        setPrices(rates);
        // Initialize quantities with 0
        const initialQtys: Record<string, number> = {};
        rates.forEach((p) => {
          initialQtys[p.clothingType] = 0;
        });
        // Default a couple for demo convenience
        if (rates.some((p) => p.clothingType === 'Shirt')) initialQtys['Shirt'] = 2;
        if (rates.some((p) => p.clothingType === 'Pant')) initialQtys['Pant'] = 1;
        if (rates.some((p) => p.clothingType === 'Towel')) initialQtys['Towel'] = 3;
        setQuantities(initialQtys);
      } catch (err) {
        console.error('Failed to load prices', err);
      }
    }
    loadPrices();
  }, []);

  const handleIncrement = (type: string) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }));
  };

  const handleDecrement = (type: string) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) - 1),
    }));
  };

  // Live estimated total for student guidance
  const selectedItems = prices
    .filter((p) => (quantities[p.clothingType] || 0) > 0)
    .map((p) => {
      const qty = quantities[p.clothingType] || 0;
      const subtotal = qty * p.pricePerUnit;
      return {
        clothingType: p.clothingType,
        quantity: qty,
        unitPrice: p.pricePerUnit,
        subtotal,
      };
    });

  const estimatedTotal = selectedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const totalItemCount = selectedItems.reduce((sum, it) => sum + it.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) {
      setError('You must be logged in as a student to place an order.');
      return;
    }
    if (selectedItems.length === 0) {
      setError('Please add at least one item with quantity greater than 0.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        studentId: student.studentId,
        items: selectedItems.map((item) => ({
          clothingType: item.clothingType,
          quantity: item.quantity,
        })),
        notes,
      };

      const result = await api.createOrder(payload);
      setCreatedOrder(result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit laundry order');
    } finally {
      setSubmitting(false);
    }
  };

  // If order was created, show Confirmation Screen
  if (createdOrder) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto py-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h1>
            <p className="text-xs text-slate-500 mt-1">
              Your laundry request has been saved in the system.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 my-6 text-left space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Order Reference</span>
                <span className="text-sm font-bold text-blue-600">#{createdOrder.orderNumber}</span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Student</span>
                <span className="text-xs font-semibold text-slate-800">
                  {createdOrder.student.name} ({createdOrder.student.roomNumber})
                </span>
              </div>

              <div className="pb-2.5 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium block mb-1">Items</span>
                <div className="space-y-1">
                  {createdOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span>
                        {item.clothingType} &times; {item.quantity}
                      </span>
                      <span className="font-medium">&#8377;{item.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Initial Status</span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-semibold">
                  {createdOrder.status}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-slate-900">Total Billed</span>
                <span className="text-lg font-bold text-slate-900">&#8377;{createdOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/student/orders"
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>View My Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student"
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with back link */}
        <div className="flex items-center gap-4">
          <Link
            href="/student"
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Place Laundry Order</h1>
            <p className="text-xs text-slate-500">
              Select clothing items and specify quantities for hostel laundry
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Clothing Item Selection (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Select Items</h2>
              <p className="text-xs text-slate-500 mb-4">
                Prices are fetched directly from the database
              </p>

              <div className="space-y-3">
                {prices.map((price) => {
                  const qty = quantities[price.clothingType] || 0;
                  return (
                    <div
                      key={price.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        qty > 0
                          ? 'border-blue-300 bg-blue-50/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                            qty > 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Shirt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{price.clothingType}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            &#8377;{price.pricePerUnit} / piece
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleDecrement(price.clothingType)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
                          aria-label={`Decrease ${price.clothingType}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(price.clothingType)}
                          className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                          aria-label={`Increase ${price.clothingType}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Instructions */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Wash white shirt separately, starch bedsheet..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="py-3 divide-y divide-slate-100 text-xs">
                {selectedItems.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No items selected yet</p>
                ) : (
                  selectedItems.map((item) => (
                    <div key={item.clothingType} className="py-2 flex items-center justify-between">
                      <span className="text-slate-700">
                        {item.clothingType} &times; {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-900">&#8377;{item.subtotal}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Total Items</span>
                  <span className="font-semibold text-slate-700">{totalItemCount} pieces</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Estimated Total</span>
                  <span className="text-xl font-bold text-blue-600">&#8377;{estimatedTotal}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Final bill is verified and calculated by the backend upon submission.
                </p>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || selectedItems.length === 0}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting to Database...</span>
                  ) : (
                    <>
                      <span>Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Student info note */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <p className="font-medium text-slate-700">Ordering as:</p>
                <p>{student?.name || 'Sai Krishna'}</p>
                <p>Room {student?.roomNumber || 'A-101'} &bull; {student?.department || 'CSE'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
