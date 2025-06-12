"use client";

import React from 'react'
import OrderConfirmation from '@/modules/form/OrderConfirmation'

const page = () => {
     const handleClose = () => {
    
    console.log('Order confirmation closed')
  }
  return (
    <div>
        <OrderConfirmation
          onClose={handleClose}
        />
    </div>
  )
}

export default page