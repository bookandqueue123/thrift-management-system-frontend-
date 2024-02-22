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

export type postSavingsResponse = {
  paymentMode: "cash" | "online";
  narrative: string;
  purposeName: string;
  amount: 50000;
  startDate: string;
  endDate: string;
  frequency: "daily";
  paidDays: [
    {
      datesPaid: string[];
      amount: 50000;
      dayOfpayment: string;
      _id: string;
    },
  ];
  user: string;
  isPaid: "unpaid" | "paid";
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
  savedDates: [];
  specificDates: string[];
  id: string;
};

export type allSavingsResponse = {
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
