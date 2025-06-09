"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/admin";
import BlotterPdfModal from "@/components/view";

// Styles
import "@/styles/list.css";
import "@/styles/table.css";
import "@/styles/button.css";

// Blotter record used for table
type Blotter = {
  caseNumber: string;
  respondent: string;
  incidentType: string;
  dateCreated: string;
};

// Full form structure for the PDF modal
type BlotterFormData = {
  complainantName: string;
  complainantContact: string;
  complainantAge: string;
  complainantAddress: string;
  respondentName: string;
  respondentContact: string;
  respondentAge: string;
  respondentAddress: string;
  incidentType: string;
  natureOfComplaint: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  summary: string;
  complainantStatement: string;
  witnessName: string;
  witnessContact: string;
  witnessAge: string;
  witnessAddress: string;
  witnessStatement: string;
};

export default function BlotterList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedData, setSelectedData] = useState<BlotterFormData | null>(null);
  const recordsPerPage = 25;

  // Hardcoded sample data from form structure
  const allBlotters: Blotter[] = [
    {
      caseNumber: "CASE-1001",
      respondent: "Juan Dela Cruz",
      incidentType: "Theft",
      dateCreated: "2024-06-01",
    },
    {
      caseNumber: "CASE-1002",
      respondent: "Maria Santos",
      incidentType: "Assault",
      dateCreated: "2024-06-02",
    },
    {
      caseNumber: "CASE-1003",
      respondent: "Pedro Reyes",
      incidentType: "Dispute",
      dateCreated: "2024-06-03",
    },
  ];

  const filteredBlotters = search.trim()
    ? allBlotters.filter((b) =>
      b.respondent.toLowerCase().includes(search.toLowerCase())
    )
    : allBlotters;

  const totalPages = Math.ceil(filteredBlotters.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentBlotters = filteredBlotters.slice(indexOfFirst, indexOfLast);

  const handleView = (caseNumber: string) => {
    const record = allBlotters.find((b) => b.caseNumber === caseNumber);
    if (!record) return;

    const mockBlotterFormData: BlotterFormData = {
      complainantName: "Ana Reyes",
      complainantContact: "09123456789",
      complainantAge: "28",
      complainantAddress: "Barangay 123, Manila",
      respondentName: record.respondent,
      respondentContact: "09998887777",
      respondentAge: "35",
      respondentAddress: "Barangay 456, Manila",
      incidentType: record.incidentType,
      natureOfComplaint: "Verbal Threat",
      incidentDate: record.dateCreated,
      incidentTime: "14:30",
      incidentLocation: "Market Area",
      summary: "Verbal altercation occurred near the market.",
      complainantStatement: "I was shouted at and threatened by the respondent.",
      witnessName: "Mark Cruz",
      witnessContact: "09112223344",
      witnessAge: "33",
      witnessAddress: "Barangay 789, Manila",
      witnessStatement: "I saw the incident while walking nearby.",
    };

    setSelectedData(mockBlotterFormData);
    setShowPdfModal(true);
  };

  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="blotter-container">
      <Navbar />
      <div className="blotter-wrapper">
        <div className="blotter-card">
          <h1 className="blotter-title">BLOTTER RECORDS</h1>

          {/* Search Bar */}
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

          {/* Table */}
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

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && selectedData && (
        <BlotterPdfModal
          formData={selectedData}
          onClose={() => {
            setShowPdfModal(false);
            setSelectedData(null);
          }}
        />

      )}
    </div>
  );
}
