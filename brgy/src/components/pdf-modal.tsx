// "use client";
// import React, { useRef } from "react";
// import BlotterPdfDocument from "@/app/add/pdf";
// import "@/styles/pdf.css";
// import "@/styles/modal.css";

// type FormData = {
//   complainantName: string;
//   complainantContact: string;
//   complainantAge: string;
//   complainantAddress: string;
//   respondentName: string;
//   respondentContact: string;
//   respondentAge: string;
//   respondentAddress: string;
//   incidentType: string;
//   natureOfComplaint: string;
//   incidentDate: string;
//   incidentTime: string;
//   incidentLocation: string;
//   summary: string;
//   complainantStatement: string;
//   witnessName: string;
//   witnessContact: string;
//   witnessAge: string;
//   witnessAddress: string;
//   witnessStatement: string;
// };

// interface BlotterPdfModalProps {
//   formData: FormData;
//   onClose: () => void;
// }

// const BlotterPdfModal: React.FC<BlotterPdfModalProps> = ({ formData, onClose }) => {
//   const printRef = useRef<HTMLDivElement>(null);

//   const sanitizeFileName = (name: string) =>
//     name.replace(/[^a-z0-9]/gi, "-").toLowerCase();

//   const getPrintHtml = (content: string) => `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Blotter Report - ${formData.complainantName}</title>
//         <style>
//           @page { size: A4; margin: 0.5in; }
//           body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
//           .pdf-document { width: 100% !important; }
//         </style>
//       </head>
//       <body>
//         ${content}
//       </body>
//     </html>
//   `;

//   const handlePrint = () => {
//     const element = printRef.current;
//     if (!element) return;

//     const printWindow = window.open("", "_blank");
//     if (printWindow) {
//       printWindow.document.write(getPrintHtml(element.innerHTML));
//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     }
//   };

//   const handleDownload = () => {
//     const element = printRef.current;
//     if (!element) return;

//     const htmlContent = getPrintHtml(element.innerHTML);
//     const blob = new Blob([htmlContent], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     const fileName = sanitizeFileName(`blotter-report-${formData.complainantName}`) + ".html";

//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2 className="modal-title">Blotter Report Preview</h2>
//           <button onClick={onClose} className="close-button">&times;</button>
//         </div>

//         <div className="modal-body" ref={printRef}>
//           <BlotterPdfDocument formData={formData} />
//         </div>

//         <div className="modal-footer gap-2">
//           <button onClick={onClose} className="btn btn-gray">Close</button>
//           <button onClick={handlePrint} className="btn btn-blue">Print</button>
//           {/* <button onClick={handleDownload} className="btn btn-blue">Download</button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlotterPdfModal;


"use client";
import React, { useRef } from "react";
import "@/styles/pdf.css";
import "@/styles/modal.css";

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

interface ReportDetailsModalProps {
  report: Report | null;
  onClose: () => void;
}

const splitSection = (section: string) => section.split("|");

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!report) return null;

  const [cName, cContact, cAge, cAddress] = splitSection(report.complainantInfo);
  const [rName, rContact, rAge, rAddress] = splitSection(report.respondentInfo);
  const [wName, wContact, wAge, wAddress, wStatement] = splitSection(report.witnessInfo);

  const getPrintHtml = (content: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Blotter Report - ${cName}</title>
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Blotter Report Details</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body" ref={printRef}>
          <div className="pdf-section">
            <h3>Complainant</h3>
            <p><b>Name:</b> {cName}</p>
            <p><b>Contact:</b> {cContact}</p>
            <p><b>Age:</b> {cAge}</p>
            <p><b>Address:</b> {cAddress}</p>

            <h3>Respondent</h3>
            <p><b>Name:</b> {rName}</p>
            <p><b>Contact:</b> {rContact}</p>
            <p><b>Age:</b> {rAge}</p>
            <p><b>Address:</b> {rAddress}</p>

            <h3>Incident</h3>
            <p><b>Type:</b> {report.incidentType}</p>
            <p><b>Nature:</b> {report.natureOfComplaint}</p>
            <p><b>Date:</b> {report.date}</p>
            <p><b>Time:</b> {report.time}</p>
            <p><b>Location:</b> {report.location}</p>

            <h3>Statements</h3>
            <p><b>Summary:</b> {report.summaryOfIncident}</p>
            <p><b>Complainant Statement:</b> {report.complainantStatement}</p>

            <h4>Witness</h4>
            <p><b>Name:</b> {wName || "-"}</p>
            <p><b>Contact:</b> {wContact || "-"}</p>
            <p><b>Age:</b> {wAge || "-"}</p>
            <p><b>Address:</b> {wAddress || "-"}</p>
            <p><b>Statement:</b> {wStatement || "-"}</p>

            <div style={{ fontSize: ".85rem", color: "#666", marginTop: "1rem", textAlign: "right" }}>
              <p><b>Submitted by:</b> {report.reporter.slice(0, 7)}...{report.reporter.slice(-5)}</p>
              <p><b>Timestamp:</b> {report.timestamp}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer gap-2">
          <button onClick={onClose} className="btn btn-gray">Close</button>
          <button onClick={handlePrint} className="btn btn-blue">Print</button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
