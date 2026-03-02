"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { VOLUNTEER_COLORS } from "@/lib/roosterConfig";

const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_ACCENT = "#0d9488";

export type Volunteer = {
  id: string;
  name: string;
  email: string | null;
  color: string;
  is_active: boolean;
  created_at?: string;
};

type VolunteerModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (data: { name: string; email: string; color: string }) => void;
  nextColor?: string;
};

export default function VolunteerModal({ open, onClose, onSaved, nextColor }: VolunteerModalProps) {
  const t = useTranslations("admin.rooster");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState(nextColor ?? VOLUNTEER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaved({ name: name.trim(), email: email.trim() || "", color });
    setName("");
    setEmail("");
    setColor(nextColor ?? VOLUNTEER_COLORS[0]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-sm w-full p-4"
        style={{ borderColor: ADM_BORDER }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold mb-4" style={{ color: ADM_TEXT }}>
          ➕ {t("addVolunteer")}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("emailOptional")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: ADM_BORDER }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: ADM_TEXT }}>{t("color")}</label>
            <div className="flex flex-wrap gap-2">
              {VOLUNTEER_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 transition-transform"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? ADM_TEXT : "transparent",
                    transform: color === c ? "scale(1.1)" : undefined,
                  }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: ADM_BORDER }}>
              {t("cancel")}
            </button>
            <button type="submit" className="px-3 py-1.5 rounded-lg text-white text-sm" style={{ backgroundColor: ADM_ACCENT }}>
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
