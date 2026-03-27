export type UserRole = "guest" | "customer" | "admin";

export type AuthSession = {
  role: UserRole;
  customerId?: string;
  companyName?: string;
  email?: string;
  adminName?: string;
};

export type CheckoutIntent = {
  productKey: string;
  planKey: string;
  customerId?: string;
  mode: UserRole;
};
