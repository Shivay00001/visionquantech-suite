'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            router.push('/auth/login');
        } else {
            setUser(currentUser);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/auth/login');
        router.refresh();
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'CRM', href: '/crm', icon: '👥', module: 'crm' },
        { name: 'HR', href: '/hr', icon: '👔', module: 'hr' },
        { name: 'Finance', href: '/finance', icon: '💰', module: 'finance' },
        { name: 'Inventory', href: '/inventory', icon: '📦', module: 'inventory' },
    ];

    const adminNavigation = [
        { name: 'Admin Panel', href: '/admin', icon: '⚙️', roles: ['org_admin', 'superadmin'] },
        { name: 'Superadmin', href: '/superadmin', icon: '👑', roles: ['superadmin'] },
    ];

    const isActive = (path) => pathname.startsWith(path);

    const canAccess = (item) => {
        if (!user) return false;
        if (item.roles && !item.roles.includes(user.role)) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
                        <h1 className="text-xl font-bold text-white">VisionQuantech</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {navigation.map((item) =>
                            canAccess(item) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ) : null
                        )}

                        {/* Divider */}
                        {user && (user.role === 'org_admin' || user.role === 'superadmin') && (
                            <div className="my-4 border-t border-gray-200"></div>
                        )}

                        {/* Admin Navigation */}
                        {adminNavigation.map((item) =>
                            canAccess(item) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ) : null
                        )}
                    </nav>

                    {/* User Info */}
                    {user && (
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.full_name || user.email}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    title="Logout"
                                >
                                    🚪
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-white shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
