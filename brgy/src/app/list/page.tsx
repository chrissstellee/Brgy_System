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

  // status: string;
};

function splitSection(section: string) {
  return section.split("|");
}

// --- Modal Component ---
// type ReportDetailsModalProps = {
//   open: boolean;
//   onClose: () => void;
//   report: Report | null;
// };
// function ReportDetailsModal({ open, onClose, report }: ReportDetailsModalProps) {
//   if (!open || !report) return null;
//   const [cName, cContact, cAge, cAddress] = splitSection(report.complainantInfo);
//   const [rName, rContact, rAge, rAddress] = splitSection(report.respondentInfo);
//   const [wName, wContact, wAge, wAddress, wStatement] = splitSection(report.witnessInfo);

//   // return (
//   //   <div
//   //     className="modal-overlay"
//   //     style={{
//   //       position: "fixed",
//   //       inset: 0,
//   //       background: "rgba(20, 20, 20, 0.55)",
//   //       display: "flex",
//   //       alignItems: "center",
//   //       justifyContent: "center",
//   //       zIndex: 1000,
//   //       backdropFilter: "blur(2px)",
//   //     }}
//   //   >
//   //     <div
//   //       className="modal-content"
//   //       style={{
//   //         background: "#fff",
//   //         borderRadius: "1.5rem",
//   //         padding: "2.5rem 2rem 1.8rem 2rem",
//   //         maxWidth: 520,
//   //         width: "100%",
//   //         boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
//   //         position: "relative",
//   //         fontFamily: "inherit",
//   //       }}
//   //     >
//   //       {/* Close button */}
//   //       <button
//   //         onClick={onClose}
//   //         aria-label="Close"
//   //         style={{
//   //           position: "absolute",
//   //           top: 24,
//   //           right: 28,
//   //           background: "none",
//   //           border: "none",
//   //           fontSize: 26,
//   //           color: "#888",
//   //           cursor: "pointer",
//   //           fontWeight: 700,
//   //           transition: "color .2s",
//   //         }}
//   //         onMouseOver={e => (e.currentTarget.style.color = "#c03")}
//   //         onMouseOut={e => (e.currentTarget.style.color = "#888")}
//   //       >
//   //         ×
//   //       </button>
//   //       <h2
//   //         style={{
//   //           textAlign: "center",
//   //           marginBottom: "1.2rem",
//   //           fontWeight: 700,
//   //           fontSize: "1.5rem",
//   //           letterSpacing: "-.5px",
//   //           color: "#c03",
//   //         }}
//   //       >
//   //         Blotter Report Details
//   //       </h2>
//   //       <div style={{ marginBottom: 18 }}>
//   //         <div
//   //           style={{
//   //             background: "#f9f9fb",
//   //             borderRadius: 12,
//   //             padding: "1rem 1.5rem",
//   //             marginBottom: 15,
//   //             border: "1px solid #ececec",
//   //           }}
//   //         >
//   //           <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8, color: "#2a2b3c" }}>Complainant</div>
//   //           <div><b>Name:</b> {cName}</div>
//   //           <div><b>Contact:</b> {cContact}</div>
//   //           <div><b>Age:</b> {cAge}</div>
//   //           <div><b>Address:</b> {cAddress}</div>
//   //         </div>
//   //         <div
//   //           style={{
//   //             background: "#f9f9fb",
//   //             borderRadius: 12,
//   //             padding: "1rem 1.5rem",
//   //             marginBottom: 15,
//   //             border: "1px solid #ececec",
//   //           }}
//   //         >
//   //           <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8, color: "#2a2b3c" }}>Respondent</div>
//   //           <div><b>Name:</b> {rName}</div>
//   //           <div><b>Contact:</b> {rContact}</div>
//   //           <div><b>Age:</b> {rAge}</div>
//   //           <div><b>Address:</b> {rAddress}</div>
//   //         </div>
//   //         <div
//   //           style={{
//   //             background: "#f9f9fb",
//   //             borderRadius: 12,
//   //             padding: "1rem 1.5rem",
//   //             marginBottom: 15,
//   //             border: "1px solid #ececec",
//   //           }}
//   //         >
//   //           <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8, color: "#2a2b3c" }}>Incident</div>
//   //           <div><b>Type:</b> {report.incidentType}</div>
//   //           <div><b>Nature:</b> {report.natureOfComplaint}</div>
//   //           <div><b>Date:</b> {report.date}</div>
//   //           <div><b>Time:</b> {report.time}</div>
//   //           <div><b>Location:</b> {report.location}</div>
//   //         </div>
//   //         <div
//   //           style={{
//   //             background: "#f9f9fb",
//   //             borderRadius: 12,
//   //             padding: "1rem 1.5rem",
//   //             marginBottom: 15,
//   //             border: "1px solid #ececec",
//   //           }}
//   //         >
//   //           <div style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 8, color: "#2a2b3c" }}>Statements</div>
//   //           <div><b>Summary:</b> <span style={{ color: "#484a60" }}>{report.summaryOfIncident}</span></div>
//   //           <div><b>Complainant Statement:</b> <span style={{ color: "#484a60" }}>{report.complainantStatement}</span></div>
//   //           <div style={{ marginTop: 12, marginBottom: 5, fontWeight: 600 }}>Witness</div>
//   //           <div><b>Name:</b> {wName || "-"}</div>
//   //           <div><b>Contact:</b> {wContact || "-"}</div>
//   //           <div><b>Age:</b> {wAge || "-"}</div>
//   //           <div><b>Address:</b> {wAddress || "-"}</div>
//   //           <div><b>Statement:</b> <span style={{ color: "#484a60" }}>{wStatement || "-"}</span></div>
//   //         </div>
//   //         <div
//   //           style={{
//   //             fontSize: ".95rem",
//   //             color: "#999",
//   //             textAlign: "right",
//   //             marginTop: "1rem",
//   //           }}
//   //         >
//   //           Submitted by: <span style={{ color: "#6a5acd" }}>{report.reporter.slice(0, 7)}...{report.reporter.slice(-5)}</span>
//   //           <br />
//   //           <span>On: {report.timestamp}</span>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// }

