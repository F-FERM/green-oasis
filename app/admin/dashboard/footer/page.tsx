"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// ================= CONFIG =================

const ENDPOINT = "/footer";

// ================= TYPES =================

interface OfficeItem {
  _id?: string;
  label: string;
  name: string;
  address: string;
  order: number;
  isActive: boolean;
}

interface NavItem {
  _id?: string;
  label: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface FooterPayload {
  eyebrow: string;
  heading: string;
  buttonText: string;
  buttonLink: string;
  callLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  locationsLabel: string;
  locationsHeading: string;
  offices: OfficeItem[];
  brandName: string;
  navigation: NavItem[];
  marqueeText: string;
  copyright: string;
  tagline: string;
  isActive: boolean;
}

interface Footer extends FooterPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type ListResponse =
  | Footer[]
  | { footers: Footer[] }
  | { footer: Footer }
  | Footer;

const EMPTY_FORM: FooterPayload = {
  eyebrow: "",
  heading: "",
  buttonText: "PLAN YOUR JOURNEY",
  buttonLink: "/contact",
  callLabel: "CALL US",
  phone: "",
  emailLabel: "WRITE TO US",
  email: "",
  locationsLabel: "FIND US",
  locationsHeading: "",
  offices: [],
  brandName: "Green Oasis",
  navigation: [],
  marqueeText: "",
  copyright: "",
  tagline: "",
  isActive: true,
};

// ================= HELPERS =================

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response &&
    err.response.data &&
    typeof err.response.data === "object" &&
    "message" in err.response.data
  ) {
    return String(err.response.data.message);
  }
  return fallback;
}

function parseFooterList(data: unknown): Footer[] {
  if (Array.isArray(data)) return data as Footer[];
  if (data && typeof data === "object") {
    if (
      "footers" in data &&
      Array.isArray((data as { footers: Footer[] }).footers)
    ) {
      return (data as { footers: Footer[] }).footers;
    }
    if ("footer" in data && data.footer) {
      return [data.footer as Footer];
    }
    if ("brandName" in data) return [data as Footer];
  }
  return [];
}

function stripId<T extends { _id?: string }>(item: T): Omit<T, "_id"> {
  const { _id, ...rest } = item;
  void _id;
  return rest;
}

