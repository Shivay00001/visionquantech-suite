'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, getUserOrganization } from '@/lib/auth';

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [org, setOrg] = useState(null);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeUsers: 0,
        moduleUsage: {},
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const currentUser = await getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const organization = await getUserOrganization(currentUser.id);
            setOrg(organization);
        }
    };

    const toggleModule = async (moduleName) => {
        if (!org) return;

        const newModules = {
            ...org.modules_enabled,
            [moduleName]: !org.modules_enabled[moduleName],
        };

        try {
            const res = await fetch(`/api/admin/organizations/${org.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ modules_enabled: newModules }),
            });

            if (res.ok) {
                setOrg({ ...org, modules_enabled: newModules });
            }
        } catch (error) {
            console.error('Error updating modules:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Organization Admin Panel</h1>
                <p className="text-gray-600">Manage your organization settings and users</p>
            </div>

            {/* Organization Info */}
            <div className="card">
                <h2 className="card-header">Organization Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Organization Name</label>
                        <p className="text-lg font-semibold">{org?.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Subscription Tier</label>
                        <p className="text-lg font-semibold capitalize">{org?.subscription_tier}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Max Employees</label>
                        <p className="text-lg font-semibold">{org?.max_employees}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">AI Enabled</label>
                        <p className="text-lg font-semibold">{org?.ai_enabled ? '✅ Yes' : '❌ No'}</p>
                    </div>
                </div>
            </div>

            {/* Module Management */}
            <div className="card">
                <h2 className="card-header">Module Access Control</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['crm', 'hr', 'finance', 'inventory'].map((module) => (
                        <div key={module} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold capitalize">{module}</p>
                                <p className="text-sm text-gray-600">
                                    {org?.modules_enabled?.[module] ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleModule(module)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${org?.modules_enabled?.[module]
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {org?.modules_enabled?.[module] ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">Total Employees</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.totalEmployees}</p>
                </div>
                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">Active Users</h3>
                    <p className="text-3xl font-bold text-primary-600">{stats.activeUsers}</p>
                </div>
                <div className="card">
                    <h3 className="font-semibold text-gray-900 mb-2">Storage Used</h3>
                    <p className="text-3xl font-bold text-primary-600">0 MB</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="card-header">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="btn btn-primary">Add Employee</button>
                    <button className="btn btn-primary">View Audit Logs</button>
                    <button className="btn btn-primary">Generate Reports</button>
                </div>
            </div>
        </div>
    );
}
