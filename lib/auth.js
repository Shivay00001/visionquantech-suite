import { supabase } from './supabaseClient';

export async function getCurrentUser() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export async function getUserOrganization(userId) {
    try {
        const { data } = await supabase
            .from('users')
            .select('organization_id, organizations(*)')
            .eq('id', userId)
            .single();

        return data?.organizations || null;
    } catch (error) {
        console.error('Error fetching user organization:', error);
        return null;
    }
}

export async function checkPermission(userId, requiredRole) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;

        const roleHierarchy = {
            superadmin: 9,
            org_admin: 8,
            hr_manager: 7,
            finance_manager: 7,
            inventory_manager: 7,
            crm_lead_manager: 7,
            support_staff: 5,
            normal_employee: 3,
            viewer: 1,
        };

        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    } catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
}

export async function hasModuleAccess(userId, moduleName) {
    try {
        const org = await getUserOrganization(userId);
        if (!org) return false;

        return org.modules_enabled?.[moduleName] === true;
    } catch (error) {
        console.error('Error checking module access:', error);
        return false;
    }
}

export async function hasAIAccess(userId) {
    try {
        const org = await getUserOrganization(userId);
        if (!org) return false;

        const premiumTiers = ['pro', 'enterprise'];
        return premiumTiers.includes(org.subscription_tier) && org.ai_enabled;
    } catch (error) {
        console.error('Error checking AI access:', error);
        return false;
    }
}

export async function logAudit(action, entityType, entityId, oldData, newData) {
    try {
        const user = await getCurrentUser();
        if (!user) return;

        await supabase.from('audit_logs').insert({
            organization_id: user.organization_id,
            user_id: user.id,
            action,
            entity_type: entityType,
            entity_id: entityId,
            old_data: oldData,
            new_data: newData,
        });
    } catch (error) {
        console.error('Error logging audit:', error);
    }
}
