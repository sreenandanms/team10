'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shirt, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsStaff, demoStudents, demoStaff } = useAuth();
  const [roleTab, setRoleTab] = useState<'STUDENT' | 'STAFF'>('STUDENT');
  const [selectedStudentId, setSelectedStudentId] = useState(demoStudents[0]?.studentId || 'STU001');
  const [selectedStaffId, setSelectedStaffId] = useState(demoStaff[0]?.staffId || 'STF001');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleTab === 'STUDENT') {
      loginAsStudent(selectedStudentId);
      router.push('/student');
    } else {
      loginAsStaff(selectedStaffId);
      router.push('/staff');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shirt className="w-6 h-6" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          LaundryHub Portal
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Hostel Laundry Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl sm:px-10">
          {/* Role selector tabs */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => setRoleTab('STUDENT')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                roleTab === 'STUDENT'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Login</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('STAFF')}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                roleTab === 'STAFF'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff / Admin</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {roleTab === 'STUDENT' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Demo Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {demoStudents.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.name} ({s.studentId} - Room {s.roomNumber}, {s.department})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Staff Account
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {demoStaff.map((st, idx) => (
                    <option key={st.id ? `staff-${st.id}` : `staff-${idx}`} value={String(st.id || idx)}>
                      {st.name} ({st.staffType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <span>Sign in to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Info Box */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-1">Hostel Project Demonstration</p>
            <p className="leading-relaxed">
              Based on the Java OOP Hostel Laundry Management System. Choose a student or staff profile to evaluate the complete end-to-end flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
