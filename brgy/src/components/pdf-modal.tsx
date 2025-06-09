"use client";
import React, { useRef } from "react";
import jsPDF from "jspdf";                
import html2canvas from "html2canvas";    

import BlotterPdfDocument from "@/app/add/pdf";  
import "@/styles/pdf.css";               
import "@/styles/modal.css";   
import "@/styles/button.css";             

// Type defining the structure of the form data expected in the blotter report
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

// Props interface for the BlotterPdfModal component
interface BlotterPdfModalProps {
  formData: FormData;          // Data to populate the PDF content
  onClose: () => void;         // Callback to close the modal
}

const BlotterPdfModal: React.FC<BlotterPdfModalProps> = ({ formData, onClose }) => {
  // Reference to the div that contains the PDF content to be exported
  const printRef = useRef<HTMLDivElement>(null);

  // Function to create a sanitized filename by replacing non-alphanumeric characters with dashes
  const sanitizeFileName = (name: string) =>
    name.replace(/[^a-z0-9]/gi, "-").toLowerCase();

  // Function to generate and download the PDF from the modal content
  const handleDownload = async () => {
    const element = printRef.current;
    if (!element) return;   // If the ref is not set, abort

    // Use html2canvas to capture the modal content as a canvas image with higher resolution (scale: 2)
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });

    // Convert the canvas to a PNG image data URL
    const imgData = canvas.toDataURL("image/png");

    // Initialize jsPDF with portrait mode, millimeter units, and A4 page size
    const pdf = new jsPDF("p", "mm", "a4");

    // Get PDF page dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the image height to maintain aspect ratio based on PDF width
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;  // Track remaining height to print
    let position = 0;            // Vertical position on the PDF page

    // Add the first page with the captured image
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;     // Reduce remaining height by one page height

    // If content overflows one page, add additional pages and draw the remaining image portions
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Create a sanitized filename based on the complainant's name
    const fileName = sanitizeFileName(`blotter-report-${formData.complainantName}`) + ".pdf";

    // Save/download the generated PDF with the constructed filename
    pdf.save(fileName);
  };

  // Render the modal UI with preview and buttons
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal header with title and close button */}
        <div className="modal-header">
          <h2 className="modal-title">Blotter Report Preview</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        {/* Modal body contains the blotter report content to be exported */}
        <div className="modal-body" ref={printRef}>
          <BlotterPdfDocument formData={formData} />
        </div>

        {/* Modal footer with action buttons */}
        <div className="modal-footer gap-2">
          <button onClick={onClose} className="btn btn-gray">Close</button>
          <button onClick={handleDownload} className="btn btn-blue">Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default BlotterPdfModal;
