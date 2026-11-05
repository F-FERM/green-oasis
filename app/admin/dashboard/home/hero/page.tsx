"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ImagePlus,
  Loader2,
  Monitor,
  Pencil,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { fileUpload } from "@/app/api/admin/upload/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ================= CONFIG =================

const ENDPOINT = "/home-hero";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface HomeHeroPayload {
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  marqueeTexts: string[];
  isActive: boolean;
}

interface HomeHero extends HomeHeroPayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// GET /home-hero -> HomeHero[] | { homeHeroes: HomeHero[] } | HomeHero
type ListResponse =
  | HomeHero[]
  | { homeHeroes: HomeHero[] }
  | { homeHero: HomeHero }
  | HomeHero;

const EMPTY_FORM: HomeHeroPayload = {
  desktopImage: "",
  tabletImage: "",
  mobileImage: "",
  marqueeTexts: [],
  isActive: true,
};

// ================= HELPERS =================

function resolveImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

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

function parseHomeHeroList(data: unknown): HomeHero[] {
  if (Array.isArray(data)) return data as HomeHero[];
  if (data && typeof data === "object") {
    if (
      "homeHeroes" in data &&
      Array.isArray((data as { homeHeroes: HomeHero[] }).homeHeroes)
    ) {
      return (data as { homeHeroes: HomeHero[] }).homeHeroes;
    }
    // Some singleton endpoints return { homeHero: {...} } or the bare object.
    if ("homeHero" in data && data.homeHero) {
      return [data.homeHero as HomeHero];
    }
    if ("desktopImage" in data) {
      return [data as HomeHero];
    }
  }
  return [];
}

function mapEntryToForm(entry: HomeHero): HomeHeroPayload {
  return {
    desktopImage: entry.desktopImage || "",
    tabletImage: entry.tabletImage || "",
    mobileImage: entry.mobileImage || "",
    marqueeTexts: Array.isArray(entry.marqueeTexts) ? [...entry.marqueeTexts] : [],
    isActive: entry.isActive ?? true,
  };
}

// ================= STRING LIST MANAGER (for marqueeTexts) =================

