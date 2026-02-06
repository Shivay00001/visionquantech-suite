-- ============================================================
-- SEED DATA - Initial Superadmin and Default Roles
-- ============================================================

-- Insert default superadmin (you'll need to create this user in Supabase Auth first)
-- Replace 'your-superadmin-uuid' with the actual UUID from Supabase Auth
-- INSERT INTO users (id, email, full_name, role)
-- VALUES (
--   'your-superadmin-uuid',
--   'admin@visionquantech.com',
--   'System Administrator',
--   'superadmin'
-- );

-- Insert default organization for testing
INSERT INTO organizations (id, name, slug, subscription_tier, modules_enabled, ai_enabled, max_employees)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Organization',
  'demo-org',
  'enterprise',
  '{"crm": true, "hr": true, "finance": true, "inventory": true}'::jsonb,
  true,
  100
);

-- Insert demo leave types
INSERT INTO hr_leave_types (organization_id, name, code, days_allowed, carry_forward)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Casual Leave', 'CL', 12, true),
  ('00000000-0000-0000-0000-000000000001', 'Sick Leave', 'SL', 12, false),
  ('00000000-0000-0000-0000-000000000001', 'Privilege Leave', 'PL', 15, true),
  ('00000000-0000-0000-0000-000000000001', 'Maternity Leave', 'ML', 90, false),
  ('00000000-0000-0000-0000-000000000001', 'Paternity Leave', 'PTL', 7, false);

-- Insert demo holidays
INSERT INTO hr_holidays (organization_id, name, date)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'New Year', '2025-01-01'),
  ('00000000-0000-0000-0000-000000000001', 'Republic Day', '2025-01-26'),
  ('00000000-0000-0000-0000-000000000001', 'Independence Day', '2025-08-15'),
  ('00000000-0000-0000-0000-000000000001', 'Gandhi Jayanti', '2025-10-02'),
  ('00000000-0000-0000-0000-000000000001', 'Christmas', '2025-12-25');

-- Insert default shifts
INSERT INTO hr_shifts (organization_id, name, start_time, end_time)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Morning Shift', '09:00:00', '18:00:00'),
  ('00000000-0000-0000-0000-000000000001', 'Evening Shift', '14:00:00', '23:00:00'),
  ('00000000-0000-0000-0000-000000000001', 'Night Shift', '22:00:00', '07:00:00');

-- Insert default chart of accounts
INSERT INTO finance_accounts (organization_id, account_code, account_name, account_type)
VALUES
  ('00000000-0000-0000-0000-000000000001', '1000', 'Assets', 'asset'),
  ('00000000-0000-0000-0000-000000000001', '1100', 'Current Assets', 'asset'),
  ('00000000-0000-0000-0000-000000000001', '1110', 'Cash', 'asset'),
  ('00000000-0000-0000-0000-000000000001', '1120', 'Bank Accounts', 'asset'),
  ('00000000-0000-0000-0000-000000000001', '1130', 'Accounts Receivable', 'asset'),
  ('00000000-0000-0000-0000-000000000001', '2000', 'Liabilities', 'liability'),
  ('00000000-0000-0000-0000-000000000001', '2100', 'Current Liabilities', 'liability'),
  ('00000000-0000-0000-0000-000000000001', '2110', 'Accounts Payable', 'liability'),
  ('00000000-0000-0000-0000-000000000001', '3000', 'Equity', 'equity'),
  ('00000000-0000-0000-0000-000000000001', '4000', 'Revenue', 'revenue'),
  ('00000000-0000-0000-0000-000000000001', '4100', 'Sales Revenue', 'revenue'),
  ('00000000-0000-0000-0000-000000000001', '5000', 'Expenses', 'expense'),
  ('00000000-0000-0000-0000-000000000001', '5100', 'Cost of Goods Sold', 'expense'),
  ('00000000-0000-0000-0000-000000000001', '5200', 'Operating Expenses', 'expense'),
  ('00000000-0000-0000-0000-000000000001', '5300', 'Payroll Expenses', 'expense');

-- Insert demo inventory categories
INSERT INTO inventory_categories (organization_id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Electronics', 'Electronic items and accessories'),
  ('00000000-0000-0000-0000-000000000001', 'Furniture', 'Office and home furniture'),
  ('00000000-0000-0000-0000-000000000001', 'Stationery', 'Office stationery and supplies'),
  ('00000000-0000-0000-0000-000000000001', 'Software', 'Software licenses and subscriptions');
