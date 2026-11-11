"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import api from "@/lib/axios";

export default function LeadModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto 20-second timer trigger
  useEffect(() => {
    if (!isMounted) return;

    // Check session storage flag
    const isDismissed = sessionStorage.getItem("lead_modal_dismissed");
    const isSubmitted = sessionStorage.getItem("lead_modal_submitted");

    if (isDismissed || isSubmitted) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, [isMounted]);

  // Event listener for opening modal on button clicks
  useEffect(() => {
    if (!isMounted) return;

    const handleOpenModal = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-lead-modal", handleOpenModal);

    // Global click handler to open lead modal on ANY button or link on the website
    const handleGlobalClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;

      const clickable = el.closest(
        "button, a, [role='button'], input[type='button'], input[type='submit']",
      );
      if (!clickable) return;

      // Do not intercept clicks inside the Lead Modal itself, admin dashboard, or role="tab" elements
      if (
        clickable.closest("[role='dialog']") ||
        clickable.closest("#lead-modal") ||
        clickable.closest("[role='tab']") ||
        clickable.closest("[role='tablist']") ||
        window.location.pathname.startsWith("/admin")
      ) {
        return;
      }

      const text = clickable.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
      const href = clickable.getAttribute("href") ?? "";

      // Exclude specific navbar links, category tabs, and back-to-top button
      const EXCLUDED_LABELS = [
        "our story",
        "experiences",
        "discover",
        "why green oasis",
        "nature & slow travel",
        "culture & discovery",
        "rest & togetherness",
        "journeys of faith",
        "back to top",
      ];

      const EXCLUDED_HREFS = [
        "#story",
        "#experiences",
        "#discover",
        "#why",
        "#hero",
        "#top",
      ];

      const isExcludedNav =
        EXCLUDED_LABELS.some((label) => text.includes(label)) ||
        (EXCLUDED_HREFS.includes(href) && !text.includes("plan"));

      if (
        isExcludedNav ||
        href.startsWith("tel:") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("open-lead-modal", handleOpenModal);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("lead_modal_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leads", {
        name: name.trim(),
        phone: phone, // International format, e.g. +919876543210
        city: city.trim(),
        state: state.trim(),
      });

      toast.success("Thank you! Our team will contact you shortly.");

      sessionStorage.setItem("lead_modal_submitted", "true");

      setName("");
      setPhone("");
      setCity("");
      setState("");

      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error("Lead submission error:", err);

      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="lead-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white p-6 shadow-2xl sm:p-8"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[#666] transition-colors hover:bg-[#EDE3D6] hover:text-[#111]"
                aria-label="Close Modal"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#004530]">
                  Green Oasis
                </span>

                <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#111]">
                  Plan Your Journey
                </h3>

                <p className="mt-2 text-sm text-[#555]">
                  Please enter your details below. Our travel experts will get
                  in touch with you shortly.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#333]">
                    Full Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="h-12 w-full rounded-xl border border-[#E4E4E4] bg-[#FDFDFD] px-4 text-sm text-[#111] transition-all focus:border-[#004530] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004530]/20"
                  />
                </div>

                {/* Phone with country code and flag */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#333]">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <PhoneInput
                    international
                    defaultCountry={"IN" as Country}
                    countryCallingCodeEditable={false}
                    value={phone}
                    onChange={(value) => setPhone(value || "")}
                    placeholder="Enter mobile number"
                    className="lead-phone-input"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#333]">
                      City
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your city"
                      className="h-12 w-full rounded-xl border border-[#E4E4E4] bg-[#FDFDFD] px-4 text-sm text-[#111] transition-all focus:border-[#004530] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004530]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#333]">
                      State
                    </label>

                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Your state"
                      className="h-12 w-full rounded-xl border border-[#E4E4E4] bg-[#FDFDFD] px-4 text-sm text-[#111] transition-all focus:border-[#004530] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004530]/20"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#004530] text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#003323] hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone input styling */}
      <style jsx global>{`
        .lead-phone-input {
          display: flex;
          align-items: center;
          width: 100%;
          height: 48px;
          border: 1px solid #e4e4e4;
          border-radius: 12px;
          background: #fdfdfd;
          padding: 0 12px;
          transition: all 0.2s;
        }

        .lead-phone-input:focus-within {
          border-color: #004530;
          background: white;
          box-shadow: 0 0 0 2px rgba(0, 69, 48, 0.12);
        }

        .lead-phone-input .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-right: 10px;
        }

        .lead-phone-input .PhoneInputCountrySelect {
          cursor: pointer;
          border: none;
          outline: none;
          background: transparent;
        }

        .lead-phone-input .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          box-shadow: none;
        }

        .lead-phone-input .PhoneInputCountryIconImg {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .lead-phone-input .PhoneInputInput {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: #111;
          font-size: 14px;
        }

        .lead-phone-input .PhoneInputInput::placeholder {
          color: #999;
        }
      `}</style>
    </>
  );
}
