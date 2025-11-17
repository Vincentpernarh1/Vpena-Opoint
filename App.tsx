import React, { useState, useCallback, useMemo } from 'react';
import { User, View } from './types';
import { USERS } from './constants';
import Login from './components/Login';
import TimeClock from './components/TimeClock';
import HolidayPlanner from './components/HolidayPlanner';
import Approvals from './components/Approvals';
import EmployeeManagement from './components/EmployeeManagement';
import Payslips from './components/Payslips';
import { LogoIcon, LogOutIcon, LayoutDashboardIcon, CalendarIcon, CheckSquareIcon, UsersIcon, DollarSignIcon, MenuIcon, XIcon } from './components/Icons';

const App = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogin = useCallback((email: string, password: string): boolean => {
        const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
            setCurrentUser(user);
            setCurrentView('dashboard');
            return true;
        }
        return false;
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const handleSetView = (view: View) => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };

    const navigationItems = useMemo(() => {
        const baseItems = [
            { name: 'Dashboard', view: 'dashboard', icon: LayoutDashboardIcon },
            { name: 'Holidays', view: 'holidays', icon: CalendarIcon },
            { name: 'Payslips', view: 'payslips', icon: DollarSignIcon },
        ];
        if (currentUser?.role === 'Manager') {
            return [
                ...baseItems,
                { name: 'Approvals', view: 'approvals', icon: CheckSquareIcon },
                { name: 'Employees', view: 'employees', icon: UsersIcon },
            ];
        }
        return baseItems;
    }, [currentUser]);

    if (!currentUser) {
        return <Login onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <TimeClock currentUser={currentUser} />;
            case 'holidays':
                return <HolidayPlanner currentUser={currentUser} />;
            case 'payslips':
                return <Payslips currentUser={currentUser} />;
            case 'approvals':
                return <Approvals />;
            case 'employees':
                return <EmployeeManagement />;
            default:
                return <TimeClock currentUser={currentUser} />;
        }
    };
    
    const SidebarContent = () => (
         <>
            <div className="h-16 flex items-center justify-center border-b shrink-0">
                 <div className="flex items-center space-x-2">
                    <LogoIcon className="h-8 w-8" />
                    <span className="text-xl font-bold text-gray-800">Vpena Opoint</span>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigationItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => handleSetView(item.view as View)}
                        className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentView === item.view
                                ? 'bg-primary-light text-primary'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                    </button>
                ))}
            </nav>
            <div className="px-4 py-4 border-t shrink-0">
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
                    <LogOutIcon className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
             {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden ${isSidebarOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`fixed inset-0 bg-black transition-opacity ${isSidebarOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform ease-in-out duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                          onClick={() => setIsSidebarOpen(false)}
                          className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                   <SidebarContent />
                </div>
            </div>


            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-col hidden md:flex shrink-0">
                <SidebarContent/>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b flex justify-between items-center px-6 shrink-0">
                    <div className="flex items-center">
                         <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-gray-500 hover:text-gray-700">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 capitalize">{currentView}</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-right text-sm hidden sm:block">
                            <p className="font-semibold">{currentUser.name}</p>
                            <p className="text-gray-500">{currentUser.role}</p>
                        </span>
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-10 w-10 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;