"use client"; // Enables client-side rendering in Next.js

// Import necessary modules
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/admin";

// Import styles
import "@/styles/list.css";
import "@/styles/table.css";
import "@/styles/button.css";

// Define the structure of a Blotter record
type Blotter = {
  caseNumber: string;
  respondent: string;
  incidentType: string;
  dateCreated: string;
};

export default function BlotterList() {
  // State for search input and current pagination page
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25; // Number of records per page

  // Generate dummy data for demonstration
  const allBlotters: Blotter[] = Array.from({ length: 100 }, (_, i) => ({
    caseNumber: `CASE-${1000 + i}`,
    respondent: `Respondent ${i + 1}`,
    incidentType: i % 3 === 0 ? "Theft" : i % 3 === 1 ? "Assault" : "Dispute",
    dateCreated: new Date(Date.now() - i * 86400000).toLocaleDateString(), // Decrement by 1 day
  }));

  // Filter records based on the search input
  const filteredBlotters = search.trim()
    ? allBlotters.filter((b) =>
        b.respondent.toLowerCase().includes(search.toLowerCase())
      )
    : allBlotters;

  // Pagination calculations
  const totalPages = Math.ceil(filteredBlotters.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentBlotters = filteredBlotters.slice(indexOfFirst, indexOfLast);

  // View button click handler (mock action)
  const handleView = (caseNumber: string) => {
    alert(`Viewing details for ${caseNumber}`);
  };

  // Refresh button resets search and page
  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="blotter-container">
      <Navbar /> {/* Top navigation bar */}
      <div className="blotter-wrapper">
        <div className="blotter-card">
          <h1 className="blotter-title">BLOTTER RECORDS</h1>

          {/* Search Bar Section */}
          <label className="search-label">Search</label>
          <div className="search-bar">
            <div className="search-input-group">
              <i className="ri-search-line search-icon"></i>
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter button removed */}

            {/* Add Blotter Button */}
            <Link href="/add">
              <button className="add-btn">
                <i className="ri-add-line"></i> Add Blotter
              </button>
            </Link>
          </div>

          {/* Refresh Button */}
          <button className="refresh-btn" onClick={handleRefresh}>
            ⟳ Refresh
          </button>

          {/* Table Displaying Blotter Data */}
          <div className="table-wrapper">
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Case Number</th>
                    <th>Respondent</th>
                    <th>Incident Type</th>
                    <th>Date Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBlotters.length > 0 ? (
                    currentBlotters.map((blotter, index) => (
                      <tr key={index}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{blotter.caseNumber}</td>
                        <td>{blotter.respondent}</td>
                        <td>{blotter.incidentType}</td>
                        <td>{blotter.dateCreated}</td>
                        <td>
                          <button
                            className="action-btn"
                            onClick={() => handleView(blotter.caseNumber)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Message for no search results
                    <tr>
                      <td colSpan={6} className="no-records">
                        No blotter cases found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            {/* Previous Button */}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            {/* Page Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
