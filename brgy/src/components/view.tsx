"use client";

import React, { useRef, useEffect, useState } from "react";
import BlotterPdfDocument from "@/app/add/pdf";
import "@/styles/pdf.css";
import "@/styles/modal.css";
import "@/styles/ai.css"; // Add this import for AI-related styles

type BlotterFormData = {
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
  formData: BlotterFormData;
  onClose: () => void;
}

type ApiResponse = {
  result?: string;
  error?: string;
  success?: boolean;
  details?: string;
};

const MAX_RETRIES = 3;

const BlotterPdfModal: React.FC<BlotterPdfModalProps> = ({ formData, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchSummary = async (isRetry: boolean = false) => {
    if (isRetry) {
      if (retryCount >= MAX_RETRIES) {
        setError("Maximum retry attempts reached.");
        setIsGenerating(false);
        return;
      }
      setRetryCount(prev => prev + 1);
    } else {
      setRetryCount(0);
    }

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

${formData.witnessName ? `- Witness: ${formData.witnessName}, Age ${formData.witnessAge}` : ''}
${formData.witnessStatement ? `- Witness Statement: ${formData.witnessStatement}` : ''}

Write this as a single, professional narrative paragraph suitable for official police documentation. Use past tense and maintain objectivity throughout.
    `.trim();

    try {
      console.log(`[AI Summary] Attempt ${retryCount + 1} - Sending request...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[AI Summary] Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[AI Summary] HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || "Unknown server error"}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const responseText = await response.text();
        console.error("[AI Summary] Invalid content type:", contentType, responseText);
        throw new Error(`Expected JSON response, got ${contentType}. Response: ${responseText.substring(0, 200)}...`);
      }

      let data: ApiResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("[AI Summary] JSON parsing failed:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      console.log("[AI Summary] Parsed response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.result || data.result.trim().length === 0) {
        throw new Error("Empty response from AI service");
      }

      setAiSummary(data.result.trim());
      setDebugInfo(`✅ AI summary generated successfully (${data.result.length} characters, attempt ${retryCount + 1})`);
      console.log("[AI Summary] Success:", data.result.length, "characters");

    } catch (err: any) {
      console.error("[AI Summary] Error:", err);

      let errorMessage = "Failed to generate AI summary";
      if (err.name === "AbortError") {
        errorMessage = "Request timed out (30s limit exceeded)";
      } else if (err.message?.includes("API key")) {
        errorMessage = "Invalid or missing API key";
      } else if (err.message?.includes("quota")) {
        errorMessage = "API quota exceeded";
      } else if (err.message?.includes("blocked")) {
        errorMessage = "Content blocked by safety filters";
      } else if (err.message?.includes("fetch")) {
        errorMessage = "Network connection failed";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(`⚠️ ${errorMessage}`);
      setDebugInfo(
        JSON.stringify(
          {
            error: err.name || "Unknown",
            message: err.message || "No message",
            attempt: retryCount + 1,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // Use fallback summary
      const fallbackSummary =
        formData.summary?.trim() ||
        `Incident reported on ${formData.incidentDate} at ${formData.incidentTime} involving ${formData.complainantName} and ${formData.respondentName}. Nature of complaint: ${formData.natureOfComplaint}.`;

      setAiSummary(fallbackSummary);
      console.log("[AI Summary] Using fallback summary");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [formData]);

  const handleRetry = (): void => {
    fetchSummary(true);
  };

  const handleClose = (): void => {
    if (isGenerating) {
      const confirmed = window.confirm("AI summary is still generating. Are you sure you want to close?");
      if (!confirmed) return;
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
      // Removed Ctrl+P print shortcut here
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isGenerating]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            View Blotter Report
          </h2>
          <button onClick={handleClose} className="close-button" aria-label="Close modal" title="Close (Esc)">
            &times;
          </button>
        </div>

        {/* PDF Preview */}
        <div className="modal-body" ref={printRef}>
          <BlotterPdfDocument formData={{ ...formData, summary: aiSummary || formData.summary || "Summary not available." }} />
        </div>

        {/* AI Summary Section */}
        <div className="ai-summary-section">
          <div className="summary-header">
            <h3>🧠 AI Generated Summary</h3>
            {isGenerating && <span className="loading-indicator">Generating summary...</span>}
          </div>

          <textarea
            value={aiSummary}
            readOnly
            rows={6}
            aria-label="AI generated police blotter summary"
            className="ai-summary-textarea"
          />

          {error && (
            <div className="error-message" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {debugInfo && (
            <pre className="debug-info" aria-live="polite">
              {debugInfo}
            </pre>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default BlotterPdfModal;