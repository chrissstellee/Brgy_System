/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import ReportSystemABI from "@/lib/ReportSystemABI.json";

import "@/styles/form.css";
import "@/styles/container.css";
import "@/styles/pdf.css";
import "@/styles/modal.css";
import "@/styles/ai.css";
import "@/styles/button.css";
import "@/styles/validation.css";

// --- Types ---
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
  status?: number; // <--- now numeric
};

type ReportDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  report: Report | null;
};

type BlotterFormData = {
  status: string;
  remarks: string;
};

// Utility to split pipe-delimited fields
const splitSection = (section: string) => section.split("|");

// Status options for mapping
const STATUS_OPTIONS = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Resolved" },
  { value: "2", label: "Revoked" },
  { value: "3", label: "Dismissed" },
];

// For mapping from enum number to text (optional)
function statusLabelFromNumber(statusNum: number) {
  return STATUS_OPTIONS.find(opt => opt.value === String(statusNum))?.label || "Unknown";
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS || "";

const ReportDetailsModal = ({ open, onClose, report }: ReportDetailsModalProps) => {
  if (!open || !report) return null;

  // Default status value as string (from numeric)
  const defaultStatus = typeof report.status === "number" ? String(report.status) : "";

  const [formData, setFormData] = useState<BlotterFormData>({
    status: defaultStatus,
    remarks: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof BlotterFormData]?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key in keyof BlotterFormData]?: string } = {};
    if (!formData.status) newErrors.status = "Status is required.";
    if (!formData.remarks.trim()) newErrors.remarks = "Remarks are required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setSubmitting(true);

      // Update the status on blockchain
      if (!window.ethereum) throw new Error("MetaMask not detected");
      if (!CONTRACT_ADDRESS) throw new Error("Smart contract address not set.");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ReportSystemABI, signer);

      // Call smart contract: updateReportStatus(uint256 id, Status newStatus)
      const tx = await contract.updateReportStatus(report.id, Number(formData.status));
      await tx.wait();

      await Swal.fire({
        icon: "success",
        title: "Update Submitted",
        text: "Blotter report status has been successfully updated on blockchain.",
        confirmButtonColor: "#1A3A6D",
      });

      onClose(); // Close modal on success
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "An error occurred while updating the report status.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field: keyof BlotterFormData) =>
    errors[field] ? (
      <p className="error-text" role="alert">
        {errors[field]}
      </p>
    ) : null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Update Blotter Report</h2>
          <button onClick={handleClose} className="close-button">
            &times;
          </button>
        </div>

        {/* Form Start */}
        <form onSubmit={handleSubmit}>
          <div className="update-form">
            <div className="grid-4">
              {/* Row 1: Case Number and Status */}
              <div className="form-group col-span-2">
                <label className="form-label">Case Number</label>
                <input
                  type="text"
                  name="caseNumber"
                  value={`CASE-${report.id}`}
                  className="custom-input"
                  readOnly
                />
              </div>
              <div className="form-group col-span-2">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="custom-input"
                  disabled={submitting}
                >
                  <option value="" disabled>
                    --Select status--
                  </option>
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {renderError("status")}
              </div>
            </div>

            {/* Row 2: Remarks */}
            <div className="grid-4 mt-5">
              <div className="form-group col-span-4">
                <label className="form-label">Remarks</label>
                <textarea
                  name="remarks"
                  rows={5}
                  value={formData.remarks}
                  onChange={handleChange}
                  className="custom-textarea"
                  placeholder="Enter remarks..."
                  disabled={submitting}
                />
                {renderError("remarks")}
              </div>
            </div>

            {/* Submit Button */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-blue" disabled={submitting}>
                {submitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
