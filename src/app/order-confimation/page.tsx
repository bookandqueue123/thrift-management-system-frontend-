"use client";

import React from 'react'
import OrderConfirmation from '@/modules/form/OrderConfirmation'

const page = () => {
  return (
    <div>
        <OrderConfirmation
          paymentMode="full"
        />
    </div>
  )
}

export default page