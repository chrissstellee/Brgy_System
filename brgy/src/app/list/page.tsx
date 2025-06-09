/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// Import
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/admin"; // Your admin navbar
import { ethers } from "ethers";
import ReportSystemABI from "@/lib/ReportSystemABI.json";
import "@/styles/list.css";
import "@/styles/table.css";
import "@/styles/button.css";

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
};

function splitSection(section: string) {
  return section.split("|");
}

// --- Modal Component ---
type ReportDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  report: Report | null;
};
function ReportDetailsModal({ open, onClose, report }: ReportDetailsModalProps) {
  if (!open || !report) return null;
  const [cName, cContact, cAge, cAddress] = splitSection(report.complainantInfo);
  const [rName, rContact, rAge, rAddress] = splitSection(report.respondentInfo);
  const [wName, wContact, wAge, wAddress, wStatement] = splitSection(report.witnessInfo);

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: "#fff",
        borderRadius: "1rem",
        padding: "2rem",
        maxWidth: 500,
        width: "100%",
        boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 24, fontWeight: "bold", fontSize: 24, background: "none", border: "none", cursor: "pointer"
        }}>×</button>
        <h2 className="form-title" style={{ marginBottom: 16 }}>Report Details</h2>
        <div>
          <h4>Complainant Info</h4>
          <div>Name: {cName}</div>
          <div>Contact: {cContact}</div>
          <div>Age: {cAge}</div>
          <div>Address: {cAddress}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <h4>Respondent Info</h4>
          <div>Name: {rName}</div>
          <div>Contact: {rContact}</div>
          <div>Age: {rAge}</div>
          <div>Address: {rAddress}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <h4>Incident Details</h4>
          <div>Type: {report.incidentType}</div>
          <div>Nature: {report.natureOfComplaint}</div>
          <div>Date: {report.date}</div>
          <div>Time: {report.time}</div>
          <div>Location: {report.location}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <h4>Statements</h4>
          <div>Summary: {report.summaryOfIncident}</div>
          <div>Complainant Statement: {report.complainantStatement}</div>
          <div>Witness: {wName || "-"}, Contact: {wContact || "-"}</div>
          <div>Witness Statement: {wStatement || "-"}</div>
        </div>
      </div>
    </div>
  );
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
                    <th>Date Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="no-records">
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
                          <td>{blotter.date}</td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => handleView(blotter)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
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
    </div>
  );
}
