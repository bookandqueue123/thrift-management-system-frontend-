import React from "react";

const TransactionsTable = ({
  headers,
  content,
  belowText
}: {
  headers: string[];
  content: React.ReactNode;
  belowText?: React.ReactNode
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full table-auto divide-y divide-gray-200  text-ajo_offWhite">
        <thead className="text-xs font-bold tracking-wider text-ajo_offWhite text-opacity-60">
          <tr className="text-left">
            {headers.map((header: string) => (
              <th className="px-6 py-3 whitespace-nowrap" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody >
          {content}
        </tbody>

       
      </table> 
            {belowText}
    </div>
  );
};

export default TransactionsTable;
