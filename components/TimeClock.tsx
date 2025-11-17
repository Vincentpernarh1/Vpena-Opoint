import React, { useState, useEffect, useMemo } from 'react';
import { TimeEntry, TimeEntryType, User } from '../types';
import { ClockIcon, MapPinIcon } from './Icons';
import CameraModal from './CameraModal';
import ImagePreviewModal from './ImagePreviewModal';
import ManualAdjustmentModal from './ManualAdjustmentModal';
import Notification from './Notification';

interface TimeClockProps {
    currentUser: User;
}

// This is a mock function. In a real app, you would use a reverse geocoding API.
const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Approx. location near ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        }, 500);
    });
};

const formatDuration = (ms: number, withSign = false) => {
    const isNegative = ms < 0;
    if (isNegative) ms = -ms;
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const sign = isNegative ? '-' : (withSign ? '+' : '');

    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimeClock = ({ currentUser }: TimeClockProps) => {
    const [time, setTime] = useState(new Date());
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [currentActionType, setCurrentActionType] = useState<TimeEntryType | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const lastEntryType = useMemo(() => timeEntries[0]?.type, [timeEntries]);
    const isClockedIn = lastEntryType === TimeEntryType.CLOCK_IN;

    const workSummary = useMemo(() => {
        const todayEntries = timeEntries
            .filter(e => e.timestamp.toDateString() === new Date().toDateString())
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        if (todayEntries.length === 0) {
            return { worked: 0, balance: -8 * 3600 * 1000 };
        }

        let totalWorkedMs = 0;
        let clockInTime: Date | null = null;

        for (const entry of todayEntries) {
            if (entry.type === TimeEntryType.CLOCK_IN) {
                if (!clockInTime) {
                    clockInTime = entry.timestamp;
                }
            } else if (entry.type === TimeEntryType.CLOCK_OUT && clockInTime) {
                totalWorkedMs += entry.timestamp.getTime() - clockInTime.getTime();
                clockInTime = null; // Reset for the next pair
            }
        }
        
        if (clockInTime) {
            totalWorkedMs += new Date().getTime() - clockInTime.getTime();
        }

        const requiredMs = 8 * 60 * 60 * 1000;
        const balanceMs = totalWorkedMs - requiredMs;

        return { worked: totalWorkedMs, balance: balanceMs };
    }, [timeEntries, time]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClockAction = (type: TimeEntryType) => {
        setCurrentActionType(type);
        setIsCameraOpen(true);
    };
    
    const handleCapture = (photoUrl: string) => {
        if(currentActionType) {
            createTimeEntry(currentActionType, photoUrl);
        }
        setIsCameraOpen(false);
        setCurrentActionType(null);
    };

    const createTimeEntry = (type: TimeEntryType, photoUrl?: string) => {
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const locationName = await getAddressFromCoordinates(latitude, longitude);

                const newEntry: TimeEntry = {
                    id: `te-${Date.now()}`,
                    userId: currentUser.id,
                    type,
                    timestamp: new Date(),
                    location: locationName,
                    photoUrl,
                };
                setTimeEntries(prev => [newEntry, ...prev]);
            },
            (error) => {
                setLocationError(`Location Error: ${error.message}`);
                 const newEntry: TimeEntry = {
                    id: `te-${Date.now()}`,
                    userId: currentUser.id,
                    type,
                    timestamp: new Date(),
                    location: 'Location not available',
                    photoUrl,
                };
                setTimeEntries(prev => [newEntry, ...prev]);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleAdjustmentSubmit = (data: { date: string, time: string, type: TimeEntryType, reason: string }) => {
        console.log('Adjustment Submitted:', data); // In a real app, this would be sent to an API
        setIsAdjustmentModalOpen(false);
        setNotification('Manual adjustment request submitted successfully!');
    };
    
    const getStatus = () => {
        if (!isClockedIn) return { text: "Clocked Out", color: "bg-gray-500", textColor: "text-gray-500" };
        return { text: "Working", color: "bg-green-500", textColor: "text-green-500" };
    };

    const currentStatus = getStatus();

    return (
        <>
            {isCameraOpen && <CameraModal onCapture={handleCapture} onClose={() => setIsCameraOpen(false)}/>}
            {previewImageUrl && <ImagePreviewModal imageUrl={previewImageUrl} onClose={() => setPreviewImageUrl(null)} />}
            {isAdjustmentModalOpen && <ManualAdjustmentModal onClose={() => setIsAdjustmentModalOpen(false)} onSubmit={handleAdjustmentSubmit} />}
            {notification && <Notification message={notification} type="success" onClose={() => setNotification(null)} />}
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Time Clock Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md w-full">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
                            <div className='text-center md:text-left'>
                                <h2 className="text-2xl font-bold text-gray-800">Time Clock</h2>
                                <p className="text-gray-500">Log your work hours for today</p>
                            </div>
                            <div className="text-center md:text-right mt-4 md:mt-0">
                                <div className="text-4xl font-bold text-primary">{time.toLocaleTimeString()}</div>
                                <div className="text-gray-500">{time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
                            <div className={`flex items-center text-white px-4 py-2 rounded-full mb-4 text-sm font-medium ${currentStatus.color}`}>
                                <span className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></span>
                                {currentStatus.text}
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                                <button onClick={() => handleClockAction(TimeEntryType.CLOCK_IN)} disabled={isClockedIn} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-300 transition-colors">Clock In</button>
                                <button onClick={() => handleClockAction(TimeEntryType.CLOCK_OUT)} disabled={!isClockedIn} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-300 transition-colors">Clock Out</button>
                            </div>
                            {locationError && <p className="text-red-500 text-xs mt-2 text-center">{locationError}</p>}
                            <button onClick={() => setIsAdjustmentModalOpen(true)} className="mt-4 text-sm text-primary hover:underline">Request Manual Adjustment</button>
                        </div>
                    </div>

                    {/* Work Summary Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md w-full space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 border-b pb-3">Work Summary</h3>
                        <div className='text-center'>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Worked Today</p>
                            <p className={`text-4xl font-bold ${currentStatus.textColor}`}>{formatDuration(workSummary.worked)}</p>
                        </div>
                        <div className='text-center'>
                            <p className="text-sm text-gray-500 uppercase tracking-wider">Hour Bank</p>
                            <p className={`text-4xl font-bold ${workSummary.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatDuration(workSummary.balance, true)}
                            </p>
                        </div>
                        <div className="pt-4">
                            <p className="text-sm text-gray-500 mb-1">Progress to 8hr Goal</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(100, (workSummary.worked / (8*3600*1000)) * 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Log */}
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Today's Log</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {timeEntries.length > 0 ? timeEntries.map(entry => (
                            <div key={entry.id} className="bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="font-medium text-gray-700">{entry.type}</span>
                                    </div>
                                    <span className="text-sm text-gray-600 font-semibold">{entry.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className="mt-2 pl-8 space-y-2 text-sm">
                                    {entry.location && entry.location !== 'Location not available' && (
                                        <div className="flex items-center text-gray-500">
                                            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                                            <span className="truncate">{entry.location}</span>
                                        </div>
                                    )}
                                    {entry.photoUrl && (
                                        <div className="flex items-center">
                                                <button onClick={() => setPreviewImageUrl(entry.photoUrl)} className="flex items-center space-x-2 group">
                                                <img src={entry.photoUrl} alt="Clock-in selfie" className="w-8 h-8 rounded-md object-cover border"/>
                                                <span className="text-primary text-xs font-medium group-hover:underline">View Photo</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-8">No entries for today.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimeClock;