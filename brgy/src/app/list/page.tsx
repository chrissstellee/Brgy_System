"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../../components/admin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define Blotter type without 'compliant' and 'status', add 'dateCreated'
type Blotter = {
  caseNumber: string;
  respondent: string;
  incidentType: string;
  dateCreated: string;
};

export default function BlotterList() {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 25;

  // Generate mock blotter data
  const allBlotters: Blotter[] = Array.from({ length: 100 }, (_, i) => ({
    caseNumber: `CASE-${1000 + i}`,
    respondent: `Respondent ${i + 1}`,
    incidentType: i % 3 === 0 ? "Theft" : i % 3 === 1 ? "Assault" : "Dispute",
    dateCreated: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  }));

  // Filter blotters by search input
  const filteredBlotters = search.trim()
    ? allBlotters.filter((b) =>
      b.respondent.toLowerCase().includes(search.toLowerCase())
    )
    : allBlotters;

  const totalPages = Math.ceil(filteredBlotters.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentBlotters = filteredBlotters.slice(indexOfFirst, indexOfLast);

  // Handler for viewing blotter detail
  const handleView = (caseNumber: string): void => {
    alert(`Viewing details for ${caseNumber}`);
  };

  // Reset filters and pagination
  const handleRefresh = (): void => {
    setSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-5xl w-full bg-white rounded-md shadow-md p-8 flex flex-col">
          <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
            BLOTTER RECORDS
          </h1>

          {/* Search bar */}
          <label className="block mb-2 font-semibold">Search</label>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex flex-grow h-9 items-center border border-[var(--color-table)] rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow h-full px-3 text-sm focus:outline-none"
              />
              <Button
                variant="ghost"
                className="h-full px-3 text-[var(--color-table)] rounded-none"
                onClick={() => setCurrentPage(1)}
              >
                <i className="ri-search-line text-lg"></i>
              </Button>
            </div>

            <Button
              className="h-9 text-sm flex items-center gap-1 border-0 hover:!bg-[var(--color-secondary-table)]"
              style={{
                backgroundColor: "var(--color-secondary-table)",
                color: "var(--color-text-primary)",
              }}
            >
              <i className="ri-equalizer-line"></i> Filter
            </Button>

            <Link href="/add" className="hover:opacity-90 transition-opacity">
              <Button
                className="h-9 text-white text-sm flex items-center gap-1"
                style={{ backgroundColor: "var(--color-dark-blue)" }}
              >
                <i className="ri-add-line"></i> Add Blotter
              </Button>
            </Link>
          </div>

          {/* Refresh Button */}
          <button
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
            onClick={handleRefresh}
          >
            ⟳ Refresh
          </button>

          {/* Blotter Table */}
          <div className="rounded overflow-hidden border border-[var(--color-table)]">
            <div className="max-h-[500px] overflow-y-auto minimal-scrollbar">
              <Table className="w-full text-sm">
                <TableHeader className="bg-[var(--color-bg)] sticky top-0 z-10">
                  <TableRow className="border-b border-[var(--color-table)]">
                    <TableHead className="text-center">No.</TableHead>
                    <TableHead className="text-center">Case Number</TableHead>
                    <TableHead className="text-center">Respondent</TableHead>
                    <TableHead className="text-center">Incident Type</TableHead>
                    <TableHead className="text-center">Date Created</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBlotters.length > 0 ? (
                    currentBlotters.map((blotter, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-100 border-b border-[var(--color-table)]"
                      >
                        <TableCell className="text-center py-1 px-2">
                          {indexOfFirst + index + 1}
                        </TableCell>
                        <TableCell className="text-center py-1 px-2">
                          {blotter.caseNumber}
                        </TableCell>
                        <TableCell className="text-center py-1 px-2">
                          {blotter.respondent}
                        </TableCell>
                        <TableCell className="text-center py-1 px-2">
                          {blotter.incidentType}
                        </TableCell>
                        <TableCell className="text-center py-1 px-2">
                          {blotter.dateCreated}
                        </TableCell>
                        <TableCell className="text-center py-1 px-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-blue-800"
                            onClick={() => handleView(blotter.caseNumber)}
                          >
                            <i className="ri-eye-line text-lg text-[var(--color-table)]" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-b border-[var(--color-table)]">
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500 italic py-4"
                      >
                        No blotter cases found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4 text-sm">
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-black p-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="ri-arrow-left-s-line text-xl"></i>
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${currentPage === page
                    ? "bg-[var(--color-primary)] text-white"
                    : ""
                  }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="ghost"
              className="text-gray-500 hover:text-black p-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <i className="ri-arrow-right-s-line text-xl"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
