'use client';

import Link from 'next/link';

export default function HRPage() {
    const modules = [
        {
            name: 'Employees',
            description: 'Employee directory and management',
            href: '/hr/employees',
            icon: '👥',
            color: 'bg-blue-500',
        },
        {
            name: 'Attendance',
            description: 'Track employee attendance',
            href: '/hr/attendance',
            icon: '📅',
            color: 'bg-green-500',
        },
        {
            name: 'Leave Requests',
            description: 'Manage leave applications',
            href: '/hr/leaves',
            icon: '🏖️',
            color: 'bg-yellow-500',
        },
        {
            name: 'Payroll',
            description: 'Salary processing and slips',
            href: '/hr/payroll',
            icon: '💰',
            color: 'bg-purple-500',
        },
        {
            name: 'Performance',
            description: 'Reviews and assessments',
            href: '/hr/performance',
            icon: '⭐',
            color: 'bg-red-500',
        },
        {
            name: 'Announcements',
            description: 'Company announcements',
            href: '/hr/announcements',
            icon: '📢',
            color: 'bg-indigo-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Human Resources</h1>
                <p className="text-gray-600">Employee management and HR operations</p>
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
