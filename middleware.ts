import { NextRequest, NextResponse } from "next/server";
import { store } from "./store/store";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const state = store.getState();

  const { token } = state.auth;

  // List of protected routes
  const protectedRoutes = [
    "/customer",
    "/customer/profile",
    "/customer/settings",
    "/customer/transactions",
    "/customer/wallet",
    "/customer/withdrawals",
    "/customer/savings-purpose",
    "/customer/savings-purpose",
    "/merchant",
    "/merchant/analytics",
    "/merchant/customers",
    "/merchant/history",
    "/merchant/location",
    "/merchant/posting",
    "/merchant/settings",
    "/merchant/settings/group",
    "/merchant/settings/location",
    "/merchant/withdrawals",
    "/superadmin",
  ];

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
