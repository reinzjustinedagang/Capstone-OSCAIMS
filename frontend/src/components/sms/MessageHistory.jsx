import React, { useEffect, useState } from "react";
import axios from "axios";

const MessageHistory = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Number of records per page
  const [totalCount, setTotalCount] = useState(0);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/sms/history?page=${page}&limit=${limit}`
        );
        setLogs(res.data.logs);
        setTotalCount(res.data.total); // total records count
      } catch (err) {
        console.error("Error loading message history", err);
      }
    };

    fetchLogs();
  }, [page, limit]);

  const totalPages = Math.ceil(totalCount / limit);

  const renderPageButtons = () => {
    const visiblePages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // If total pages are less than or equal to maxVisible, show all
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always show the first page
      visiblePages.push(1);

      if (page > 3) {
        visiblePages.push("ellipsis-prev");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        visiblePages.push(i);
      }

      if (page < totalPages - 2) {
        visiblePages.push("ellipsis-next");
      }

      // Always show the last page if not already included
      if (totalPages !== 1) {
        visiblePages.push(totalPages);
      }
    }

    return visiblePages.map((p, index) => {
      if (p === "ellipsis-prev" || p === "ellipsis-next") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-2 py-2 text-gray-500 text-sm select-none"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            page === p
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Date & Time", "Message", "Recipients", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.message}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {JSON.parse(log.recipients).length} recipients
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>

          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {renderPageButtons()}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MessageHistory;
