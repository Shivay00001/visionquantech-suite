import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser } from '@/lib/auth';

// POST /api/hr/attendance/clock-in
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employee } = await supabaseAdmin
            .from('hr_employees')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!employee) {
            return NextResponse.json({ error: 'Employee record not found' }, { status: 404 });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if already clocked in today
        const { data: existing } = await supabaseAdmin
            .from('hr_attendance')
            .select('*')
            .eq('employee_id', employee.id)
            .eq('date', today)
            .single();

        if (existing) {
            return NextResponse.json({ error: 'Already clocked in today' }, { status: 400 });
        }

        // Clock in
        const { data, error } = await supabaseAdmin
            .from('hr_attendance')
            .insert({
                organization_id: user.organization_id,
                employee_id: employee.id,
                date: today,
                clock_in: new Date().toISOString(),
                status: 'present',
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
