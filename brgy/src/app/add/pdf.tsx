"use client";
import React from "react";
import "@/styles/pdf.css";

export type Report = {
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
  remarks: string;
};

export type BlotterFormData = {
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
  remarks: string;
  report: Report;
};

const BlotterPdfDocument: React.FC<{ formData: BlotterFormData }> = ({ formData }) => {
  const {
    complainantName,
    complainantContact,
    complainantAge,
    complainantAddress,
    respondentName,
    respondentContact,
    respondentAge,
    respondentAddress,
    witnessName,
    witnessContact,
    witnessAge,
    witnessAddress,
    witnessStatement,
    complainantStatement,
    remarks,
    report,
  } = formData;

  // Helper to display "N/A" if the field is empty
  const display = (value: string | undefined | null) => value?.trim() || "N/A";

  return (
    <div className="pdf-document">
      <h1 className="form-title">Barangay Blotter Report</h1>
      <div className="form-header">
        <p>123 Brgy. Burgos, Rodriguez, Rizal</p>
        <p>09123456789 | 02-1234-5678</p>
      </div>

      <div className="form-row">
        <label>Date Filed:</label>
        <span>{display(report.timestamp)}</span>
        <label>Case Number:</label>
        <span>{`CASE-${report.id}`}</span>
      </div>

      <h2 className="section-title">Complainant Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{display(complainantName)}</span>
        <label>Age:</label>
        <span>{display(complainantAge)}</span>
        <label>Contact Number:</label>
        <span>{display(complainantContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{display(complainantAddress)}</span>
        <label>Location:</label>
        <span>{display(report.location)}</span>
      </div>

      <h2 className="section-title">Respondent Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{display(respondentName)}</span>
        <label>Age:</label>
        <span>{display(respondentAge)}</span>
        <label>Contact Number:</label>
        <span>{display(respondentContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{display(respondentAddress)}</span>
      </div>

      <h2 className="section-title">Witness Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{display(witnessName)}</span>
        <label>Age:</label>
        <span>{display(witnessAge)}</span>
        <label>Contact Number:</label>
        <span>{display(witnessContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{display(witnessAddress)}</span>
      </div>

      <h2 className="section-title">Incident Details</h2>
      <div className="form-row">
        <label>Date of Incident:</label>
        <span>{display(report.date)}</span>
        <label>Time:</label>
        <span>{display(report.time)}</span>
        <label>Type of Incident:</label>
        <span>{display(report.incidentType)}</span>
      </div>
      <div className="form-row">
        <label>Nature of Complaint:</label>
        <span>{display(report.natureOfComplaint)}</span>
      </div>

      <h2 className="section-title">Incident Summary</h2>
      <div className="form-row">
        <span>{display(report.summaryOfIncident)}</span>
      </div>

      <h2 className="section-title">Complainant’s Statement</h2>
      <div className="form-row">
        <span>{display(complainantStatement)}</span>
      </div>

      <h2 className="section-title">Witness Statement</h2>
      <div className="form-row">
        <span>{display(witnessStatement)}</span>
      </div>

      <h2 className="section-title">Remarks</h2>
<div className="form-row">
  <span>{display(report.remarks)}</span>
</div>


      <div className="signature-section">
        <div className="signature-box">
          <p>Complainant’s Name and Signature</p>
        </div>
        <div className="signature-box">
          <p>Barangay Official’s Name and Signature</p>
        </div>
      </div>

      <p className="footer-note">
        This document is an official record of the Barangay.
      </p>
    </div>
  );
};

export default BlotterPdfDocument;
