'use client'
import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { apiUrl } from '@/api/hooks/useAuth';

const PaymentCallback = () => {
    const searchParams = useSearchParams()
 
    const transaction_id = searchParams.get('transaction_id')
    

    useEffect(() => {
        if (transaction_id) {
            verifyPayment();
        }
    }, [transaction_id]);

    const verifyPayment = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/pay/flw/verify-payment?transaction_id=${transaction_id}`);
            if (response.data.status === 'success') {
                console.log('Payment successful:', response.data);
            } else {
                console.error('Payment failed:', response.data);
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        }
    };

    return <div>Processing payment...</div>;
};

export default PaymentCallback;
