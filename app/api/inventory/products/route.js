import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// GET /api/inventory/products
export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const lowStock = searchParams.get('lowStock');

        let query = supabaseAdmin
            .from('inventory_products')
            .select('*, category:inventory_categories!category_id(name)')
            .eq('organization_id', user.organization_id)
            .eq('is_active', true)
            .order('name');

        if (lowStock === 'true') {
            query = query.lt('current_stock', supabaseAdmin.raw('min_stock_level'));
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/inventory/products
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const productData = {
            organization_id: user.organization_id,
            name: body.name,
            sku: body.sku,
            barcode: body.barcode,
            category_id: body.category_id,
            description: body.description,
            hsn_code: body.hsn_code,
            gst_rate: body.gst_rate,
            unit_price: body.unit_price,
            cost_price: body.cost_price,
            current_stock: body.current_stock || 0,
            min_stock_level: body.min_stock_level || 0,
            max_stock_level: body.max_stock_level,
            unit_of_measure: body.unit_of_measure,
        };

        const { data, error } = await supabaseAdmin
            .from('inventory_products')
            .insert(productData)
            .select()
            .single();

        if (error) throw error;

        await logAudit('create', 'inventory_product', data.id, null, data);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
