"use client";

import React, { useState, useRef } from "react";
import { InvoiceData, FontType, INITIAL_INVOICE_DATA } from "@/types/invoice";
import InvoiceForm from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import FontChooserDialog from "@/components/FontChooserDialog";
import { exportInvoiceToPdf } from "@/lib/generatePdf";
import {
  Download,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Type,
} from "lucide-react";

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_INVOICE_DATA);
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Zoom scale for preview (defaults to ~0.8 for desktop screens to fit A4 neatly)
  const [previewScale, setPreviewScale] = useState(0.85);
  // View mode for responsive devices: "split" | "edit" | "preview"
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const filename = `Invoice-${invoiceData.invoiceNumber || "draft"}-${invoiceData.company.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      await exportInvoiceToPdf("invoice-document", filename);
      showToast("success", `Downloaded ${filename} successfully!`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("error", "Failed to generate PDF. You can also use the Print button to Save as PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectFont = (font: FontType) => {
    setInvoiceData((prev) => ({
      ...prev,
      font,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:bg-white print:min-h-0 print:p-0 print:block">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
              notification.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/40"
                : "bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/40"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-400" />
            ) : (
              <AlertCircle className="size-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/scalyx_light.png"
                alt="Scalyx"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  Scalyx Invoice Generator
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hidden sm:inline-block">
                  A4 Live PDF
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official invoicing tool for{" "}
                <a
                  href="https://scalyx.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5 hover:underline"
                >
                  scalyx.in
                  <ExternalLink className="size-2.5" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Chooser Button */}
            <button
              onClick={() => setIsFontDialogOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-500 transition-colors"
            >
              <Type className="size-3.5 text-blue-400" />
              <span className="hidden sm:inline">Font:</span>
              <span className="capitalize font-bold text-white">{invoiceData.font}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              {isDownloading ? (
                <>
                  <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Mode Switcher Tabs */}
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900/60 no-print">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
            mobileTab === "edit"
              ? "border-blue-500 text-blue-400 bg-blue-500/10"
              : "border-transparent text-slate-400"
          }`}
        >
          <Edit3 className="size-3.5" />
          <span>Editor & Items</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
            mobileTab === "preview"
              ? "border-blue-500 text-blue-400 bg-blue-500/10"
              : "border-transparent text-slate-400"
          }`}
        >
          <Eye className="size-3.5" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:block print:max-w-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:m-0 print:p-0">
          {/* Left Column: Form & Item Controls (5 cols) */}
          <div
            className={`lg:col-span-5 no-print ${
              mobileTab === "edit" ? "block" : "hidden lg:block"
            }`}
          >
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}
              onOpenFontDialog={() => setIsFontDialogOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              isDownloading={isDownloading}
            />
          </div>

          {/* Right Column: Live A4 Document Preview (7 cols) */}
          <div
            ref={previewContainerRef}
            className={`lg:col-span-7 flex flex-col items-center print:block print:p-0 print:m-0 ${
              mobileTab === "preview" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Preview Toolbar */}
            <div className="w-full max-w-[210mm] flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs no-print">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-300">Live A4 Document Preview</span>
                <span className="text-[10px] font-mono text-slate-500">(210mm × 297mm)</span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.max(0.5, s - 0.1))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-slate-300 w-12 text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}
                  title="Zoom In"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.85)}
                  title="Reset Zoom"
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-800"
                >
                  <Maximize2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="w-full overflow-x-auto flex justify-center py-4 bg-slate-950/40 rounded-3xl border border-slate-800/40 shadow-inner print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:block print:overflow-visible">
              <InvoicePreview data={invoiceData} scale={previewScale} />
            </div>
          </div>
        </div>
      </main>

      {/* Font Chooser Modal Dialog */}
      <FontChooserDialog
        isOpen={isFontDialogOpen}
        onClose={() => setIsFontDialogOpen(false)}
        selectedFont={invoiceData.font}
        onSelectFont={handleSelectFont}
      />
    </div>
  );
}
