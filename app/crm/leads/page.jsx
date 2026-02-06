'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CRMLeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadLeads();
    }, [filter]);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const url = filter === 'all' ? '/api/crm/leads' : `/api/crm/leads?status=${filter}`;
            const res = await fetch(url);
            const result = await res.json();
            setLeads(result.data || []);
        } catch (error) {
            console.error('Error loading leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this lead?')) return;

        try {
            const res = await fetch(`/api/crm/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                loadLeads();
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            new: 'badge-info',
            contacted: 'badge-primary',
            qualified: 'badge-success',
            proposal: 'badge-warning',
            negotiation: 'badge-warning',
            won: 'badge-success',
            lost: 'badge-danger',
        };
        return `badge ${badges[status] || 'badge-info'}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                    <p className="text-gray-600">Manage your sales leads and prospects</p>
                </div>
                <Link href="/crm/leads/new" className="btn btn-primary">
                    + Add Lead
                </Link>
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex flex-wrap gap-2">
                    {['all', 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <div className="card">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No leads found</p>
                        <Link href="/crm/leads/new" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                            Create your first lead
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>Value</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr key={lead.id}>
                                        <td className="font-medium">
                                            {lead.first_name} {lead.last_name}
                                        </td>
                                        <td>{lead.company || '-'}</td>
                                        <td>{lead.email || '-'}</td>
                                        <td>{lead.phone || '-'}</td>
                                        <td>
                                            <span className={getStatusBadge(lead.status)}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-semibold">{lead.score || 0}</span>
                                        </td>
                                        <td>
                                            {lead.estimated_value
                                                ? `₹${parseFloat(lead.estimated_value).toLocaleString()}`
                                                : '-'}
                                        </td>
                                        <td>{lead.assigned_user?.full_name || 'Unassigned'}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/crm/leads/${lead.id}`}
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/crm/leads/${lead.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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
