"use client";
import React from "react";
import "@/styles/pdf.css";

type FormData = {
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

const formatValue = (value: string | number | undefined | null): string => {
  return value?.toString().trim() ? value.toString() : "N/A";
};

const BlotterPdfPreview: React.FC<{ formData: FormData }> = ({ formData }) => {
  return (
    <div className="pdf-document">
      <h1 className="form-title">Barangay Blotter Report</h1>
      <div className="form-header">
        <p>123 Brgy. Maginhawa, Rodriguez, Rizal</p>
        <p>09123456789 | 02-1234-5678</p>
      </div>

      <div className="form-row">
        <label>Date Filed:</label>
        <span>{formatValue(formData.incidentDate)}</span>
        <label>Case Number:</label>
        <span>__________</span>
      </div>

      <h2 className="section-title">Complainant Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{formatValue(formData.complainantName)}</span>
        <label>Age:</label>
        <span>{formatValue(formData.complainantAge)}</span>
        <label>Contact Number:</label>
        <span>{formatValue(formData.complainantContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{formatValue(formData.complainantAddress)}</span>
        <label>Location:</label>
        <span>{formatValue(formData.incidentLocation)}</span>
      </div>

      <h2 className="section-title">Respondent Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{formatValue(formData.respondentName)}</span>
        <label>Age:</label>
        <span>{formatValue(formData.respondentAge)}</span>
        <label>Contact Number:</label>
        <span>{formatValue(formData.respondentContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{formatValue(formData.respondentAddress)}</span>
      </div>

      <h2 className="section-title">Witness Information</h2>
      <div className="form-row">
        <label>Full Name:</label>
        <span>{formatValue(formData.witnessName)}</span>
        <label>Age:</label>
        <span>{formatValue(formData.witnessAge)}</span>
        <label>Contact Number:</label>
        <span>{formatValue(formData.witnessContact)}</span>
      </div>
      <div className="form-row">
        <label>Address:</label>
        <span>{formatValue(formData.witnessAddress)}</span>
      </div>

      <h2 className="section-title">Incident Details</h2>
      <div className="form-row">
        <label>Date of Incident:</label>
        <span>{formatValue(formData.incidentDate)}</span>
        <label>Time:</label>
        <span>{formatValue(formData.incidentTime)}</span>
        <label>Type of Incident:</label>
        <span>{formatValue(formData.incidentType)}</span>
      </div>
      <div className="form-row">
        <label>Nature of Complaint:</label>
        <span>{formatValue(formData.natureOfComplaint)}</span>
      </div>

      <h2 className="section-title">Incident Summary</h2>
      <div className="form-row">
        <span>{formatValue(formData.summary)}</span>
      </div>

      <h2 className="section-title">Complainant’s Statement</h2>
      <div className="form-row">
        <span>{formatValue(formData.complainantStatement)}</span>
      </div>

      <h2 className="section-title">Witness Statement</h2>
      <div className="form-row">
        <span>{formatValue(formData.witnessStatement)}</span>
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

export default BlotterPdfPreview;
