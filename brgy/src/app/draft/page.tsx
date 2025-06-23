/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import { ethers } from "ethers";
import ReportSystemABI from "@/lib/ReportSystemABI.json";

import "@/styles/form.css";
import "@/styles/button.css";
import "@/styles/container.css";
import "@/styles/validation.css";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS;

function bundleSection(fields: string[]) {
  return fields.join("|");
}

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

export default function AddBlotter() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    complainantName: "",
    complainantContact: "",
    complainantAge: "",
    complainantAddress: "",
    respondentName: "",
    respondentContact: "",
    respondentAge: "",
    respondentAddress: "",
    incidentType: "",
    natureOfComplaint: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    summary: "",
    complainantStatement: "",
    witnessName: "",
    witnessContact: "",
    witnessAge: "",
    witnessAddress: "",
    witnessStatement: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof FormData]?: string }>({});

  useEffect(() => {
    const existing = localStorage.getItem("blotterEdit");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        setFormData(parsed);
        setIsEditing(true);
      } catch (err) {
        console.error("Invalid stored data", err);
      }
    }
  }, []);

  const getTodayDate = (): string => new Date().toISOString().split("T")[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof FormData;

    if (
      (key === "complainantContact" || key === "respondentContact" || key === "witnessContact") &&
      (value.length > 11 || !/^\d*$/.test(value))
    ) {
      return;
    }

    if (
      (key === "complainantAge" || key === "respondentAge" || key === "witnessAge") &&
      (!/^\d{0,3}$/.test(value) || value === "0")
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields: (keyof FormData)[] = [
      "complainantName",
      "complainantContact",
      "complainantAge",
      "complainantAddress",
      "respondentName",
      "respondentContact",
      "respondentAge",
      "respondentAddress",
      "incidentType",
      "natureOfComplaint",
      "incidentDate",
      "incidentTime",
      "incidentLocation",
      "summary",
      "complainantStatement",
    ];

    const newErrors: { [key in keyof FormData]?: string } = {};

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    if (formData.incidentDate && formData.incidentDate > getTodayDate()) {
      newErrors.incidentDate = "Incident date cannot be in the future";
    }

    ["complainantAge", "respondentAge"].forEach((field) => {
      const age = formData[field as keyof FormData];
      if (!age) {
        newErrors[field as keyof FormData] = "This field is required";
      } else if (age === "0" || !/^\d{1,3}$/.test(age)) {
        newErrors[field as keyof FormData] = "Enter a valid age";
      }
    });

    if (formData.witnessAge && (formData.witnessAge === "0" || !/^\d{1,3}$/.test(formData.witnessAge))) {
      newErrors.witnessAge = "Enter a valid age";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const complainantInfo = bundleSection([
      formData.complainantName,
      formData.complainantContact,
      formData.complainantAge,
      formData.complainantAddress,
    ]);
    const respondentInfo = bundleSection([
      formData.respondentName,
      formData.respondentContact,
      formData.respondentAge,
      formData.respondentAddress,
    ]);
    const witnessInfo = bundleSection([
      formData.witnessName,
      formData.witnessContact,
      formData.witnessAge,
      formData.witnessAddress,
      formData.witnessStatement,
    ]);

    try {
      // @ts-ignore
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      if (!CONTRACT_ADDRESS) {
        alert("Smart contract address not set.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ReportSystemABI, signer);

      const tx = await contract.submitBlotterReport(
        complainantInfo,
        respondentInfo,
        formData.incidentType,
        formData.natureOfComplaint,
        formData.incidentDate,
        formData.incidentTime,
        formData.incidentLocation,
        formData.summary,
        formData.complainantStatement,
        witnessInfo
      );

      await tx.wait();

      await Swal.fire({
        icon: "success",
        title: "Report Submitted",
        text: "The blotter report has been successfully submitted to the blockchain.",
        confirmButtonText: "Back to Home",
        confirmButtonColor: "#1A3A6D",
      });

      router.push("/list");
    } catch (err: any) {
      alert(`Submission failed: ${err?.message || err}`);
    }
  };

  const renderInputClass = (field: keyof FormData, base: string = "custom-input") =>
    `${base} ${errors[field] ? "input-error" : ""}`;

  const renderError = (field: keyof FormData) =>
    errors[field] ? (
      <p className="error-text" role="alert">
        {errors[field]}
      </p>
    ) : null;
  return (
    <div className="container">
      <div className="content-wrapper">
        <div className="form-container" style={{ paddingTop: "80px" }}>
          <h1 className="form-title">BLOTTER FORM</h1>
          <form onSubmit={handleSubmit}>
            {/* A. Complainant Information */}
            <h2 className="section-heading">A. Complainant Information</h2>
            <div className="grid-4">
              <div className="form-group col-span-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="complainantName"
                  value={formData.complainantName}
                  onChange={handleChange}
                  className={renderInputClass("complainantName")}
                  placeholder="Enter full name here..."
                />
                {renderError("complainantName")}
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  name="complainantContact"
                  value={formData.complainantContact}
                  onChange={handleChange}
                  className={renderInputClass("complainantContact")}
                  placeholder="Enter contact number"
                />
                {renderError("complainantContact")}
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="complainantAge"
                  value={formData.complainantAge}
                  onChange={handleChange}
                  className={renderInputClass("complainantAge")}
                  placeholder="0"
                />
                {renderError("complainantAge")}
              </div>
            </div>
            <div className="grid-4 mt-5">
              <div className="form-group col-span-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="complainantAddress"
                  value={formData.complainantAddress}
                  onChange={handleChange}
                  className={renderInputClass("complainantAddress")}
                  placeholder="Enter address"
                />
                {renderError("complainantAddress")}
              </div>
            </div>

            {/* B. Respondent Information */}
            <h2 className="section-heading mt-6">B. Respondent Information</h2>
            <div className="grid-4">
              <div className="form-group col-span-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="respondentName"
                  value={formData.respondentName}
                  onChange={handleChange}
                  className={renderInputClass("respondentName")}
                  placeholder="Enter full name here..."
                />
                {renderError("respondentName")}
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  name="respondentContact"
                  value={formData.respondentContact}
                  onChange={handleChange}
                  className={renderInputClass("respondentContact")}
                  placeholder="Enter contact number"
                />
                {renderError("respondentContact")}
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="respondentAge"
                  value={formData.respondentAge}
                  onChange={handleChange}
                  className={renderInputClass("respondentAge")}
                  placeholder="0"
                />
                {renderError("respondentAge")}
              </div>
            </div>
            <div className="grid-4 mt-5">
              <div className="form-group col-span-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="respondentAddress"
                  value={formData.respondentAddress}
                  onChange={handleChange}
                  className={renderInputClass("respondentAddress")}
                  placeholder="Enter address"
                />
                {renderError("respondentAddress")}
              </div>
            </div>

            {/* C. Complaint Details */}
            <h2 className="section-heading mt-6">C. Complaint Details</h2>
            <div className="grid-4">
              <div className="form-group">
                <label className="form-label">Incident Type</label>
                <input
                  type="text"
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  className={renderInputClass("incidentType")}
                  placeholder="Enter incident type"
                />
                {renderError("incidentType")}
              </div>
              <div className="form-group col-span-2">
                <label className="form-label">Nature of Complaint</label>
                <input
                  type="text"
                  name="natureOfComplaint"
                  value={formData.natureOfComplaint}
                  onChange={handleChange}
                  className={renderInputClass("natureOfComplaint")}
                  placeholder="Enter nature of complaint"
                />
                {renderError("natureOfComplaint")}
              </div>
            </div>

            {/* D. Incident Information */}
            <h2 className="section-heading mt-6">D. Incident Information</h2>
            <div className="grid-4">
              <div className="form-group col-span-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  max={getTodayDate()}
                  onChange={handleChange}
                  className={renderInputClass("incidentDate")}
                />
                {renderError("incidentDate")}
              </div>
              <div className="form-group col-span-2">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  className={renderInputClass("incidentTime")}
                />
                {renderError("incidentTime")}
              </div>
            </div>
            <div className="grid-4 mt-5">
              <div className="form-group col-span-4">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  className={renderInputClass("incidentLocation")}
                  placeholder="Enter location"
                />
                {renderError("incidentLocation")}
              </div>
            </div>

            {/* E. Statement Summary */}
            <h2 className="section-heading mt-6">E. Statement Summary</h2>
            <div className="grid-4">
              <div className="form-group col-span-4">
                <label className="form-label">Summary of Incident</label>
                <textarea
                  name="summary"
                  rows={5}
                  value={formData.summary}
                  onChange={handleChange}
                  className={renderInputClass("summary", "custom-textarea")}
                  placeholder="Enter summary of incident..."
                />
                {renderError("summary")}
              </div>
            </div>
            <div className="grid-4 mt-4">
              <div className="form-group col-span-4">
                <label className="form-label">Complainant's Statement</label>
                <textarea
                  name="complainantStatement"
                  rows={5}
                  value={formData.complainantStatement}
                  onChange={handleChange}
                  className={renderInputClass("complainantStatement", "custom-textarea")}
                  placeholder="Enter complainant's full statement..."
                />
                {renderError("complainantStatement")}
              </div>
            </div>

            {/* F. Witness Information (optional) */}
            <h2 className="section-heading mt-6">F. Witness Information</h2>
            <div className="grid-4">
              <div className="form-group col-span-2">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="witnessName"
                  value={formData.witnessName}
                  onChange={handleChange}
                  className="custom-input"
                  placeholder="Enter full name here..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  name="witnessContact"
                  value={formData.witnessContact}
                  onChange={handleChange}
                  className="custom-input"
                  placeholder="Enter contact number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="witnessAge"
                  value={formData.witnessAge}
                  onChange={handleChange}
                  className="custom-input"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid-4 mt-5">
              <div className="form-group col-span-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="witnessAddress"
                  value={formData.witnessAddress}
                  onChange={handleChange}
                  className="custom-input"
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="grid-4 mt-4">
              <div className="form-group col-span-4">
                <label className="form-label">Witness Statement</label>
                <textarea
                  name="witnessStatement"
                  rows={5}
                  value={formData.witnessStatement}
                  onChange={handleChange}
                  className="custom-textarea"
                  placeholder="Enter witness full statement..."
                />
              </div>
            </div>

            {/* Button Group */}
            <div className="button-group">
              <Link href="/list" className="button button-cancel">
                Cancel
              </Link>
              <button type="submit" className="button button-save">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

