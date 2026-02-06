import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// GET /api/crm/leads - List all leads
export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const assigned_to = searchParams.get('assigned_to');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from('crm_leads')
            .select('*, assigned_user:users!assigned_to(full_name, email)', { count: 'exact' })
            .eq('organization_id', user.organization_id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            query = query.eq('status', status);
        }

        if (assigned_to) {
            query = query.eq('assigned_to', assigned_to);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({
            data,
            pagination: {
                page,
                limit,
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/crm/leads - Create new lead
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const leadData = {
            organization_id: user.organization_id,
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            phone: body.phone,
            company: body.company,
            title: body.title,
            source: body.source,
            status: body.status || 'new',
            score: body.score || 0,
            estimated_value: body.estimated_value,
            assigned_to: body.assigned_to,
            created_by: user.id,
        };

        const { data, error } = await supabaseAdmin
            .from('crm_leads')
            .insert(leadData)
            .select()
            .single();

        if (error) throw error;

        await logAudit('create', 'crm_lead', data.id, null, data);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
