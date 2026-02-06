'use client';

import { useEffect, useState } from 'react';

export default function SuperadminPage() {
    const [orgs, setOrgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadOrganizations();
    }, []);

    const loadOrganizations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/organizations');
            const data = await res.json();
            setOrgs(data.data || []);
        } catch (error) {
            console.error('Error loading organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Superadmin Panel</h1>
                    <p className="text-gray-600">Global system administration</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                >
                    + Create Organization
                </button>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Organizations</p>
                            <p className="text-3xl font-bold text-gray-900">{orgs.length}</p>
                        </div>
                        <div className="text-4xl">🏢</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-3xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold text-gray-900">₹0</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">System Health</p>
                            <p className="text-3xl font-bold text-green-600">✓</p>
                        </div>
                        <div className="text-4xl">❤️</div>
                    </div>
                </div>
            </div>

            {/* Organizations Table */}
            <div className="card">
                <h2 className="card-header">Organizations</h2>
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Tier</th>
                                    <th>Employees</th>
                                    <th>AI Enabled</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orgs.map((org) => (
                                    <tr key={org.id}>
                                        <td className="font-medium">{org.name}</td>
                                        <td>{org.slug}</td>
                                        <td>
                                            <span className="badge badge-primary capitalize">{org.subscription_tier}</span>
                                        </td>
                                        <td>{org.max_employees}</td>
                                        <td>{org.ai_enabled ? '✅' : '❌'}</td>
                                        <td>
                                            <span className={`badge ${org.is_active ? 'badge-success' : 'badge-danger'}`}>
                                                {org.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{new Date(org.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
