'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Staff, UserRole } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  currentUser: Student | Staff | null;
  role: UserRole;
  loginAsStudent: (studentId: string) => void;
  loginAsStaff: (staffId: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  demoStudents: Student[];
  demoStaff: Staff[];
  loadingUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [demoStudents, setDemoStudents] = useState<Student[]>([]);
  const [demoStaff, setDemoStaff] = useState<Staff[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | Staff | null>(null);
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Load real users from Java Backend & MySQL
  useEffect(() => {
    async function loadBackendUsers() {
      try {
        setLoadingUsers(true);
        const { students, staff } = await api.getUsers();
        setDemoStudents(students);
        setDemoStaff(staff);

        // Check if there is a saved user in localStorage
        const savedUser = localStorage.getItem('hlms_user');
        const savedRole = localStorage.getItem('hlms_role') as UserRole;

        if (savedUser && savedRole) {
          try {
            const parsed = JSON.parse(savedUser);
            // Verify if parsed user exists in backend list
            if (savedRole === 'STUDENT') {
              const matched = students.find((s) => s.studentId === parsed.studentId);
              setCurrentUser(matched || students[0] || null);
            } else {
              const matched = staff.find((st) => st.id === parsed.id || st.name === parsed.name);
              setCurrentUser(matched || staff[0] || null);
            }
            setRole(savedRole);
          } catch {
            if (students.length > 0) {
              setCurrentUser(students[0]);
              setRole('STUDENT');
            }
          }
        } else if (students.length > 0) {
          setCurrentUser(students[0]);
          setRole('STUDENT');
        }
      } catch (err) {
        console.error('Failed to load users from backend:', err);
      } finally {
        setLoadingUsers(false);
      }
    }

    loadBackendUsers();
  }, []);

  const loginAsStudent = (studentId: string) => {
    const student = demoStudents.find((s) => s.studentId === studentId) || demoStudents[0];
    if (student) {
      setCurrentUser(student);
      setRole('STUDENT');
      localStorage.setItem('hlms_user', JSON.stringify(student));
      localStorage.setItem('hlms_role', 'STUDENT');
    }
  };

  const loginAsStaff = (staffIdOrName: string) => {
    const staff = demoStaff.find((s) => String(s.id) === staffIdOrName || s.name === staffIdOrName) || demoStaff[0];
    if (staff) {
      setCurrentUser(staff);
      setRole('STAFF');
      localStorage.setItem('hlms_user', JSON.stringify(staff));
      localStorage.setItem('hlms_role', 'STAFF');
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'STAFF') {
      if (demoStaff.length > 0) {
        loginAsStaff(String(demoStaff[0].id));
      }
    } else {
      if (demoStudents.length > 0) {
        loginAsStudent(demoStudents[0].studentId);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('hlms_user');
    localStorage.removeItem('hlms_role');
    if (demoStudents.length > 0) {
      setCurrentUser(demoStudents[0]);
      setRole('STUDENT');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        loginAsStudent,
        loginAsStaff,
        logout,
        switchRole,
        demoStudents,
        demoStaff,
        loadingUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
