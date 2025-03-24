import React, { useEffect, useState } from 'react'
import TenderList from '../components/TenderList'
import { Pagination, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import io from "socket.io-client";

const token = localStorage.getItem("access_token");

interface SubTender {
  subId: string;
  title: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
}

const TenderDashboard: React.FC = () => {
  const [tenders, setTenders] = useState<any[]>([])
  const [filteredTenders, setFilteredTenders] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("You must be logged in to view your Tenders.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/v1/tenders/submittedtenders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch bids`);
      }

      const data = await response.json();
      console.log("Raw response data:", data);

      const rawTenders = data.subtenders || [];

      // Trim spaces from status values
      const cleanedsubTenders = rawTenders.map((subtender: SubTender) => ({
        ...subtender,
        status: subtender.status.trim(),
      }));

      console.log("Cleaned sub tenders:", cleanedsubTenders);
      setTenders(cleanedsubTenders);
      setFilteredTenders(cleanedsubTenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTenders();
  
    const token = localStorage.getItem('access_token') || '';

    // Connect via socket.io
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      query: { token },
    });
  
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
  
    socket.on("tenderInserted", (data) => {
      console.log("Tender inserted:", data.subtender);
      fetchTenders();
    });
    socket.on("tenderUpdated", (data) => {
      console.log("Tender updated:", data.subtender);
      fetchTenders();
    });
    socket.on("tenderDeleted", (data) => {
      console.log("Tender deleted:", data.subtender);
      fetchTenders();
    });
  
    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  

  // Apply filters
  const handleFilter = () => {
    let filtered = tenders
    console.log("filered tenders", tenders);

    if (statusFilter) {
      filtered = filtered.filter((tender) => tender.status === statusFilter)
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        (tender) =>
          new Date(tender.submittedAt) >= new Date(startDate) &&
          new Date(tender.submittedAt) <= new Date(endDate)
      )
    }

    setFilteredTenders(filtered)
    setShowFilters(false) // Hide filter modal after applying
  }

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
  }

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page)
  }

  // Reset filters
  const clearFilters = () => {
    setStatusFilter(null)
    setStartDate('')
    setEndDate('')
    setFilteredTenders(tenders)
    setShowFilters(false) // Hide filter modal
  }

  // Sorting logic
  const handleSort = (field: string) => {
    let newSortOrder: 'asc' | 'desc' | null

    if (sortField === field) {
      newSortOrder =
        sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc'
    } else {
      newSortOrder = 'asc'
    }

    setSortField(newSortOrder ? field : null)
    setSortOrder(newSortOrder)

    if (newSortOrder) {
      const sortedTenders = [...filteredTenders].sort((a, b) => {
        if (a[field] < b[field]) return newSortOrder === 'asc' ? -1 : 1
        if (a[field] > b[field]) return newSortOrder === 'asc' ? 1 : -1
        return 0
      })

      setFilteredTenders(sortedTenders)
    } else {
      setFilteredTenders([...tenders])
    }
  }

  // **Compute Summary Stats**
  const totalTenders = tenders.length
  const openTenders = tenders.filter((t) => t.status === 'Open').length
  const pendingTenders = tenders.filter((t) => t.status === 'Submitted').length
  const acceptedTenders = tenders.filter((t) => t.status === 'Approved').length
  const rejectedTenders = tenders.filter((t) => t.status === 'Rejected').length

  // Compute **Percentage Stats**
  const getPercentage = (count: number) =>
    totalTenders > 0 ? ((count / totalTenders) * 100).toFixed(1) : '0'

  // Handle **Click on Status Card** to Filter Tenders
  const filterByStatus = (status: string | null) => {
    if (status === statusFilter) {
      setStatusFilter(null)
      setFilteredTenders([...tenders])
    } else {
      setStatusFilter(status)
      setFilteredTenders(tenders.filter((t) => t.status === status))
    }
  }

  console.log("Filtered tenders>>>>>>>",filteredTenders)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tenders Dashboard</h1>
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg text-center shadow cursor-pointer ${
            statusFilter === null ? 'bg-gray-200' : 'bg-gray-100'
          }`}
          onClick={() => filterByStatus(null)}
        >
          <p className="text-lg font-semibold">Total</p>
          <p className="text-3xl font-bold">{totalTenders}</p>
          <p className="text-sm text-gray-600">100%</p>
        </div>
        <div
          className={`p-4 rounded-lg text-center shadow cursor-pointer ${
            statusFilter === 'Open' ? 'bg-blue-200' : 'bg-blue-100'
          }`}
          onClick={() => filterByStatus('Open')}
        >
          <p className="text-lg font-semibold">Open</p>
          <p className="text-3xl font-bold text-blue-600">{openTenders}</p>
          <p className="text-sm text-gray-600">{getPercentage(openTenders)}%</p>
        </div>
        <div
          className={`p-4 rounded-lg text-center shadow cursor-pointer ${
            statusFilter === 'Pending' ? 'bg-yellow-200' : 'bg-yellow-100'
          }`}
          onClick={() => filterByStatus('Submitted')}
        >
          <p className="text-lg font-semibold">Submitted</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingTenders}</p>
          <p className="text-sm text-gray-600">
            {getPercentage(pendingTenders)}%
          </p>
        </div>
        <div
          className={`p-4 rounded-lg text-center shadow cursor-pointer ${
            statusFilter === 'Approved' ? 'bg-green-200' : 'bg-green-100'
          }`}
          onClick={() => filterByStatus('Approved')}
        >
          <p className="text-lg font-semibold">Accepted</p>
          <p className="text-3xl font-bold text-green-600">{acceptedTenders}</p>
          <p className="text-sm text-gray-600">
            {getPercentage(acceptedTenders)}%
          </p>
        </div>
        <div
          className={`p-4 rounded-lg text-center shadow cursor-pointer ${
            statusFilter === 'Rejected' ? 'bg-red-200' : 'bg-red-100'
          }`}
          onClick={() => filterByStatus('Rejected')}
        >
          <p className="text-lg font-semibold">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{rejectedTenders}</p>
          <p className="text-sm text-gray-600">
            {getPercentage(rejectedTenders)}%
          </p>
        </div>
      </div>

      {/* Filter & Clear Buttons */}
      <div className="flex justify-between mb-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded-lg"
          onClick={() => setShowFilters(true)}
        >
          ⚙️ Filters
        </button>
        <button className="text-red-500 underline" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      {/*Filter Options */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setShowFilters(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Filter Options</h2>
            <label>Status:</label>
            <select
              className="w-full border p-2 rounded"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">All</option>
              <option value="Open">Open</option>
              <option value="Approved">Accepted</option>
              <option value="Submitted">Submitted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <label className="block mb-2">Start Date:</label>
            <input
              type="date"
              className="w-full border p-2 rounded mb-4"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label className="block mb-2">End Date:</label>
            <input
              type="date"
              className="w-full border p-2 rounded mb-4"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleFilter}
              >
                Apply Filters
              </button>
              <button
                className="text-gray-500 underline"
                onClick={() => setShowFilters(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}



      {/*Tender Table */}
      <TenderList
        tenders={filteredTenders}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
      />

      <div className="mt-6 flex justify-end items-center">
        <div className="flex items-center">
          <span className="mr-2">Rows per page:</span>
          <Select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>

        <Pagination
          count={Math.ceil(filteredTenders.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  )
}

export default TenderDashboard
