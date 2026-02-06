-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- CRM Tables
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_followups ENABLE ROW LEVEL SECURITY;

-- HR Tables
ALTER TABLE hr_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_documents ENABLE ROW LEVEL SECURITY;

-- Finance Tables
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_ledger ENABLE ROW LEVEL SECURITY;

-- Inventory Tables
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_so_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_pos_items ENABLE ROW LEVEL SECURITY;

-- Workflows
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================

-- Get current user's organization
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE;

-- Check if user is superadmin
CREATE OR REPLACE FUNCTION auth.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
$$ LANGUAGE SQL STABLE;

-- Check if user is org admin
CREATE OR REPLACE FUNCTION auth.is_org_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role IN ('superadmin', 'org_admin')
  )
$$ LANGUAGE SQL STABLE;

-- Check if user has role
CREATE OR REPLACE FUNCTION auth.has_role(required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = required_role
  )
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- ORGANIZATIONS POLICIES
-- ============================================================

-- Superadmin can do everything
CREATE POLICY "Superadmin full access" ON organizations
  FOR ALL USING (auth.is_superadmin());

-- Org admins can view their own organization
CREATE POLICY "Org admins can view own org" ON organizations
  FOR SELECT USING (
    id = auth.user_organization_id() AND auth.is_org_admin()
  );

-- ============================================================
-- USERS POLICIES
-- ============================================================

-- Superadmin can manage all users
CREATE POLICY "Superadmin can manage all users" ON users
  FOR ALL USING (auth.is_superadmin());

-- Org admins can manage users in their organization
CREATE POLICY "Org admins can manage org users" ON users
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND auth.is_org_admin()
  );

-- Users can view themselves
CREATE POLICY "Users can view self" ON users
  FOR SELECT USING (id = auth.uid());

-- Users can update themselves
CREATE POLICY "Users can update self" ON users
  FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- CRM POLICIES
-- ============================================================

-- CRM Leads
CREATE POLICY "CRM leads org access" ON crm_leads
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Contacts
CREATE POLICY "CRM contacts org access" ON crm_contacts
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Accounts
CREATE POLICY "CRM accounts org access" ON crm_accounts
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Deals
CREATE POLICY "CRM deals org access" ON crm_deals
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Tasks
CREATE POLICY "CRM tasks org access" ON crm_tasks
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Notes
CREATE POLICY "CRM notes org access" ON crm_notes
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Files
CREATE POLICY "CRM files org access" ON crm_files
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Email Templates
CREATE POLICY "CRM email templates org access" ON crm_email_templates
  FOR ALL USING (organization_id = auth.user_organization_id());

-- CRM Followups
CREATE POLICY "CRM followups org access" ON crm_followups
  FOR ALL USING (organization_id = auth.user_organization_id());

-- ============================================================
-- HR POLICIES
-- ============================================================

-- HR Departments
CREATE POLICY "HR departments org access" ON hr_departments
  FOR ALL USING (organization_id = auth.user_organization_id());

-- HR Employees
CREATE POLICY "HR employees org access" ON hr_employees
  FOR ALL USING (organization_id = auth.user_organization_id());

-- HR Attendance - employees can view/create their own
CREATE POLICY "HR attendance access" ON hr_attendance
  FOR SELECT USING (
    organization_id = auth.user_organization_id()
  );

CREATE POLICY "HR attendance insert own" ON hr_attendance
  FOR INSERT WITH CHECK (
    employee_id IN (SELECT id FROM hr_employees WHERE user_id = auth.uid())
  );

-- HR Leave Requests
CREATE POLICY "HR leave requests access" ON hr_leave_requests
  FOR ALL USING (organization_id = auth.user_organization_id());

-- HR Payroll - restricted to HR managers and own records
CREATE POLICY "HR payroll manager access" ON hr_payroll
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND
    (auth.has_role('hr_manager'::user_role) OR auth.has_role('org_admin'::user_role) OR auth.is_superadmin())
  );

CREATE POLICY "HR payroll own access" ON hr_payroll
  FOR SELECT USING (
    employee_id IN (SELECT id FROM hr_employees WHERE user_id = auth.uid())
  );

