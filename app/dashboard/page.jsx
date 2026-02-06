'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser, getUserOrganization } from '@/lib/auth';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [org, setOrg] = useState(null);
    const [stats, setStats] = useState({
        employees: 0,
        leads: 0,
        invoices: 0,
        products: 0,
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
            // Load stats would go here
        }
    };

    const quickActions = [
        { name: 'Add Lead', href: '/crm/leads/new', icon: '➕', color: 'bg-blue-500' },
        { name: 'Mark Attendance', href: '/hr/attendance', icon: '✓', color: 'bg-green-500' },
        { name: 'Create Invoice', href: '/finance/invoices/new', icon: '📄', color: 'bg-yellow-500' },
        { name: 'Add Product', href: '/inventory/products/new', icon: '📦', color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.full_name || 'User'}! 👋
                </h1>
                <p className="text-primary-100">
                    {org?.name || 'VisionQuantech Business Suite'}
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Employees</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.employees}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Leads</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.leads}</p>
                        </div>
                        <div className="text-4xl">📊</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Invoices</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.invoices}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Products</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.products}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="card-header">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.name}
                            href={action.href}
                            className={`${action.color} text-white rounded-lg p-6 hover:opacity-90 transition-opacity shadow-md`}
                        >
                            <div className="text-3xl mb-2">{action.icon}</div>
                            <div className="font-semibold">{action.name}</div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="card-header">Recent Activity</h2>
                    <div className="space-y-3">
                        <div className="text-sm text-gray-500">No recent activity</div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="card-header">Notifications</h2>
                    <div className="space-y-3">
                        <div className="text-sm text-gray-500">No new notifications</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
