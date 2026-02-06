'use client';

import Link from 'next/link';

export default function InventoryPage() {
    const modules = [
        {
            name: 'Products',
            description: 'Product catalog management',
            href: '/inventory/products',
            icon: '📦',
            color: 'bg-blue-500',
        },
        {
            name: 'Stock Movement',
            description: 'Track stock in/out',
            href: '/inventory/stock',
            icon: '📊',
            color: 'bg-green-500',
        },
        {
            name: 'Purchase Orders',
            description: 'Create and manage POs',
            href: '/inventory/purchase-orders',
            icon: '🛒',
            color: 'bg-purple-500',
        },
        {
            name: 'Sales Orders',
            description: 'Customer sales orders',
            href: '/inventory/sales-orders',
            icon: '💼',
            color: 'bg-yellow-500',
        },
        {
            name: 'POS',
            description: 'Point of Sale billing',
            href: '/inventory/pos',
            icon: '🏪',
            color: 'bg-red-500',
        },
        {
            name: 'Suppliers',
            description: 'Supplier directory',
            href: '/inventory/suppliers',
            icon: '🚚',
            color: 'bg-indigo-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory & POS</h1>
                <p className="text-gray-600">Product inventory and point of sale</p>
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
