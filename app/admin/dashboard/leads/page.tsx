"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get<Lead[]>("/leads");
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load leads:", err);
      toast.error("Failed to load leads content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const res = await api.get("/leads/export-excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads.xls");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Excel exported successfully");
    } catch (err) {
      console.error("Failed to export Excel:", err);
      toast.error("Failed to export Excel file");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`/leads/${deleteTarget._id}`);
      setLeads((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Lead deleted successfully");
    } catch (err) {
      console.error("Failed to delete lead:", err);
      toast.error("Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      lead.name?.toLowerCase().includes(term) ||
      lead.phone?.toLowerCase().includes(term) ||
      lead.city?.toLowerCase().includes(term) ||
      lead.state?.toLowerCase().includes(term)
    );
  });

  return (
    <section className="min-h-screen bg-[#F8F0F5] px-[16px] py-[24px] xs:px-[20px] sm:px-[28px] sm:py-[36px] md:px-[36px] lg:px-[48px] lg:py-[48px] 2xl:px-[64px]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#111111",
            color: "#fff",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#004530", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Collected Leads
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            View and export customer leads submitted from the website popup
            modal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-[10px]">
          <Button
            onClick={fetchLeads}
            variant="outline"
            disabled={loading}
            className="h-[46px] gap-[8px] rounded-[14px] border-[#E4E4E4] bg-white text-[14px] font-medium text-[#111] hover:bg-[#F4F1EA]"
          >
            <RefreshCw
              className={`h-[16px] w-[16px] ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleExportExcel}
            disabled={exporting || leads.length === 0}
            className="flex h-[46px] items-center justify-center gap-[8px] rounded-[14px] bg-[#004530] text-[14px] font-medium text-white hover:bg-[#003323] hover:shadow-[0_14px_30px_rgba(0,69,48,0.3)] disabled:opacity-50 sm:h-[48px] sm:px-[22px] sm:text-[15px]"
          >
            {exporting ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-[18px] w-[18px]" />
                Export to Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* SEARCH BAR & STATS */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[360px]">
            <Search className="absolute left-[14px] top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-[#888888]" />
            <Input
              type="text"
              placeholder="Search by name, phone, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[46px] rounded-[14px] border-[#E4E4E4] bg-white pl-[40px] text-[14px] focus-visible:ring-[#004530]/30"
            />
          </div>

          <div className="flex items-center gap-[8px] text-[13px] font-medium text-[#555555]">
            <UserCheck className="h-[16px] w-[16px] text-[#004530]" />
            <span>Total Leads: {leads.length}</span>
            {searchTerm && <span>({filteredLeads.length} matching)</span>}
          </div>
        </div>

        {/* LIST / TABLE */}
        <div className="mt-[16px]">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="h-[28px] w-[28px] animate-spin text-[#004530]" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
              <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
                <FileSpreadsheet className="h-[32px] w-[32px] text-[#004530]/40" />
                <p className="text-[15px] font-medium text-[#333333]">
                  {searchTerm
                    ? "No leads matching your search"
                    : "No leads collected yet"}
                </p>
                <p className="text-[13px] text-[#888888]">
                  {searchTerm
                    ? "Try searching with a different name, phone number, city, or state."
                    : "When users submit the modal on the website, lead records will appear here."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-[20px] border border-white/80 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead className="border-b border-[#ECECEC] bg-[#FDFBF7] text-[12px] font-semibold uppercase tracking-wider text-[#666666]">
                    <tr>
                      <th className="px-[20px] py-[14px]">#</th>
                      <th className="px-[20px] py-[14px]">Name</th>
                      <th className="px-[20px] py-[14px]">Phone Number</th>
                      <th className="px-[20px] py-[14px]">City</th>
                      <th className="px-[20px] py-[14px]">State</th>
                      <th className="px-[20px] py-[14px]">Submitted At</th>
                      <th className="px-[20px] py-[14px] text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECECEC]">
                    {filteredLeads.map((lead, index) => (
                      <tr
                        key={lead._id}
                        className="transition-colors hover:bg-[#F8F0F5]/50"
                      >
                        <td className="px-[20px] py-[16px] text-[13px] text-[#888888]">
                          {index + 1}
                        </td>
                        <td className="px-[20px] py-[16px] font-semibold text-[#111111]">
                          {lead.name}
                        </td>
                        <td className="px-[20px] py-[16px] font-medium text-[#004530]">
                          {lead.phone}
                        </td>
                        <td className="px-[20px] py-[16px] text-[#444444]">
                          {lead.city || "—"}
                        </td>
                        <td className="px-[20px] py-[16px] text-[#444444]">
                          {lead.state || "—"}
                        </td>
                        <td className="px-[20px] py-[16px] text-[13px] text-[#666666]">
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "—"}
                        </td>
                        <td className="px-[20px] py-[16px] text-right">
                          <Button
                            onClick={() => setDeleteTarget(lead)}
                            variant="outline"
                            className="h-[36px] w-[36px] rounded-[10px] border-[#F3D0D0] p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                          >
                            <Trash2 className="h-[14px] w-[14px]" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[20px] backdrop-blur-[4px]"
            onClick={() => !deletingId && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-[20px] bg-white p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
            >
              <h3 className="text-[18px] font-semibold text-[#111111]">
                Delete Lead?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                Are you sure you want to delete lead for &quot;
                {deleteTarget.name}&quot;? This action cannot be undone.
              </p>
              <div className="mt-[18px] flex flex-col gap-[10px] xs:flex-row xs:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] text-[#666666]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={!!deletingId}
                  className="h-[42px] rounded-[10px] bg-[#DC2626] text-[13px] font-medium text-white hover:bg-[#DC2626]"
                >
                  {deletingId ? "Deleting..." : "Delete Lead"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
