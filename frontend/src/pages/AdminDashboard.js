import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const userRes = await api.get('/admin/users');
                const statRes = await api.get('/admin/stats');
                setUsers(userRes.data);
                setStats(statRes.data);
            } catch (err) {
                alert("You don't have the authority!");
            }
        };
        fetchAdminData();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl shadow">Total Users: {stats.total_users}</div>
                <div className="bg-white p-6 rounded-xl shadow">Total Exams: {stats.total_exams}</div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-t">
                                <td className="p-4">{u.full_name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">{u.is_verified ? "✅ Verified" : "❌ Unverified"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
