
import React, { useState } from 'react';
import { USERS, HOLIDAY_REQUESTS, ADJUSTMENT_REQUESTS } from '../constants';
import { HolidayRequest, AdjustmentRequest, RequestStatus, User } from '../types';
import { CheckIcon, XIcon } from './Icons';
import EmployeeLogModal from './EmployeeLogModal';

interface ViewingLogState {
    user: User;
    date: Date;
}

const getUser = (userId: string): User | undefined => USERS.find(u => u.id === userId);

const Approvals = () => {
    const [holidayRequests, setHolidayRequests] = useState<HolidayRequest[]>(HOLIDAY_REQUESTS.filter(r => r.status === RequestStatus.PENDING));
    const [adjustmentRequests, setAdjustmentRequests] = useState<AdjustmentRequest[]>(ADJUSTMENT_REQUESTS.filter(r => r.status === RequestStatus.PENDING));
    const [activeTab, setActiveTab] = useState('holidays');
    const [viewingLog, setViewingLog] = useState<ViewingLogState | null>(null);

    const handleHolidayAction = (id: string, status: RequestStatus.APPROVED | RequestStatus.REJECTED) => {
        setHolidayRequests(prev => prev.filter(req => req.id !== id));
        // In a real app, you would update the original request's status
    };
    
    const handleAdjustmentAction = (id: string, status: RequestStatus.APPROVED | RequestStatus.REJECTED) => {
        setAdjustmentRequests(prev => prev.filter(req => req.id !== id));
    };

    const handleViewLog = (userId: string, date: Date) => {
        const user = getUser(userId);
        if (user) {
            setViewingLog({ user, date });
        }
    };

    return (
        <>
            {viewingLog && (
                <EmployeeLogModal 
                    user={viewingLog.user} 
                    date={viewingLog.date} 
                    onClose={() => setViewingLog(null)} 
                />
            )}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Approval Requests</h2>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('holidays')} className={`${activeTab === 'holidays' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Holiday Requests ({holidayRequests.length})
                        </button>
                        <button onClick={() => setActiveTab('adjustments')} className={`${activeTab === 'adjustments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Time Adjustments ({adjustmentRequests.length})
                        </button>
                    </nav>
                </div>
                <div className="mt-6">
                    {activeTab === 'holidays' && (
                        <div className="space-y-4">
                            {holidayRequests.map(req => (
                                <div key={req.id} className="p-4 border rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{getUser(req.userId)?.name || 'Unknown User'}</p>
                                        <p className="text-sm text-gray-600">{req.startDate.toLocaleDateString()} - {req.endDate.toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500 mt-1">{req.reason}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleHolidayAction(req.id, RequestStatus.APPROVED)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><CheckIcon className="h-5 w-5"/></button>
                                        <button onClick={() => handleHolidayAction(req.id, RequestStatus.REJECTED)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><XIcon className="h-5 w-5"/></button>
                                    </div>
                                </div>
                            ))}
                            {holidayRequests.length === 0 && <p className="text-gray-500 text-center py-8">No pending holiday requests.</p>}
                        </div>
                    )}
                    {activeTab === 'adjustments' && (
                         <div className="space-y-4">
                            {adjustmentRequests.map(req => (
                                <div key={req.id} className="p-4 border rounded-lg flex flex-col items-stretch">
                                    <div className="flex justify-between items-start w-full">
                                        <div>
                                            <p className="font-semibold">{getUser(req.userId)?.name || 'Unknown User'}</p>
                                            <p className="text-sm text-gray-600">{req.date.toLocaleDateString()}: {req.adjustedTime}</p>
                                            <p className="text-xs text-gray-500 mt-1">{req.reason}</p>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button onClick={() => handleAdjustmentAction(req.id, RequestStatus.APPROVED)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><CheckIcon className="h-5 w-5"/></button>
                                            <button onClick={() => handleAdjustmentAction(req.id, RequestStatus.REJECTED)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><XIcon className="h-5 w-5"/></button>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t text-left">
                                        <button onClick={() => handleViewLog(req.userId, req.date)} className="text-sm font-medium text-primary hover:underline">
                                            View Activity for this Day
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {adjustmentRequests.length === 0 && <p className="text-gray-500 text-center py-8">No pending time adjustment requests.</p>}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Approvals;