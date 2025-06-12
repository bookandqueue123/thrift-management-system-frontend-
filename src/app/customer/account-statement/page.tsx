"use client";

import React, { useState, FormEvent } from "react";

export default function AccountStatement() {
  const [idType, setIdType] = useState<"id"|"phone"|"name"|"email">("id");
  const [identifier, setIdentifier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sendEmail, setSendEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire up your API call to generate & send the statement
    console.log({ idType, identifier, startDate, endDate, sendEmail });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-2 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Account Statement</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identifier */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Identify Customer By
          </label>
          <div className="flex gap-2">
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value as any)}
              className="flex-shrink-0 border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="id">ID</option>
              <option value="phone">Phone</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${idType}`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="flex-grow border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Statement Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span className="self-center text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Send To Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Send To Email Address
          </label>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-[#221c3e] text-white font-medium rounded hover:bg-blue-500 transition"
          >
            Generate & Send
          </button>
        </div>
      </form>
    </div>
  );
}
