import React, { useState, useEffect } from 'react';
import { HolidayRequest, User, RequestStatus } from '../types';
import { HOLIDAY_REQUESTS } from '../constants';
import { CalendarIcon } from './Icons';
import Calendar from './Calendar';
import Notification from './Notification';

interface HolidayPlannerProps {
    currentUser: User;
}

const statusColorMap: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.APPROVED]: 'bg-green-100 text-green-800',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
};

// Helper to format date to YYYY-MM-DD for input fields
const toInputDate = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
};

const HolidayPlanner = ({ currentUser }: HolidayPlannerProps) => {
    const [requests, setRequests] = useState<HolidayRequest[]>(HOLIDAY_REQUESTS.filter(r => r.userId === currentUser.id));
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [numDays, setNumDays] = useState<number | string>('');
    const [reason, setReason] = useState('');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (startDate && endDate && endDate >= startDate) {
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays !== numDays) {
               setNumDays(diffDays);
            }
        } else if (!startDate || !endDate) {
            setNumDays('');
        }
    }, [startDate, endDate, numDays]);

    useEffect(() => {
        if (startDate && typeof numDays === 'number' && numDays > 0) {
            const newEndDate = new Date(startDate);
            newEndDate.setDate(newEndDate.getDate() + numDays - 1);
            if (endDate?.getTime() !== newEndDate.getTime()) {
                setEndDate(newEndDate);
            }
        } else if (startDate && numDays === '') {
            setEndDate(null);
        }
    }, [startDate, numDays]);
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = value ? new Date(`${value}T00:00:00`) : null;
        setStartDate(date);
        if (date && endDate && date > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const date = value ? new Date(`${value}T00:00:00`) : null;
        if(date && startDate && date < startDate) return;
        setEndDate(date);
    };

    const handleNumDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const days = e.target.value;
        setNumDays(days === '' ? '' : parseInt(days, 10));
    };

    const handleDateClick = (day: Date) => {
        if (startDate && !endDate) {
            if (day < startDate) {
                setStartDate(day);
            } else {
                setEndDate(day);
            }
        } else {
            setStartDate(day);
            setEndDate(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!startDate || !endDate) return;
        
        const newRequest: HolidayRequest = {
            id: `hr-${Date.now()}`,
            userId: currentUser.id,
            startDate,
            endDate,
            reason,
            status: RequestStatus.PENDING,
        };
        setRequests(prev => [newRequest, ...prev].sort((a,b) => b.startDate.getTime() - a.startDate.getTime()));
        
        // Reset form
        setStartDate(null);
        setEndDate(null);
        setNumDays('');
        setReason('');

        // Show notification
        setNotification('Holiday request submitted successfully!');
    };

    return (
        <>
            {notification && <Notification message={notification} type="success" onClose={() => setNotification(null)} />}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Holiday</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" id="startDate" name="startDate" value={toInputDate(startDate)} onChange={handleStartDateChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-end">
                            <div>
                            <label htmlFor="numDays" className="block text-sm font-medium text-gray-700">Number of Days</label>
                            <input type="number" id="numDays" name="numDays" value={numDays} onChange={handleNumDaysChange} min="1" disabled={!startDate} placeholder="e.g. 5" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" id="endDate" name="endDate" value={toInputDate(endDate)} onChange={handleEndDateChange} disabled={!startDate} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason (optional)</label>
                            <textarea id="reason" name="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                        </div>
                        <button type="submit" disabled={!startDate || !endDate} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-300">Submit Request</button>
                    </form>
                </div>
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <Calendar 
                        requests={requests} 
                        displayedDate={calendarDate} 
                        setDisplayedDate={setCalendarDate}
                        startDate={startDate}
                        endDate={endDate}
                        onDateClick={handleDateClick}
                    />
                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">My Requests</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {requests.length > 0 ? requests.map(req => (
                                <div key={req.id} className="p-3 border rounded-lg flex items-start space-x-3 bg-gray-50">
                                <div className="bg-primary-light p-2.5 rounded-full mt-1">
                                    <CalendarIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-700">
                                            {req.startDate.toLocaleDateString()} - {req.endDate.toLocaleDateString()}
                                        </p>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{req.reason || 'No reason provided.'}</p>
                                </div>
                                </div>
                            )) : (
                                <p className="text-gray-500 text-center py-8">You have no holiday requests.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HolidayPlanner;