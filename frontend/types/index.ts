export type OrderStatus = 'PENDING' | 'WASHING' | 'READY' | 'DELIVERED';

export type UserRole = 'STUDENT' | 'STAFF';

export interface UserBase {
  id: number;
  name: string;
  phone: string;
  role: UserRole;
}

export interface Student extends UserBase {
  role: 'STUDENT';
  studentId: string;
  roomNumber: string;
  department: string;
}

export interface Staff extends UserBase {
  role: 'STAFF';
  staffId?: string;
  staffType: string;
}

export interface LaundryPrice {
  id: number;
  clothingType: string;
  pricePerUnit: number;
  active: boolean;
}

export interface LaundryOrderItem {
  id?: number;
  clothingType: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface LaundryOrder {
  id: number;
  orderNumber: string;
  student: Student;
  items: LaundryOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequest {
  clothingType: string;
  quantity: number;
}

export interface CreateOrderRequest {
  studentId: string; // e.g. "STU001" or student database ID
  items: OrderItemRequest[];
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface CreateStudentRequest {
  studentId: string;
  name: string;
  phone: string;
  roomNumber: string;
  department: string;
}

export interface DashboardStats {
  totalStudents: number;
  pendingOrders: number;
  washingOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  totalOrders: number;
  totalRevenue: number;
}
