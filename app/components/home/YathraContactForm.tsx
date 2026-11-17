"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";
import { syne, dmSans } from "@/app/fonts";

type FormData = {
  name: string;
  city: string;
  phone: string;
  peopleCount: number;
  invitedBy: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  city: "",
  phone: "",
  peopleCount: 1,
  invitedBy: "",
};

export default function YathraContactForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [alertState, setAlertState] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const inputClass =
    "h-[42px] sm:h-[46px] w-full rounded-[11px] border border-[#CBE8B9] bg-[#E0F5D2] px-3.5 text-[13px] font-medium text-[#004530] outline-none transition-all duration-300 placeholder:text-[#929E8C] focus:border-[#8BDA59] focus:bg-white/80 focus:ring-2 focus:ring-[#004530]/20";

  const labelClass =
    "mb-1.5 block text-[11px] sm:text-[12px] font-bold uppercase text-[#111111]";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "peopleCount"
          ? value === ""
            ? 0
            : Math.max(0, parseInt(value, 10) || 0)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertState({ type: null, message: "" });

    if (!formData.name.trim()) {
      const msg = "Please enter your full name.";
      toast.error(msg);
      setAlertState({ type: "error", message: msg });
      return;
    }

    if (!formData.phone.trim()) {
      const msg = "Please enter your phone number.";
      toast.error(msg);
      setAlertState({ type: "error", message: msg });
      return;
    }

    if (!/^[+]?[\d\s()-]{7,20}$/.test(formData.phone.trim())) {
      const msg = "Please enter a valid phone number.";
      toast.error(msg);
      setAlertState({ type: "error", message: msg });
      return;
    }

    if (formData.peopleCount < 1) {
      const msg = "Please enter at least 1 person for People's Count.";
      toast.error(msg);
      setAlertState({ type: "error", message: msg });
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/leads", {
        name: formData.name.trim(),
        city: formData.city.trim(),
        phone: formData.phone.trim(),
        peopleCount: formData.peopleCount,
        invitedBy: formData.invitedBy.trim(),
        leadType: "yathra",
      });

      const successMsg =
        "Thank you! Your registration for Yathra Vismayam Travel Expo has been submitted successfully.";

      toast.success(successMsg);
      setAlertState({ type: "success", message: successMsg });

      // Reset form
      setFormData(INITIAL_FORM);
    } catch (error: any) {
      console.error("Yathra enquiry submission error:", error);

      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong while submitting. Please try again.";

      toast.error(errorMsg);
      setAlertState({ type: "error", message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="register"
      className={`${dmSans.className} w-full bg-white px-4 py-10 sm:px-8 lg:py-14`}
    >
      <Toaster position="top-right" />

      <div className="mx-auto max-w-[900px] rounded-[24px] bg-[#EDFBE3] px-5 py-7 sm:px-10 sm:py-9 lg:px-[48px] lg:py-9 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-[#D5F0B2]/60">
        {/* Heading */}
        <div className="mb-5 text-center">
          <h2
            className={`${syne.className} text-[clamp(27px,5vw,48px)] font-bold leading-[1.08] tracking-[-0.055em] text-[#004530]`}
          >
            Register Now for <span className="text-[#08A66B]">Yathra</span>
            <br />
            <span className="text-[#08A66B]">Vismayam</span> Travel Expo!
          </h2>

          <p className="mt-2 text-[11px] sm:text-[13px] text-[#111111]">
            Interested in visiting Yathra Vismayam? Enter your details below.
          </p>
        </div>

        {/* ALERT BOX (Visible Banner on Form Submission) */}
        {alertState.type && (
          <div
            className={`mb-5 flex items-start gap-3 rounded-[12px] p-4 text-[13px] font-medium leading-[1.5] transition-all ${
              alertState.type === "success"
                ? "bg-[#D7F3AD] text-[#004530] border border-[#8BDA59]"
                : "bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]"
            }`}
          >
            {alertState.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#004530] mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-[#991B1B] mt-0.5" />
            )}
            <div className="flex-1">{alertState.message}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="yathra-name" className={labelClass}>
              NAME*
            </label>

            <input
              id="yathra-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>

          {/* Place */}
          <div>
            <label htmlFor="yathra-city" className={labelClass}>
              PLACE
            </label>

            <input
              id="yathra-city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Your City Or Town"
              autoComplete="address-level2"
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="yathra-phone" className={labelClass}>
              PHONE NUMBER*
            </label>

            <input
              id="yathra-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="your phone number"
              autoComplete="tel"
              required
              className={inputClass}
            />
          </div>

          {/* People's Count */}
          <div>
            <label htmlFor="yathra-count" className={labelClass}>
              PEOPLE'S COUNT
            </label>

            <input
              id="yathra-count"
              name="peopleCount"
              type="number"
              min="1"
              max="100"
              value={formData.peopleCount}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Invited By */}
          <div>
            <label htmlFor="yathra-invited-by" className={labelClass}>
              Invited By
            </label>

            <input
              id="yathra-invited-by"
              name="invitedBy"
              type="text"
              value={formData.invitedBy}
              onChange={handleChange}
              placeholder="Person Name"
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-[42px] sm:h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#9DEB63] px-8 text-[12px] font-bold uppercase text-[#004530] transition-all duration-300 hover:bg-[#85DB49] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto min-w-[200px]"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#004530]" />
                  Submitting...
                </>
              ) : (
                <>
                  SUBMIT ENQUIRY
                  <ArrowUpRight size={16} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
