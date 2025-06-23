/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import BlotterPdfDocument from "@/app/add/pdf";
import "@/styles/pdf.css";
import "@/styles/modal.css";
import "@/styles/ai.css";
import "@/styles/button.css";

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
  txHash?: string; // <-- NEW
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
};

type BlotterPdfModalProps = {
  formData: BlotterFormData;
  onClose: () => void;
};

type ApiResponse = {
  result?: string;
  error?: string;
  success?: boolean;
  details?: string;
};

const MAX_RETRIES = 3;

// Utility to split sections from pipe-delimited strings
const splitSection = (section: string) => section.split("|");

// --- Modal Entry Point ---
const ReportDetailsModal = ({ open, onClose, report }: ReportDetailsModalProps) => {
  if (!open || !report) return null;

  const [cName, cContact, cAge, cAddress] = splitSection(report.complainantInfo);
  const [rName, rContact, rAge, rAddress] = splitSection(report.respondentInfo);
  const [wName, wContact, wAge, wAddress, wStatement] = splitSection(report.witnessInfo);

  const formData: BlotterFormData = {
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
  };

  return <BlotterPdfModal formData={formData} onClose={onClose} />;
};

// --- Main Modal with AI + PDF ---
const BlotterPdfModal: React.FC<BlotterPdfModalProps> = ({ formData, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);

  // --- AI Summary Generator ---
  const fetchSummary = async (isRetry = false) => {
    if (isRetry && retryCount >= MAX_RETRIES) {
      setError("Maximum retry attempts reached.");
      setIsGenerating(false);
      return;
    }

    setRetryCount((prev) => (isRetry ? prev + 1 : 0));
    setIsGenerating(true);
    setError("");
    setDebugInfo("");

    const prompt = `
Please create a professional police blotter summary in a single, coherent paragraph. Use formal, objective language and include all key details:

INCIDENT DETAILS:
- Type: ${formData.incidentType}
- Date: ${formData.incidentDate}
- Time: ${formData.incidentTime}
- Location: ${formData.incidentLocation}

PARTIES INVOLVED:
- Complainant: ${formData.complainantName}, Age ${formData.complainantAge}
- Respondent: ${formData.respondentName}, Age ${formData.respondentAge}

COMPLAINT DETAILS:
- Nature: ${formData.natureOfComplaint}
- Statement: ${formData.complainantStatement}

${formData.witnessName ? `- Witness: ${formData.witnessName}, Age ${formData.witnessAge}` : ""}
${formData.witnessStatement ? `- Witness Statement: ${formData.witnessStatement}` : ""}
    `.trim();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data: ApiResponse = await response.json();

      if (data.error) throw new Error(data.error);
      if (!data.result?.trim()) throw new Error("Empty AI response.");

      setAiSummary(data.result.trim());
      setDebugInfo("✅ AI summary generated successfully.");
    } catch (err: any) {
      console.error("[AI Summary Error]", err);
      setError(`⚠️ ${err.message || "Unknown error occurred"}`);
      const fallback =
        formData.summary?.trim() ||
        `Incident involving ${formData.complainantName} and ${formData.respondentName} on ${formData.incidentDate}. Complaint: ${formData.natureOfComplaint}.`;

      setAiSummary(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, [formData]);

  const handleRetry = () => fetchSummary(true);

  const handleClose = () => {
    if (isGenerating && !confirm("AI summary is still generating. Close anyway?")) return;
    onClose();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line
  }, [isGenerating]);

  // --- PDF Download Handler ---
  const handleDownload = async () => {
    const input = printRef.current;
    if (!input) {
      console.error("❌ printRef is null – nothing to capture.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = {
        width: canvas.width,
        height: canvas.height,
      };

      const ratio = pdfWidth / imgProps.width;
      const imgHeightInPdf = imgProps.height * ratio;

      let position = 0;

      while (position < imgHeightInPdf) {
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, imgHeightInPdf);
        position += pdfHeight;
        if (position < imgHeightInPdf) pdf.addPage();
      }

      pdf.save(`blotter-report-${formData.report.id}.pdf`);
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    }
  };

  // Get base scan url (use Sepolia for testnet, Mainnet for main)
  const baseScanUrl = formData.report.txHash
    ? `https://sepolia.basescan.org/tx/${formData.report.txHash}`
    : "";

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>View Blotter Report</h2>
          <button onClick={handleClose} className="close-button">&times;</button>
        </div>

        {/* AI Summary Section */}
        <div className="ai-summary-section">
          <div className="summary-header">
            <h3>🧠 AI Generated Summary</h3>
            {isGenerating && <span className="loading-indicator">Generating summary...</span>}
          </div>
          <textarea value={aiSummary} readOnly rows={6} className="ai-summary-textarea" />
          {error && <div className="error-message">{error}</div>}
          {debugInfo && <pre className="debug-info">{debugInfo}</pre>}
        </div>

        {/* PDF Capture Section – Must be wrapped in ref */}
        <div ref={printRef}>
          <BlotterPdfDocument
            formData={{
              ...formData,
              report: {
                ...formData.report,
                summaryOfIncident: formData.summary || "N/A",
              },
            }}
          />
        </div>

        {/* Footer with PDF Download Button and Blockchain Link */}
        <div className="modal-footer">
          <button onClick={handleDownload} className="btn btn-blue">Download PDF</button>
          {formData.report.txHash && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <a
                href={baseScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green"
                style={{ marginLeft: "1rem", textDecoration: "none" }}
              >
                View Blockchain Transaction
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
