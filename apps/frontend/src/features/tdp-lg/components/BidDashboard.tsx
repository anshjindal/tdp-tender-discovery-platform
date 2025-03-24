import React from "react";

interface BidDashboardProps {
  bidCounts: {
    Pending: number;
    "Under Review": number;
    Accepted: number;
    Rejected: number;
    Awarded: number;
  };
}

const BidDashboard: React.FC<BidDashboardProps> = ({ bidCounts }) => {
  const totalBids =
    bidCounts.Pending +
    bidCounts["Under Review"] +
    bidCounts.Accepted +
    bidCounts.Rejected +
    bidCounts.Awarded;

  const getPercentage = (count: number) =>
    totalBids > 0 ? ((count / totalBids) * 100).toFixed(1) : "0";

  const statusColors: Record<string, string> = {
    Total: "bg-gray-200",
    Pending: "bg-yellow-100",
    "Under Review": "bg-blue-100",
    Accepted: "bg-green-100",
    Rejected: "bg-red-100",
    Awarded: "bg-purple-100",
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">My Bids</h1>
      <div className="grid grid-cols-6 gap-4 mb-6">
        {/* Total Section */}
        <div className={`p-4 rounded-lg text-center shadow ${statusColors["Total"]}`}>
          <p className="text-lg font-semibold">Total</p>
          <p className="text-3xl font-bold">{totalBids}</p>
          <p className="text-sm text-gray-600">100%</p>
        </div>

        {/* Dynamic Status Sections */}
        {Object.entries(bidCounts).map(([status, count]) => (
          <div
            key={status}
            className={`p-4 rounded-lg text-center shadow ${statusColors[status]}`}
          >
            <p className="text-lg font-semibold">{status}</p>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm text-gray-600">{getPercentage(count)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidDashboard;
