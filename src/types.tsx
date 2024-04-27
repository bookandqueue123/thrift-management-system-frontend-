export type customer = {
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

// export type postSavingsResponse = {
//   paymentMode: "cash" | "online";
//   message: string;
//   narrative: string;
//   purposeName: string;
//   amount: 50000;
//   startDate: string;
//   endDate: string;
//   frequency: "daily";
//   paidDays: [
//     {
//       datesPaid: string[];
//       amount: 50000;
//       dayOfpayment: string;
//       _id: string;
//     },
//   ];
//   user: string;
//   isPaid: "unpaid" | "paid";
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: 0;
//   savedDates: [];
//   specificDates: string[];
//   id: string;
//   status: "failed" | "success" | undefined;
// };

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
  isVerified: boolean;
  _id: string;
  email: string;
  phoneNumber: string;
  organisationName: string;
  password: string;
  userType: string;
  groupMember: any[];
  role: string;
  prefferedUrl: string;
  kycVerified: boolean;
  isArchieve: boolean;
  savingIdentities: any[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface User {
  isVerified: boolean;
  _id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  password: string;
  accountNumber: string;
  userType: string;
  groupMember: any[];
  role: string;
  kycVerified: boolean;
  isArchieve: boolean;
  savingIdentities: string[];
  organisation: string;
  organisationName: string;
  createdAt: Date;
  updatedAt: Date;
  totalCustomer: number;
  pendingPayout: number;
  __v: number;
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
  address2: string,
  BankRecommendation: null;
  CourtAffidavit: null;
  CommunityRecommendation: null;
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
  createdAt:        Date;
  updatedAt:        Date;
  __v:              number;
}
export interface setUpSavingsProps {
  accountType: string,
    percentageBased: string,
    amountBased: string,
    accountNumber: string,
    accountName: string,
    purpose: string,
    amount: string,
    frequency: string,
    startDate: string,
    endDate: string,
    totalexpectedSavings: string,
    collectionDate: string,
    userId: string
    savingID?: string
}


export interface createRoleProps {
    roleName: string,
    description: string,
    postPermissions: {
      viewMyPostReports: boolean,
      viewAllPostReports: boolean,
      postPayment: boolean,
      debit: boolean,
      export: boolean,
    },
    withdrawalPermissions: {
      viewWithdrawals: boolean,
      export: boolean,
    },
    customerPermissions: {
      viewCustomerDetails: boolean,
      viewAssignedCustomers: boolean,
      editAssignedCustomers: boolean,
      viewAllCustomers: boolean,
    },
  };