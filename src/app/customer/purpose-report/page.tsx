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



export default function PurposeReport() {
   
    const {client} = useAuth()
    const organisationId = useSelector(selectOrganizationId)

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
   

   
  


    
    
    return (
        <div className="container mx-auto max-w-7xl px-4 py-2  md:px-6 md:py-8 lg:px-8">
          
           
            <div className="mb-4 space-y-2">
                <div className="mt-8">
                    <TransactionsTable
                        headers={[
                            "S/N", "Item/Purpose", "Amount", "Quantity", "Total", "Amount to be Paid", "Balance",
                            "Total Payment Duration", "Days Left", "Payment Completion %"
                        ]}
                        content={(
                            <>
                                
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
