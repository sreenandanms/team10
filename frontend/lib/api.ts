import {
  LaundryPrice,
  Student,
  Staff,
  LaundryOrder,
  CreateOrderRequest,
  OrderStatus,
  CreateStudentRequest,
  DashboardStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.message) message = errorData.message;
        if (errorData.validationErrors) {
          const firstKey = Object.keys(errorData.validationErrors)[0];
          message = errorData.validationErrors[firstKey];
        }
      } catch {
        // fallback to status text
      }
      throw new Error(message);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`API Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Laundry rates from Java Backend & MySQL
  async getPrices(): Promise<LaundryPrice[]> {
    return request<LaundryPrice[]>('/prices');
  },

  // Students from Java Backend & MySQL
  async getStudents(search?: string): Promise<Student[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<Student[]>(`/students${query}`);
  },

  async getStudentById(id: string): Promise<Student> {
    return request<Student>(`/students/${id}`);
  },

  async createStudent(data: CreateStudentRequest): Promise<Student> {
    return request<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Orders from Java Backend & MySQL
  async getOrders(params?: { studentId?: string; status?: OrderStatus; search?: string }): Promise<LaundryOrder[]> {
    const query = new URLSearchParams();
    if (params?.studentId) query.set('studentId', params.studentId);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<LaundryOrder[]>(`/orders${queryString}`);
  },

  async getOrderById(id: number | string): Promise<LaundryOrder> {
    return request<LaundryOrder>(`/orders/${id}`);
  },

  // Create Order: Backend calculates total from MySQL pricing
  async createOrder(requestData: CreateOrderRequest): Promise<LaundryOrder> {
    return request<LaundryOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Update Status: Backend validates state transition and updates MySQL
  async updateOrderStatus(id: number | string, status: OrderStatus): Promise<LaundryOrder> {
    return request<LaundryOrder>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Dashboard Stats from Java Backend
  async getDashboardStats(): Promise<DashboardStats> {
    return request<DashboardStats>('/dashboard/stats');
  },

  // Dynamic users from MySQL
  async getUsers(): Promise<{ students: Student[]; staff: Staff[] }> {
    return request<{ students: Student[]; staff: Staff[] }>('/auth/users');
  },
};
