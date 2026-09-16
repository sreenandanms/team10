'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shirt,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  HelpCircle,
  ArrowRightLeft,
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, role, logout, switchRole, demoStudents, demoStaff, loginAsStudent, loginAsStaff } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isStaff = role === 'STAFF';

  const studentNavItems = [
    { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { name: 'Place Order', href: '/student/place-order', icon: PlusCircle },
    { name: 'My Orders', href: '/student/orders', icon: ClipboardList },
  ];

  const staffNavItems = [
    { name: 'Dashboard & Orders', href: '/staff', icon: LayoutDashboard },
    { name: 'Student Management', href: '/staff/students', icon: Users },
  ];

  const navItems = isStaff ? staffNavItems : studentNavItems;

  const handleToggleRole = () => {
    if (isStaff) {
      switchRole('STUDENT');
      router.push('/student');
    } else {
      switchRole('STAFF');
      router.push('/staff');
    }
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'HL';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">LaundryHub</h1>
            <p className="text-xs text-slate-500 font-medium">Hostel Laundry System</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {isStaff ? 'Staff Administration' : 'Student Portal'}
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/student' && item.href !== '/staff' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-100 space-y-1.5">
          {/* Quick role toggle button for viva demo */}
          <button
            onClick={handleToggleRole}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            title="Switch between student and staff view"
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Switch to {isStaff ? 'Student' : 'Staff'}</span>
            </span>
            <span className="text-[10px] uppercase font-bold bg-white px-1.5 py-0.5 rounded text-blue-800 border border-blue-200">
              Demo
            </span>
          </button>

          <Link
            href="/login"
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out</span>
          </Link>

          <div className="pt-2 text-[11px] text-slate-400 px-3">
            <p className="leading-snug">Clean laundry.</p>
            <p className="leading-snug">A better hostel life.</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Search bar */}
          <div className="w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isStaff ? 'Search by order ID, student, room...' : 'Search orders, items...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    if (isStaff) {
                      router.push(`/staff?search=${encodeURIComponent(val)}`);
                    } else {
                      router.push(`/student/orders?search=${encodeURIComponent(val)}`);
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-slate-200 shadow-md p-3 text-xs z-50">
                  <div className="font-semibold text-slate-900 pb-2 border-b border-slate-100">Notifications</div>
                  <div className="py-2 space-y-2">
                    <div className="text-slate-600">
                      <span className="font-semibold text-blue-600">#ORD-1024</span> is now Washing.
                    </div>
                    <div className="text-slate-600">
                      <span className="font-semibold text-emerald-600">#ORD-1021</span> is Ready for pickup.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Role indicator pill */}
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                isStaff
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {role}
            </span>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 pl-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {initials}
                </div>
                <div className="text-left text-xs hidden sm:block">
                  <p className="font-semibold text-slate-900 leading-tight">{currentUser?.name || 'User'}</p>
                  <p className="text-slate-500 text-[11px]">
                    {isStaff
                      ? (currentUser as any)?.staffType || 'Staff'
                      : `Room ${(currentUser as any)?.roomNumber || 'A-101'}`}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile dropdown menu with quick user switch for viva presentation */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-slate-200 shadow-lg p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentUser?.name}</p>
                    <p className="text-slate-500 text-[11px]">{currentUser?.phone}</p>
                    {!isStaff && (
                      <p className="text-slate-500 text-[11px]">
                        ID: {(currentUser as any)?.studentId} | Dept: {(currentUser as any)?.department}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Demo User
                    </p>
                    {demoStudents.map((s) => (
                      <button
                        key={s.studentId}
                        onClick={() => {
                          loginAsStudent(s.studentId);
                          setUserMenuOpen(false);
                          router.push('/student');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded hover:bg-slate-50 flex items-center justify-between ${
                          currentUser?.name === s.name && role === 'STUDENT' ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="text-[10px] text-slate-400">{s.roomNumber}</span>
                      </button>
                    ))}

                    <div className="border-t border-slate-100 my-1" />
                    {demoStaff.map((st, idx) => (
                      <button
                        key={st.id ? `staff-${st.id}` : `staff-${idx}`}
                        onClick={() => {
                          loginAsStaff(String(st.id || idx));
                          setUserMenuOpen(false);
                          router.push('/staff');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded hover:bg-slate-50 flex items-center justify-between ${
                          currentUser?.name === st.name && role === 'STAFF' ? 'bg-purple-50 font-semibold text-purple-700' : 'text-slate-700'
                        }`}
                      >
                        <span>{st.name}</span>
                        <span className="text-[10px] text-slate-400">Staff</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <Link
                      href="/login"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="block px-3 py-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body with smooth fade-in */}
        <main className="flex-1 p-8 animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