function mapEntryToForm(entry: Footer): FooterPayload {
  return {
    eyebrow: entry.eyebrow || "",
    heading: entry.heading || "",
    buttonText: entry.buttonText || "PLAN YOUR JOURNEY",
    buttonLink: entry.buttonLink || "/contact",
    callLabel: entry.callLabel || "CALL US",
    phone: entry.phone || "",
    emailLabel: entry.emailLabel || "WRITE TO US",
    email: entry.email || "",
    locationsLabel: entry.locationsLabel || "FIND US",
    locationsHeading: entry.locationsHeading || "",
    offices: [...(entry.offices || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((o) => ({ ...o })),
    brandName: entry.brandName || "Green Oasis",
    navigation: [...(entry.navigation || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((n) => ({ ...n })),
    marqueeText: entry.marqueeText || "",
    copyright: entry.copyright || "",
    tagline: entry.tagline || "",
    isActive: entry.isActive ?? true,
  };
}

function serializePayload(form: FooterPayload): FooterPayload {
  return {
    ...form,
    offices: form.offices.map(stripId),
    navigation: form.navigation.map(stripId),
  };
}

// ================= REUSABLE FIELDS =================

function FormField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30 sm:h-[48px]"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 2,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="rounded-[12px] border-[#E4E4E4] bg-white text-[14px] focus-visible:ring-[#67003E]/30"
      />
    </div>
  );
}

// ================= SECTION ACCORDION =================

function SectionAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[14px] border border-[#E4E4E4] bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-[14px] py-[12px] text-left"
      >
        <span className="text-[14px] font-semibold text-[#111111]">{title}</span>
        <ChevronDown
          className={`h-[16px] w-[16px] text-[#666666] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="space-y-[12px] border-t border-[#ECECEC] p-[14px]">
          {children}
        </div>
      )}
    </div>
  );
}

// ================= NESTED LIST EDITOR =================

function NestedListEditor<
  T extends { _id?: string; order?: number; isActive?: boolean },
>({
  items,
  onChange,
  emptyItem,
  addLabel,
  renderItem,
  getLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  getLabel: (item: T) => string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const add = () => {
    onChange([...items, { ...emptyItem }]);
    setOpenIndex(items.length);
  };

  const update = (index: number, patch: Partial<T>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const remove = (index: number) => {
    onChange(
      items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i })),
    );
    setOpenIndex(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, i) => ({ ...item, order: i })));
    setOpenIndex(target);
  };

  return (
    <div className="rounded-[12px] border border-[#ECECEC] p-[12px]">
      <div className="mb-[10px] flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#666666]">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        <Button
          type="button"
          onClick={add}
          className="h-[34px] gap-[6px] rounded-[8px] bg-[#67003E] px-[10px] text-[12px] font-medium text-white hover:bg-[#4F0030]"
        >
          <Plus className="h-[12px] w-[12px]" />
          {addLabel}
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-[12px] text-[#888888]">No items yet.</p>
      )}

      <div className="space-y-[8px]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item._id || `item-${index}`}
              className="rounded-[10px] border border-[#ECECEC] bg-white"
            >
              <div className="flex items-center gap-[6px] px-[10px] py-[8px]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="min-w-0 flex-1 truncate text-left text-[13px] font-medium text-[#111111]"
                >
                  {index + 1}. {getLabel(item)}
                </button>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="px-[4px] text-[12px] text-[#666666] disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="px-[4px] text-[12px] text-[#666666] disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="px-[4px] text-[#DC2626] hover:text-[#b91c1c]"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-[13px] w-[13px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="px-[4px] text-[#666666]"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  <ChevronDown
                    className={`h-[14px] w-[14px] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-[#ECECEC] p-[10px]">
                  {renderItem(item, (patch) => update(index, patch))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActiveToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#E4E4E4] px-[12px] py-[8px]">
      <span className="text-[12px] text-[#666666]">Active</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// ================= MAIN PAGE =================

export default function FooterAdminPage() {
  const [entries, setEntries] = useState<Footer[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FooterPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Footer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------- LOAD ----------

  const fetchFooters = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseFooterList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load footer content"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooters();
  }, []);

  // ---------- MODAL ----------

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (entry: Footer) => {
    setEditingId(entry._id);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const patch = <K extends keyof FooterPayload>(
    key: K,
    value: FooterPayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.heading.trim()) {
      toast.error("Heading is required");
      return;
    }
    if (!form.brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const payload = serializePayload(form);

    try {
      setSubmitting(true);
      if (editingId) {
        await api.patch(`${ENDPOINT}/${editingId}`, payload);
        toast.success("Footer updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Footer created");
      }
      closeModal();
      fetchFooters();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId ? "Failed to update footer" : "Failed to create footer",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ----------

  const toggleActive = async (entry: Footer) => {
    try {
      setTogglingId(entry._id);
      await api.patch(`${ENDPOINT}/${entry._id}`, { isActive: !entry.isActive });
      setEntries((prev) =>
        prev.map((item) =>
          item._id === entry._id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
      toast.success(entry.isActive ? "Footer deactivated" : "Footer activated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    } finally {
      setTogglingId(null);
    }
  };

  // ---------- DELETE ----------

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget._id);
      await api.delete(`${ENDPOINT}/${deleteTarget._id}`);
      setEntries((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Footer deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete footer"));
    } finally {
      setDeletingId(null);
    }
  };

  // ---------- RENDER ----------

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
          success: { iconTheme: { primary: "#67003E", secondary: "#fff" } },
          error: { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />

      {/* HEADER */}
      <div className="mx-auto flex max-w-[1600px] flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.5px] text-[#111111] xs:text-[24px] sm:text-[28px] lg:text-[32px]">
            Footer Content
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the footer, offices, navigation links and branding.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Footer
        </Button>
      </div>

      {/* LIST */}
      <div className="mx-auto mt-[22px] max-w-[1600px] sm:mt-[28px] lg:mt-[32px]">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center sm:min-h-[240px]">
            <Loader2 className="h-[26px] w-[26px] animate-spin text-[#67003E] sm:h-[28px] sm:w-[28px]" />
          </div>
        ) : entries.length === 0 ? (
          <Card className="rounded-[20px] border border-dashed border-[#D4B8A8] bg-white/60 sm:rounded-[24px]">
            <CardContent className="flex flex-col items-center justify-center gap-[10px] p-[32px] text-center sm:p-[48px]">
              <Plus className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No footer content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create the footer content record.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {entries.map((entry) => (
              <Card
                key={entry._id}
                className="overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]"
              >
                <CardContent className="p-[18px] sm:p-[22px]">
                  <div className="flex items-start justify-between gap-[12px]">
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                        {entry.eyebrow}
                      </p>
                      <h3 className="mt-[4px] line-clamp-2 text-[17px] font-semibold text-[#111111]">
                        {entry.heading}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleActive(entry)}
                      disabled={togglingId === entry._id}
                      className={`shrink-0 rounded-full px-[10px] py-[5px] text-[11px] font-medium transition-colors ${
                        entry.isActive
                          ? "bg-[#67003E] text-white"
                          : "bg-[#E4E4E4] text-[#666666]"
                      }`}
                    >
                      {togglingId === entry._id
                        ? "..."
                        : entry.isActive
                          ? "Active"
                          : "Inactive"}
                    </button>
                  </div>

                  <div className="mt-[12px] grid grid-cols-1 gap-[8px] xs:grid-cols-2">
                    <div className="rounded-[10px] bg-[#F8F0F5] p-[10px]">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                        {entry.callLabel}
                      </p>
                      <p className="mt-[2px] text-[13px] font-medium text-[#111111]">
                        {entry.phone || "—"}
                      </p>
                    </div>
                    <div className="rounded-[10px] bg-[#F8F0F5] p-[10px]">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                        {entry.emailLabel}
                      </p>
                      <p className="mt-[2px] truncate text-[13px] font-medium text-[#111111]">
                        {entry.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-[10px]">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                      {entry.locationsLabel}
                    </p>
                    <p className="mt-[2px] text-[13px] font-medium text-[#111111]">
                      {entry.locationsHeading}
                    </p>
                    <div className="mt-[6px] flex flex-wrap gap-[6px]">
                      {entry.offices?.map((office, idx) => (
                        <span
                          key={office._id || idx}
                          className="rounded-full bg-white px-[10px] py-[4px] text-[11px] text-[#67003E] ring-1 ring-[#E4E4E4]"
                        >
                          {office.name}
                        </span>
                      ))}
                      {(entry.offices?.length ?? 0) === 0 && (
                        <span className="text-[11px] text-[#999]">
                          No offices
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-[10px] flex flex-wrap gap-[6px]">
                    {entry.navigation?.map((nav, idx) => (
                      <span
                        key={nav._id || idx}
                        className="rounded-full bg-[#F8F0F5] px-[10px] py-[4px] text-[11px] text-[#67003E]"
                      >
                        {nav.label}
                      </span>
                    ))}
                  </div>

                  <p className="mt-[12px] text-[11px] italic text-[#888888]">
                    {entry.tagline}
                  </p>
                  <p className="mt-[2px] text-[11px] text-[#999]">
                    {entry.copyright}
                  </p>

                  <div className="mt-[14px] flex gap-2">
                    <Button
                      onClick={() => openEdit(entry)}
                      variant="outline"
                      className="h-[36px] flex-1 gap-[6px] rounded-[10px] border-[#D4B8A8] text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5]"
                    >
                      <Pencil className="h-[13px] w-[13px]" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => setDeleteTarget(entry)}
                      variant="outline"
                      className="h-[36px] w-[36px] rounded-[10px] border-[#F3D0D0] p-0 text-[#DC2626] hover:bg-[#FEF2F2]"
                    >
                      <Trash2 className="h-[14px] w-[14px]" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[4px] sm:items-center sm:p-[20px]"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[820px] sm:rounded-[28px] sm:p-[32px] md:max-w-[900px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {editingId ? "Edit Footer" : "Create Footer"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                  aria-label="Close"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[12px] sm:mt-[22px]">
                {/* ---------- CONNECT / CTA ---------- */}
                <SectionAccordion title="Connect / CTA" defaultOpen>
                  <FormField
                    label="Eyebrow"
                    value={form.eyebrow}
                    onChange={(v) => patch("eyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.heading}
                    onChange={(v) => patch("heading", v)}
                  />
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Button Text"
                      value={form.buttonText}
                      onChange={(v) => patch("buttonText", v)}
                    />
                    <FormField
                      label="Button Link"
                      value={form.buttonLink}
                      onChange={(v) => patch("buttonLink", v)}
                    />
                  </div>
                </SectionAccordion>

                {/* ---------- CONTACT ---------- */}
                <SectionAccordion title="Contact Details">
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Call Label"
                      value={form.callLabel}
                      onChange={(v) => patch("callLabel", v)}
                    />
                    <FormField
                      label="Phone"
                      value={form.phone}
                      onChange={(v) => patch("phone", v)}
                    />
                    <FormField
                      label="Email Label"
                      value={form.emailLabel}
                      onChange={(v) => patch("emailLabel", v)}
                    />
                    <FormField
                      label="Email"
                      value={form.email}
                      onChange={(v) => patch("email", v)}
                    />
                  </div>
                </SectionAccordion>

                {/* ---------- LOCATIONS / OFFICES ---------- */}
                <SectionAccordion title="Locations & Offices">
                  <FormField
                    label="Locations Label"
                    value={form.locationsLabel}
                    onChange={(v) => patch("locationsLabel", v)}
                  />
                  <FormField
                    label="Locations Heading"
                    value={form.locationsHeading}
                    onChange={(v) => patch("locationsHeading", v)}
                  />
                  <NestedListEditor
                    items={form.offices}
                    onChange={(items) => patch("offices", items)}
                    emptyItem={{
                      label: "",
                      name: "",
                      address: "",
                      order: 0,
                      isActive: true,
                    }}
                    addLabel="Add Office"
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.label}
                          onChange={(e) => update({ label: e.target.value })}
                          placeholder="01 / HEAD OFFICE"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Input
                          value={item.name}
                          onChange={(e) => update({ name: e.target.value })}
                          placeholder="Malappuram"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Textarea
                          value={item.address}
                          onChange={(e) => update({ address: e.target.value })}
                          rows={3}
                          placeholder="Full address"
                          className="rounded-[10px] text-[13px]"
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.name || "Untitled office"}
                  />
                </SectionAccordion>

                {/* ---------- BRAND & NAVIGATION ---------- */}
                <SectionAccordion title="Brand & Navigation">
                  <FormField
                    label="Brand Name"
                    value={form.brandName}
                    onChange={(v) => patch("brandName", v)}
                  />
                  <NestedListEditor
                    items={form.navigation}
                    onChange={(items) => patch("navigation", items)}
                    emptyItem={{
                      label: "",
                      link: "",
                      order: 0,
                      isActive: true,
                    }}
                    addLabel="Add Nav Link"
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.label}
                          onChange={(e) => update({ label: e.target.value })}
                          placeholder="Our Story"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Input
                          value={item.link}
                          onChange={(e) => update({ link: e.target.value })}
                          placeholder="/about"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.label || "Untitled link"}
                  />
                </SectionAccordion>

                {/* ---------- BOTTOM BAR ---------- */}
                <SectionAccordion title="Bottom Bar">
                  <FormField
                    label="Marquee Text"
                    value={form.marqueeText}
                    onChange={(v) => patch("marqueeText", v)}
                  />
                  <FormField
                    label="Copyright"
                    value={form.copyright}
                    onChange={(v) => patch("copyright", v)}
                  />
                  <TextareaField
                    label="Tagline"
                    value={form.tagline}
                    onChange={(v) => patch("tagline", v)}
                    rows={2}
                  />
                </SectionAccordion>

                {/* ---------- ACTIVE SWITCH ---------- */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this footer on the website
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) => patch("isActive", checked)}
                  />
                </div>

                {/* ---------- ACTIONS ---------- */}
                <div className="flex flex-col gap-[10px] pt-[4px] xs:flex-row xs:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={submitting}
                    className="h-[46px] rounded-[12px] border-[#E4E4E4] bg-white px-[18px] text-[14px] text-[#666666]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Footer"
                    ) : (
                      "Create Footer"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
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
                Delete Footer?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove the footer for &quot;{deleteTarget.brandName}&quot;
                , its offices and navigation links.
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
                  {deletingId ? "Deleting..." : "Delete Footer"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}