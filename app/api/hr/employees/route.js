import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getCurrentUser, logAudit } from '@/lib/auth';

// GET /api/hr/employees
export async function GET(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('hr_employees')
            .select(`
        *,
        user:users!user_id(id, email, full_name, role),
        department:hr_departments!department_id(name)
      `)
            .eq('organization_id', user.organization_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/hr/employees
export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const employeeData = {
            organization_id: user.organization_id,
            user_id: body.user_id,
            employee_code: body.employee_code,
            department_id: body.department_id,
            designation: body.designation,
            date_of_joining: body.date_of_joining,
            date_of_birth: body.date_of_birth,
            gender: body.gender,
            phone: body.phone,
            address: body.address,
            basic_salary: body.basic_salary,
            hra: body.hra,
            other_allowances: body.other_allowances,
        };

        const { data, error } = await supabaseAdmin
            .from('hr_employees')
            .insert(employeeData)
            .select()
            .single();

        if (error) throw error;

        await logAudit('create', 'hr_employee', data.id, null, data);

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
