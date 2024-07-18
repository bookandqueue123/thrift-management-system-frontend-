'use client'

import React, { useEffect, useState , Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios';
import { apiUrl, useAuth } from '@/api/hooks/useAuth'; // Adjust import as necessary
import { useMutation } from '@tanstack/react-query';

const ConfirmCoupon = () => {
    const {client} = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [processing, setProcessing] = useState(true);
    const [confirmationstatus, setConfirmationstatus] = useState('');

    useEffect(() => {
        if (token) {
            VerifyCoupon();
        }
    }, [token]);

    // const verifyPayment = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}api/coupon/confirm-email?token=${token}`);
    //         console.log(response)
    //         if (response.status === 200) {
    //             setConfirmationstatus('success');

    //             setTimeout(() => {
    //                 router.push('/merchant/purpose/coupon')
    //             }, 3000)
    //         } else {
    //             setConfirmationstatus('failure');
    //         }
    //     } catch (error) {
    //         console.error('Error verifying payment:', error);
    //         setConfirmationstatus('failure');
    //     } finally {
    //         setProcessing(false);
    //     }
    // };

    const{mutate: VerifyCoupon, isPending, isError} = useMutation({
        mutationKey: ["verify coupon"],
        mutationFn: async() => {
            return client.get(`/api/coupon/confirm-email?token=${token}`)
        },
        onSuccess(response){
            setConfirmationstatus('success');

            setTimeout(() => {
                router.push('/merchant/purpose/coupon')
            }, 3000)
        },
        onError(error){
            console.error('Error verifying payment:', error);
            setConfirmationstatus('failure');
        }
    })

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {processing ? (
                <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-gray-900"></div> // Tailwind CSS spinner
            ) : confirmationstatus === 'success' ? (
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
            <ConfirmCoupon/>
        </Suspense>
    )
}