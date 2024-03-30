export type customer = {
  _id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  accountNumber: number;
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
  meansOfIDPhoto: File;
  meansOfID: "NIN" | "Passport";
  photo: File;
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
  message:       string;
  updatedSaving: UpdatedSaving;
}

export interface UpdatedSaving {
  postedBy: any;
  amountPaid: string;
  saving: any;
  paymentMode: string;
  _id:              string;
  purposeName:      string;
  amount:           number;
  startDate:        Date;
  endDate:          Date;
  frequency:        string;
  user:             string;
  organisation:     string;
  isPaid:           string;
  paidDays:         PaidDay[];
  createdAt:        Date;
  updatedAt:        Date;
  __v:              number;
  totalAmountSaved: number;
  savedDates:       Date[];
  specificDates:    Date[];
  adminFee:         number;
  totalBalance:     number;
  id:               string;
}

export interface PaidDay {
  dayOfCollection: Date;
  datesPaid:       Date[];
  amount:          number;
  dayOfpayment?:   Date;
  paymentMode:     string;
  status:          string;
  reference:       string;
  _id:             string;
  narration?:      string;
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
}
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
  phoneNumber:      string;
  email:            string;
  password:         string;
  prefferedUrl:     string;
  role:             string;
  confirmPassword: string
}

export interface signInProps{
  email: string,
  userCategory: string,
  password: string,
  rememberPassword: boolean,
}
export interface CustomerSignUpProps {
  firstName:    string;
  lastName:     string;
  otherName:    string;
  phoneNumber:  string;
  email:        string;
  password:     string;
  // role:         string;
   organization: string;
  confirmPassword: string
}

export interface getOrganizationProps {
  userType:         string;
  groupMember:      any[];
  isArchieve:       boolean;
  savingIdentities: any[];
  _id:              string;
  email:            string;
  phoneNumber:      string;
  organisationName: string;
  accountNumber:    string;
  role:             string;
  prefferedUrl:     string;
  kycVerified:      boolean;
  createdAt:        Date;
  updatedAt:        Date;
  __v:              number;
}

export interface UpdateKycProps {
  country:         string;
  state:           string;
  lga:             string;
  city:            string;
  popularMarket:   string;
  nok:             string;
  nokRelationship: string;
  nokPhone:        string;
  homeAddress:     string;
  userType:        string;
  photo:           null;
  meansOfID:       string;
  meansOfIDPhoto:  null;
  nin:             string;
  bvn:             string;
  organisation:    string;
  bankAcctNo: string
}

export interface WithdrawalProps {
  paymentEvidence: string;
  evidence: string;
  _id:                 string;
  saving:              string;
  user:                User;
  amount:              number;
  status:              string;
  paymentConfirmation: string;
  organisation:        Organisation;
  withdrawalRequest:   string;
  createdAt:           Date;
  updatedAt:           Date;
  __v:                 number;
}

export interface Organisation {
  isVerified:       boolean;
  _id:              string;
  email:            string;
  phoneNumber:      string;
  organisationName: string;
  password:         string;
  userType:         string;
  groupMember:      any[];
  role:             string;
  prefferedUrl:     string;
  kycVerified:      boolean;
  isArchieve:       boolean;
  savingIdentities: any[];
  createdAt:        Date;
  updatedAt:        Date;
  __v:              number;
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
  __v: number;
} 

export interface CountryAndStateProps {
  country: string;
  states:  StateProps[];
}

export interface StateProps {
  name: string;
  lgas: string[];
}