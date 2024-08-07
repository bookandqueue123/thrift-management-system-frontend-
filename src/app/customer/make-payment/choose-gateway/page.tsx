const Payment = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Make Payment</h1>
          <button className="w-full mb-4 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
            Payment Gateway 1
          </button>
          <button className="w-full py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
            Payment Gateway 2
          </button>
        </div>
      </div>
    );
  };
  
  export default Payment;