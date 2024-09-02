"use client";
import { useAuth } from "@/api/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import AvatarDropdown from "./Dropdowns";
import { usePermissions } from "@/api/hooks/usePermissions";
import { useSelector } from "react-redux";
import { selectUser } from "@/slices/OrganizationIdSlice";

const CustomerNavbar = () => {
  // const [AvatarMenuIsOpen, setAvatarMenuIsOpen] = useState(false);
  const [DropdownMenuIsOpen, setDropdownMenuIsOpen] = useState(false);
  const [savingsDashboardDropdownIsOpen, setSavingsDashboardDropdownIsOpen] = useState(false)
  const endpoints = [
    "dashboard",
    "make-payment",
    "withdrawals",
    "transactions",
    "savings-setup",
    "savings-purpose",
    // "savings-dashboard",
    "coupon"
  ];
  const { SignOut } = useAuth();
  const routeOptions=["Savings Dashboard", "Purchase Items Report"]
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
              {endpoints.map((route) => {
                return (
                  <Link
                    key={route}
                    href={
                      route !== "dashboard" ? `/customer/${route}` : "/customer/savings-purpose"
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100`}
                  >
                    {route === "make-payment" ? "Make Payment": route === "savings-setup" ? "Savings Setup" : route === 'savings-purpose' ? 'Savings Purpose' : route === 'savings-dashboard' ? 'Savings Dashboard' : route}
                  </Link>
                );
              })}
            </div>
            
            </div>
          </div>

          <div className="pr-2 md:pl-11">
      {/* <!-- Profile dropdown --> */}
      <button
        type="button"
        className="flex items-center gap-x-2 rounded-full {`rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100`}"
        onClick={() => setSavingsDashboardDropdownIsOpen(!savingsDashboardDropdownIsOpen)}
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
        <div className="absolute right-0 top-14 z-10 mt-2 w-48  rounded-md bg-white bg-opacity-20 py-1 shadow-lg">
          {routeOptions.map((route, index) => {
            
              return (
                <Link
                  key={route}
                  href={route === 'Savings Dashboard' ? '/customer/savings-dashboard' : route === "Purchase Items Report" ? "/customer/purpose-report" : `/customer/${route.toLowerCase()}`}
                  className={`block px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue`}
                >
                  {route === "bank-settings" ? 'Bank Settings' : route}
                </Link>
              );
            }
          )}
        </div>
      )}
    </div>


          

          <AvatarDropdown
            avatarImg="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            routeOptions={["profile", "settings", "sign out"]}
            logoutFn={() => {
              SignOut();
            }}
          />
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {DropdownMenuIsOpen && (
        <div className="absolute z-10 w-full rounded-b-lg bg-ajo_darkBlue md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {endpoints.map((route) => {
              return (
                <Link
                  key={route}
                  href={
                    route !== "dashboard" ? `/customer/${route}` : "/customer"
                  }
                  className={`block rounded-lg px-3 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100`}
                >
                  {route}
                </Link>
              );
            })}
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

  const [settingsDropdownIsOpen, setSettingsDropdownIsOpen] = useState(false);
  const [setupdropdownOpen, setSetupDropdownOpen] = useState(false);
  const [generalAdminFeeOpen, setGeneralAdminFeeOpen] = useState(false);

  const [purposeDropdownIsOpen, setpurposeDropdownIsOpen] = useState(false);
  const [categoriesdropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const toggleSidebar = () => {
    return onShow ? "visible" : "invisible";
  };

  const toggleLeftPadding = () => {
    return onShow && "pl-4 md:pl-12";
  };

  const merchantRoutes = [
    "dashboard",
    "customers",
    "posting",
    "location",
    "history",
    user?.role === "organisation"
      ? "analytics"
      : user?.role === "staff" &&
          (userPermissions.includes(permissionsMap["view-savings"]))
        ? "analytics"
        : "",
    user?.role === "organisation"
      ? "withdrawals"
      : user?.role === "staff" &&
          (userPermissions.includes(permissionsMap["export-withdrawal"]) ||
            userPermissions.includes(permissionsMap["view-withdrawals"]))
        ? "withdrawals"
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
        "account-statement"
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
        className={`${toggleSidebar()}  fixed h-full w-44 space-y-10 border-r border-r-ajo_offWhite border-opacity-80 bg-ajo_darkBlue overflow-y-auto`}
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
                  {route === "analytics" ? "General Report" : route === "account-statement" ? "Account Statement" : route}
                </Link>
              );
            })}
          </div>
          <span className="w-full cursor-pointer">
            {["item/purpose", "settings", "sign out"].map((label) => (
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
                ): label ===  "item/purpose" ?  (
                  <Link
                    href="/merchant/purpose"
                    onClick={(e) => {
                      e.preventDefault();
                      setpurposeDropdownIsOpen(!purposeDropdownIsOpen);
                    }}
                  >
                    {label}
                  </Link>
                ):(
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

                    <Link
                      href="/merchant/settings"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Savings settings
                    </Link>

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
                        <span>
                          Categories
                        </span>

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
                        <span>
                         Purposes</span>

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
                        <span>
                         Coupon</span>

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
                         Purchased Item <br/> Report</span>

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
                               Purchased Item <br/> Report
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

  const [settingsDropdownIsOpen, setSettingsDropdownIsOpen] = useState(false);

  const toggleSidebar = () => {
    return onShow ? "visible" : "invisible";
  };

  const toggleLeftPadding = () => {
    return onShow && "pl-4 md:pl-12";
  };

  const merchantRoutes = [
    "dashboard",
    "organisation",
    "customers",
    "group",
    "commission",
    "roles",
    "industry",
    "category",
    "users",
    "account-statement",
    'superadminfee'
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
        className={`${toggleSidebar()} overflow-y-auto fixed h-full w-44 space-y-10 border-r border-r-ajo_offWhite border-opacity-80 bg-ajo_darkBlue`}
      >
        <div className="flex w-full items-center justify-between px-6 py-6">
          <Link href="/" tabIndex={-1} className="outline-none">
            <Image
              className="h-8 w-auto"
              src="/Logo.svg"
              alt="Finkia Logo"
              width={20}
              height={20}
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
          <div className="cursor-pointer space-y-4">
            {merchantRoutes.map((route) => {
              return (
                <Link
                  key={route}
                  href={
                    route === "dashboard"
                      ? "/superadmin"
                      : `/superadmin/${route}`
                  }
                  className="block cursor-pointer rounded-lg px-4 py-2 text-sm font-medium capitalize text-ajo_offWhite opacity-50 hover:rounded-lg hover:bg-gray-700 hover:opacity-100 focus:bg-gray-700 focus:opacity-100"
                >
                  { route === "account-statement" ? "Account Statement" : route}
                </Link>
              );
            })}
          </div>
          <span className="w-full cursor-pointer">
            {["settings", "sign out"].map((label) => (
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
                ) : (
                  <span
                    onClick={() => {
                      SignOut();
                      // router.replace("/");
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

                    <Link
                      href="/merchant/settings"
                      className="block cursor-pointer whitespace-nowrap px-4 py-2 text-sm capitalize text-ajo_offWhite hover:bg-ajo_offWhite hover:text-ajo_darkBlue"
                    >
                      Savings settings
                    </Link>
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
