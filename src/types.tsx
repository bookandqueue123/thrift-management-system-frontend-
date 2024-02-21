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
    purposeName: string,
    amount: 50000,
    startDate: string,
    endDate: string,
    frequency: 'daily',
    paidDays: [
      {
        datesPaid: string[],
        amount: 50000,
        dayOfpayment: string,
        _id: string
      }
    ],
    user: string,
    isPaid: 'unpaid' | 'paid',
    _id: string,
    createdAt: string,
    updatedAt: string,
    __v: 0,
    savedDates: [],
    specificDates: string[],
    id: string,

};

