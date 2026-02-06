import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// POST /api/crm/pipeline/moveStage - Move lead/deal to different stage
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { leadId, fromStage, toStage } = body;

        // Get current lead data
        const { data: oldData } = await supabaseAdmin
            .from('crm_leads')
            .select('*')
            .eq('id', leadId)
            .eq('organization_id', user.organization_id)
            .single();

        if (!oldData) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Update status
        const { data, error } = await supabaseAdmin
            .from('crm_leads')
            .update({ status: toStage })
            .eq('id', leadId)
            .eq('organization_id', user.organization_id)
            .select()
            .single();

        if (error) throw error;

        await logAudit('update_stage', 'crm_lead', leadId, { status: fromStage }, { status: toStage });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
