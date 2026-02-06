import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser } from '@/lib/auth';

// POST /api/hr/attendance/clock-out
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: employee } = await supabaseAdmin
            .from('hr_employees')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!employee) {
            return NextResponse.json({ error: 'Employee record not found' }, { status: 404 });
        }

        const today = new Date().toISOString().split('T')[0];

        // Get today's attendance record
        const { data: attendance } = await supabaseAdmin
            .from('hr_attendance')
            .select('*')
            .eq('employee_id', employee.id)
            .eq('date', today)
            .single();

        if (!attendance) {
            return NextResponse.json({ error: 'No clock-in record found for today' }, { status: 404 });
        }

        if (attendance.clock_out) {
            return NextResponse.json({ error: 'Already clocked out' }, { status: 400 });
        }

        // Calculate total hours
        const clockIn = new Date(attendance.clock_in);
        const clockOut = new Date();
        const hoursDiff = (clockOut - clockIn) / (1000 * 60 * 60);

        // Update with clock-out time
        const { data, error } = await supabaseAdmin
            .from('hr_attendance')
            .update({
                clock_out: clockOut.toISOString(),
                total_hours: hoursDiff.toFixed(2),
            })
            .eq('id', attendance.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
