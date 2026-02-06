import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// GET /api/crm/leads/[id] - Get single lead
export async function GET(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('crm_leads')
            .select('*, assigned_user:users!assigned_to(full_name, email), created_user:users!created_by(full_name)')
            .eq('id', params.id)
            .eq('organization_id', user.organization_id)
            .single();

        if (error) throw error;

        if (!data) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/crm/leads/[id] - Update lead
export async function PUT(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get existing data for audit
        const { data: oldData } = await supabaseAdmin
            .from('crm_leads')
            .select('*')
            .eq('id', params.id)
            .eq('organization_id', user.organization_id)
            .single();

        if (!oldData) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const body = await request.json();

        const updateData = {
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            phone: body.phone,
            company: body.company,
            title: body.title,
            source: body.source,
            status: body.status,
            score: body.score,
            estimated_value: body.estimated_value,
            assigned_to: body.assigned_to,
            lost_reason: body.lost_reason,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseAdmin
            .from('crm_leads')
            .update(updateData)
            .eq('id', params.id)
            .eq('organization_id', user.organization_id)
            .select()
            .single();

        if (error) throw error;

        await logAudit('update', 'crm_lead', data.id, oldData, data);

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/crm/leads/[id] - Delete lead
export async function DELETE(request, { params }) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get existing data for audit
        const { data: oldData } = await supabaseAdmin
            .from('crm_leads')
            .select('*')
            .eq('id', params.id)
            .eq('organization_id', user.organization_id)
            .single();

        if (!oldData) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const { error } = await supabaseAdmin
            .from('crm_leads')
            .delete()
            .eq('id', params.id)
            .eq('organization_id', user.organization_id);

        if (error) throw error;

        await logAudit('delete', 'crm_lead', params.id, oldData, null);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
