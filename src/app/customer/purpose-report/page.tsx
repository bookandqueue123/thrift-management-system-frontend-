'use client'
import { apiUrl, useAuth } from "@/api/hooks/useAuth";
import Modal from "@/components/Modal";
import TransactionsTable from "@/components/Tables";
import { selectOrganizationId, selectSelectedProducts, selectToken, selectUser, selectUserId } from "@/slices/OrganizationIdSlice";
import { savingsFilteredById } from "@/types";
import AmountFormatter from "@/utils/AmountFormatter";
import { daysBetweenDates, daysUntilDate, extractDate, extractTime } from "@/utils/TimeStampFormatter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useSelector } from "react-redux";



export default function PurposeReport() {
   
    const {client} = useAuth()
    const organisationId = useSelector(selectOrganizationId)

    const { data: allPurpose } = useQuery({
        queryKey: ["allPurpose"],
        staleTime: 5000,
        queryFn: async () => {
            return client
                .get(`/api/purpose/payment/item`)
                .then((response) => response.data)
                .catch((error) => { throw error });
        },
    });
   
    console.log(allPurpose)

   
  


    
    
    return (
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
          
           
            <div className="mb-4 space-y-2">
                <div className="mt-8">
                    <TransactionsTable
                        headers={[
                            "S/N", "Item/Purpose", "Category", "Amount", "Quantity", "Total", "Balance",
                            "Total Payment Duration", "Days Left", "Payment Completion %", "Transaction reference", "Time and date of transaction",
                            "Payment gateway", "Payment status"
                        ]}
                        content={(
                            <>
                                {allPurpose && allPurpose.map((payment: { name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; amount: number; quantity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; total: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; balance: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; TotalPaymentDuration: any; DaysLeft: any; paymentCompletionPercentage: any; transactionReference: any; timeAndDate: string | Date; PaymentGateway: any; }, index: number) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            {index + 1}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm ">{payment.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.category}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm ">{AmountFormatter(payment.amount)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.quantity}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.total}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.balance}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.TotalPaymentDuration || "NULL"}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.DaysLeft || "NULL"} {payment.DaysLeft ? 'days left' : ''}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.paymentCompletionPercentage || "NULL"} </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.transactionReference || "NULL"} </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{extractDate(payment.timeAndDate )} {extractTime( payment.timeAndDate) || "NULL"} </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">{payment.PaymentGateway || "NULL"} </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-capitalize">Success </td>
                                    </tr>
                                )) }
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
