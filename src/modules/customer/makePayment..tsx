import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import { savingsFilteredById } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const data = [
    {
      "S/N": 1,
      "Item/Purpose": "Rent",
      "Debit Amount": 1000,
      "Payment Start": "2024-01-01",
      "Payment End": "2024-12-31",
      "Credit Amount": 0,
      "Balance": -1000,
      "Duration": "1 year"
    },
    {
      "S/N": 2,
      "Item/Purpose": "Electricity Bill",
      "Debit Amount": 50,
      "Payment Start": "2024-04-01",
      "Payment End": "2024-04-30",
      "Credit Amount": 0,
      "Balance": -50,
      "Duration": "1 month"
    },
    {
      "S/N": 3,
      "Item/Purpose": "Groceries",
      "Debit Amount": 200,
      "Payment Start": "2024-04-15",
      "Payment End": "2024-04-30",
      "Credit Amount": 0,
      "Balance": -200,
      "Duration": "15 days"
    },
    // Add more data entries as needed
  ];

export default function MakePayment() {
    const organisationId = useSelector(selectOrganizationId);
    const { client } = useAuth();
    const user = useSelector(selectUser);
    const userId = useSelector(selectUserId);

    const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
    const [paymentDetails, setPaymentDetails] = useState<any>({});

    const handleInputChange = (id: string, field: string, value: any) => {
        setPaymentDetails((prevDetails: any) => ({
            ...prevDetails,
            [id]: {
                ...prevDetails[id],
                savingsId: id,
                [field]: value
            }
        }));
    };

    const getTotal = () => {
        return Object.values(paymentDetails).reduce((acc: any, val: any) => acc + (val.amount || 0), 0);
    };

    const { data: allSavings, isLoading: isLoadingAllSavings } = useQuery({
        queryKey: ["allSavings"],
        staleTime: 5000,
        queryFn: async () => {
            return client
                .get(`/api/saving/get-savings?organisation=${organisationId}`)
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    throw error;
                });
        },
    });

    useEffect(() => {
        if (allSavings?.savings) {
            const filtered = allSavings.savings.filter(
                (item: { user: { _id: any; }; }) => item.user?._id === userId,
            );

            setFilteredArray(filtered);
        }
    }, [allSavings?.savings, userId]);
    console.log(filteredArray);

    const GoToPayment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log(Object.values(paymentDetails));

        try {
            const amount = getTotal();
            const email = user.email;
            const phoneNumber = user.phoneNumber;
            const customerName = user.firstName + user.lastName;

            const response = await axios.post(`${apiUrl}api/pay/flw`, 
            { amount, email, paymentDetails: Object.values(paymentDetails), userId, organisationId, phoneNumber, customerName, });
            if (response.data.status === 'success') {
                window.location.href = response.data.data.link;
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
            <div className="mb-4 space-y-2">
                <h6 className="text-base font-bold text-ajo_offWhite opacity-60">
                    Dashboard
                </h6>

                <div>
                    <div className="flex items-center mt-16 mb-16">
                        <p className="font-lg mr-2 text-white">Select range from:</p>
                        <input
                            type="date"
                            className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        <p className="mx-2 text-white">to</p>
                        <input
                            type="date"
                            className="w-48 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <TransactionsTable
                        headers={[
                            "",
                            "S/N",
                            "Item/Purpose",
                            "Debit Amount",
                            "Payment Start",
                            "Payment End",
                            "Credit Amount",
                            "Balance",
                            "Total Payment Duration"
                        ]}
                        content={<>
                            {filteredArray.map((payment, index) => (
                                <tr className="" key={index}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {payment.purposeName}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {payment.amount}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                      <span className="text-xs font-sm">{extractDate(payment.startDate)} <br/></span>
                                      
                                        <input 
                                        className="p-1 rounded-md text-black"
                                    
                                            type="date"
                                            onChange={(e) => handleInputChange(payment.id, 'startDate', e.target.value)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                    <span className="text-xs font-sm">{extractDate(payment.endDate)} <br/></span>
                                        <input 
                                            className="p-1 rounded-md text-black"
                                            type="date"
                                            onChange={(e) => handleInputChange(payment.id, 'endDate', e.target.value)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <form className="max-w-sm mx-auto">
                                            <input
                                                type="number"
                                                id={`number-input-${index}`}
                                                aria-describedby="helper-text-explanation"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="90210"
                                                required
                                                onChange={(e) => handleInputChange(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                                            />
                                        </form>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {(payment.totalexpectedSavings === undefined ? 0 : payment.totalexpectedSavings)-(payment.totalAmountSaved === undefined ? 0 : payment.totalAmountSaved) }
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {payment.specificDates.length} days
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <p className="font-bold text-white pt-2">Selected Amount to be Paid</p>
                                </td>
                                <td>
                                    <form className="ml-[10%]">
                                        <div className="flex border">
                                            <input 
                                                type="number" 
                                                id="search-dropdown" 
                                                className="bg-ajo_darkBlue text-white block p-2.5  w-full z-20 text-sm  border border-gray-300"
                                                placeholder="Total" 
                                                required
                                                value={String(getTotal()) || 0}
                                                readOnly
                                            />
                                            <button
                                                onClick={GoToPayment}
                                                type="submit" 
                                                className="w-full bg-green-400 text-white"
                                            >
                                                Make Payment
                                            </button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </>}
                    />
                </div>
            </div>
        </div>
    );
}
