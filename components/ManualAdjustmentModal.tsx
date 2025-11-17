import React, { useState } from 'react';
import { TimeEntryType } from '../types';
import { XIcon } from './Icons';

interface ManualAdjustmentModalProps {
    onClose: () => void;
    onSubmit: (data: { date: string, time: string, type: TimeEntryType, reason: string }) => void;
}

const ManualAdjustmentModal = ({ onClose, onSubmit }: ManualAdjustmentModalProps) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('');
    const [type, setType] = useState<TimeEntryType>(TimeEntryType.CLOCK_IN);
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!time || !reason.trim()) {
            setError('Time and justification are required.');
            return;
        }
        setError('');
        onSubmit({ date, time, type, reason });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <XIcon className="h-6 w-6"/>
                </button>
                <h3 className="text-xl font-semibold mb-4">Request Manual Time Adjustment</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="adj-date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" id="adj-date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="adj-time" className="block text-sm font-medium text-gray-700">Time</label>
                        <input type="time" id="adj-time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="adj-type" className="block text-sm font-medium text-gray-700">Adjustment Type</label>
                        <select id="adj-type" value={type} onChange={e => setType(e.target.value as TimeEntryType)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                            <option value={TimeEntryType.CLOCK_IN}>Clock In</option>
                            <option value={TimeEntryType.CLOCK_OUT}>Clock Out</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="adj-reason" className="block text-sm font-medium text-gray-700">Justification</label>
                        <textarea id="adj-reason" value={reason} onChange={e => setReason(e.target.value)} rows={3} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., I forgot to clock out yesterday."></textarea>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualAdjustmentModal;
