/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

// Import
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/admin"; // Your admin navbar
import { ethers } from "ethers";

import ReportSystemABI from "@/lib/ReportSystemABI.json";
import ReportDetailsModal from "@/components/view";
import ReportUpdateModal from "@/components/edit"; //For pop up edit

import "@/styles/list.css";
import "@/styles/table.css";
import "@/styles/button.css";
import "@/styles/chips.css";

// CONTRACT ADDRESS (set in .env.local as NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS)
const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS || "0xYourContractAddress";

// Blockchain Report Type (matching your contract)
type Report = {
  id: number;
  reporter: string;
  complainantInfo: string;
  respondentInfo: string;
  incidentType: string;
  natureOfComplaint: string;
  date: string;
  time: string;
  location: string;
  summaryOfIncident: string;
  complainantStatement: string;
  witnessInfo: string;
  timestamp: string;
  status: number; // <--- updated from string to number
};

function splitSection(section: string) {
  return section.split("|");
}

// Update: map status number to string (enum from contract)
function formatStatus(status: number) {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Resolved";
    case 2:
      return "Revoked";
    case 3:
      return "Dismissed";
    default:
      return "Unknown";
  }
}

// Add: For CSS className of chips
function statusChipClass(status: number) {
  switch (status) {
    case 0:
      return "pending";
    case 1:
      return "resolved";
    case 2:
      return "revoked";
    case 3:
      return "dismissed";
    default:
      return "pending";
  }
}

export default function BlotterList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25;
  const [allBlotters, setAllBlotters] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);

  // Fetch from blockchain
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // @ts-ignore
        if (!window.ethereum) return alert("MetaMask not detected");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ReportSystemABI, provider);
        const count = await contract.reportCount();
        const items: Report[] = [];
        for (let i = 1; i <= Number(count); i++) {
          const r = await contract.getReport(i);
          items.push({
            id: Number(r.id),
            reporter: r.reporter,
            complainantInfo: r.complainantInfo,
            respondentInfo: r.respondentInfo,
            incidentType: r.incidentType,
            natureOfComplaint: r.natureOfComplaint,
            date: r.date,
            time: r.time,
            location: r.location,
            summaryOfIncident: r.summaryOfIncident,
            complainantStatement: r.complainantStatement,
            witnessInfo: r.witnessInfo,
            timestamp: new Date(Number(r.timestamp) * 1000).toLocaleString(),

            status: Number(r.status), // <--- get status as number from contract
          });
        }
        setAllBlotters(items.reverse()); // newest first
      } catch (err: any) {
        alert(err?.message || err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filtering & Pagination (searches Respondent Name & Incident Type)
  const filteredBlotters = search.trim()
    ? allBlotters.filter((b) =>
      splitSection(b.respondentInfo)[0].toLowerCase().includes(search.toLowerCase()) ||
      b.incidentType.toLowerCase().includes(search.toLowerCase())
    )
    : allBlotters;

  const totalPages = Math.ceil(filteredBlotters.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentBlotters = filteredBlotters.slice(indexOfFirst, indexOfLast);

  // Handlers
  const handleView = (report: Report) => setSelected(report);
  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
    // Optionally, you can re-fetch here if needed.
  };

  // For Update Modal
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateReport, setUpdateReport] = useState<Report | null>(null);

  const handleUpdate = (report: Report) => {
    setUpdateReport(report);
    setUpdateModalOpen(true);
  };

  return (
    <div className="blotter-container">
      <Navbar />
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
                    <th>Status</th>
                    <th>Date Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="no-records">
                        Loading reports from blockchain...
                      </td>
                    </tr>
                  ) : currentBlotters.length > 0 ? (
                    currentBlotters.map((blotter, index) => {
                      const [respondentName] = splitSection(blotter.respondentInfo);
                      return (
                        <tr key={blotter.id}>
                          <td>{indexOfFirst + index + 1}</td>
                          <td>{`CASE-${blotter.id}`}</td>
                          <td>{respondentName}</td>
                          <td>{blotter.incidentType}</td>
                          <td className="table-status">
                            <span className={`chip ${statusChipClass(blotter.status)}`}>
                              {formatStatus(blotter.status)}
                            </span>
                          </td>
                          <td>{blotter.date}</td>
                          <td>
                            <div className="action-gap">
                              <button
                                className="action-view-btn"
                                onClick={() => handleView(blotter)}
                              >
                                View
                              </button>
                              <button
                                className="action-edit-btn"
                                onClick={() => handleUpdate(blotter)}
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="no-records">
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
      {/* View Details Modal */}
      <ReportDetailsModal
        open={!!selected}
        report={selected}
        onClose={() => setSelected(null)}
      />

      {/* Update Modal - FIXED */}
      <ReportUpdateModal
        open={updateModalOpen}
        report={updateReport}
        onClose={() => {
          setUpdateModalOpen(false);
          setUpdateReport(null);
        }}
      />
    </div>
  );
}