-- HR Announcements
CREATE POLICY "HR announcements access" ON hr_announcements
  FOR SELECT USING (organization_id = auth.user_organization_id());

CREATE POLICY "HR announcements manage" ON hr_announcements
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND
    (auth.has_role('hr_manager'::user_role) OR auth.is_org_admin())
  );

-- HR Documents
CREATE POLICY "HR documents access" ON hr_documents
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND
    (auth.has_role('hr_manager'::user_role) OR auth.is_org_admin() OR employee_id IN (SELECT id FROM hr_employees WHERE user_id = auth.uid()))
  );

-- ============================================================
-- FINANCE POLICIES
-- ============================================================

-- Finance Accounts
CREATE POLICY "Finance accounts access" ON finance_accounts
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND
    (auth.has_role('finance_manager'::user_role) OR auth.is_org_admin())
  );

-- Finance Vendors
CREATE POLICY "Finance vendors access" ON finance_vendors
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Finance Customers
CREATE POLICY "Finance customers access" ON finance_customers
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Finance Invoices
CREATE POLICY "Finance invoices access" ON finance_invoices
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Finance Invoice Items (inherits from invoice)
CREATE POLICY "Finance invoice items access" ON finance_invoice_items
  FOR ALL USING (
    invoice_id IN (SELECT id FROM finance_invoices WHERE organization_id = auth.user_organization_id())
  );

-- Finance Expenses
CREATE POLICY "Finance expenses access" ON finance_expenses
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Finance Payments
CREATE POLICY "Finance payments access" ON finance_payments
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Finance Ledger - restricted to finance managers
CREATE POLICY "Finance ledger access" ON finance_ledger
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND
    (auth.has_role('finance_manager'::user_role) OR auth.is_org_admin())
  );

-- ============================================================
-- INVENTORY POLICIES
-- ============================================================

-- Inventory Categories
CREATE POLICY "Inventory categories access" ON inventory_categories
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory Products
CREATE POLICY "Inventory products access" ON inventory_products
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory Stock Movements
CREATE POLICY "Inventory stock movements access" ON inventory_stock_movements
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory Suppliers
CREATE POLICY "Inventory suppliers access" ON inventory_suppliers
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory Purchase Orders
CREATE POLICY "Inventory PO access" ON inventory_purchase_orders
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory PO Items
CREATE POLICY "Inventory PO items access" ON inventory_po_items
  FOR ALL USING (
    po_id IN (SELECT id FROM inventory_purchase_orders WHERE organization_id = auth.user_organization_id())
  );

-- Inventory Sales Orders
CREATE POLICY "Inventory SO access" ON inventory_sales_orders
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory SO Items
CREATE POLICY "Inventory SO items access" ON inventory_so_items
  FOR ALL USING (
    so_id IN (SELECT id FROM inventory_sales_orders WHERE organization_id = auth.user_organization_id())
  );

-- Inventory POS Transactions
CREATE POLICY "Inventory POS access" ON inventory_pos_transactions
  FOR ALL USING (organization_id = auth.user_organization_id());

-- Inventory POS Items
CREATE POLICY "Inventory POS items access" ON inventory_pos_items
  FOR ALL USING (
    transaction_id IN (SELECT id FROM inventory_pos_transactions WHERE organization_id = auth.user_organization_id())
  );

-- ============================================================
-- WORKFLOW POLICIES
-- ============================================================

-- Workflow Rules
CREATE POLICY "Workflow rules access" ON workflow_rules
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND auth.is_org_admin()
  );

-- Workflow Executions
CREATE POLICY "Workflow executions access" ON workflow_executions
  FOR SELECT USING (
    rule_id IN (SELECT id FROM workflow_rules WHERE organization_id = auth.user_organization_id())
  );

-- Scheduled Jobs
CREATE POLICY "Scheduled jobs access" ON scheduled_jobs
  FOR ALL USING (
    organization_id = auth.user_organization_id() AND auth.is_org_admin()
  );

-- Notifications
CREATE POLICY "Notifications access" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Notifications update own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================

-- Audit logs - org admins and superadmins can view
CREATE POLICY "Audit logs access" ON audit_logs
  FOR SELECT USING (
    organization_id = auth.user_organization_id() AND auth.is_org_admin()
  );
