import React from "react";
import {
  UsersIcon,
  MessageSquareIcon,
  BellIcon,
  UserPlusIcon,
  HouseIcon,
} from "lucide-react";
import Card from "../UI/Card";
const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Senior Citizens"
          value="1,245"
          icon={<UsersIcon />}
          color="blue"
        />
        <Card
          title="No. of Barangay"
          value="28"
          icon={<HouseIcon />}
          color="green"
        />
        <Card
          title="SMS Sent (This Month)"
          value="156"
          icon={<MessageSquareIcon />}
          color="indigo"
        />
        <Card
          title="Pending Notifications"
          value="12"
          icon={<BellIcon />}
          color="amber"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Date Registered
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm">Maria Santos</td>
                  <td className="px-4 py-3 text-sm">67</td>
                  <td className="px-4 py-3 text-sm">Brgy. Poblacion</td>
                  <td className="px-4 py-3 text-sm">June 15, 2023</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm">Pedro Reyes</td>
                  <td className="px-4 py-3 text-sm">72</td>
                  <td className="px-4 py-3 text-sm">Brgy. Labangan</td>
                  <td className="px-4 py-3 text-sm">June 14, 2023</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm">Juan Dela Cruz</td>
                  <td className="px-4 py-3 text-sm">65</td>
                  <td className="px-4 py-3 text-sm">Brgy. San Roque</td>
                  <td className="px-4 py-3 text-sm">June 12, 2023</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Elena Magtanggol</td>
                  <td className="px-4 py-3 text-sm">70</td>
                  <td className="px-4 py-3 text-sm">Brgy. Pag-asa</td>
                  <td className="px-4 py-3 text-sm">June 10, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent SMS Activities</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm font-medium">
                Monthly Pension Notification
              </p>
              <p className="text-xs text-gray-500">
                Sent to 45 recipients • June 16, 2023
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm font-medium">Health Checkup Reminder</p>
              <p className="text-xs text-gray-500">
                Sent to 78 recipients • June 14, 2023
              </p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm font-medium">
                Community Meeting Invitation
              </p>
              <p className="text-xs text-gray-500">
                Sent to 120 recipients • June 10, 2023
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">
                Medicine Distribution Notice
              </p>
              <p className="text-xs text-gray-500">
                Sent to 56 recipients • June 5, 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
