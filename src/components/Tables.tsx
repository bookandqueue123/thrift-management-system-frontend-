import React from "react";

const TransactionsTable = ({
  headers,
  content,
  belowText
}: {
  headers: string[] | React.ReactNode[];
  content: React.ReactNode;
  belowText?: React.ReactNode
}) => {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-600">
      <table className="w-full text-sm text-left text-white border border-gray-600 rounded-md overflow-hidden">
        <thead className="bg-[#221c3e] text-gray-300 text-sm">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 border-b border-gray-600 font-semibold text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#1b1634] text-white">
          {React.Children.map(content, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                className: `${child.props.className || ''} border-b border-gray-600`.trim()
              });
            }
            return child;
          })}
        </tbody>
      </table>
      {belowText}
    </div>
  );
};

export default TransactionsTable;