// function formatStatus(blotterStatus: string) {
//   switch (blotterStatus) {
//     case "resolved":
//       return "Resolved";
//     case "pending":
//       return "Pending";
//     case "revoked":
//       return "Revoked";
//     case "dismissed":
//       return "Dismissed";
//     default:
//       return blotterStatus;
//   }
// }

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

            // status: "pending",
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
                    {/* <th>Status</th> */}
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
                          {/* <td className="table-status">
                            <span className={`chip ${blotter.status}`}>
                              {formatStatus(blotter.status)}
                            </span>
                          </td> */}
                          <td>{blotter.incidentType}</td>
                          <td>{blotter.date}</td>
                          <td>
                            <div className="action-gap">
                              <button
                                className="action-view-btn"
                                onClick={() => handleView(blotter)}
                              >
                                View
                              </button>

                              {/* <Link href="/edit">
                              <button className="action-edit-btn">
                                Edit
                              </button>
                              </Link> */}

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
      {/* <ReportDetailsModal
        open={!!selected}
        report={selected}
        onClose={() => setSelected(null)}
      /> */}

      {/* View Details Modal */}
      <ReportDetailsModal
        open={!!selected}
        report={selected}
        onClose={() => setSelected(null)}
      />

      {/* Update Modal - FIXED */}
      <ReportUpdateModal
        open={updateModalOpen}  // Changed from !!selected to updateModalOpen
        report={updateReport}   // Changed from selected to updateReport
        onClose={() => {
          setUpdateModalOpen(false);  // Close update modal
          setUpdateReport(null);      // Clear update report
        }}
      />
    </div>
  );
}
