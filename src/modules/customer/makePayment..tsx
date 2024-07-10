import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import { savingsFilteredById } from "@/types";
import { extractDate } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
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
    const organisationId = useSelector(selectOrganizationId);
    const { client } = useAuth();
    const user = useSelector(selectUser);
    const userId = useSelector(selectUserId);

    const [filteredArray, setFilteredArray] = useState<savingsFilteredById[]>([]);
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (id: string, field: string, value: any) => {
        const payment = filteredArray.find(p => p.id === id);
        setPaymentDetails((prevDetails: any) => ({
            ...prevDetails,
            [id]: {
                ...prevDetails[id],
                savingsId: id,
                [field]: value,
                purposeName: payment?.purposeName,
                userFirstName: payment?.user?.firstName,
                userLastName: payment?.user?.lastName,
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

    const GoToPayment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};

        // Validate payment details
        Object.keys(paymentDetails).forEach((key) => {
            const paymentDetail = paymentDetails[key];
            const selectedDates = generateDateRange(paymentDetail.startDate, paymentDetail.endDate);
            const payment = filteredArray.find(p => p.id === key);

            if (!paymentDetail.startDate || !paymentDetail.endDate) {
                newErrors[key] = "Start and end dates must be selected.";
            } else if (!payment) {
                newErrors[key] = "Invalid payment ID.";
            } else if (new Date(paymentDetail.startDate) < new Date(payment.startDate) ||
                new Date(paymentDetail.endDate) > new Date(payment.endDate)) {
                newErrors[key] = "Selected dates must be within the allowed range.";
            } else if (!paymentDetail.amount || paymentDetail.amount <= 0) {
                newErrors[key] = "Amount must be provided and greater than 0.";
            }

            if (payment) {
                paymentDetails[key].selectedDates = selectedDates;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        console.log(paymentDetails)

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
                                        <span className="text-xs font-sm">{extractDate(payment.startDate)} <br /></span>

                                        <input
                                            className="p-1 rounded-md text-black"
                                            type="date"
                                            onChange={(e) => handleInputChange(payment.id, 'startDate', e.target.value)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className="text-xs font-sm">{extractDate(payment.endDate)} <br /></span>
                                        <input
                                            className="p-1 rounded-md text-black"
                                            type="date"
                                            onChange={(e) => handleInputChange(payment.id, 'endDate', e.target.value)}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <form className="max-w-sm mx-auto mt-5">

                                            <input
                                                type="number"
                                                id={`number-input-${index}`}
                                                aria-describedby="helper-text-explanation"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="90210"
                                                required
                                                onChange={(e) => handleInputChange(payment.id, 'amount', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors[payment.id] && <span className="text-red-500">{errors[payment.id]}</span>}
                                        </form>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        {(payment.totalexpectedSavings === undefined ? 0 : payment.totalexpectedSavings) - (payment.totalAmountSaved === undefined ? 0 : payment.totalAmountSaved)}
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
                {Object.keys(errors).map((key) => (
                    <div key={key} className="text-red-500">
                        {errors[key]}
                    </div>
                ))}
            </div>
        </div>
    );
}
