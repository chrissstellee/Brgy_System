"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

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
};

type ReportDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  report: Report | null;
};

type BlotterFormData = {
  incidentType: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  natureOfComplaint: string;
  complainantName: string;
  complainantContact: string;
  complainantAge: string;
  complainantAddress: string;
  respondentName: string;
  respondentContact: string;
  respondentAge: string;
  respondentAddress: string;
  witnessName: string;
  witnessContact: string;
  witnessAge: string;
  witnessAddress: string;
  witnessStatement: string;
  complainantStatement: string;
  summary?: string;
  report: Report;
  status: string;
  caseNumber: string;
  remarks: string;
};

// Utility to split pipe-delimited fields
const splitSection = (section: string) => section.split("|");

const ReportDetailsModal = ({ open, onClose, report }: ReportDetailsModalProps) => {
  if (!open || !report) return null;

  const [cName, cContact, cAge, cAddress] = splitSection(report.complainantInfo);
  const [rName, rContact, rAge, rAddress] = splitSection(report.respondentInfo);
  const [wName, wContact, wAge, wAddress, wStatement] = splitSection(report.witnessInfo);

  const [formData, setFormData] = useState<BlotterFormData>({
    incidentType: report.incidentType,
    incidentDate: report.date,
    incidentTime: report.time,
    incidentLocation: report.location,
    natureOfComplaint: report.natureOfComplaint,
    complainantName: cName,
    complainantContact: cContact,
    complainantAge: cAge,
    complainantAddress: cAddress,
    respondentName: rName,
    respondentContact: rContact,
    respondentAge: rAge,
    respondentAddress: rAddress,
    witnessName: wName,
    witnessContact: wContact,
    witnessAge: wAge,
    witnessAddress: wAddress,
    witnessStatement: wStatement,
    complainantStatement: report.complainantStatement,
    summary: report.summaryOfIncident,
    report,
    status: "",
    caseNumber: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<{ [key in keyof BlotterFormData]?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key in keyof BlotterFormData]?: string } = {};

    if (!formData.status) {
      newErrors.status = "Status is required.";
    }
    if (!formData.remarks.trim()) {
      newErrors.remarks = "Remarks are required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Update Submitted",
      text: "Blotter report has been successfully updated.",
    });

    // Your API call or further logic here
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
                >
                  <option value="" disabled>
                    --Select status--
                  </option>
                  <option value="resolved">Resolved</option>
                  <option value="revoked">Revoked</option>
                  <option value="pending">Pending</option>
                  <option value="dismissed">Dismissed</option>
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
                />
                {renderError("remarks")}
              </div>
            </div>

            {/* Submit Button */}
            <div className="modal-footer">
              <button type="submit" className="btn btn-blue">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
