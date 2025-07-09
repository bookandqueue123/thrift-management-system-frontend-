"use client";
import { useAuth } from "@/api/hooks/useAuth";
import { usePermissions } from "@/api/hooks/usePermissions";
import useServiceCheckPermission from "@/api/hooks/useServicePermission";
import { selectUser } from "@/slices/OrganizationIdSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import AvatarDropdown from "./Dropdowns";

const CustomerNavbar = () => {
  const [DropdownMenuIsOpen, setDropdownMenuIsOpen] = useState(false);
  const [savingsDashboardDropdownIsOpen, setSavingsDashboardDropdownIsOpen] =
    useState(false);
  const [billManagementDropdownIsOpen, setBillManagementDropdownIsOpen] =
    useState(false); // New state for bill management dropdown
  const [ecommerceDropdownIsOpen, setEcommerceDropdownIsOpen] = useState(false); // New state for e-commerce dropdown

  const { checkPermission } = useServiceCheckPermission();
  const { savings, purpose, aIPhotoEditor } = checkPermission;
  const user = useSelector(selectUser);

  const endpoints = [
    purpose ? "dashboard" : "",
    savings ? "make-payment" : "",
    savings ? "withdrawals" : "",
    savings ? "transactions" : "",
    savings ? "savings-setup" : "",
    purpose ? "savings-purpose" : "",
    purpose ? "coupon" : "",
    aIPhotoEditor ? "photo-editor" : "",
  ];

  // Filter out empty strings before mapping
  const filteredEndpoints = endpoints.filter(Boolean);
  const { SignOut } = useAuth();
  const routeOptions = [
    "Savings Dashboard",
    purpose ? "Purchased Items Report" : "",
  ];
  const filteredrouteOptions = routeOptions.filter(Boolean);

  // Bill Management routes
  const billManagementRoutes = [
    "Current Bill",
    "My Bills",
    "Bill Payment Report",
    // "Generate previous bills",
    "Account Statement",
    "Payment history",
  ];

  // E-Commerce routes
  const ecommerceRoutes = ["Orders", "Delivery", "Pay Little-by-Little"];

  return (
    <nav className="border-ajo_offWhite border-opacity-40 md:border-b">
      <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ajo_offWhite"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setDropdownMenuIsOpen(!DropdownMenuIsOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {DropdownMenuIsOpen === false ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-between">
            <div className="flex flex-shrink-0 items-center">
              <Image
                className="h-8 w-auto"
                src="/Logo.svg"
                alt="Finkia Logo"
                width={20}
                height={20}
              />
            </div>
            <div className="hidden items-center gap-x-2 md:flex">
              <div>
                {filteredEndpoints.map((route) => {
                  return (
                    <Link
                      key={route}
                      href={
                        route !== "dashboard"
                          ? `/customer/${route}`
                          : "/customer/savings-purpose"
                      }
                      className={`rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100`}
                    >
                      {route === "make-payment"
                        ? "Make Payment"
                        : route === "savings-setup"
                          ? "Savings Setup"
                          : route === "savings-purpose"
                            ? "Savings Purpose"
                            : route === "savings-dashboard"
                              ? "Savings Dashboard"
                              : route === "photo-editor"
                                ? "AI photo Editor"
                                : route}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bill Management Dropdown */}
          <div className="pr-2 md:pl-4">
            <button
              type="button"
              className="flex items-center gap-x-2 rounded-full px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
              onClick={() =>
                setBillManagementDropdownIsOpen(!billManagementDropdownIsOpen)
              }
            >
              Bill Management
              <svg width="10" height="5" viewBox="0 0 12 7" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="#BDBDBD"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Open bill management menu</span>
            </button>
            {billManagementDropdownIsOpen && (
              <div className="absolute right-0 top-14 z-10 mt-2 w-48 rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
                {billManagementRoutes.map((route, index) => {
                  return (
                    <Link
                      key={route}
                      href={
                        route === "Current Bill"
                          ? "/customer/current-bill"
                          : route === "My Bills"
                            ? "/customer/my-bill"
                            : route === "Bill Payment Report"
                              ? "/customer/my-bill/bill-report"
                              : route === "Account Statement"
                                ? "/customer/account-statement"
                                : route === "Payment History"
                                  ? "/customer/payment-history"
                                  : `/customer/${route.toLowerCase().replace(/\s+/g, "-")}`
                      }
                      className="block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      {route}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* E-Commerce Dropdown */}
          <div className="pr-2 md:pl-4">
            <button
              type="button"
              className="flex items-center gap-x-2 rounded-full px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
              onClick={() =>
                setEcommerceDropdownIsOpen(!ecommerceDropdownIsOpen)
              }
            >
              E-Commerce
              <svg width="10" height="5" viewBox="0 0 12 7" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="#BDBDBD"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Open e-commerce menu</span>
            </button>
            {ecommerceDropdownIsOpen && (
              <div className="absolute right-0 top-14 z-10 mt-2 w-56 rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
                {ecommerceRoutes.map((route) => (
                  <Link
                    key={route}
                    href={
                      route === "Orders"
                        ? "/customer/ecommerce-order"
                        : route === "Delivery"
                          ? "/customer/ecommerce-delivery"
                          : route === "Pay Little-by-Little"
                            ? "/customer/ecommerce-pay-in-bits"
                            : `/customer/ecommerce/${route.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className="block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                  >
                    {route}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Savings Dashboard Dropdown */}
          <div className="pr-2 md:pl-4">
            <button
              type="button"
              className="flex items-center gap-x-2 rounded-full px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
              onClick={() =>
                setSavingsDashboardDropdownIsOpen(
                  !savingsDashboardDropdownIsOpen,
                )
              }
            >
              Savings Dashboard
              <svg width="10" height="5" viewBox="0 0 12 7" fill="none">
                <path
                  d="M1 1L6 6L11 1"
                  stroke="#BDBDBD"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Open user menu</span>
            </button>
            {savingsDashboardDropdownIsOpen && (
              <div className="absolute right-0 top-14 z-10 mt-2 w-48 rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
                {filteredrouteOptions.map((route, index) => {
                  return (
                    <Link
                      key={route}
                      href={
                        route === "Savings Dashboard"
                          ? "/customer/savings-dashboard"
                          : route === "Purchased Items Report"
                            ? "/customer/purpose-report"
                            : `/customer/${route.toLowerCase()}`
                      }
                      className="block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      {route === "bank-settings" ? "Bank Settings" : route}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {user?.role === "customer" ? (
            <AvatarDropdown
              avatarImg="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              routeOptions={["profile", "settings", "sign out"]}
              logoutFn={() => {
                SignOut();
              }}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {DropdownMenuIsOpen && (
        <div className="absolute z-10 w-full rounded-b-lg bg-ajo_darkBlue md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Regular navigation items for mobile */}
            {endpoints.map((route) => {
              return (
                <Link
                  key={route}
                  href={
                    route !== "dashboard" ? `/customer/${route}` : "/customer"
                  }
                  className="block rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
                >
                  {route}
                </Link>
              );
            })}

            {/* Bill Management section for mobile */}
            <div className="border-t border-ajo_offWhite border-opacity-20 pt-2">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ajo_offWhite opacity-70">
                Bill Management
              </div>
              {billManagementRoutes.map((route) => {
                return (
                  <Link
                    key={route}
                    href={
                      route === "Current Bill"
                        ? "/customer/current-bill"
                        : route === "My Bills"
                          ? "/customer/my-bill"
                          : route === "Generate previous bills"
                            ? "/customer/generate-bill"
                            : route === "Account Statement"
                              ? "/customer/account-statement"
                              : route === "Payment History"
                                ? "/customer/payment-history"
                                : `/customer/${route.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    className="block rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
                  >
                    {route}
                  </Link>
                );
              })}
            </div>
            {/* E-Commerce section for mobile */}
            <div className="border-t border-ajo_offWhite border-opacity-20 pt-2">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ajo_offWhite opacity-70">
                E-Commerce
              </div>
              {ecommerceRoutes.map((route) => (
                <Link
                  key={route}
                  href={
                    route === "Orders"
                      ? "/customer/ecommerce-order"
                      : route === "Delivery"
                        ? "/customer/ecommerce-delivery"
                        : route === "Pay Little-by-Little"
                          ? "/customer/ecommerce-pay-in-bits"
                          : `/customer/ecommerce/${route.toLowerCase().replace(/\s+/g, "-")}`
                  }
                  className="block rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
                >
                  {route}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomerNavbar;

export const Sidebar = ({
  onShow,
  setShow,
}: {
  onShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { SignOut } = useAuth();
  const { userPermissions, permissionsMap } = usePermissions();
  const user = useSelector(selectUser);
  const { client } = useAuth();
  const [settingsDropdownIsOpen, setSettingsDropdownIsOpen] = useState(false);
  const [setupdropdownOpen, setSetupDropdownOpen] = useState(false);
  const [generalAdminFeeOpen, setGeneralAdminFeeOpen] = useState(false);
  const [billManagementDropdownOpen, setBillManagementDropdownOpen] =
    useState(false);
  const [ecommerceDropdownOpen, setEcommerceDropdownOpen] = useState(false); // New state for e-commerce
  const [productDropdownOpen, setProductDropdownOpen] = useState(false); // New state for product sub-module

  const [purposeDropdownIsOpen, setpurposeDropdownIsOpen] = useState(false);
  const [categoriesdropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);

  const toggleSidebar = () => {
    return onShow ? "visible" : "invisible";
  };

  const { checkPermission } = useServiceCheckPermission();
  const { savings, purpose, aIPhotoEditor } = checkPermission;

  const toggleLeftPadding = () => {
    return onShow && "pl-4 md:pl-12";
  };

  const merchantRoutes = [
    "dashboard",
    "customers",
    savings ? "posting" : "",
    aIPhotoEditor ? "photo-editor" : "",
    // "location",
    // "history",
    savings
      ? user?.role === "organisation"
        ? "analytics"
        : user?.role === "staff" &&
            userPermissions.includes(permissionsMap["view-savings"])
          ? "analytics"
          : ""
      : "",
    savings
      ? user?.role === "organisation"
        ? "withdrawals"
        : user?.role === "staff" &&
            (userPermissions.includes(permissionsMap["export-withdrawal"]) ||
              userPermissions.includes(permissionsMap["view-withdrawals"]))
          ? "withdrawals"
          : ""
      : "",
    user?.role === "organisation"
      ? "users"
      : (user?.role === "staff" &&
            (userPermissions.includes(permissionsMap["create-staff"]) ||
              userPermissions.includes(permissionsMap["edit-user"]))) ||
          userPermissions.includes(permissionsMap["view-users"])
        ? "users"
        : "",

    user?.role === "organisation"
      ? "roles"
      : (user?.role === "staff" &&
            (userPermissions.includes(permissionsMap["create-role"]) ||
              userPermissions.includes(permissionsMap["edit-role"]))) ||
          userPermissions.includes(permissionsMap["view-role"])
        ? "roles"
        : "",
  ].filter(Boolean) as string[];

  const MenuBtn = ({
    icon,
    positioning,
  }: {
    icon: ReactElement;
    positioning?: string;
  }) => (
    <button
      type="button"
      className={`${positioning} inline-flex cursor-pointer items-center justify-center rounded-md p-2 pl-0 text-gray-400 ${toggleLeftPadding()}`}
      aria-controls="mobile-menu"
      aria-expanded="false"
      tabIndex={-1}
      onClick={() => setShow(!onShow)}
    >
      <span className="sr-only">Open main menu</span>
      {icon}
    </button>
  );
  return (
    <aside>
      <div
        className={`${toggleSidebar()}  fixed h-full w-44 space-y-10 overflow-y-auto border-r border-r-ajo_offWhite border-opacity-80 bg-ajo_darkBlue`}
      >
        <div className="flex w-full items-center justify-between px-6 py-6">
          <Link href="/" tabIndex={-1} className="outline-none">
            <Image
              className="h-8 w-auto"
              src="/Logo.svg"
              alt="Finkia Logo"
              width={50}
              height={50}
            />
          </Link>

          <MenuBtn
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          />
        </div>
        <nav className="mt-6 flex h-3/4 flex-col justify-between px-2">
          <div className="cursor-pointer space-y-3">
            {merchantRoutes.map((route) => {
              return (
                <Link
                  key={route}
                  href={
                    route === "dashboard" ? "/merchant" : `/merchant/${route}`
                  }
                  className="block cursor-pointer rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
                >
                  {route === "analytics"
                    ? "General Report"
                    : route === "account-statement"
                      ? "Account Statement"
                      : route === "photo-editor"
                        ? "AI Photo editor"
                        : route}
                </Link>
              );
            })}
          </div>
          <span className="w-full cursor-pointer">
            {[
              purpose ? "item/purpose" : "",
              "bill management",
              "e-commerce",
              "settings",
              "sign out",
            ].map((label) => (
              <div
                key={label}
                className="relative flex w-full cursor-pointer items-center gap-x-4 rounded-lg px-4 py-2 text-start text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
              >
                {label === "settings" ? (
                  <Link
                    href="/merchant/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingsDropdownIsOpen(!settingsDropdownIsOpen);
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "item/purpose" ? (
                  <Link
                    href="/merchant/purpose"
                    onClick={(e) => {
                      e.preventDefault();
                      setpurposeDropdownIsOpen(!purposeDropdownIsOpen);
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "bill management" ? (
                  <Link
                    href="/merchant/create-bill"
                    onClick={(e) => {
                      e.preventDefault();
                      setBillManagementDropdownOpen(
                        !billManagementDropdownOpen,
                      );
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "e-commerce" ? (
                  <Link
                    href="/merchant/ecommerce"
                    onClick={(e) => {
                      e.preventDefault();
                      setEcommerceDropdownOpen(!ecommerceDropdownOpen);
                    }}
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    onClick={() => {
                      SignOut();
                    }}
                  >
                    {label}
                  </span>
                )}

                {label === "settings" && (
                  <Image
                    src="/arrow_down.svg"
                    alt="arrow down"
                    width={8}
                    height={6}
                  />
                )}
                {label === "item/purpose" && (
                  <Image
                    src="/arrow_down.svg"
                    alt="arrow down"
                    width={8}
                    height={6}
                  />
                )}
                {label === "bill management" && (
                  <Image
                    src="/arrow_down.svg"
                    alt="arrow down"
                    width={8}
                    height={6}
                  />
                )}
                {label === "e-commerce" && (
                  <Image
                    src="/arrow_down.svg"
                    alt="arrow down"
                    width={8}
                    height={6}
                  />
                )}

                {/* E-commerce Dropdown */}
                {label === "e-commerce" && ecommerceDropdownOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setProductDropdownOpen(!productDropdownOpen);
                      }}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                        <span>Product</span>
                        <Image
                          className="mr-2"
                          src="/arrow_down.svg"
                          alt="arrow down"
                          width={12}
                          height={12}
                        />
                      </div>

                      {productDropdownOpen && (
                        <>
                          <div className="left-0 z-20 my-1 w-full rounded-md py-1 shadow-lg">
                            <Link
                              href="/merchant/ecommerce"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              Create Product
                            </Link>
                          </div>

                          <div className="left-0 z-20 my-1 w-full rounded-md py-1 shadow-lg">
                            <Link
                              href="/merchant/bits-payment-report"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              Little-by-little Payment Report
                            </Link>
                          </div>

                          <div className="left-0 z-20 my-1 w-full rounded-md py-1 shadow-lg">
                            <Link
                              href="/merchant/customerOrder-report"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              Admin&apos;s Order Report
                            </Link>
                          </div>

                          <div className="left-0 z-20 my-1 w-full rounded-md py-1 shadow-lg">
                              <Link
                                href="/merchant/Ratings-review"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                Ratings And Review
                              </Link>
                            </div>
                             <div className="left-0 z-20 my-1 w-full rounded-md py-1 shadow-lg">
                              <Link
                                href="/merchant/Faq"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                FAQ
                              </Link>
                            </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Bill Management Dropdown */}
                {label === "bill management" && billManagementDropdownOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href="/merchant/create-bill"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Create Bill
                    </Link>
                    <Link
                      href="/merchant/bill-category"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Bill Item Category
                    </Link>
                    <Link
                      href="/merchant/account-statement"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Account Statement
                    </Link>
                    <Link
                      href="/merchant/bill-payment-report"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Bill Payment Report
                    </Link>
                  </div>
                )}

                {label === "settings" && settingsDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href={`/merchant/settings/location`}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      location settings
                    </Link>
                    <Link
                      href="/merchant/settings/group"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      group settings
                    </Link>

                    {/* <Link
                      href="/merchant/settings"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Savings settings
                    </Link> */}
                    {savings ? (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          setSetupDropdownOpen(!setupdropdownOpen);
                        }}
                        className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite  hover:text-ajo_darkBlue"
                      >
                        <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                          <span>
                            Savings Setup <br />
                            and Admin Fee
                          </span>

                          <Image
                            className="mr-2"
                            src="/arrow_down.svg"
                            alt="arrow down"
                            width={12}
                            height={12}
                          />
                        </div>

                        {setupdropdownOpen && (
                          <>
                            <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                              <Link
                                href="/merchant/settings/setup-adminfee"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                Setup Saving <br /> and Admin fee
                              </Link>
                            </div>

                            <div className="left-0 z-20 w-full rounded-md   py-1 shadow-lg">
                              <Link
                                href="/merchant/settings/update-savings-set-up"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                Update Admin <br /> Settings
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      ""
                    )}

                    {savings ? (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          setGeneralAdminFeeOpen(!generalAdminFeeOpen);
                        }}
                        className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite   hover:text-ajo_darkBlue"
                      >
                        <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                          <span>
                            General Admin Fee <br />
                            and Set up
                          </span>

                          <Image
                            className="mr-2"
                            src="/arrow_down.svg"
                            alt="arrow down"
                            width={12}
                            height={12}
                          />
                        </div>

                        {generalAdminFeeOpen && (
                          <>
                            <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                              <Link
                                href="/merchant/settings/general-admin-fee-set-up"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                General Admin fee
                              </Link>
                            </div>

                            <div className="left-0 z-20 w-full rounded-md   py-1 shadow-lg">
                              <Link
                                href="/merchant/settings/general-admin-fee-set-up/update-general-adminfee"
                                className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                              >
                                Update General <br />
                                Admin Fee
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}

                {label === "item/purpose" && purposeDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setCategoriesDropdownOpen(!categoriesdropdownOpen);
                      }}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite  hover:text-ajo_darkBlue"
                    >
                      <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                        <span>Categories</span>

                        <Image
                          className="mr-2"
                          src="/arrow_down.svg"
                          alt="arrow down"
                          width={12}
                          height={12}
                        />
                      </div>

                      {categoriesdropdownOpen && (
                        <>
                          <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                            <Link
                              href="/merchant/purpose/category"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              categories
                            </Link>
                          </div>

                          {/* <div className="left-0 z-20 w-full rounded-md   py-1 shadow-lg">
                            <Link
                              href="/merchant/purpose/category"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              View Categories
                            </Link>
                          </div> */}
                        </>
                      )}
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setItemOpen(!itemOpen);
                      }}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite   hover:text-ajo_darkBlue"
                    >
                      <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                        <span>Purposes</span>

                        <Image
                          className="mr-2"
                          src="/arrow_down.svg"
                          alt="arrow down"
                          width={12}
                          height={12}
                        />
                      </div>

                      {itemOpen && (
                        <>
                          <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                            <Link
                              href="/merchant/purpose/item"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              purpose
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setItemOpen(!itemOpen);
                      }}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite   hover:text-ajo_darkBlue"
                    >
                      <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                        <span>Coupon</span>

                        <Image
                          className="mr-2"
                          src="/arrow_down.svg"
                          alt="arrow down"
                          width={12}
                          height={12}
                        />
                      </div>

                      {itemOpen && (
                        <>
                          <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                            <Link
                              href="/merchant/purpose/coupon"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              coupon
                            </Link>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        setItemOpen(!itemOpen);
                      }}
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite   hover:text-ajo_darkBlue"
                    >
                      <div className="flex justify-between text-gray-200 hover:bg-ajo_offWhite hover:p-1 hover:text-black">
                        <span>
                          Purchased Item <br /> Report
                        </span>

                        <Image
                          className="mr-2"
                          src="/arrow_down.svg"
                          alt="arrow down"
                          width={12}
                          height={12}
                        />
                      </div>

                      {itemOpen && (
                        <>
                          <div className="left-0 z-20 my-1 w-full  rounded-md  py-1 shadow-lg">
                            <Link
                              href="/merchant/purpose/item-report"
                              className="block cursor-pointer whitespace-nowrap bg-white px-2 py-1 text-sm capitalize text-black hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                            >
                              Purchased Item <br /> Report
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </span>
        </nav>
      </div>
      {/* <!-- Mobile menu button--> */}
      {!onShow && (
        <MenuBtn
          positioning="absolute top-3.5"
          icon={
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          }
        />
      )}
    </aside>
  );
};

export const SuperAdminSidebar = ({
  onShow,
  setShow,
}: {
  onShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { SignOut } = useAuth();
  const router = useRouter();
  const user = useSelector(selectUser);
  const { userPermissions, permissionsMap } = usePermissions();
  const [settingsDropdownIsOpen, setSettingsDropdownIsOpen] = useState(false);
  const [itemsDropdownIsOpen, setItemsDropdownIsOpen] = useState(false);
  const [subscriptionDropdownIsOpen, setSubscriptionDropdownIsOpen] =
    useState(false);
  const [pickupStationDropdownIsOpen, setPickupStationDropdownIsOpen] =
    useState(false);
  const [productCategoryDropdownIsOpen, setProductCategoryDropdownIsOpen] =
    useState(false);
  const [customerBillDropdownIsOpen, setCustomerBillDropdownIsOpen] =
    useState(false);
  const [customerGroupDropdownIsOpen, setCustomerGroupDropdownIsOpen] =
    useState(false);

  const toggleSidebar = () => (onShow ? "visible" : "invisible");
  const toggleLeftPadding = () => onShow && "pl-4 md:pl-12";

  const merchantRoutes = [
    "dashboard",
    "organisation",
    "customers",
    "group",
    "services",
    "commission",
    "roles",
    "industry",
    "category",
    "users",
    "account-statement",
    "superadminfee",
    "bill-payment-reports",
  ];

  const MenuBtn = ({
    icon,
    positioning,
  }: {
    icon: ReactElement;
    positioning?: string;
  }) => (
    <button
      type="button"
      className={`${positioning} inline-flex items-center justify-center rounded-md p-2 pl-0 text-gray-400 ${toggleLeftPadding()}`}
      aria-controls="mobile-menu"
      aria-expanded="false"
      tabIndex={-1}
      onClick={() => setShow(!onShow)}
    >
      <span className="sr-only">Open main menu</span>
      {icon}
    </button>
  );

  return (
    <aside>
      <div
        className={`${toggleSidebar()} fixed h-full w-44 space-y-10 overflow-y-auto border-r border-r-ajo_offWhite border-opacity-80 bg-ajo_darkBlue`}
      >
        <div className="flex w-full items-center justify-between px-6 py-6">
          <Link href="/" tabIndex={-1} className="outline-none">
            <Image
              src="/Logo.svg"
              alt="Finkia Logo"
              width={20}
              height={20}
              className="h-8 w-auto"
            />
          </Link>
          <MenuBtn
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          />
        </div>
        <nav className="mt-6 flex h-3/4 flex-col justify-between px-2">
          <div className="space-y-4">
            {merchantRoutes.map((route) => (
              <Link
                key={route}
                href={
                  route === "dashboard" ? "/superadmin" : `/superadmin/${route}`
                }
                className="block rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
              >
                {route === "account-statement"
                  ? "Account Statement"
                  : route === "superadminfee"
                    ? "Superadmin Fee"
                    : route === "bill-payment-reports"
                      ? "Bill Payment Reports"
                      : route === "customer-bill"
                        ? "Customer Bill"
                        : route}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            {[
              "subscription-report",
              "item/purpose",
              "pick-up-station",
              "product-category",
              "customer-bill",
              "customer-group",
              "settings",
              "sign out",
            ].map((label) => (
              <div
                key={label}
                className="relative flex items-center gap-x-4 rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:bg-gray-700 hover:opacity-100"
              >
                {/* Link or action based on label */}
                {label === "settings" ? (
                  <Link
                    href="/superadmin/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingsDropdownIsOpen(!settingsDropdownIsOpen);
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "item/purpose" ? (
                  <Link
                    href="/superadmin/item"
                    onClick={(e) => {
                      e.preventDefault();
                      setItemsDropdownIsOpen(!itemsDropdownIsOpen);
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "pick-up-station" ? (
                  <Link
                    href="/superadmin/pick-up-station"
                    onClick={(e) => {
                      e.preventDefault();
                      setPickupStationDropdownIsOpen(
                        !pickupStationDropdownIsOpen,
                      );
                    }}
                  >
                    pick up Center
                  </Link>
                ) : label === "product-category" ? (
                  <Link
                    href="/superadmin/product-category"
                    onClick={(e) => {
                      e.preventDefault();
                      setProductCategoryDropdownIsOpen(
                        !productCategoryDropdownIsOpen,
                      );
                    }}
                  >
                    {label}
                  </Link>
                ) : label === "customer-bill" ? (
                  <Link
                    href="/superadmin/customer-bill"
                    onClick={(e) => {
                      e.preventDefault();
                      setCustomerBillDropdownIsOpen(
                        !customerBillDropdownIsOpen,
                      );
                    }}
                  >
                    customer bill
                  </Link>
                ) : label === "customer-group" ? (
                  <Link
                    href="/superadmin/customer-group"
                    onClick={(e) => {
                      e.preventDefault();
                      setCustomerGroupDropdownIsOpen(
                        !customerGroupDropdownIsOpen,
                      );
                    }}
                  >
                    customer group
                  </Link>
                ) : label === "subscription-report" ? (
                  <Link
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setSubscriptionDropdownIsOpen(
                        !subscriptionDropdownIsOpen,
                      );
                    }}
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    onClick={() => {
                      SignOut();
                    }}
                  >
                    {label}
                  </span>
                )}

                {/* Dropdown toggles */}
                {[
                  "subscription-report",
                  "settings",
                  "item/purpose",
                  "pick-up-station",
                  "product-category",
                  "customer-bill",
                  "customer-group",
                ].includes(label) && (
                  <Image
                    src="/arrow_down.svg"
                    alt="arrow down"
                    width={8}
                    height={6}
                  />
                )}

                {/* Dropdown content */}
                {label === "settings" && settingsDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href="#"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      location settings
                    </Link>
                    <Link
                      href="#"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      group settings
                    </Link>
                    <Link
                      href="#"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Savings settings
                    </Link>
                  </div>
                )}

                {label === "item/purpose" && itemsDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href="/superadmin/item"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      All purposes/items
                    </Link>
                    <Link
                      href="/superadmin/item/report"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Purpose/item report
                    </Link>
                  </div>
                )}

                {label === "pick-up-station" && pickupStationDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href="/superadmin/getpick-station"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Create-pick-up-center
                    </Link>
                  </div>
                )}

                {label === "product-category" &&
                  productCategoryDropdownIsOpen && (
                    <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                      <Link
                        href="/superadmin/product-category"
                        className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        product-category
                      </Link>
                      <Link
                        href="/superadmin/product-brand"
                        className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        Brands
                      </Link>
                      <Link
                        href="/superadmin/product-tags"
                        className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        Tags
                      </Link>
                    </div>
                  )}

                {label === "customer-bill" && customerBillDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    <Link
                      href="/superadmin/customer-bill"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Create User Bill
                    </Link>
                  </div>
                )}

                {label === "customer-group" && customerGroupDropdownIsOpen && (
                  <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                    {/* <Link href="/superadmin/customer-group" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
                      All Customer Groups
                    </Link> */}
                    <Link
                      href="/superadmin/customer-group"
                      className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Create Customer Group
                    </Link>
                    {/* <Link href="/superadmin/customer-group/manage" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
                      Manage Groups
                    </Link> */}
                  </div>
                )}

                {label === "subscription-report" &&
                  subscriptionDropdownIsOpen && (
                    <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
                      <Link
                        href="/superadmin/subscription-report/merchant"
                        className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        Merchants <br /> Subscription
                      </Link>
                      <Link
                        href="/superadmin/subscription-report/customer"
                        className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                      >
                        Customer <br /> Subscription
                      </Link>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu button */}
      {!onShow && (
        <MenuBtn
          positioning="absolute top-3.5"
          icon={
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          }
        />
      )}
    </aside>
  );
};

// export const SuperAdminSidebar = ({
//   onShow,
//   setShow,
// }: {
//   onShow: boolean;
//   setShow: Dispatch<SetStateAction<boolean>>;
// }) => {
//   const { SignOut } = useAuth();
//   const router = useRouter();
//   const user = useSelector(selectUser);
//   const { userPermissions, permissionsMap } = usePermissions();
//   const [settingsDropdownIsOpen, setSettingsDropdownIsOpen] = useState(false);
//   const [itemsDropdownIsOpen, setItemsDropdownIsOpen] = useState(false);
//   const [subscriptionDropdownIsOpen, setSubscriptionDropdownIsOpen] = useState(false);
//   const [pickupStationDropdownIsOpen, setPickupStationDropdownIsOpen] = useState(false);
//   const [productCategoryDropdownIsOpen, setProductCategoryDropdownIsOpen] = useState(false);
//   const [customerBillDropdownIsOpen, setCustomerBillDropdownIsOpen] = useState(false);

//   const toggleSidebar = () => (onShow ? 'visible' : 'invisible');
//   const toggleLeftPadding = () => onShow && 'pl-4 md:pl-12';

//   const merchantRoutes = [
//     'dashboard',
//     'organisation',
//     'customers',
//     'group',
//     'services',
//     'commission',
//     'roles',
//     'industry',
//     'category',
//     'users',
//     'account-statement',
//     'superadminfee',
//   ];

//   const MenuBtn = ({ icon, positioning }: { icon: ReactElement; positioning?: string }) => (
//     <button
//       type="button"
//       className={`${positioning} inline-flex items-center justify-center rounded-md p-2 pl-0 text-gray-400 ${toggleLeftPadding()}`}
//       aria-controls="mobile-menu"
//       aria-expanded="false"
//       tabIndex={-1}
//       onClick={() => setShow(!onShow)}
//     >
//       <span className="sr-only">Open main menu</span>
//       {icon}
//     </button>
//   );

//   return (
//     <aside>
//       <div className={`${toggleSidebar()} fixed h-full w-44 space-y-10 overflow-y-auto border-r border-r-ajo_offWhite border-opacity-80 bg-ajo_darkBlue`}>
//         <div className="flex w-full items-center justify-between px-6 py-6">
//           <Link href="/" tabIndex={-1} className="outline-none">
//             <Image src="/Logo.svg" alt="Finkia Logo" width={20} height={20} className="h-8 w-auto" />
//           </Link>
//           <MenuBtn
//             icon={
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             }
//           />
//         </div>
//         <nav className="mt-6 flex h-3/4 flex-col justify-between px-2">
//           <div className="space-y-4">
//             {merchantRoutes.map((route) => (
//               <Link
//                 key={route}
//                 href={route === 'dashboard' ? '/superadmin' : `/superadmin/${route}`}
//                 className="block rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
//               >
//                 {route === 'account-statement'
//                   ? 'Account Statement'
//                   : route === 'superadminfee'
//                   ? 'Superadmin Fee'
//                   : route === 'customer-bill'
//                   ? 'Customer Bill'
//                   : route}
//               </Link>
//             ))}
//           </div>

//           <div className="space-y-2">
//             {[
//               'subscription-report',
//               'item/purpose',
//               'pick-up-station',
//               'product-category',
//               'customer-bill',
//               'settings',
//               'sign out',
//             ].map((label) => (
//               <div
//                 key={label}
//                 className="relative flex items-center gap-x-4 rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:bg-gray-700 hover:opacity-100"
//               >
//                 {/* Link or action based on label */}
//                 {label === 'settings' ? (
//                   <Link
//                     href="/superadmin/settings"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setSettingsDropdownIsOpen(!settingsDropdownIsOpen);
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ) : label === 'item/purpose' ? (
//                   <Link
//                     href="/superadmin/item"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setItemsDropdownIsOpen(!itemsDropdownIsOpen);
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ) : label === 'pick-up-station' ? (
//                   <Link
//                     href="/superadmin/pick-up-station"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setPickupStationDropdownIsOpen(!pickupStationDropdownIsOpen);
//                     }}
//                   >
//                     pick up Center
//                   </Link>
//                 ) : label === 'product-category' ? (
//                   <Link
//                     href="/superadmin/product-category"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setProductCategoryDropdownIsOpen(!productCategoryDropdownIsOpen);
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ) : label === 'customer-bill' ? (
//                   <Link
//                     href="/superadmin/customer-bill"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCustomerBillDropdownIsOpen(!customerBillDropdownIsOpen);
//                     }}
//                   >
//                     customer bill
//                   </Link>
//                 ) : label === 'subscription-report' ? (
//                   <Link
//                     href=""
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setSubscriptionDropdownIsOpen(!subscriptionDropdownIsOpen);
//                     }}
//                   >
//                     {label}
//                   </Link>
//                 ) : (
//                   <span
//                     onClick={() => {
//                       SignOut();
//                     }}
//                   >
//                     {label}
//                   </span>
//                 )}

//                 {/* Dropdown toggles */}
//                 {['subscription-report', 'settings', 'item/purpose', 'pick-up-station', 'product-category', 'customer-bill'].includes(label) && (
//                   <Image src="/arrow_down.svg" alt="arrow down" width={8} height={6} />
//                 )}

//                 {/* Dropdown content */}
//                 {label === 'settings' && settingsDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="#" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       location settings
//                     </Link>
//                     <Link href="#" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       group settings
//                     </Link>
//                     <Link href="#" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Savings settings
//                     </Link>
//                   </div>
//                 )}

//                 {label === 'item/purpose' && itemsDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="/superadmin/item" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       All purposes/items
//                     </Link>
//                     <Link href="/superadmin/item/report" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Purpose/item report
//                     </Link>
//                   </div>
//                 )}

//                 {label === 'pick-up-station' && pickupStationDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="/superadmin/getpick-station" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Create-pick-up-center
//                     </Link>
//                   </div>
//                 )}

//                 {label === 'product-category' && productCategoryDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="/superadmin/product-category" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       product-category
//                     </Link>
//                     <Link href="/superadmin/product-brand" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Brands
//                     </Link>
//                     <Link href="/superadmin/product-tags" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Tags
//                     </Link>
//                   </div>
//                 )}

//                 {label === 'customer-bill' && customerBillDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="/superadmin/customer-bill" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Create User Bill
//                     </Link>
//                   </div>
//                 )}

//                 {label === 'subscription-report' && subscriptionDropdownIsOpen && (
//                   <div className="absolute bottom-[110%] left-0 z-20 w-full rounded-md border border-ajo_offWhite border-opacity-40 bg-ajo_darkBlue py-1 shadow-lg">
//                     <Link href="/superadmin/subscription-report/merchant" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Merchants <br /> Subscription
//                     </Link>
//                     <Link href="/superadmin/subscription-report/customer" className="block whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue">
//                       Customer <br /> Subscription
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </nav>
//       </div>

//       {/* Mobile menu button */}
//       {!onShow && (
//         <MenuBtn
//           positioning="absolute top-3.5"
//           icon={
//             <svg
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//             </svg>
//           }
//         />
//       )}
//     </aside>
//   );
// };
