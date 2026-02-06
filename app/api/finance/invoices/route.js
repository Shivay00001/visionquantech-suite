import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// GET /api/finance/invoices
export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('finance_invoices')
            .select('*, customer:finance_customers!customer_id(name, email)')
            .eq('organization_id', user.organization_id)
            .order('invoice_date', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/finance/invoices
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const invoiceData = {
            organization_id: user.organization_id,
            invoice_number: invoiceNumber,
            customer_id: body.customer_id,
            invoice_date: body.invoice_date || new Date().toISOString().split('T')[0],
            due_date: body.due_date,
            subtotal: body.subtotal,
            tax_amount: body.tax_amount,
            discount_amount: body.discount_amount || 0,
            total_amount: body.total_amount,
            status: body.status || 'draft',
            notes: body.notes,
            created_by: user.id,
        };

        const { data, error } = await supabaseAdmin
            .from('finance_invoices')
            .insert(invoiceData)
            .select()
            .single();

        if (error) throw error;

        // Insert invoice items
        if (body.items && body.items.length > 0) {
            const items = body.items.map((item) => ({
                invoice_id: data.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                hsn_code: item.hsn_code,
                gst_rate: item.gst_rate,
                tax_amount: item.tax_amount,
                total: item.total,
            }));

            await supabaseAdmin.from('finance_invoice_items').insert(items);
        }

        await logAudit('create', 'finance_invoice', data.id, null, data);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
