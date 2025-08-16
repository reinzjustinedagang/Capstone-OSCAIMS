import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import { ArrowUp, History, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const LoginTrail = () => {
  const { userId } = useParams(); // assuming route like /admin/login-trail/:userId
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoginTrails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/audit-logs/${userId}`
      );
      setTrails(response.data);
    } catch (err) {
      console.error("Error fetching login trails:", err);
      setError("Failed to fetch login trails.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLoginTrails();
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <NavLink
            to="/admin/user-management"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowUp className="h-5 w-5 mr-2 -rotate-90" />
            Back to Users Management
          </NavLink>
        </div>
        <div className="text-sm text-gray-500">
          {trails.length} login records
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : trails.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No login trails
            </h3>
            <p className="text-gray-500">
              This user has no recorded login history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trails.map((trail) => (
                  <tr key={trail.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {formatDistanceToNow(new Date(trail.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trail.action || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trail.ipAddress || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginTrail;
