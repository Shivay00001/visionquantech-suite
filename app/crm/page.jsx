'use client';

import Link from 'next/link';

export default function CRMPage() {
    const modules = [
        {
            name: 'Leads',
            description: 'Manage sales leads and prospects',
            href: '/crm/leads',
            icon: '👤',
            color: 'bg-blue-500',
        },
        {
            name: 'Contacts',
            description: 'Customer contact directory',
            href: '/crm/contacts',
            icon: '📇',
            color: 'bg-green-500',
        },
        {
            name: 'Accounts',
            description: 'Company and account management',
            href: '/crm/accounts',
            icon: '🏢',
            color: 'bg-purple-500',
        },
        {
            name: 'Deals',
            description: 'Sales pipeline and deals',
            href: '/crm/deals',
            icon: '💼',
            color: 'bg-yellow-500',
        },
        {
            name: 'Tasks',
            description: 'CRM tasks and activities',
            href: '/crm/tasks',
            icon: '✓',
            color: 'bg-red-500',
        },
        {
            name: 'Analytics',
            description: 'Sales reports and analytics',
            href: '/crm/analytics',
            icon: '📊',
            color: 'bg-indigo-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
                <p className="text-gray-600">Customer Relationship Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                    <Link
                        key={module.name}
                        href={module.href}
                        className="card hover:shadow-lg transition-shadow"
                    >
                        <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4`}>
                            {module.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
                        <p className="text-sm text-gray-600">{module.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
