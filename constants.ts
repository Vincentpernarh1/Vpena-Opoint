
import { User, UserRole, HolidayRequest, AdjustmentRequest, RequestStatus, TimeEntry, TimeEntryType, Payslip } from './types';

// Dummy data with emails and passwords for domain-based login
export const USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@vertex.com', password: 'password123', role: UserRole.EMPLOYEE, avatarUrl: 'https://picsum.photos/seed/alice/100/100', team: 'Frontend' },
  { id: '2', name: 'Bob Williams', email: 'bob@vertex.com', password: 'password123', role: UserRole.EMPLOYEE, avatarUrl: 'https://picsum.photos/seed/bob/100/100', team: 'Frontend' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@summit.inc', password: 'password123', role: UserRole.MANAGER, avatarUrl: 'https://picsum.photos/seed/charlie/100/100', team: 'Management' },
  { id: '4', name: 'Diana Prince', email: 'diana@vertex.com', password: 'password123', role: UserRole.EMPLOYEE, avatarUrl: 'https://picsum.photos/seed/diana/100/100', team: 'Backend' },
];

export const HOLIDAY_REQUESTS: HolidayRequest[] = [
  { id: 'h1', userId: '1', startDate: new Date('2024-08-10'), endDate: new Date('2024-08-15'), reason: 'Family vacation', status: RequestStatus.APPROVED },
  { id: 'h2', userId: '2', startDate: new Date('2024-09-01'), endDate: new Date('2024-09-03'), reason: 'Short trip', status: RequestStatus.PENDING },
];

export const ADJUSTMENT_REQUESTS: AdjustmentRequest[] = [
    { id: 'a1', userId: '4', date: new Date(), adjustedTime: '09:05 Clock In', reason: 'Forgot to clock in on time.', status: RequestStatus.PENDING },
];

export const TIME_ENTRIES: TimeEntry[] = [
  // Alice Johnson's entries for today
  { id: 'te1', userId: '1', type: TimeEntryType.CLOCK_IN, timestamp: new Date(new Date().setHours(9, 1, 15)), location: '123 Main St, Anytown, USA', photoUrl: 'https://picsum.photos/seed/alice_in/400/400' },
  { id: 'te4', userId: '1', type: TimeEntryType.CLOCK_OUT, timestamp: new Date(new Date().setHours(17, 32, 10)), location: '123 Main St, Anytown, USA', photoUrl: 'https://picsum.photos/seed/alice_out/400/400' },

  // Bob Williams' entries for today
  { id: 'te5', userId: '2', type: TimeEntryType.CLOCK_IN, timestamp: new Date(new Date().setHours(8, 55, 20)), location: '456 Oak Ave, Anytown, USA', photoUrl: 'https://picsum.photos/seed/bob_in/400/400' },

  // Diana Prince's entries for today (related to her adjustment request)
  { id: 'te8', userId: '4', type: TimeEntryType.CLOCK_OUT, timestamp: new Date(new Date().setHours(18, 2, 30)), location: '789 Pine Ln, Anytown, USA', photoUrl: 'https://picsum.photos/seed/diana_out/400/400' },
];

export const PAYSCLIPS: Payslip[] = [
    {
        id: 'ps1',
        userId: '1',
        payPeriodStart: new Date('2024-07-01'),
        payPeriodEnd: new Date('2024-07-15'),
        payDate: new Date('2024-07-20'),
        grossPay: 2500,
        totalDeductions: 550,
        netPay: 1950,
        earnings: [
            { description: 'Regular Pay (80 hrs)', amount: 2000 },
            { description: 'Overtime (10 hrs)', amount: 500 },
        ],
        deductions: [
            { description: 'Federal Tax', amount: 300 },
            { description: 'State Tax', amount: 150 },
            { description: 'Health Insurance', amount: 100 },
        ],
    },
    {
        id: 'ps2',
        userId: '1',
        payPeriodStart: new Date('2024-06-16'),
        payPeriodEnd: new Date('2024-06-30'),
        payDate: new Date('2024-07-05'),
        grossPay: 2200,
        totalDeductions: 480,
        netPay: 1720,
        earnings: [
            { description: 'Regular Pay (80 hrs)', amount: 2000 },
            { description: 'Bonus', amount: 200 },
        ],
        deductions: [
            { description: 'Federal Tax', amount: 250 },
            { description: 'State Tax', amount: 130 },
            { description: 'Health Insurance', amount: 100 },
        ],
    },
];