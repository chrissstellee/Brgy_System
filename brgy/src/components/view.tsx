"use client";
import React, { useRef } from "react";
import BlotterPdfDocument from "@/app/add/pdf";
import "@/styles/pdf.css";
import "@/styles/modal.css";

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

interface BlotterPdfModalProps {
  formData: FormData;
  onClose: () => void;
}

const BlotterPdfModal: React.FC<BlotterPdfModalProps> = ({ formData, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const sanitizeFileName = (name: string) =>
    name.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  const getPrintHtml = (content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Blotter Report - ${formData.complainantName}</title>
        <style>
          @page { size: A4; margin: 0.5in; }
          body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
          .pdf-document { width: 100% !important; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

  const handlePrint = () => {
    const element = printRef.current;
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(getPrintHtml(element.innerHTML));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownload = () => {
    const element = printRef.current;
    if (!element) return;

    const htmlContent = getPrintHtml(element.innerHTML);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fileName = sanitizeFileName(`blotter-report-${formData.complainantName}`) + ".html";

    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Blotter Report Preview</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body" ref={printRef}>
          <BlotterPdfDocument formData={formData} />
        </div>

      </div>
    </div>
  );
};

export default BlotterPdfModal;
