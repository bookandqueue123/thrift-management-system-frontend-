import React from 'react';

interface DeliveryProps {
  deliveryOption: "door" | "pickup";
  setDeliveryOption: (option: "door" | "pickup") => void;
  total: number;
}

const Delivery: React.FC<DeliveryProps> = ({ deliveryOption, setDeliveryOption, total }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Delivery Details
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Choose your Location
          </label>
          <select
            id="location"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option>Lagos, Nigeria</option>
            <option>Abuja, Nigeria</option>
            <option>Port Harcourt, Nigeria</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Area
          </label>
          <select
            id="area"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option>Ikeja</option>
            <option>Lekki</option>
            <option>Victoria Island</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Input Address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Choose Your Preferred Mode of Delivery
          </p>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="delivery"
                  value="door"
                  checked={deliveryOption === "door"}
                  onChange={() => setDeliveryOption("door")}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Door Delivery
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                ₦0.00
              </span>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Pick Up
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                ₦21.00
              </span>
            </label>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">
              Total
            </span>
            <span className="text-2xl font-extrabold text-gray-800">
              ₦{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
