'use client'
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import Modal from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectSelectedProducts, selectToken, selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import { savingsFilteredById } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { daysBetweenDates, daysUntilDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useSelector } from "react-redux";

function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
}

function generateDateRange(startDate: Date, endDate: Date) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dates.push(formatDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export default function MakePayment() {
    const token = useSelector(selectToken)
   
    const selectedProducts = useSelector(selectSelectedProducts);
    const organisationId = useSelector(selectOrganizationId);
    const { client } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const user = useSelector(selectUser);
    const userId = useSelector(selectUserId);
  
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const { data: allGateways, isLoading: isLoadingAllGateways } = useQuery({
        queryKey: ["all gateways"],
        staleTime: 5000,
        queryFn: async () => {
            return client
                .get(`/api/payment-gateway`)
                .then((response) => {
                
                    return response.data;
                })
                .catch((error) => {
                    throw error;
                });
        },
    });
     

    const getTotal = () => {
        return Object.values(paymentDetails).reduce((acc: any, val: any) => acc + ( val.amount || 0), 0);
    };

    const { data: allPurpose } = useQuery({
        queryKey: ["allPurpose"],
        staleTime: 5000,
        queryFn: async () => {
            return client
                .get(`/api/purpose?organisation=${organisationId}`)
                .then((response) => response.data)
                .catch((error) => { throw error });
        },
    });
   

    
    const filteredPurposes = allPurpose?.filter((purpose: { _id: Key; }) =>
        selectedProducts.includes(purpose._id)
    );
  

   
    const handleInputChange = (id: string, field: string, value: any) => {
        const payment = filteredPurposes.find((p: { _id: string; }) => p._id === id);
        
        setPaymentDetails((prevDetails: any) => ({
            ...prevDetails,
            [id]: {
                ...prevDetails[id],
                savingsId: id,
                [field]: value,
                purposeName: payment?.purposeName,
                userFirstName: user?.firstName,
                userLastName: user?.lastName,
                
            }
        }));
    };

    const GoToPayment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
       
        if (Object.keys(paymentDetails).length === 0) {
            setShowModal(false);
            setErrors({ general: "No payment details provided." });
            return;
        }
    
        const newErrors: { [key: string]: string } = {};
    
        Object.keys(paymentDetails).forEach((key) => {
            const paymentDetail = paymentDetails[key];
            const selectedDates = generateDateRange(paymentDetail.startDate, paymentDetail.endDate);
            const payment = filteredPurposes.find((p: { _id: string; }) => p._id === key);

            if (!payment) {
                newErrors[key] = "Invalid payment ID.";
            } else if (!paymentDetail.amount || paymentDetail.amount <= 0) {
                newErrors[key] = "Amount must be provided and greater than 0.";
            }
    
            if (payment) {
                paymentDetails[key].selectedDates = selectedDates;
            }
        });
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    const decideCharge = (fixedFee: number, percentageFee: number) => {
        return Math.max(fixedFee, (percentageFee / 100) * Number(getTotal()));
    };

    const makeThePayment = async (fixedFee: number, percentageFee: number) => {
     
        // try {
        //     const amount = Number(getTotal()) + decideCharge(fixedFee, percentageFee);
        //     const email = user.email;
        //     const phoneNumber = user.phoneNumber;
        //     const customerName = user.firstName + user.lastName;

        //     const response = await axios.post(`${apiUrl}api/purpose/payment`,
        //         {purposeId: '66be32aa5d54b16031ee9c06',
        //         customerId: userId,
        //         paymentAmount: amount},
        //         { headers: { Authorization: `Bearer ${token}` } }
        //     );
        //     console.log(response)
        //     if (response.data.status === 'success') {
        //         // window.location.href = response.data.data.link;
        //     }
        // } catch (error) {
        //     console.error(error);
        // }

        try {
            const amount = Number(getTotal()) + decideCharge(fixedFee, percentageFee);
            const email = user.email;
            const phoneNumber = user.phoneNumber;
            const customerName = user.firstName + user.lastName;
            const redirectURL = 'customer/savings-purpose/make-payment/payment-callback'
            const response = await axios.post(`${apiUrl}api/pay/flw`,
            
                { amount, redirectURL, email, paymentDetails: Object.values(paymentDetails), userId, organisationId, phoneNumber, customerName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'success') {
                window.location.href = response.data.data.link;
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
          {showModal && (
            <Modal
            title="Choose Payment Gateway"
            setModalState={setShowModal}
       >
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-center">
                <h1 className="text-4xl font-bold mb-8 text-white">Make Payment</h1>
                {allGateways?.map((gateway: { _id: Key | null | undefined; fixedFee: number; percentageFee: number; }) => (
                    <button 
                    key={gateway._id}
                    onClick={() => makeThePayment(gateway.fixedFee, gateway.percentageFee)}
                    className="w-full mb-4 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
                    Flutterwave
                </button>
                ))}
                
                
                </div>
            </div>
       </Modal>
          )}
           
            <div className="mb-4 space-y-2">
                <div className="mt-8">
                    <TransactionsTable
                        headers={[
                            "S/N", "Item/Purpose", "Amount", "Quantity", "Total", "Amount to be Paid", "Balance",
                            "Total Payment Duration", "Days Left", "Payment Completion %"
                        ]}
                        content={(
                            <>
                                {filteredPurposes && filteredPurposes.map((purpose: {
                                    total: number;
                                    quantity: number;
                                    balance: any; purposeName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; amount: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; _id: string; endDate: string | number | Date; startDate: string | number | Date; 
                                    }, index: number) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">{index + 1}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">{purpose.purposeName}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">{(AmountFormatter(Number(purpose.amount)))}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <input
                                            type="number"
                                            onChange={(e) => handleInputChange(purpose._id, 'quantity', parseFloat(e.target.value) || 0)}
                                            className="bg-gray-50 border text-gray-900 text-sm rounded-lg p-1.5"
                                            min={1}
                                            value={paymentDetails[purpose._id]?.quantity || purpose.quantity || ""}  // Ensure value is properly set
                                            readOnly={purpose.quantity !== 0}  // Make the input read-only if quantity is not 0
                                        />

                                    </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {purpose.total === 0 || !purpose.total ? AmountFormatter(parseFloat((Number(purpose.amount) * (paymentDetails[purpose._id]?.quantity || 1)).toFixed(2))) : AmountFormatter(purpose.total)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <input
                                                
                                                type="number"
                                                onChange={(e) => handleInputChange(purpose._id, 'amount', parseFloat(e.target.value) || 0)}
                                                className="bg-gray-50 border text-gray-900 text-sm rounded-lg p-1.5"
                                                min={1}
                                            />
                                            <br/>
                                            {errors[purpose._id] && <span className="text-red-500">{errors[purpose._id]}</span>}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">{AmountFormatter(purpose.balance?.toFixed(2))}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {!purpose.endDate ? "Nill" : daysBetweenDates(purpose.startDate, purpose.endDate)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {!purpose.endDate ? "Nill" : daysUntilDate(purpose.endDate)} 
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">Nill</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4}></td>
                                    <td>
                                        <p className="font-bold text-white pt-2">Selected Amount to be Paid</p>
                                    </td>
                                    <td>
                                        <form>
                                            <div className="flex border">
                                                <input
                                                    type="number"
                                                    className="bg-ajo_darkBlue text-white p-2.5 w-full text-sm"
                                                    value={String(getTotal()) || 0}
                                                    readOnly
                                                />
                                                <button
                                                    onClick={GoToPayment}
                                                    type="submit"
                                                    className="font-bold bg-green-400 hover:bg-ajo_orange text-ajo_darkBlue py-1 px-3">
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
