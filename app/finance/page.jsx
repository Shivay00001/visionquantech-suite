'use client';

import Link from 'next/link';

export default function FinancePage() {
    const modules = [
        {
            name: 'Invoices',
            description: 'Create and manage invoices',
            href: '/finance/invoices',
            icon: '📄',
            color: 'bg-blue-500',
        },
        {
            name: 'Expenses',
            description: 'Track business expenses',
            href: '/finance/expenses',
            icon: '💸',
            color: 'bg-red-500',
        },
        {
            name: 'Customers',
            description: 'Customer billing information',
            href: '/finance/customers',
            icon: '🏢',
            color: 'bg-green-500',
        },
        {
            name: 'Vendors',
            description: 'Vendor and supplier management',
            href: '/finance/vendors',
            icon: '🤝',
            color: 'bg-purple-500',
        },
        {
            name: 'Reports',
            description: 'Financial reports and analytics',
            href: '/finance/reports',
            icon: '📊',
            color: 'bg-indigo-500',
        },
        {
            name: 'Ledger',
            description: 'Account ledger entries',
            href: '/finance/ledger',
            icon: '📚',
            color: 'bg-yellow-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Finance & Accounting</h1>
                <p className="text-gray-600">Manage finances, invoices, and accounting</p>
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
