"use client";

import React, { useState, useRef } from "react";
import { InvoiceData, InvoiceItem, SCALYX_DEFAULTS, INITIAL_INVOICE_DATA } from "@/types/invoice";
import {
  Plus,
  Trash2,
  Download,
  Printer,
  Type,
  Building2,
  User,
  FileText,
  RotateCcw,
} from "lucide-react";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  onOpenFontDialog: () => void;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "AED", symbol: "AED", label: "AED (AED) - UAE Dirham" },
];

export default function InvoiceForm({
  data,
  onChange,
  onOpenFontDialog,
  onDownloadPdf,
  isDownloading,
}: InvoiceFormProps) {
  // Two inputs for adding a record
  const [itemInput, setItemInput] = useState("");
  const [costInput, setCostInput] = useState("");
  const [inputError, setInputError] = useState("");
  const itemInputRef = useRef<HTMLInputElement>(null);

  // Active tab for secondary details
  const [activeSection, setActiveSection] = useState<"client" | "meta" | "company">("client");

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedItem = itemInput.trim();
    const parsedCost = parseFloat(costInput);

    if (!trimmedItem) {
      setInputError("Please enter an item description");
      itemInputRef.current?.focus();
      return;
    }

    if (isNaN(parsedCost) || parsedCost <= 0) {
      setInputError("Please enter a valid cost greater than 0");
      return;
    }

    setInputError("");

    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      description: trimmedItem,
      cost: parsedCost,
    };

    onChange({
      ...data,
      items: [...data.items, newItem],
    });

    setItemInput("");
    setCostInput("");
    itemInputRef.current?.focus();
  };

  const handleRemoveItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const found = CURRENCIES.find((c) => c.code === currencyCode);
    if (found) {
      onChange({
        ...data,
        currency: found.code,
        currencySymbol: found.symbol,
      });
    }
  };

  const handleResetToSample = () => {
    onChange({
      ...INITIAL_INVOICE_DATA,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    });
  };

  const handleClearItems = () => {
    onChange({
      ...data,
      items: [],
    });
  };

  const subtotal = data.items.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
  const taxAmount = (subtotal * (Number(data.taxRate) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="space-y-6">
      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Font Dialog Trigger */}
          <button
            type="button"
            onClick={onOpenFontDialog}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:border-slate-500 shadow-sm"
          >
            <Type className="size-4 text-blue-400" />
            <span>Font:</span>
            <span className="capitalize text-white bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 font-medium">
              {data.font}
            </span>
          </button>

          {/* Sample Data Reset */}
          <button
            type="button"
            onClick={handleResetToSample}
            title="Load sample invoice data"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all"
          >
            <RotateCcw className="size-3.5" />
            <span>Sample</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Printer className="size-4" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            {isDownloading ? (
              <>
                <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating A4 PDF...</span>
              </>
            ) : (
              <>
                <Download className="size-4" />
                <span>Download A4 PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CORE REQUIREMENT: 2 Inputs for Item and Cost + Button to Add Record */}
      <div className="p-5 bg-slate-900/90 border-2 border-blue-500/40 rounded-2xl shadow-xl shadow-blue-950/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Plus className="size-4" />
            </div>
            <h2 className="text-base font-bold text-white">Add Item to Invoice</h2>
          </div>
          <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-0.5 rounded-full">
            2 Inputs Form
          </span>
        </div>

        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Input 1: Item */}
            <div className="sm:col-span-2">
              <label
                htmlFor="item-name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Item Name / Description <span className="text-blue-400">*</span>
              </label>
              <input
                ref={itemInputRef}
                id="item-name"
                type="text"
                placeholder="e.g. Full-Stack Web App Development"
                value={itemInput}
                onChange={(e) => {
                  setItemInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-500 text-sm transition-all"
              />
            </div>

            {/* Input 2: Cost */}
            <div>
              <label
                htmlFor="item-cost"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Cost ({data.currencySymbol}) <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                  {data.currencySymbol}
                </span>
                <input
                  id="item-cost"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="25000"
                  value={costInput}
                  onChange={(e) => {
                    setCostInput(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-white placeholder-slate-500 text-sm font-mono transition-all"
                />
              </div>
            </div>
          </div>

          {inputError && (
            <p className="text-xs text-rose-400 font-medium">{inputError}</p>
          )}

          {/* Add Record Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all"
          >
            <Plus className="size-4" />
            <span>Add Record to Invoice</span>
          </button>
        </form>
      </div>

      {/* Item Records Table & Live Total */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Invoice Records ({data.items.length})
            </h3>
          </div>
          {data.items.length > 0 && (
            <button
              type="button"
              onClick={handleClearItems}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {data.items.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <p className="text-xs text-slate-400">
              No items in the invoice yet. Enter an item and cost above to add your first record!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {data.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 max-w-[65%]">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-slate-200 truncate">
                    {item.description}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-emerald-400">
                    {data.currencySymbol} {Number(item.cost).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove item"
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Total Calculation Summary */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Amount Due
          </span>
          <div className="text-right">
            <span className="text-lg font-mono font-black text-white">
              {data.currencySymbol} {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion / Tabbed Settings: Client, Invoice Meta, Company Details */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex border-b border-slate-800 gap-1 pb-2">
          <button
            type="button"
            onClick={() => setActiveSection("client")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === "client"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="size-3.5" />
            Client Details
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("meta")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === "meta"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="size-3.5" />
            Invoice & Tax
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("company")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSection === "company"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="size-3.5" />
            Company (Scalyx)
          </button>
        </div>

        {/* Client Details Section */}
        {activeSection === "client" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client / Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corporation"
                value={data.client.name}
                onChange={(e) =>
                  onChange({
                    ...data,
                    client: { ...data.client, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  placeholder="billing@acmecorp.com"
                  value={data.client.email}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      client: { ...data.client, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Client Phone
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={data.client.phone || ""}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      client: { ...data.client, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Client Address
              </label>
              <textarea
                rows={2}
                placeholder="Bangalore, Karnataka, India"
                value={data.client.address || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    client: { ...data.client, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Invoice Metadata Section */}
        {activeSection === "meta" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => onChange({ ...data, issueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={data.currency}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tax / GST Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={data.taxRate}
                    onChange={(e) =>
                      onChange({ ...data, taxRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Payment Details / Instructions
              </label>
              <input
                type="text"
                value={data.paymentDetails}
                onChange={(e) => onChange({ ...data, paymentDetails: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Notes & Terms
              </label>
              <textarea
                rows={2}
                value={data.notes}
                onChange={(e) => onChange({ ...data, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Company Section (Scalyx) */}
        {activeSection === "company" && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-300 flex items-center justify-between">
              <span>Fetched live from <strong>https://scalyx.in</strong></span>
              <button
                type="button"
                onClick={() => onChange({ ...data, company: SCALYX_DEFAULTS })}
                className="text-[11px] underline hover:text-white"
              >
                Reset to Scalyx
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={data.company.name}
                onChange={(e) =>
                  onChange({
                    ...data,
                    company: { ...data.company, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Website Link
                </label>
                <input
                  type="text"
                  value={data.company.website}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      company: { ...data.company, website: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Support Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={data.company.phone}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      company: { ...data.company, phone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company Tagline / Subtitle
              </label>
              <input
                type="text"
                value={data.company.tagline}
                onChange={(e) =>
                  onChange({
                    ...data,
                    company: { ...data.company, tagline: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
