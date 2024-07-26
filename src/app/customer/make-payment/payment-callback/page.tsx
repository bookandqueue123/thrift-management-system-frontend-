'use client'

import React, { useEffect, useState , Suspense} from 'react';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { apiUrl } from '@/api/hooks/useAuth'; // Adjust import as necessary

const PaymentCallback = () => {
    const searchParams = useSearchParams();
    const transaction_id = searchParams.get('transaction_id');
    const [processing, setProcessing] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('');

    useEffect(() => {
        if (transaction_id) {
            verifyPayment();
        }
    }, [transaction_id]);

    const verifyPayment = async () => {
        try {
            const response = await axios.get(`${apiUrl}api/pay/flw/verify-payment?transaction_id=${transaction_id}`);
            console.log(response)
            if (response.status === 200) {
                setPaymentStatus('success');
            } else {
                setPaymentStatus('failure');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setPaymentStatus('failure');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {processing ? (
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900"></div> // Tailwind CSS spinner
            ) : paymentStatus === 'success' ? (
                <h1 className="text-4xl text-white font-bold">Payment Successful!</h1>
            ) : (
                <h1 className="text-4xl text-red-600 font-bold">Payment Failed. Please try again.</h1>
            )}
        </div>
    );
};





export default function CallbackPayment(){
    return(
        <Suspense>
            <PaymentCallback/>
        </Suspense>
    )
}