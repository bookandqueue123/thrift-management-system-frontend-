"use client";

import React, { useState, FormEvent } from "react";

export default function GenerateBill() {
  const [idType, setIdType] = useState<"id" | "phone" | "name" | "email">("id");
  const [identifier, setIdentifier] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sendEmail, setSendEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ idType, identifier, startDate, endDate, sendEmail });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800/30 border border-gray-700/50 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-white">Generate Bill</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identifier */}
        <div>
          <label className="block font-medium text-gray-300 mb-1">
            Identify Customer By
          </label>
          <div className="flex gap-2">
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value as any)}
              className="flex-shrink-0 w-28 border border-gray-600 rounded p-2 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
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
              className="flex-grow border border-gray-600 rounded p-2 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block font-medium text-gray-300 mb-1">
            Statement Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-600 rounded p-2 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <span className="self-center text-gray-300">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-600 rounded p-2 bg-gray-800 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Send To Email */}
        <div>
          <label className="block font-medium text-gray-300 mb-1">
            Send To Email Address
          </label>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            className="w-full border border-gray-600 rounded p-2 bg-gray-800 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-500 transition-colors"
          >
            Generate &amp; Send
          </button>
        </div>
      </form>
    </div>
  );
}
