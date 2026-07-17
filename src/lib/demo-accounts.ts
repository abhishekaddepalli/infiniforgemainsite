// Shared demo credentials list, used by the /auth demo panel and the seeder.
export type DemoAccount = {
  role:
    | "super_admin"
    | "admin"
    | "sales_manager"
    | "support"
    | "finance"
    | "reseller"
    | "customer"
    | "affiliate"
    | "employee";
  label: string;
  email: string;
  password: string;
  full_name: string;
  description: string;
};

export const DEMO_PASSWORD = "Infiniforge@2026";

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "super_admin",   label: "Super Admin",    email: "superadmin@demo.infiniforge.cloud", password: DEMO_PASSWORD, full_name: "Aarav Mehta",     description: "Unrestricted access — roles, audit logs, everything." },
  { role: "admin",         label: "Admin",          email: "admin@demo.infiniforge.cloud",       password: DEMO_PASSWORD, full_name: "Priya Nair",      description: "Manage users, products, orders, tickets." },
  { role: "sales_manager", label: "Sales Manager",  email: "sales@demo.infiniforge.cloud",       password: DEMO_PASSWORD, full_name: "Rohan Kapoor",    description: "Products, catalog, coupons, orders." },
  { role: "support",       label: "Support",        email: "support@demo.infiniforge.cloud",     password: DEMO_PASSWORD, full_name: "Neha Iyer",       description: "Tickets and customer help." },
  { role: "finance",       label: "Finance",        email: "finance@demo.infiniforge.cloud",     password: DEMO_PASSWORD, full_name: "Vikram Shah",     description: "Invoices, payments, wallet." },
  
  { role: "affiliate",     label: "Affiliate",      email: "affiliate@demo.infiniforge.cloud",   password: DEMO_PASSWORD, full_name: "Kabir Sethi",     description: "Referral tracking and payouts." },
  { role: "employee",      label: "Employee",       email: "employee@demo.infiniforge.cloud",    password: DEMO_PASSWORD, full_name: "Ishita Rao",      description: "Internal staff-only views." },
  { role: "customer",      label: "Customer",       email: "customer@demo.infiniforge.cloud",    password: DEMO_PASSWORD, full_name: "Aditya Verma",    description: "End-user checkout, wallet, tickets." },
];