function StringListManager({
  items,
  onChange,
  label,
  placeholder,
  description,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
  description?: string;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const value = draft.trim();
    if (!value) {
      toast.error("Value is required");
      return;
    }
    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error(`"${value}" already exists`);
      return;
    }
    onChange([...items, value]);
    setDraft("");
    toast.success("Marquee text added");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    toast.success("Marquee text removed");
  };

  return (
    <div>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      {description && (
        <p className="mb-[8px] text-[11px] text-[#888888]">{description}</p>
      )}

      {items.length > 0 && (
        <div className="mb-[10px] flex flex-wrap gap-[8px]">
          {items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-[6px] rounded-full border border-[#E4E4E4] bg-[#F8F0F5] py-[5px] pl-[12px] pr-[6px] text-[12px] text-[#67003E]"
            >
              <span className="font-medium">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                aria-label={`Remove ${item}`}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[#67003E]/70 transition-colors hover:bg-[#67003E]/10 hover:text-[#67003E]"
              >
                <X className="h-[11px] w-[11px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-[8px]">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px] focus-visible:ring-[#67003E]/30"
        />
        <Button
          type="button"
          onClick={addItem}
          className="h-[42px] shrink-0 gap-[6px] rounded-[10px] bg-[#67003E] px-[14px] text-[13px] font-medium text-white hover:bg-[#4F0030]"
        >
          <Plus className="h-[14px] w-[14px]" />
          Add
        </Button>
      </div>
    </div>
  );
}

// ================= IMAGE UPLOAD FIELD =================

function ImageUploadField({
  label,
  icon,
  value,
  onUploaded,
  onClear,
  inputRef,
  uploading,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onUploaded: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  uploading: boolean;
}) {
  return (
    <div className="rounded-[14px] border border-[#D4B8A8] bg-[#F8F0F5] p-[14px]">
      <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
        {icon}
        {label}
      </Label>

      {value && (
        <div className="relative mb-[10px] h-[120px] w-full overflow-hidden rounded-[12px] bg-[#E8D5E0]">
          <Image
            src={resolveImage(value)}
            alt={label}
            fill
            unoptimized
            className="object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            aria-label={`Remove ${label}`}
          >
            <X className="h-[12px] w-[12px]" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onUploaded}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="h-[42px] w-full gap-[8px] rounded-[10px] border-[#D4B8A8] bg-white text-[13px] font-medium text-[#67003E] hover:bg-[#F8F0F5] hover:text-[#67003E]"
      >
        {uploading ? (
          <Loader2 className="h-[14px] w-[14px] animate-spin" />
        ) : (
          <UploadCloud className="h-[14px] w-[14px]" />
        )}
        {value ? "Replace Image" : "Upload Image"}
      </Button>
    </div>
  );
}

// ================= MAIN PAGE =================

export default function HomeHeroAdminPage() {
  const [entries, setEntries] = useState<HomeHero[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HomeHeroPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [uploading, setUploading] = useState<
    null | "desktopImage" | "tabletImage" | "mobileImage"
  >(null);

  const [deleteTarget, setDeleteTarget] = useState<HomeHero | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const tabletInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // ---------- LOAD ----------

  const fetchHomeHeroes = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseHomeHeroList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load home hero sections"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeHeroes();
  }, []);

  // ---------- MODAL ----------

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (entry: HomeHero) => {
    setEditingId(entry._id);
    setForm(mapEntryToForm(entry));
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting || uploading) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ---------- IMAGE UPLOAD ----------

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "desktopImage" | "tabletImage" | "mobileImage",
    ref: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(field);
      const result = await fileUpload(file);
      setForm((prev) => ({ ...prev, [field]: result.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(null);
      if (ref.current) ref.current.value = "";
    }
  };

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.desktopImage.trim()) {
      toast.error("Desktop image is required");
      return;
    }
    if (!form.tabletImage.trim()) {
      toast.error("Tablet image is required");
      return;
    }
    if (!form.mobileImage.trim()) {
      toast.error("Mobile image is required");
      return;
    }
    if (form.marqueeTexts.length === 0) {
      toast.error("At least one marquee text is required");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        // If your backend only supports a singleton PATCH /home-hero, drop the
        // `/${editingId}` below and send the _id inside the payload instead.
        await api.patch(`${ENDPOINT}/${editingId}`, form);
        toast.success("Home hero updated");
      } else {
        await api.post(ENDPOINT, form);
        toast.success("Home hero created");
      }

      closeModal();
      fetchHomeHeroes();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId
            ? "Failed to update home hero"
            : "Failed to create home hero",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ACTIVE ----------

  const toggleActive = async (entry: HomeHero) => {
    try {
      setTogglingId(entry._id);
      await api.patch(`${ENDPOINT}/${entry._id}`, { isActive: !entry.isActive });
      setEntries((prev) =>
        prev.map((item) =>
          item._id === entry._id ? { ...item, isActive: !item.isActive } : item,
        ),
      );
      toast.success(entry.isActive ? "Section deactivated" : "Section activated");
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
      toast.success("Home hero deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete home hero"));
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
            Home Hero Section
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage the homepage hero images and marquee text.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Hero Section
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
              <ImagePlus className="h-[28px] w-[28px] text-[#67003E]/50 sm:h-[32px] sm:w-[32px]" />
              <p className="text-[14px] font-medium text-[#333333] sm:text-[15px]">
                No home hero content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create a section to manage the homepage hero.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {entries.map((entry) => (
              <Card
                key={entry._id}
                className="group overflow-hidden rounded-[18px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:rounded-[22px]"
              >
                <div className="relative h-[220px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[240px]">
                  {entry.desktopImage ? (
                    <Image
                      src={resolveImage(entry.desktopImage)}
                      alt="Home hero desktop"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImagePlus className="h-[26px] w-[26px] text-[#67003E]/40" />
                    </div>
                  )}

                  <div className="absolute left-[12px] top-[12px] flex items-center gap-[6px] rounded-full bg-black/50 px-[10px] py-[5px] text-[11px] font-medium text-white backdrop-blur-sm">
                    {entry.marqueeTexts?.length ?? 0} marquee items
                  </div>

                  <button
                    onClick={() => toggleActive(entry)}
                    disabled={togglingId === entry._id}
                    className={`absolute right-[12px] top-[12px] rounded-full px-[10px] py-[5px] text-[11px] font-medium backdrop-blur-sm transition-colors ${
                      entry.isActive
                        ? "bg-[#67003E]/90 text-white"
                        : "bg-black/40 text-white/80"
                    }`}
                  >
                    {togglingId === entry._id
                      ? "..."
                      : entry.isActive
                        ? "Active"
                        : "Inactive"}
                  </button>
                </div>

                <CardContent className="p-[16px] sm:p-[20px]">
                  <div className="flex flex-wrap gap-[6px]">
                    {entry.marqueeTexts?.slice(0, 5).map((text, idx) => (
                      <span
                        key={`${text}-${idx}`}
                        className="rounded-full bg-[#F8F0F5] px-[10px] py-[4px] text-[11px] font-medium text-[#67003E]"
                      >
                        {text}
                      </span>
                    ))}
                    {(entry.marqueeTexts?.length ?? 0) > 5 && (
                      <span className="rounded-full bg-[#F8F0F5] px-[10px] py-[4px] text-[11px] text-[#888888]">
                        +{(entry.marqueeTexts?.length ?? 0) - 5} more
                      </span>
                    )}
                  </div>

                  {/* Image variants preview */}
                  <div className="mt-[12px] flex gap-[8px]">
                    {[
                      { src: entry.tabletImage, icon: <Tablet className="h-[12px] w-[12px]" />, label: "Tablet" },
                      { src: entry.mobileImage, icon: <Smartphone className="h-[12px] w-[12px]" />, label: "Mobile" },
                    ].map(({ src, icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-1 items-center gap-[8px] rounded-[10px] border border-[#ECECEC] bg-white p-[8px]"
                      >
                        <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[6px] bg-[#E8D5E0]">
                          {src ? (
                            <Image
                              src={resolveImage(src)}
                              alt={label}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#67003E]/40">
                              {icon}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-[#666666]">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-[14px] flex gap-2">
                    <Button
                      onClick={() => openEditModal(entry)}
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
              className="relative max-h-[94vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.25)] xs:p-[22px] sm:max-h-[92vh] sm:max-w-[720px] sm:rounded-[28px] sm:p-[32px] md:max-w-[800px]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#111111] xs:text-[20px] sm:text-[24px]">
                  {editingId ? "Edit Home Hero" : "Create Home Hero"}
                </h2>
                <button
                  onClick={closeModal}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666666] transition-colors hover:bg-[#EDE3D6] sm:h-[36px] sm:w-[36px]"
                  aria-label="Close"
                >
                  <X className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]" />
                </button>
              </div>

              <div className="mt-[18px] space-y-[14px] sm:mt-[22px] sm:space-y-[16px]">
                {/* IMAGES */}
                <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-3">
                  <ImageUploadField
                    label="Desktop Image"
                    icon={<Monitor className="h-[13px] w-[13px]" />}
                    value={form.desktopImage}
                    onUploaded={(e) =>
                      handleImageUpload(e, "desktopImage", desktopInputRef)
                    }
                    onClear={() =>
                      setForm((prev) => ({ ...prev, desktopImage: "" }))
                    }
                    inputRef={desktopInputRef}
                    uploading={uploading === "desktopImage"}
                  />
                  <ImageUploadField
                    label="Tablet Image"
                    icon={<Tablet className="h-[13px] w-[13px]" />}
                    value={form.tabletImage}
                    onUploaded={(e) =>
                      handleImageUpload(e, "tabletImage", tabletInputRef)
                    }
                    onClear={() =>
                      setForm((prev) => ({ ...prev, tabletImage: "" }))
                    }
                    inputRef={tabletInputRef}
                    uploading={uploading === "tabletImage"}
                  />
                  <ImageUploadField
                    label="Mobile Image"
                    icon={<Smartphone className="h-[13px] w-[13px]" />}
                    value={form.mobileImage}
                    onUploaded={(e) =>
                      handleImageUpload(e, "mobileImage", mobileInputRef)
                    }
                    onClear={() =>
                      setForm((prev) => ({ ...prev, mobileImage: "" }))
                    }
                    inputRef={mobileInputRef}
                    uploading={uploading === "mobileImage"}
                  />
                </div>

                {/* MARQUEE TEXTS */}
                <div className="rounded-[14px] border border-[#E4E4E4] p-[14px] sm:p-[16px]">
                  <StringListManager
                    items={form.marqueeTexts}
                    onChange={(items) =>
                      setForm((prev) => ({ ...prev, marqueeTexts: items }))
                    }
                    label="Marquee Texts"
                    placeholder="e.g. Travel for you"
                    description="Scrolling text items shown on the homepage hero. Press Enter or click Add."
                  />
                </div>

                {/* ACTIVE SWITCH */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this section on the website
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, isActive: checked })
                    }
                  />
                </div>

                {/* ACTIONS */}
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
                    disabled={submitting || !!uploading}
                    className="h-[46px] rounded-[12px] bg-[#67003E] px-[22px] text-[14px] font-medium text-white hover:bg-[#4F0030]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-[8px] h-[14px] w-[14px] animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Section"
                    ) : (
                      "Create Section"
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
                Delete Home Hero Section?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove this hero section and its{" "}
                {deleteTarget.marqueeTexts?.length ?? 0} marquee item
                {(deleteTarget.marqueeTexts?.length ?? 0) !== 1 ? "s" : ""}.
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
                  {deletingId ? "Deleting..." : "Delete Section"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}