"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronDown,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
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
import { Textarea } from "@/components/ui/textarea";

// ================= CONFIG =================

const ENDPOINT = "/home-page";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

// ================= TYPES =================

interface StatItem {
  _id?: string;
  value: string;
  label: string;
}

interface DestinationItem {
  _id?: string;
  title: string;
  subtitle: string;
  priceText: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface ExperienceCategory {
  _id?: string;
  name: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  isActive: boolean;
}

interface ServiceItem {
  _id?: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface CertificationItem {
  _id?: string;
  name: string;
  image: string;
  order: number;
  isActive: boolean;
}

interface YoutubeShort {
  _id?: string;
  title: string;
  youtubeShortUrl: string;
  order: number;
}

interface HomePagePayload {
  introEyebrow: string;
  introHeading: string;
  introParagraphOne: string;
  introParagraphTwo: string;
  introImage: string;
  introButtonText: string;
  introButtonLink: string;
  stats: StatItem[];
  destinationsEyebrow: string;
  destinationsHeading: string;
  destinationsDescription: string;
  destinations: DestinationItem[];
  destinationCtaTitle: string;
  destinationCtaDescription: string;
  destinationCtaButtonText: string;
  destinationCtaButtonLink: string;
  experiencesEyebrow: string;
  experiencesHeading: string;
  experiencesDescription: string;
  experienceCategories: ExperienceCategory[];
  founderEyebrow: string;
  founderHeading: string;
  founderMessageLabel: string;
  founderParagraphs: string[];
  founderName: string;
  founderDesignation: string;
  founderImage: string;
  servicesEyebrow: string;
  servicesHeading: string;
  servicesDescription: string;
  services: ServiceItem[];
  travellersEyebrow: string;
  travellersHeading: string;
  travellersDescription: string;
  youtubeShorts: YoutubeShort[];
  certificationsEyebrow: string;
  certificationsHeading: string;
  certificationsDescription: string;
  certifications: CertificationItem[];
  finalCtaEyebrow: string;
  finalCtaHeading: string;
  finalCtaDescription: string;
  finalCtaButtonText: string;
  finalCtaButtonLink: string;
  finalCtaNote: string;
  isActive: boolean;
}

interface HomePage extends HomePagePayload {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

type ListResponse =
  | HomePage[]
  | { homePages: HomePage[] }
  | { homePage: HomePage }
  | HomePage;

const EMPTY_FORM: HomePagePayload = {
  introEyebrow: "",
  introHeading: "",
  introParagraphOne: "",
  introParagraphTwo: "",
  introImage: "",
  introButtonText: "GET TO KNOW US",
  introButtonLink: "/about",
  stats: [],
  destinationsEyebrow: "",
  destinationsHeading: "",
  destinationsDescription: "",
  destinations: [],
  destinationCtaTitle: "",
  destinationCtaDescription: "",
  destinationCtaButtonText: "LET’S MAKE IT PERSONAL",
  destinationCtaButtonLink: "/contact",
  experiencesEyebrow: "",
  experiencesHeading: "",
  experiencesDescription: "",
  experienceCategories: [],
  founderEyebrow: "",
  founderHeading: "",
  founderMessageLabel: "OUR CMD’S MESSAGE",
  founderParagraphs: [],
  founderName: "",
  founderDesignation: "",
  founderImage: "",
  servicesEyebrow: "",
  servicesHeading: "",
  servicesDescription: "",
  services: [],
  travellersEyebrow: "",
  travellersHeading: "",
  travellersDescription: "",
  youtubeShorts: [],
  certificationsEyebrow: "",
  certificationsHeading: "",
  certificationsDescription: "",
  certifications: [],
  finalCtaEyebrow: "",
  finalCtaHeading: "",
  finalCtaDescription: "",
  finalCtaButtonText: "START A CONVERSATION",
  finalCtaButtonLink: "/contact",
  finalCtaNote: "",
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

function parseHomePageList(data: unknown): HomePage[] {
  if (Array.isArray(data)) return data as HomePage[];
  if (data && typeof data === "object") {
    if (
      "homePages" in data &&
      Array.isArray((data as { homePages: HomePage[] }).homePages)
    ) {
      return (data as { homePages: HomePage[] }).homePages;
    }
    if ("homePage" in data && data.homePage) {
      return [data.homePage as HomePage];
    }
    if ("introHeading" in data) return [data as HomePage];
  }
  return [];
}

/** Strip _id from a nested item before sending to the API. */
function stripId<T extends { _id?: string }>(item: T): Omit<T, "_id"> {
  const { _id, ...rest } = item;
  void _id;
  return rest;
}

function mapEntryToForm(entry: HomePage): HomePagePayload {
  return {
    introEyebrow: entry.introEyebrow || "",
    introHeading: entry.introHeading || "",
    introParagraphOne: entry.introParagraphOne || "",
    introParagraphTwo: entry.introParagraphTwo || "",
    introImage: entry.introImage || "",
    introButtonText: entry.introButtonText || "GET TO KNOW US",
    introButtonLink: entry.introButtonLink || "/about",
    stats: (entry.stats || []).map((s) => ({ ...s })),
    destinationsEyebrow: entry.destinationsEyebrow || "",
    destinationsHeading: entry.destinationsHeading || "",
    destinationsDescription: entry.destinationsDescription || "",
    destinations: [...(entry.destinations || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((d) => ({ ...d })),
    destinationCtaTitle: entry.destinationCtaTitle || "",
    destinationCtaDescription: entry.destinationCtaDescription || "",
    destinationCtaButtonText:
      entry.destinationCtaButtonText || "LET’S MAKE IT PERSONAL",
    destinationCtaButtonLink: entry.destinationCtaButtonLink || "/contact",
    experiencesEyebrow: entry.experiencesEyebrow || "",
    experiencesHeading: entry.experiencesHeading || "",
    experiencesDescription: entry.experiencesDescription || "",
    experienceCategories: [...(entry.experienceCategories || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((c) => ({ ...c })),
    founderEyebrow: entry.founderEyebrow || "",
    founderHeading: entry.founderHeading || "",
    founderMessageLabel: entry.founderMessageLabel || "OUR CMD’S MESSAGE",
    founderParagraphs: Array.isArray(entry.founderParagraphs)
      ? [...entry.founderParagraphs]
      : [],
    founderName: entry.founderName || "",
    founderDesignation: entry.founderDesignation || "",
    founderImage: entry.founderImage || "",
    servicesEyebrow: entry.servicesEyebrow || "",
    servicesHeading: entry.servicesHeading || "",
    servicesDescription: entry.servicesDescription || "",
    services: [...(entry.services || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((s) => ({ ...s })),
    travellersEyebrow: entry.travellersEyebrow || "",
    travellersHeading: entry.travellersHeading || "",
    travellersDescription: entry.travellersDescription || "",
    youtubeShorts: [...(entry.youtubeShorts || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((s) => ({ ...s })),
    certificationsEyebrow: entry.certificationsEyebrow || "",
    certificationsHeading: entry.certificationsHeading || "",
    certificationsDescription: entry.certificationsDescription || "",
    certifications: [...(entry.certifications || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((c) => ({ ...c })),
    finalCtaEyebrow: entry.finalCtaEyebrow || "",
    finalCtaHeading: entry.finalCtaHeading || "",
    finalCtaDescription: entry.finalCtaDescription || "",
    finalCtaButtonText: entry.finalCtaButtonText || "START A CONVERSATION",
    finalCtaButtonLink: entry.finalCtaButtonLink || "/contact",
    finalCtaNote: entry.finalCtaNote || "",
    isActive: entry.isActive ?? true,
  };
}

function serializePayload(form: HomePagePayload): HomePagePayload {
  return {
    ...form,
    stats: form.stats.map(stripId),
    destinations: form.destinations.map(stripId),
    experienceCategories: form.experienceCategories.map(stripId),
    services: form.services.map(stripId),
    youtubeShorts: form.youtubeShorts.map(stripId),
    certifications: form.certifications.map(stripId),
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
  rows = 3,
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

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await fileUpload(file);
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to upload image"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[14px] border border-[#D4B8A8] bg-[#F8F0F5] p-[14px]">
      <Label className="mb-[8px] flex items-center gap-[6px] text-[13px] font-medium text-[#2A2A2A]">
        <ImagePlus className="h-[13px] w-[13px]" />
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
            onClick={() => onChange("")}
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
        onChange={handleUpload}
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

function StringListManager({
  items,
  onChange,
  label,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) {
      toast.error("Value is required");
      return;
    }
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div>
      <Label className="mb-[8px] block text-[13px] font-medium text-[#2A2A2A]">
        {label}
      </Label>
      {items.length > 0 && (
        <div className="mb-[10px] flex flex-wrap gap-[8px]">
          {items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center gap-[6px] rounded-full border border-[#E4E4E4] bg-[#F8F0F5] py-[5px] pl-[12px] pr-[6px] text-[12px] text-[#67003E]"
            >
              <span className="max-w-[260px] truncate font-medium">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[#67003E]/70 hover:bg-[#67003E]/10 hover:text-[#67003E]"
                aria-label={`Remove ${item}`}
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
              add();
            }
          }}
          placeholder={placeholder}
          className="h-[42px] rounded-[10px] border-[#E4E4E4] bg-white text-[13px]"
        />
        <Button
          type="button"
          onClick={add}
          className="h-[42px] shrink-0 gap-[6px] rounded-[10px] bg-[#67003E] px-[14px] text-[13px] font-medium text-white hover:bg-[#4F0030]"
        >
          <Plus className="h-[14px] w-[14px]" />
          Add
        </Button>
      </div>
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

// ================= MAIN PAGE =================

export default function HomePageAdminPage() {
  const [entries, setEntries] = useState<HomePage[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HomePagePayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<HomePage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------- LOAD ----------

  const fetchHomePages = async () => {
    try {
      setLoading(true);
      const res = await api.get<ListResponse>(ENDPOINT);
      setEntries(parseHomePageList(res.data));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load home page content"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomePages();
  }, []);

  // ---------- MODAL ----------

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (entry: HomePage) => {
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

  const patch = <K extends keyof HomePagePayload>(
    key: K,
    value: HomePagePayload[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ---------- CREATE / UPDATE ----------

  const handleSubmit = async () => {
    if (!form.introHeading.trim()) {
      toast.error("Intro heading is required");
      return;
    }
    if (!form.introImage.trim()) {
      toast.error("Intro image is required");
      return;
    }
    if (!form.founderImage.trim()) {
      toast.error("Founder image is required");
      return;
    }

    const payload = serializePayload(form);

    try {
      setSubmitting(true);
      if (editingId) {
        await api.patch(`${ENDPOINT}/${editingId}`, payload);
        toast.success("Home page updated");
      } else {
        await api.post(ENDPOINT, payload);
        toast.success("Home page created");
      }
      closeModal();
      fetchHomePages();
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          editingId ? "Failed to update home page" : "Failed to create home page",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- TOGGLE ----------

  const toggleActive = async (entry: HomePage) => {
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
      toast.success("Home page deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete home page"));
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
            Home Page Content
          </h1>
          <p className="mt-[6px] text-[13px] leading-[1.6] text-[#666666] sm:text-[14px] lg:text-[15px]">
            Manage every section of the home page.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex h-[46px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-[#67003E] text-[14px] font-medium text-white hover:bg-[#4F0030] hover:shadow-[0_14px_30px_rgba(103,0,62,0.3)] sm:h-[48px] sm:w-auto sm:px-[22px] sm:text-[15px]"
        >
          <Plus className="h-[18px] w-[18px]" />
          Add Home Page
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
                No home page content yet
              </p>
              <p className="text-[12px] text-[#888888] sm:text-[13px]">
                Create the home page content record.
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
                <div className="relative h-[200px] w-full overflow-hidden bg-[#E8D5E0] sm:h-[220px]">
                  {entry.introImage ? (
                    <Image
                      src={resolveImage(entry.introImage)}
                      alt={entry.introHeading}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImagePlus className="h-[26px] w-[26px] text-[#67003E]/40" />
                    </div>
                  )}
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
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#67003E]">
                    {entry.introEyebrow}
                  </p>
                  <h3 className="mt-[4px] line-clamp-2 text-[16px] font-semibold text-[#111111]">
                    {entry.introHeading}
                  </h3>
                  <p className="mt-[6px] line-clamp-2 text-[12px] leading-[1.6] text-[#666666]">
                    {entry.introParagraphOne}
                  </p>

                  <div className="mt-[12px] flex flex-wrap gap-[6px]">
                    {[
                      { label: "Stats", count: entry.stats?.length ?? 0 },
                      { label: "Destinations", count: entry.destinations?.length ?? 0 },
                      {
                        label: "Experiences",
                        count: entry.experienceCategories?.length ?? 0,
                      },
                      { label: "Services", count: entry.services?.length ?? 0 },
                      { label: "Shorts", count: entry.youtubeShorts?.length ?? 0 },
                      {
                        label: "Certifications",
                        count: entry.certifications?.length ?? 0,
                      },
                    ].map((chip) => (
                      <span
                        key={chip.label}
                        className="rounded-full bg-[#F8F0F5] px-[10px] py-[4px] text-[11px] text-[#67003E]"
                      >
                        {chip.count} {chip.label}
                      </span>
                    ))}
                  </div>

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
                  {editingId ? "Edit Home Page" : "Create Home Page"}
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
                {/* ---------- INTRO ---------- */}
                <SectionAccordion title="Intro" defaultOpen>
                  <FormField
                    label="Intro Eyebrow"
                    value={form.introEyebrow}
                    onChange={(v) => patch("introEyebrow", v)}
                  />
                  <FormField
                    label="Intro Heading"
                    value={form.introHeading}
                    onChange={(v) => patch("introHeading", v)}
                  />
                  <TextareaField
                    label="Paragraph One"
                    value={form.introParagraphOne}
                    onChange={(v) => patch("introParagraphOne", v)}
                  />
                  <TextareaField
                    label="Paragraph Two"
                    value={form.introParagraphTwo}
                    onChange={(v) => patch("introParagraphTwo", v)}
                  />
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Button Text"
                      value={form.introButtonText}
                      onChange={(v) => patch("introButtonText", v)}
                    />
                    <FormField
                      label="Button Link"
                      value={form.introButtonLink}
                      onChange={(v) => patch("introButtonLink", v)}
                    />
                  </div>
                  <ImageUploadField
                    label="Intro Image"
                    value={form.introImage}
                    onChange={(v) => patch("introImage", v)}
                  />
                </SectionAccordion>

                {/* ---------- STATS ---------- */}
                <SectionAccordion title={`Stats (${form.stats.length})`}>
                  <NestedListEditor
                    items={form.stats}
                    onChange={(items) => patch("stats", items)}
                    emptyItem={{ value: "", label: "" }}
                    addLabel="Add Stat"
                    renderItem={(item, update) => (
                      <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                        <Input
                          value={item.value}
                          onChange={(e) => update({ value: e.target.value })}
                          placeholder="150,000+"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Input
                          value={item.label}
                          onChange={(e) => update({ label: e.target.value })}
                          placeholder="Happy Travellers"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                      </div>
                    )}
                    getLabel={(item) => `${item.value} — ${item.label}`}
                  />
                </SectionAccordion>

                {/* ---------- DESTINATIONS ---------- */}
                <SectionAccordion title="Destinations">
                  <FormField
                    label="Eyebrow"
                    value={form.destinationsEyebrow}
                    onChange={(v) => patch("destinationsEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.destinationsHeading}
                    onChange={(v) => patch("destinationsHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.destinationsDescription}
                    onChange={(v) => patch("destinationsDescription", v)}
                  />
                  <NestedListEditor
                    items={form.destinations}
                    onChange={(items) => patch("destinations", items)}
                    emptyItem={{
                      title: "",
                      subtitle: "",
                      priceText: "",
                      image: "",
                      order: 0,
                      isActive: true,
                    }}
                    addLabel="Add Destination"
                    reindexOrder
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.title}
                          onChange={(e) => update({ title: e.target.value })}
                          placeholder="Title"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                          <Input
                            value={item.subtitle}
                            onChange={(e) => update({ subtitle: e.target.value })}
                            placeholder="5 DAYS 4 NIGHT"
                            className="h-[42px] rounded-[10px] text-[13px]"
                          />
                          <Input
                            value={item.priceText}
                            onChange={(e) => update({ priceText: e.target.value })}
                            placeholder="From ₹120,000 /Per Person"
                            className="h-[42px] rounded-[10px] text-[13px]"
                          />
                        </div>
                        <ImageUploadField
                          label="Destination Image"
                          value={item.image}
                          onChange={(url) => update({ image: url })}
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.title || "Untitled destination"}
                  />
                </SectionAccordion>

                {/* ---------- DESTINATION CTA ---------- */}
                <SectionAccordion title="Destination CTA">
                  <FormField
                    label="Title"
                    value={form.destinationCtaTitle}
                    onChange={(v) => patch("destinationCtaTitle", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.destinationCtaDescription}
                    onChange={(v) => patch("destinationCtaDescription", v)}
                    rows={2}
                  />
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Button Text"
                      value={form.destinationCtaButtonText}
                      onChange={(v) => patch("destinationCtaButtonText", v)}
                    />
                    <FormField
                      label="Button Link"
                      value={form.destinationCtaButtonLink}
                      onChange={(v) => patch("destinationCtaButtonLink", v)}
                    />
                  </div>
                </SectionAccordion>

                {/* ---------- EXPERIENCES ---------- */}
                <SectionAccordion title="Experiences">
                  <FormField
                    label="Eyebrow"
                    value={form.experiencesEyebrow}
                    onChange={(v) => patch("experiencesEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.experiencesHeading}
                    onChange={(v) => patch("experiencesHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.experiencesDescription}
                    onChange={(v) => patch("experiencesDescription", v)}
                  />
                  <NestedListEditor
                    items={form.experienceCategories}
                    onChange={(items) => patch("experienceCategories", items)}
                    emptyItem={{
                      name: "",
                      title: "",
                      description: "",
                      image: "",
                      buttonText: "",
                      buttonLink: "",
                      order: 0,
                      isActive: true,
                    }}
                    addLabel="Add Experience Category"
                    reindexOrder
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.name}
                          onChange={(e) => update({ name: e.target.value })}
                          placeholder="Name (e.g. Nature & Slow Travel)"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Input
                          value={item.title}
                          onChange={(e) => update({ title: e.target.value })}
                          placeholder="Title"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Textarea
                          value={item.description}
                          onChange={(e) => update({ description: e.target.value })}
                          rows={2}
                          placeholder="Description"
                          className="rounded-[10px] text-[13px]"
                        />
                        <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
                          <Input
                            value={item.buttonText}
                            onChange={(e) => update({ buttonText: e.target.value })}
                            placeholder="Button text"
                            className="h-[42px] rounded-[10px] text-[13px]"
                          />
                          <Input
                            value={item.buttonLink}
                            onChange={(e) => update({ buttonLink: e.target.value })}
                            placeholder="/contact"
                            className="h-[42px] rounded-[10px] text-[13px]"
                          />
                        </div>
                        <ImageUploadField
                          label="Experience Image"
                          value={item.image}
                          onChange={(url) => update({ image: url })}
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.name || "Untitled category"}
                  />
                </SectionAccordion>

                {/* ---------- FOUNDER ---------- */}
                <SectionAccordion title="Founder">
                  <FormField
                    label="Eyebrow"
                    value={form.founderEyebrow}
                    onChange={(v) => patch("founderEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.founderHeading}
                    onChange={(v) => patch("founderHeading", v)}
                  />
                  <FormField
                    label="Message Label"
                    value={form.founderMessageLabel}
                    onChange={(v) => patch("founderMessageLabel", v)}
                  />
                  <StringListManager
                    items={form.founderParagraphs}
                    onChange={(items) => patch("founderParagraphs", items)}
                    label="Founder Paragraphs"
                    placeholder="Add a paragraph"
                  />
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Founder Name"
                      value={form.founderName}
                      onChange={(v) => patch("founderName", v)}
                    />
                    <FormField
                      label="Founder Designation"
                      value={form.founderDesignation}
                      onChange={(v) => patch("founderDesignation", v)}
                    />
                  </div>
                  <ImageUploadField
                    label="Founder Image"
                    value={form.founderImage}
                    onChange={(v) => patch("founderImage", v)}
                  />
                </SectionAccordion>

                {/* ---------- SERVICES ---------- */}
                <SectionAccordion title="Services">
                  <FormField
                    label="Eyebrow"
                    value={form.servicesEyebrow}
                    onChange={(v) => patch("servicesEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.servicesHeading}
                    onChange={(v) => patch("servicesHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.servicesDescription}
                    onChange={(v) => patch("servicesDescription", v)}
                    rows={2}
                  />
                  <NestedListEditor
                    items={form.services}
                    onChange={(items) => patch("services", items)}
                    emptyItem={{
                      title: "",
                      description: "",
                      order: 0,
                      isActive: true,
                    }}
                    addLabel="Add Service"
                    reindexOrder
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.title}
                          onChange={(e) => update({ title: e.target.value })}
                          placeholder="Title"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Textarea
                          value={item.description}
                          onChange={(e) => update({ description: e.target.value })}
                          rows={2}
                          placeholder="Description"
                          className="rounded-[10px] text-[13px]"
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.title || "Untitled service"}
                  />
                </SectionAccordion>

                {/* ---------- TRAVELLERS ---------- */}
                <SectionAccordion title="Travellers">
                  <FormField
                    label="Eyebrow"
                    value={form.travellersEyebrow}
                    onChange={(v) => patch("travellersEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.travellersHeading}
                    onChange={(v) => patch("travellersHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.travellersDescription}
                    onChange={(v) => patch("travellersDescription", v)}
                  />
                  <NestedListEditor
                    items={form.youtubeShorts}
                    onChange={(items) => patch("youtubeShorts", items)}
                    emptyItem={{
                      title: "",
                      youtubeShortUrl: "",
                      order: 0,
                    }}
                    addLabel="Add YouTube Short"
                    reindexOrder
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.title}
                          onChange={(e) => update({ title: e.target.value })}
                          placeholder="Title (e.g. Bali Highlights)"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <Input
                          value={item.youtubeShortUrl}
                          onChange={(e) =>
                            update({ youtubeShortUrl: e.target.value })
                          }
                          placeholder="https://youtube.com/shorts/..."
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        {item.youtubeShortUrl && (
                          <a
                            href={item.youtubeShortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[11px] text-[#67003E] underline"
                          >
                            Preview link ↗
                          </a>
                        )}
                      </div>
                    )}
                    getLabel={(item) =>
                      item.title || item.youtubeShortUrl || "Untitled short"
                    }
                  />
                </SectionAccordion>

                {/* ---------- CERTIFICATIONS ---------- */}
                <SectionAccordion title="Certifications">
                  <FormField
                    label="Eyebrow"
                    value={form.certificationsEyebrow}
                    onChange={(v) => patch("certificationsEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.certificationsHeading}
                    onChange={(v) => patch("certificationsHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.certificationsDescription}
                    onChange={(v) => patch("certificationsDescription", v)}
                  />
                  <NestedListEditor
                    items={form.certifications}
                    onChange={(items) => patch("certifications", items)}
                    emptyItem={{ name: "", image: "", order: 0, isActive: true }}
                    addLabel="Add Certification"
                    reindexOrder
                    renderItem={(item, update) => (
                      <div className="space-y-[8px]">
                        <Input
                          value={item.name}
                          onChange={(e) => update({ name: e.target.value })}
                          placeholder="Name (e.g. IATA)"
                          className="h-[42px] rounded-[10px] text-[13px]"
                        />
                        <ImageUploadField
                          label="Certification Image"
                          value={item.image}
                          onChange={(url) => update({ image: url })}
                        />
                        <ActiveToggle
                          checked={item.isActive}
                          onChange={(checked) => update({ isActive: checked })}
                        />
                      </div>
                    )}
                    getLabel={(item) => item.name || "Untitled certification"}
                  />
                </SectionAccordion>

                {/* ---------- FINAL CTA ---------- */}
                <SectionAccordion title="Final CTA">
                  <FormField
                    label="Eyebrow"
                    value={form.finalCtaEyebrow}
                    onChange={(v) => patch("finalCtaEyebrow", v)}
                  />
                  <FormField
                    label="Heading"
                    value={form.finalCtaHeading}
                    onChange={(v) => patch("finalCtaHeading", v)}
                  />
                  <TextareaField
                    label="Description"
                    value={form.finalCtaDescription}
                    onChange={(v) => patch("finalCtaDescription", v)}
                  />
                  <div className="grid grid-cols-1 gap-[12px] xs:grid-cols-2">
                    <FormField
                      label="Button Text"
                      value={form.finalCtaButtonText}
                      onChange={(v) => patch("finalCtaButtonText", v)}
                    />
                    <FormField
                      label="Button Link"
                      value={form.finalCtaButtonLink}
                      onChange={(v) => patch("finalCtaButtonLink", v)}
                    />
                  </div>
                  <TextareaField
                    label="Note"
                    value={form.finalCtaNote}
                    onChange={(v) => patch("finalCtaNote", v)}
                    rows={2}
                  />
                </SectionAccordion>

                {/* ---------- ACTIVE SWITCH ---------- */}
                <div className="flex items-center justify-between rounded-[12px] border border-[#E4E4E4] px-[14px] py-[12px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#111111]">Active</p>
                    <p className="text-[12px] text-[#888888]">
                      Show this home page content on the website
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
                      "Update Home Page"
                    ) : (
                      "Create Home Page"
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
                Delete Home Page?
              </h3>
              <p className="mt-[8px] text-[13px] leading-[1.6] text-[#666666]">
                This will remove &quot;{deleteTarget.introHeading}&quot; and all its
                sections.
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
                  {deletingId ? "Deleting..." : "Delete Home Page"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ================= NESTED LIST EDITOR =================

function NestedListEditor<T extends { _id?: string; order?: number; isActive?: boolean }>({
  items,
  onChange,
  emptyItem,
  addLabel,
  renderItem,
  getLabel,
  reindexOrder = false,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  getLabel: (item: T) => string;
  reindexOrder?: boolean;
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
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(
      reindexOrder
        ? next.map((item, i) => ({ ...item, order: i }))
        : next,
    );
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

// ================= ACTIVE TOGGLE =================

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