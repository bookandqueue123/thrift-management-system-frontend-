import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ReactNode } from "react";
import { Url } from "url";

export type customer = {
  officeAddress1: string;
  organisationName?: string;
  _id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  accountNumber: number;
  groupMembers: [];
  role: "customer" | "merchant" | "organization";
  kycVerified: boolean;
  organisation: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  homeAddress: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  popularMarket: string;
  nok: string;
  nokRelationship: string;
  nokPhone: number;
  nin: number;
  bvn: number;
  meansOfIDPhoto: any;
  meansOfID: "NIN" | "Passport";
  photo: File | any;
  userType: string;
  groupName: string;
 
};

export type setSavingsResponse = {
  purposeName: string;
  amount: 15000;
  startDate: string;
  endDate: string;
  frequency: string;
  user: string;
  organisation: string;
  isPaid: string;
  _id: string;
  paidDays: [];
  createdAt: string;
  updatedAt: string;
  __v: 0;
  savedDates: [];
  specificDates: string[];
  id: string;
};

export interface postSavingsResponse {
  status: "failed" | "success" | undefined;
  message: string;
  updatedSaving: UpdatedSaving;
}

export interface UpdatedSaving {
  postedBy: any;
  amountPaid: string;
  saving: any;
  paymentMode: string;
  _id: string;
  purposeName: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  frequency: string;
  user: string;
  organisation: string;
  isPaid: string;
  paidDays: PaidDay[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  totalAmountSaved: number;
  savedDates: Date[];
  specificDates: Date[];
  adminFee: number;
  totalBalance: number;
  id: string;
}

export interface PaidDay {
  dayOfCollection: Date;
  datesPaid: Date[];
  amount: number;
  dayOfpayment?: Date;
  paymentMode: string;
  status: string;
  reference: string;
  _id: string;
  narration?: string;
}

export type savings = {
  [x: string]: any;
  _id: string;
  purposeName: string;
  amount: number;
  startDate: string;
  endDate: string;
  totalAmountSaved: number;
  frequency: string;
  user: User;
  organisation: Organisation;
  isPaid: string;
  paidDays: PaidDay[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  savedDates: string[];
  specificDates: string[];
  adminFee: number;
  appliedServiceCharge: number;
  serviceCharge: number;
  appliedPercentage: number;
  amountPayable: number;
  calculatedPaidDays: { datePaid: string; amountPerDay: number }[];
  adminMargin: number;
  id: string;
};
export type allSavingsResponse = {
  [x: string]: any;
  savings: [
    {
      _id: string;
      purposeName: string;
      amount: number;
      startDate: string;
      endDate: string;
      frequency: string;
      user: {
        groupMember: any[];
        isArchieve: boolean;
        savingIdentities: any[];
        _id: string;
        firstName: string;
        lastName: string;
        otherName: string;
        email: string;
        homeAddress: string;
        phoneNumber: string;
        country: string;
        state: string;
        lga: string;
        city: string;
        popularMarket: string;
        nok: string;
        nokRelationship: string;
        nokPhone: string;
        nin: number;
        bvn: number;
        meansOfIDPhoto: File;
        meansOfID: string;
        photo: File;
        accountNumber: number;
        userType: string;
        role: "customer" | "merchant" | "organization";
        kycVerified: boolean;
        organisation: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
      };
      organisation: string;
      isPaid: string;
      paidDays: any[];
      createdAt: string;
      updatedAt: string;
      __v: number;
      savedDates: any[];
      specificDates: any[];
      id: string;
    },
  ];
};

export type savingsFilteredById = {
 
  _id: string;
  purposeName: string;
  amount: number;
  startDate: string;
  endDate: string;
  frequency: string;
  user: {
    groupMember: any[];
    isArchieve: boolean;
    savingIdentities: any[];
    _id: string;
    firstName: string;
    lastName: string;
    otherName: string;
    email: string;
    homeAddress: string;
    phoneNumber: string;
    country: string;
    state: string;
    lga: string;
    city: string;
    popularMarket: string;
    nok: string;
    nokRelationship: string;
    nokPhone: string;
    nin: number;
    bvn: number;
    meansOfIDPhoto: File;
    meansOfID: string;
    photo: File;
    accountNumber: number;
    userType: string;
    role: "customer" | "merchant" | "organization";
    kycVerified: boolean;
    organisation: string;
    createdAt: string;
    updatedAt: string;
    
    __v: number;
  };
  organisation: string;
  isPaid: string;
  paidDays: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  savedDates: any[];
  specificDates: any[];
  id: string;
  totalexpectedSavings?: number;
  totalAmountSaved?: number
};

export interface MerchantSignUpProps {
  organisationName: string;
  phoneNumber: string;
  email: string;
  password: string;
  prefferedUrl: string;
  role: string;
  confirmPassword: string;
  
}

export interface signInProps {
  email: string;
  userCategory: string;
  password: string;
  // rememberPassword: boolean;
}
export interface CustomerSignUpProps {
  [x: string]: any;
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  email: string;
  password: string;
  // role:         string;
  organization: string;
  confirmPassword: string;
}

export interface getOrganizationProps {
  userType: string;
  groupMember: any[];
  isArchieve: boolean;
  savingIdentities: any[];
  _id: string;
  email: string;
  phoneNumber: string;
  organisationName: string;
  accountNumber: string;
  role: string;
  prefferedUrl: string;
  kycVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface UpdateKycProps {
  email?: any;
  phoneNumber?: any;
  otherName?: any;
  lastName?: any;
  firstName?: any;
  country: string;
  state: string;
  lga: string;
  city: string;
  popularMarket: string;
  nok: string;
  nokRelationship: string;
  nokPhone: string;
  homeAddress: string;
  userType: string;
  photo: null;
  meansOfID: string;
  meansOfIDPhoto: any;
  nin: any;
  bvn: any;
  organisation: string;
  bankAcctNo: string;
  // bankAcctName: string;
  // bankName: string;
}

export interface WithdrawalProps {
  paymentMode: string | number | readonly string[] | undefined;
  paymentEvidence: string;
  evidence: string;
  _id: string;
  // saving:              string;
  user: User;
  amount: number;
  status: string;
  paymentConfirmation: string;
  organisation: Organisation;
  withdrawalRequest: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  saving: savings;
}

export interface Organisation {
  accountNumber: string;
  assignedCustomer?: any[];
  businessEmailAdress: string;
  city: string;
  country: string;
  createdAt?: string; // Consider using Date type if you parse this string into a Date object
  description: string;
  email: string;
  groupMember?: any[]; // You may want to replace 'any[]' with the appropriate type
  isArchive?: boolean;
  isVerified?: boolean;
  kycEmailSent?: boolean;
  kycVerified?: boolean;
  officeAddress1: string;
  officeAddress2: string;
  organisationName: string;
  organisations?: any[]; // You may want to replace 'any[]' with the appropriate type
  phoneNumber: string;
  preferredUrl?: string;
  region: string;
  role?: string;
  roles?: any[]; // You may want to replace 'any[]' with the appropriate type
  savingIdentities?: any[]; // You may want to replace 'any[]' with the appropriate type
  socialMedia?: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedIn: string;
    pintrest: string;
  };
  state: string;
  tradingName: string;
  updatedAt?: string; // Consider using Date type if you parse this string into a Date object
  userType?: string;
  website: string;
  __v?: number;
  _id?: string;
  photo?: string;
}

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
}

export interface Role {
  createdAt: string;
  description: string;
  name: string;
  organisation: string;
  permissions: Permission[];
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface Permission {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssignedUser {
  accountNumber: string;
  assignedUser: AssignedUser[];
  bvn: number;
  city: string;
  country: string;
  createdAt: string;
  email: string;
  firstName: string;
  groupMember: any[];
  officeAddress1: string;
  organisationName?: string;
  homeAddress: string;
  isArchieve: boolean;
  isVerified: boolean;
  kycEmailSent: boolean;
  kycVerified: boolean;
  lastName: string;
  lga: string;
  meansOfID: string;
  meansOfIDPhoto: string;
  nin: number;
  nok: string;
  nokPhone: string;
  nokRelationship: string;
  organisation: string;
  organisations: any[];
  otherName: string;
  phoneNumber: string;
  photo: string;
  popularMarket: string;
  role: string;
  roles: any[];
  savingIdentities: any[];
  state: string;
  updatedAt: string;
  userType: string;
  groupName: string;
  __v: number;
  _id: string;
}
export interface User {
  _id: string;
  name:string;
  firstName: string;
  lastName: string;
  otherName?: string;
  email: string;
  phoneNumber: string;
  password?: string;
  accountNumber?: string;
  userType: string;
  groupMember: any[];
  role: string;
  organisations: any[];
  kycVerified: boolean;
  kycEmailSent: boolean;
  isArchieve: boolean;
  isVerified: boolean;
  savingIdentities: any[];
  organisation: string;
  organisationName?: string;
  assignedUser: AssignedUser[];
  totalCustomer?: number;
  pendingPayout?: number;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  bvn?: number;
  city?: string;
  country?: string;
  homeAddress: string;
  lga?: string;
  meansOfID?: string;
  meansOfIDPhoto?: string;
  nin?: number;
  nok?: string;
  nokPhone?: string;
  nokRelationship?: string;
  photo?: string;
  popularMarket?: string;
  state?: string;
  groupName?: string;
  guarantor1?: Guarantor;
  guarantor2?: Guarantor;
}


export interface CountryAndStateProps {
  country: string;
  states: StateProps[];
}

export interface StateProps {
  name: string;
  lgas: string[];
}

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string | string[];
}

export interface UpdateMerchantKycProps {
  country: string;
  state: string;
  lga: string;
  city: string;
  phoneNumber: string;
  organisationLogo: null;
  tradingName: string;
  organisationName: string;
  description: string;
  websiteUrl: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedIn: string;
  twitter: string;
  pinterest: string;
  officeAddress: string;
  address2: string;
  BankRecommendation: null;
  CourtAffidavit: null;
  CommunityRecommendation: null;
  FormCacBn: null;
  CertOfBusinessName: null;
  percentOwnership: string;
  contactPhoto: null;
  cacNumber: string;
  contactBvn: string;
  contactNIN: string;
  contactNationality: string;
  OrgRole: string;
  contactDOB: string;
  contactEmail: string;
  contactPhoneNumber: string;
  businessPhoneNumber: string;
  contactFullName: string;
  // bankName: string;
  // acctNo: string;
  // account_bank: string,
  //   split_type: string,
  //   split_value: string,
}

type MyFile = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type MyFileList = {
  [index: number]: MyFile;
  // length: number;
};
export interface OrganisationGroupsProps {
  _id: string;
  description: string;
  userType: string;
  groupName: string;
  groupMember: any[];
  role: string;
  organisations: any[];
  kycVerified: boolean;
  isArchieve: boolean;
  isVerified: boolean;
  savingIdentities: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface setUpSavingsProps {
  accountType: string;
  percentageBased: string;
  amountBased: string;
  accountNumber: string;
  accountName: string;
  purpose: string;
  amount: string;
  frequency: string;
  startDate: string;
  endDate: string;
  totalexpectedSavings: string;
  collectionDate: string;
  userId: string;
  savingID?: string;
  purposeRadioValue?: string
}

export interface createRoleProps {
  roleName: string;
  description: string;
  permissions: {
    "edit-user": boolean;
    "view-assigned-users": boolean;
    "export-withdrawal": boolean;
    "view-withdrawals": boolean;
    "view-savings": boolean;
    "export-saving": boolean;
    "post-saving": boolean;
    "set-saving": boolean;
    "view-user": boolean;
  };
}
export interface CategoryFormValuesProps {
  name: string;
  description: string;
}

export interface createSuperRoleProps {
  superuser: string[];
  roleName: string;
  description: string;
  // viewPermissions: {
  //   viewOrgDetails: boolean;
  //   viewOrgCustomerDetails: boolean;
  //   viewOrg: boolean;
  //   generalPostingReport: boolean;
  //   withdrawalReport: boolean;
  // };
  // editPermissions: {
  //   editOrgCustomerDetails: boolean;
  //   editOrgDetails: boolean;
  // };
  // actionPermissions: {
  //   enableOrg: boolean;
  //   disableOrg: boolean;
  // };
}

export interface mutateUserProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeAddress: string;
  dept_unit: string;
  userPicture:  null;
  meansOfIDPhoto: null;
  guarantor2ID: null;
  guarantorForm: null;
  guarantorForm2: null;
  idType: string;
  guarantor1Name: string;
  guarantor1Email: string;
  guarantor1Phone: string;
  guarantor1Address: string;
  guarantor2Name: string;
  guarantor2Email: string;
  guarantor2Phone: string;
  guarantor2Address: string;
  assignedCustomers: any;

