import React from "react";
import { Link } from 'react-router-dom'

interface Tender {
  subId: string
  title: string;
  submittedAt: string;
  status: string;
  updatedAt: string;
}

interface TenderListProps {
  tenders: Tender[];
  onSort: (field: string) => void;
  sortField: string | null;
  sortOrder: "asc" | "desc" | null;
  currentPage: number;
  rowsPerPage: number;
}

const TenderList: React.FC<TenderListProps> = ({
  tenders,
  onSort,
  sortField,
  sortOrder,
  currentPage,
  rowsPerPage
}) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const visibleTenders = tenders.slice(startIndex, endIndex);

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="p-2 cursor-pointer" onClick={() => onSort("title")}>
            Tender Title {sortField === "title" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="p-2 cursor-pointer" onClick={() => onSort("submittedAt")}>
            Submission Date {sortField === "submitted_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="p-2 cursor-pointer" onClick={() => onSort("status")}>
            Status {sortField === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="p-2 cursor-pointer" onClick={() => onSort("submittedAt")}>
            Last Updated {sortField === "updated_at" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
          </th>
          <th className="p-2">More Info</th>
        </tr>
      </thead>
      <tbody>
        {visibleTenders.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-4 text-center text-gray-500">
              No tenders found.
            </td>
          </tr>
        ) : (
          visibleTenders.map((tender, index) => (
            <tr key={tender.subId} className="border-t border-gray-300 text-center">
              <td className="p-2">{tender.title}</td>
              <td className="p-2">{tender.submittedAt || "N/A"}</td>
              <td className="p-2">{tender.status}</td>
              <td className="p-2">{tender.submittedAt || "N/A"}</td>
              <td className="p-2">
              <Link to={`/tender/${tender.subId}`} className="text-blue-500 hover:underline">
                More Info
              </Link>
            </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

TenderList.defaultProps = {
  tenders: [],
  onSort: () => {},
  sortField: null,
  sortOrder: null,
};

export default TenderList;
