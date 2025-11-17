

import React, { useState } from 'react';
import { USERS } from '../constants';
import { User, UserRole } from '../types';
import EmployeeLogModal from './EmployeeLogModal';
import AddEmployeeModal from './AddEmployeeModal';

const EmployeeManagement = () => {
    const [users, setUsers] = useState<User[]>(USERS);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // FIX: Add email to the data parameter and to the newUser object to satisfy the User type.
    const handleAddEmployee = (data: { name: string, email: string, team: string, role: UserRole }) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            team: data.team,
            role: data.role,
            avatarUrl: `https://picsum.photos/seed/${data.name.split(' ')[0]}/100/100`,
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsAddModalOpen(false);
    };

    return (
        <>
            {viewingUser && <EmployeeLogModal user={viewingUser} onClose={() => setViewingUser(null)} />}
            {isAddModalOpen && <AddEmployeeModal onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddEmployee} />}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Employee</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Team</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">{user.team}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setViewingUser(user)} className="font-medium text-primary hover:underline">
                                            View Log
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default EmployeeManagement;