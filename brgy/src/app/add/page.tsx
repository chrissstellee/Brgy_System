"use client";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AddBlotter() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-5xl w-full bg-white rounded-md shadow-md p-8 flex flex-col">
          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
            BLOTTER FORM
          </h1>


          {/* Main Form Container */}
          <div className="bg-white border border-[var(--color-table)] mt-3 p-5 rounded-lg space-y-8">
            {/* A. Complainant Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">A. Complainant Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name here..."
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>
            </div>

            {/* B. Respondent Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">B. Respondent Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name here..."
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>
            </div>

            {/* C. Complaint Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4">C. Complaint Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Incident Type</label>
                  <input
                    type="text"
                    placeholder="Enter incident type"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Nature of Complaint</label>
                  <input
                    type="text"
                    placeholder="Enter nature of complaint"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>
            </div>


            {/* D. Incident Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">D. Incident Information</h2>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>

              {/* Location Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                      outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-table)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-table)"}
                  />
                </div>
              </div>
            </div>


            {/* E. Statement Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4">E. Statement Summary</h2>

              {/* First row: Summary of Incident */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Summary of Incident</label>
                  <textarea
                    placeholder="Enter summary of incident..."
                    rows={5}
                    className="border rounded-md px-3 py-1.5 text-sm resize-none focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>

              {/* Second row: Complainant's Statement */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Complainant's Statement</label>
                  <textarea
                    placeholder="Enter complainant's full statement..."
                    rows={5}
                    className="border rounded-md px-3 py-1.5 text-sm resize-none focus:outline-none"
                    style={{
                      borderColor: "var(--color-table)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>
            </div>


            {/* F. Witness Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">F. Witness Information</h2>

              {/* Complainant details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name here..."
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-table)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-table)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-table)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="border rounded-md px-3 py-1.5 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-table)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>

              {/* Witness Statement */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="flex flex-col md:col-span-4">
                  <label className="text-sm font-medium mb-1">Witness Statement</label>
                  <textarea
                    placeholder="Enter witness full statement..."
                    rows={5}
                    className="border rounded-md px-3 py-1.5 text-sm resize-none focus:outline-none"
                    style={{ borderColor: "var(--color-table)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(var(--color-primary-rgb), 0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--color-table)")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Group */}
          <div className="flex justify-end gap-[10px] mt-6">
            <Link href="/list" className="hover:opacity-90 transition-opacity">
              <Button
                className="h-9 text-sm"
                style={{ backgroundColor: 'var(--color-table)', color: 'white' }}
              >
                Cancel
              </Button>
            </Link>

            <Link href="/list" className="hover:opacity-90 transition-opacity">
              <Button
                className="h-9 text-sm"
                style={{ backgroundColor: 'var(--color-dark-blue)', color: 'white' }}
              >
                Save and Print
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}




