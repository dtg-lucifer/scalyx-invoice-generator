"use client";

import React, { useEffect } from "react";
import { FontType } from "@/types/invoice";
import { Check, X, Type } from "lucide-react";

interface FontOption {
  id: FontType;
  name: string;
  className: string;
  description: string;
  sample: string;
}

const FONT_OPTIONS: FontOption[] = [
  {
    id: "poppins",
    name: "Poppins",
    className: "font-poppins",
    description: "Geometric & Modern — Matches Scalyx website branding",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
  {
    id: "roboto",
    name: "Roboto",
    className: "font-roboto",
    description: "Clean & Professional — High legibility neo-grotesque standard",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
  {
    id: "systemfont",
    name: "System Font",
    className: "font-systemfont",
    description: "Native & Neutral — Default system UI typography (SF Pro / Segoe UI)",
    sample: "The quick brown fox jumps over the lazy dog. 0123456789",
  },
];

interface FontChooserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFont: FontType;
  onSelectFont: (font: FontType) => void;
}

export default function FontChooserDialog({
  isOpen,
  onClose,
  selectedFont,
  onSelectFont,
}: FontChooserDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Choose Invoice Typography</h3>
              <p className="text-xs text-slate-400">
                Select a font to customize both the preview and exported A4 PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font List */}
        <div className="p-6 space-y-3.5">
          {FONT_OPTIONS.map((option) => {
            const isSelected = selectedFont === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSelectFont(option.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all relative flex flex-col gap-2 ${
                  isSelected
                    ? "bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-slate-800/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-base font-bold text-white ${option.className}`}>
                      {option.name}
                    </span>
                    {option.id === "poppins" && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                        Scalyx Default
                      </span>
                    )}
                  </div>
                  <div
                    className={`size-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "border border-slate-600 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-400">{option.description}</p>

                <div
                  className={`mt-1 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 tracking-wide ${option.className}`}
                >
                  <p className="font-semibold text-sm text-slate-200">
                    INVOICE #INV-2026-001 • Total: ₹85,000.00
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{option.sample}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Current: <strong className="text-white capitalize">{selectedFont}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
