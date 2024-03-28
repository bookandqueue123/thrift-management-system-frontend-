import { NextResponse } from "next/server";
import { store } from "../store/store";

export async function middleware(request: {
  nextUrl: { pathname: any };
  url: string | URL | undefined;
}) {
  console.log("Middleware triggered:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;
  console.log(pathname);
  const state = store.getState();
  console.log(state);
  const { token } = state.auth;
  console.log(token);

  // List of protected routes
  const protectedRoutes = [
    "/customer",
    "/customer/profile",
    "/customer/settings",
    "/customer/transactions",
    "/customer/wallet",
    "/customer/withdrawals",
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
  ];

  console.log("middleware pathname", pathname);
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
