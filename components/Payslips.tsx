import React, { useState, useMemo } from 'react';
import { User, Payslip, UserRole } from '../types';
import { PAYSCLIPS, USERS } from '../constants';
import { TrendingUpIcon, TrendingDownIcon, LogoIcon, ChevronDownIcon, ArrowLeftIcon } from './Icons';

interface PayslipsProps {
    currentUser: User;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const groupPayslipsByYear = (payslips: Payslip[]) => {
    return payslips.reduce((acc, payslip) => {
        const year = payslip.payDate.getFullYear().toString();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(payslip);
        return acc;
    }, {} as Record<string, Payslip[]>);
};


const PayslipDetailView = ({ employee }: { employee: User }) => {
    const userPayslips = useMemo(() => {
        return PAYSCLIPS.filter(p => p.userId === employee.id)
            .sort((a, b) => b.payDate.getTime() - a.payDate.getTime());
    }, [employee.id]);

    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(userPayslips[0] || null);
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

    const groupedPayslips = useMemo(() => groupPayslipsByYear(userPayslips), [userPayslips]);
    const sortedYears = useMemo(() => Object.keys(groupedPayslips).sort((a, b) => parseInt(b) - parseInt(a)), [groupedPayslips]);

    if (userPayslips.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">No Payslips Available</h2>
                    <p className="text-gray-500 mt-2">There are no payslips to display for {employee.name}.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {selectedPayslip && (
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl animate-fade-in">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 mb-6">
                        <div className='mb-4 md:mb-0'>
                            <h1 className="text-3xl font-bold text-gray-900">Payslip</h1>
                            <p className="text-gray-500">{employee.name}</p>
                        </div>
                        <div className="text-left md:text-right w-full md:w-auto">
                            <div className="flex items-center md:justify-end space-x-2">
                                 <LogoIcon className="h-7 w-7" />
                                 <span className="text-lg font-bold text-gray-700">Vpena Opoint</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Pay Date: <span className="font-medium text-gray-700">{formatDate(selectedPayslip.payDate)}</span></p>
                            <p className="text-sm text-gray-500">Pay Period: <span className="font-medium text-gray-700">{formatDate(selectedPayslip.payPeriodStart)} - {formatDate(selectedPayslip.payPeriodEnd)}</span></p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-green-700 uppercase">Gross Pay</p>
                            <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedPayslip.grossPay)}</p>
                        </div>
                         <div className="bg-red-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-red-700 uppercase">Deductions</p>
                            <p className="text-3xl font-bold text-red-600">{formatCurrency(selectedPayslip.totalDeductions)}</p>
                        </div>
                         <div className="bg-primary-light p-4 rounded-lg border-2 border-primary">
                            <p className="text-sm font-medium text-primary uppercase">Net Pay</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(selectedPayslip.netPay)}</p>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Earnings */}
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingUpIcon className="h-6 w-6 text-green-500" />
                                <h3 className="text-xl font-semibold text-gray-800">Earnings</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedPayslip.earnings.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
                                        <p className="text-gray-600">{item.description}</p>
                                        <p className="font-medium text-gray-800">{formatCurrency(item.amount)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 mt-2 border-t-2 font-bold">
                                <p className="text-gray-800">Total Earnings</p>
                                <p className="text-gray-900">{formatCurrency(selectedPayslip.grossPay)}</p>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <TrendingDownIcon className="h-6 w-6 text-red-500" />
                                <h3 className="text-xl font-semibold text-gray-800">Deductions</h3>
                            </div>
                            <div className="space-y-2">
                                {selectedPayslip.deductions.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-gray-50">
                                        <p className="text-gray-600">{item.description}</p>
                                        <p className="font-medium text-gray-800">{formatCurrency(item.amount)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center text-sm p-2 mt-2 border-t-2 font-bold">
                                <p className="text-gray-800">Total Deductions</p>
                                <p className="text-gray-900">{formatCurrency(selectedPayslip.totalDeductions)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Collapsible Pay History */}
            <div className="mt-8 bg-white rounded-lg shadow-md">
                <button
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full flex justify-between items-center text-left p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800">Pay History</h2>
                    <ChevronDownIcon
                        className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`}
                    />
                </button>
                {isHistoryExpanded && (
                    <div className="px-6 pb-6 border-t animate-fade-in-down">
                        {sortedYears.map(year => (
                            <div key={year} className="mt-4">
                                <h3 className="font-semibold text-lg text-gray-700 mb-2">{year}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {groupedPayslips[year].map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedPayslip(p);
                                                setIsHistoryExpanded(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-md transition-colors text-sm ${
                                                selectedPayslip?.id === p.id 
                                                ? 'bg-primary text-white font-semibold shadow' 
                                                : 'bg-gray-100 hover:bg-primary-light hover:text-primary text-gray-700'
                                            }`}
                                        >
                                            <p>Pay Date: {formatDate(p.payDate)}</p>
                                            <p className={`${selectedPayslip?.id === p.id ? 'text-indigo-200' : 'text-gray-500'}`}>{formatCurrency(p.netPay)}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const Payslips = ({ currentUser }: PayslipsProps) => {
    const isManager = currentUser.role === UserRole.MANAGER;
    const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

    const handleSelectEmployee = (user: User) => {
        setSelectedEmployee(user);
    };

    if (isManager && !selectedEmployee) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Employee</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {USERS.map(user => (
                        <button key={user.id} onClick={() => handleSelectEmployee(user)} className="p-4 border rounded-lg text-center hover:shadow-lg hover:border-primary transition-all duration-200">
                             <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-3" />
                             <p className="font-semibold text-gray-800">{user.name}</p>
                             <p className="text-sm text-gray-500">{user.team}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    const employeeToView = isManager ? selectedEmployee! : currentUser;

    return (
        <div>
            {isManager && (
                <button onClick={() => setSelectedEmployee(null)} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-primary mb-6">
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back to Employee List</span>
                </button>
            )}
            <PayslipDetailView employee={employeeToView} />
        </div>
    );
};

export default Payslips;
