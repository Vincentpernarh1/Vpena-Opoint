export enum UserRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Made optional for security reasons, but we'll use it for mock data
  role: UserRole;
  avatarUrl: string;
  team: string;
}

export enum TimeEntryType {
  CLOCK_IN = 'Clock In',
  CLOCK_OUT = 'Clock Out',
}

export interface TimeEntry {
  id: string;
  userId: string;
  type: TimeEntryType;
  timestamp: Date;
  location?: string;
  photoUrl?: string;
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface HolidayRequest {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: RequestStatus;
}

export interface AdjustmentRequest {
  id: string;
  userId: string;
  date: Date;
  adjustedTime: string;
  reason: string;
  status: RequestStatus;
}

export interface Earning {
  description: string;
  amount: number;
}

export interface Deduction {
  description: string;
  amount: number;
}

export interface Payslip {
    id: string;
    userId: string;
    payPeriodStart: Date;
    payPeriodEnd: Date;
    payDate: Date;
    grossPay: number;
    totalDeductions: number;
    netPay: number;
    earnings: Earning[];
    deductions: Deduction[];
}


export type View = 'dashboard' | 'holidays' | 'approvals' | 'employees' | 'payslips';