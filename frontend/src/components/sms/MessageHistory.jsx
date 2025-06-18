import React from "react";

const MessageHistory = () => {
  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Date & Time",
                "Message",
                "Recipients",
                "Status",
                "Sent By",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-500">
                2023-06-16 09:15 AM
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                Monthly pension is now available for claiming at the municipal
                hall...
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">45 recipients</td>
              <td className="px-6 py-4">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Delivered
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">Admin User</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessageHistory;