  roles: any;
  allCustomers?: string[];
}

export interface permissionObject {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface roleResponse {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  organisation: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
 
export interface staffResponse {
  photo: string | StaticImport ;
  guarantor1: {
    fullName: string;
    phoneNumber: string;
    email: string;
    homeAddress: string;
  };
  guarantor2: {
    fullName: string;
    phoneNumber: string;
    email: string;
    homeAddress: string;
  };
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  homeAddress: string;
  phoneNumber: string;
  userType: string;
  groupMember: string[];
  role: "staff";
  organisations: string[];
  kycVerified: boolean;
  kycEmailSent: boolean;
  isArchieve: boolean;
  isVerified: boolean;
  savingIdentities: string[];
  organisation: string;
  assignedUser: assignedUserdata[];
  roles: RolesData[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  guarantorForm2:string;
  guarantorForm: string;
  meansOfID: string;
  meansOfIDPhoto: any
  
}
interface assignedUserdata{
  _id: string; // or _id if that's what it should be
  firstName: string;
  lastName: string;
}
interface RolesData{
  name: string
}

export interface permissionsState {
  permissionsMap: { [key: string]: string };
  userPermissions: string[];
  permissionsLoading: boolean;
  assignedCustomers: AssignedUser[]
}

export interface PermissionsProviderProps {
  children: ReactNode;
}

export interface PermissionsMap {
  [key: string]: string;
}


export interface SavingsInterface {
  savings: savings[];
  currentSavingsBalance: number;
  totalAmountCollected: number;
  nextWithdrawalDate: string;
}

export interface PurposeProps {
  purposeName: string;
  description: string;
  category: string;
  uniqueCode: string;
  amount: number;
  startDate: string | number | readonly string[] | undefined;
  startTime: string;
  endDate: string | number | readonly string[] | undefined;
  endTime: string;
  promoCode: string;
  promoPercentage:  number;
  referralBonus: number;
  image: File | null;
  imageUrl: any;
  digitalItem: any;
  visibility: 'general' | 'inhouse';
  visibilityStartDate: string | number | readonly string[] | undefined;
  visibilityStartTime: string;
  visibilityEndDate: string | number | readonly string[] | undefined;
  visibilityEndTime: string;
  assignToCustomer: string;
  assignedCustomers: string[];

  organisation: string;
  referralBonusValue: string;
  SelectorAll: 'selectorAllMandatory' | 'selectorAllOptional',
  selectorCategory: 'selectorCategoryOptional' | 'selectorCategoryMandatory'
};

// interfaces/Coupon.ts
export interface ICouponProps {
  _id(_id: any): string;
 
  name: string;
  description: string;
  amount: number |string;
  applyToPurpose: 'all-purpose' | 'select-category' | 'select-individual';
  selectedCategories?: string[]; // Array of category IDs
  selectedIndividualPurpose?: string; // Purpose ID
  applyToCustomers: 'all-customers' | 'group-of-customers' | 'individual-customer';
  selectedCustomerGroup?: string; // Customer group ID
  selectedIndividualCustomer?: string; // Customer ID
  startTime: string;
  startDate: string; // ISO Date string
  endTime: string;
  endDate: string; // ISO Date string
  notifications: string[]; // Array of 'email', 'sms', 'whatsapp'
  organisation: string; // Organisation ID
  couponCode?: string;
}

export interface createGatewayProps{
  feeType: string,
    name: string,
    fixedFee: string,
    percentageFee: string
}

