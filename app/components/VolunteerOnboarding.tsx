"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  loadOnboarding,
  saveOnboardingStep,
  uploadOnboardingFiles,
  type VolunteerOnboardingFormData,
  type VolunteerOnboardingFiles as VolunteerOnboardingFilesType,
} from "@/lib/volunteerOnboarding";

// ── Saved Souls Foundation – Vrijwilliger onboarding (4 stappen) ─────────────
// Gebruikt op /[locale]/portal/onboarding/volunteer

function Input({
  label,
  optional,
  optionalLabel,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; optional?: boolean; optionalLabel?: string; hint?: string }) {
  return (
    <div className="vol-field">
      <label className="vol-label">
        {label}
        {optional && <span className="vol-optional">{optionalLabel ?? " (optioneel)"}</span>}
      </label>
      {hint && <p className="vol-hint">{hint}</p>}
      <input className="vol-input" {...props} />
    </div>
  );
}

function Textarea({
  label,
  optional,
  optionalLabel,
  hint,
  ...props
}: React.ComponentProps<"textarea"> & { label: string; optional?: boolean; optionalLabel?: string; hint?: string }) {
  return (
    <div className="vol-field">
      <label className="vol-label">
        {label}
        {optional && <span className="vol-optional">{optionalLabel ?? " (optioneel)"}</span>}
      </label>
      {hint && <p className="vol-hint">{hint}</p>}
      <textarea className="vol-input vol-textarea" rows={3} {...props} />
    </div>
  );
}

function Select({
  label,
  hint,
  children,
  ...props
}: React.ComponentProps<"select"> & { label: string; hint?: string }) {
  return (
    <div className="vol-field">
      <label className="vol-label">{label}</label>
      {hint && <p className="vol-hint">{hint}</p>}
      <select className="vol-input vol-select" {...props}>{children}</select>
    </div>
  );
}

function PdfUpload({
  label,
  hint,
  optional,
  optionalLabel,
  files,
  onFiles,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  optionalLabel?: string;
  files: File[];
  onFiles: (fn: (prev: File[]) => File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    if (pdfs.length) onFiles((prev) => [...prev, ...pdfs]);
  };

  const remove = (idx: number) => onFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div className="vol-field">
      <label className="vol-label">
        {label}
        {optional && <span className="vol-optional">{optionalLabel ? ` (${optionalLabel})` : " (optioneel)"}</span>}
      </label>
      {hint && <p className="vol-hint">{hint}</p>}
      <div
        className={"vol-dropzone" + (dragging ? " vol-dropzone--over" : "")}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <span className="vol-dropzone-icon">📎</span>
        <span className="vol-dropzone-text">
          Sleep PDF&apos;s hierheen of <span className="vol-dropzone-link">klik om te bladeren</span>
        </span>
        <span className="vol-dropzone-sub">Alleen PDF-bestanden · max. 10 MB per bestand</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="vol-file-list">
          {files.map((f, i) => (
            <li key={i} className="vol-file-item">
              <span className="vol-file-icon">📄</span>
              <span className="vol-file-name">{f.name}</span>
              <span className="vol-file-size">{(f.size / 1024).toFixed(0)} KB</span>
              <button
                type="button"
                className="vol-file-remove"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                aria-label="Verwijder"
              >×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Thermometer({ current, total, stepLabels }: { current: number; total: number; stepLabels: string[] }) {
  const pct = total > 1 ? ((current - 1) / (total - 1)) * 100 : 0;
  const icons = ["✍️", "🎥", "📋", "✈️"];
  return (
    <div className="vol-thermo">
      <div className="vol-thermo-track">
        <div className="vol-thermo-fill" style={{ width: pct + "%" }} />
        {stepLabels.map((label, i) => (
          <div
            key={i}
            className={
              "vol-thermo-node" +
              (i + 1 < current ? " vol-thermo-node--done" : i + 1 === current ? " vol-thermo-node--active" : "")
            }
            style={{ left: total > 1 ? ((i / (total - 1)) * 100) + "%" : "0%" }}
          >
            <span className="vol-thermo-dot">{i + 1 < current ? "✓" : icons[i]}</span>
            <span className="vol-thermo-step-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type FormData = VolunteerOnboardingFormData;

function Step1({ data, onChange, t }: { data: FormData; onChange: (k: keyof FormData, v: string) => void; t: (key: string) => string }) {
  return (
    <>
      <div className="vol-step-badge">{t("step1Badge")}</div>
      <h2 className="vol-step-title">{t("step1Title")}</h2>
      <p className="vol-step-sub">{t("step1Sub")}</p>
      <div className="vol-grid-2">
        <Input label={t("firstName")} value={data.firstName} onChange={(e) => onChange("firstName", e.target.value)} placeholder={t("firstName")} />
        <Input label={t("lastName")} value={data.lastName} onChange={(e) => onChange("lastName", e.target.value)} placeholder={t("lastName")} />
      </div>
      <Input label={t("email")} type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)} placeholder="jij@example.com" />
      <Input label={t("phone")} type="tel" value={data.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+31 6 12 34 56 78" />
      <Input label={t("city")} value={data.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Amsterdam" />
      <Select label={t("areaLabel")} hint={t("areaHint")} value={data.area} onChange={(e) => onChange("area", e.target.value)}>
        <option value="">{t("areaChoose")}</option>
        <option value="lokaal">{t("areaLokaal")}</option>
        <option value="thailand">{t("areaThailand")}</option>
      </Select>
      <Textarea label={t("motivationLabel")} optional optionalLabel={t("optional")} hint={t("motivationHint")} value={data.motivation} onChange={(e) => onChange("motivation", e.target.value)} placeholder={t("motivationPlaceholder")} />
    </>
  );
}

function Step2({ data, onChange, t }: { data: FormData; onChange: (k: keyof FormData, v: string) => void; t: (key: string) => string }) {
  return (
    <>
      <div className="vol-step-badge">{t("step2Badge")}</div>
      <h2 className="vol-step-title">{t("step2Title")}</h2>
      <p className="vol-step-sub">{t("step2Sub")}</p>
      <div className="vol-info-block">
        <div className="vol-info-row">
          <span className="vol-info-icon">🎥</span>
          <div>
            <strong>{t("step2Info1Title")}</strong>
            <p>{t("step2Info1Text")}</p>
          </div>
        </div>
        <div className="vol-info-row">
          <span className="vol-info-icon">🗣️</span>
          <div>
            <strong>{t("step2Info2Title")}</strong>
            <p>{t("step2Info2Text")}</p>
          </div>
        </div>
        <div className="vol-info-row">
          <span className="vol-info-icon">🤝</span>
          <div>
            <strong>{t("step2Info3Title")}</strong>
            <p>{t("step2Info3Text")}</p>
          </div>
        </div>
      </div>
      <Input label={t("callPreference")} optional hint={t("callPreferenceHint")} value={data.callPreference} onChange={(e) => onChange("callPreference", e.target.value)} placeholder="bijv. dinsdag of donderdag na 18:00" />
      <Select label={t("language")} value={data.language} onChange={(e) => onChange("language", e.target.value)}>
        <option value="">{t("languageChoose")}</option>
        <option value="nl">{t("languageNl")}</option>
        <option value="en">{t("languageEn")}</option>
        <option value="de">{t("languageDe")}</option>
        <option value="fr">{t("languageFr")}</option>
      </Select>
    </>
  );
}

type FilesState = VolunteerOnboardingFilesType;

function Step3({ files, setFiles, t }: { files: FilesState; setFiles: React.Dispatch<React.SetStateAction<FilesState>>; t: (key: string) => string }) {
  return (
    <>
      <div className="vol-step-badge">{t("step3Badge")}</div>
      <h2 className="vol-step-title">{t("step3Title")}</h2>
      <p className="vol-step-sub">{t("step3Sub")}</p>
      <a
        href="https://savedsouls-foundation.org/wp-content/uploads/2023/07/Savedsoulsfoundation_volunteering.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="vol-brochure-link"
      >
        {t("brochureLink")}
      </a>
      <PdfUpload label={t("idLabel")} hint={t("idHint")} files={files.id} onFiles={(fn) => setFiles((f) => ({ ...f, id: fn(f.id) }))} />
      <PdfUpload label={t("vogLabel")} hint={t("vogHint")} files={files.vog} onFiles={(fn) => setFiles((f) => ({ ...f, vog: fn(f.vog) }))} />
      <PdfUpload label={t("certsLabel")} optional optionalLabel={t("optional")} hint={t("certsHint")} files={files.certs} onFiles={(fn) => setFiles((f) => ({ ...f, certs: fn(f.certs) }))} />
      <PdfUpload label={t("extraLabel")} optional optionalLabel={t("optional")} hint={t("extraHint")} files={files.extra} onFiles={(fn) => setFiles((f) => ({ ...f, extra: fn(f.extra) }))} />
      <div className="vol-notice">
        {t("privacyNotice")}
      </div>
    </>
  );
}

function Step4({ data, t }: { data: FormData; t: (key: string, values?: Record<string, string>) => string }) {
  const subText = data.firstName ? t("step4SubWithName", { name: data.firstName }) : t("step4Sub");
  return (
    <div className="vol-done">
      <div className="vol-done-anim">✈️</div>
      <div className="vol-step-badge vol-step-badge--teal">{t("step4Badge")}</div>
      <h2 className="vol-step-title">
        {t("step4Title1")}<br />{t("step4Title2")}
      </h2>
      <p className="vol-step-sub">{subText}</p>
      <div className="vol-done-steps">
        <div className="vol-done-step">
          <span>📬</span>
          <p>{t("step4Bullet1")}</p>
        </div>
        <div className="vol-done-step">
          <span>🗓️</span>
          <p>{t("step4Bullet2")}</p>
        </div>
        <div className="vol-done-step">
          <span>✈️</span>
          <p>{t("step4Bullet3")}</p>
        </div>
        <div className="vol-done-step">
          <span>💛</span>
          <p>{t("step4Bullet4")}</p>
        </div>
      </div>
      <div className="vol-done-badge">{t("step4Done")}</div>
    </div>
  );
}

export default function VolunteerOnboarding() {
  const t = useTranslations("volunteerOnboarding");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    motivation: "",
    callPreference: "",
    language: "",
  });
  const [files, setFiles] = useState<FilesState>({ id: [], vog: [], certs: [], extra: [] });
  const step4SavedRef = useRef(false);

  // Licht thema 7:00–21:00, donker de rest van de dag (lokale tijd)
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const hour = new Date().getHours();
    setTheme(hour >= 7 && hour < 21 ? "light" : "dark");
  }, []);

  useEffect(() => {
    const supabase = createClient();
    loadOnboarding(supabase)
      .then((data) => {
        if (data) {
          setForm(data.form);
          setStep(data.step);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const update = (key: keyof FormData, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError("");
  };

  const validate = () => {
    if (step === 1) {
      if (!form.firstName.trim()) return t("validationFirstName");
      if (!form.lastName.trim()) return t("validationLastName");
      if (!form.email.includes("@")) return t("validationEmail");
      if (!form.phone.trim()) return t("validationPhone");
      if (!form.area) return t("validationArea");
    }
    if (step === 3) {
      if (files.id.length === 0) return t("validationIdDoc");
      if (files.vog.length === 0) return t("validationVog");
    }
    return "";
  };

  const next = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (step >= 4) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      if (step === 1) {
        await saveOnboardingStep(supabase, form, 1);
      } else if (step === 2) {
        await saveOnboardingStep(supabase, form, 2);
      } else if (step === 3) {
        const docPaths = await uploadOnboardingFiles(supabase, files);
        await saveOnboardingStep(supabase, form, 3, docPaths);
      }
      setStep((s) => s + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step !== 4 || loadingData || step4SavedRef.current) return;
    step4SavedRef.current = true;
    const supabase = createClient();
    saveOnboardingStep(supabase, form, 4)
      .then(() =>
        fetch("/api/portal/welcome-complete", { method: "POST", credentials: "include" })
      )
      .catch(() => {});
  }, [step, loadingData, form]);

  const back = () => { setError(""); setStep((s) => s - 1); };

  const stepLabels = [t("stepRegistered"), t("stepVideoCall"), t("stepDocuments"), t("stepTravel")];

  if (loadingData) {
    return (
      <div className="vol-bg">
        <div className="vol-card">
          <p className="vol-step-sub">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: VOLUNTEER_ONBOARDING_CSS }} />
      <div className={`vol-bg vol-bg--${theme}`} data-theme={theme}>
        <div className="vol-card">
          <div className="vol-logo">
            <img
              src={theme === "light" ? "/savedsouls-logo-darkgreen.png" : "/savedsouls-logo-white.png"}
              alt="Saved Souls Foundation"
              className="vol-logo-img"
            />
            <span className="vol-logo-text">SavedSoulsFoundation</span>
            <span className="vol-logo-pill">Vrijwilliger</span>
          </div>
          <Thermometer current={step} total={4} stepLabels={stepLabels} />
          <div className="vol-content">
            {step === 1 && <Step1 data={form} onChange={update} t={t} />}
            {step === 2 && <Step2 data={form} onChange={update} t={t} />}
            {step === 3 && <Step3 files={files} setFiles={setFiles} t={t} />}
            {step === 4 && <Step4 data={form} t={t} />}
            {error && <p className="vol-error">{error}</p>}
          </div>
          <div className="vol-nav">
            {step > 1 && step < 4 && (
              <button type="button" className="vol-btn vol-btn--ghost" onClick={back}>{t("buttonBack")}</button>
            )}
            {step < 4 && (
              <button type="button" className="vol-btn vol-btn--primary" onClick={next} disabled={loading}>
                {loading ? t("pleaseWait") : step === 1 ? t("buttonRegister") : step === 2 ? t("buttonNext") : t("buttonDocs")}
              </button>
            )}
            {step === 4 && (
              <Link href="/portal/vrijwilliger" className="vol-btn vol-btn--primary" style={{ textDecoration: "none" }}>
                {t("buttonDashboard")}
              </Link>
            )}
          </div>
          <p className="vol-footer">{t("progressFooter", { current: String(step) })}</p>
        </div>
      </div>
    </>
  );
}

const VOLUNTEER_ONBOARDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
  :root {
    --vol-teal: #2A9D8F; --vol-teal-lt: #4DC8BA; --vol-sky: #1A7FB5;
    --vol-dark: #0f172a; --vol-card: #1a2332; --vol-card2: #1e293b;
    --vol-border: #334155; --vol-text: #e2e8f0; --vol-muted: #94a3b8;
    --vol-error: #E05D5D; --vol-green: #3D8B5E; --vol-green-lt: #6FCF97;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .vol-bg {
    min-height: 100vh;
    background: var(--vol-dark);
    background-image: radial-gradient(ellipse 55% 45% at 10% 5%, rgba(42,157,143,.14) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 90% 95%, rgba(26,127,181,.12) 0%, transparent 65%);
    display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }
  .vol-card {
    width: 100%; max-width: 580px;
    background: var(--vol-card); border: 1px solid var(--vol-border); border-radius: 22px;
    padding: 2.5rem 2.25rem 2rem;
    box-shadow: 0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(42,157,143,.08);
  }
  .vol-logo { display: flex; align-items: center; gap: .65rem; margin-bottom: 2rem; }
  .vol-logo-img { height: 2rem; width: auto; object-fit: contain; display: block; }
  .vol-logo-text { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--vol-teal-lt); letter-spacing: .02em; flex: 1; }
  .vol-logo-pill { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; background: rgba(42,157,143,.15); border: 1px solid rgba(42,157,143,.3); color: var(--vol-teal-lt); padding: .2rem .65rem; border-radius: 99px; }
  .vol-thermo { margin-bottom: 2.5rem; padding: 0 4px; }
  .vol-thermo-track { position: relative; height: 4px; background: var(--vol-border); border-radius: 99px; margin: 28px 0 44px; }
  .vol-thermo-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, var(--vol-teal), var(--vol-teal-lt)); border-radius: 99px; transition: width .5s cubic-bezier(.4,0,.2,1); }
  .vol-thermo-node { position: absolute; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; }
  .vol-thermo-dot { width: 36px; height: 36px; border-radius: 50%; background: var(--vol-card); border: 2px solid var(--vol-border); color: var(--vol-muted); font-size: .95rem; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all .3s; position: relative; z-index: 1; }
  .vol-thermo-node--done .vol-thermo-dot { background: var(--vol-teal); border-color: var(--vol-teal); color: #fff; }
  .vol-thermo-node--active .vol-thermo-dot { background: var(--vol-card2); border-color: var(--vol-teal); color: var(--vol-teal-lt); box-shadow: 0 0 0 5px rgba(42,157,143,.2); }
  .vol-thermo-step-label { font-size: .67rem; color: var(--vol-muted); white-space: nowrap; position: absolute; top: 100%; margin-top: 8px; left: 50%; transform: translateX(-50%); }
  .vol-thermo-node--active .vol-thermo-step-label, .vol-thermo-node--done .vol-thermo-step-label { color: var(--vol-teal-lt); }
  .vol-step-badge { display: inline-block; font-size: .71rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--vol-teal-lt); background: rgba(42,157,143,.1); border: 1px solid rgba(42,157,143,.25); border-radius: 99px; padding: .25rem .9rem; margin-bottom: .8rem; }
  .vol-step-badge--teal { color: var(--vol-green-lt); background: rgba(61,139,94,.12); border-color: rgba(61,139,94,.3); }
  .vol-content { margin-bottom: 1.75rem; }
  .vol-step-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: var(--vol-text); margin-bottom: .5rem; line-height: 1.25; }
  .vol-step-sub { color: var(--vol-muted); font-size: .9rem; margin-bottom: 1.5rem; line-height: 1.65; }
  .vol-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .vol-field { margin-bottom: 1rem; }
  .vol-label { display: block; font-size: .77rem; font-weight: 700; color: var(--vol-muted); margin-bottom: .35rem; text-transform: uppercase; letter-spacing: .07em; }
  .vol-hint { font-size: .78rem; color: var(--vol-muted); margin-bottom: .4rem; line-height: 1.4; font-style: italic; }
  .vol-optional { font-weight: 400; text-transform: none; letter-spacing: 0; }
  .vol-input { width: 100%; background: rgba(255,255,255,.08); border: 1px solid var(--vol-border); border-radius: 10px; padding: .75rem 1rem; color: var(--vol-text); font-family: 'DM Sans', sans-serif; font-size: .95rem; outline: none; resize: vertical; transition: border-color .2s, box-shadow .2s; -webkit-appearance: none; }
  .vol-input:focus { border-color: var(--vol-teal); box-shadow: 0 0 0 3px rgba(42,157,143,.2); }
  .vol-input::placeholder { color: #8ba3b8; }
  .vol-textarea { min-height: 90px; }
  .vol-select { cursor: pointer; }
  .vol-select option { background: var(--vol-card2); }
  .vol-info-block { background: rgba(42,157,143,.05); border: 1px solid rgba(42,157,143,.18); border-radius: 14px; padding: 1.1rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: .9rem; }
  .vol-info-row { display: flex; gap: .85rem; align-items: flex-start; }
  .vol-info-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: .1rem; }
  .vol-info-row strong { display: block; font-size: .88rem; color: var(--vol-text); margin-bottom: .2rem; }
  .vol-info-row p { font-size: .82rem; color: var(--vol-muted); line-height: 1.45; }
  .vol-dropzone { border: 1.5px dashed var(--vol-border); border-radius: 12px; padding: 1.2rem 1rem; text-align: center; cursor: pointer; transition: border-color .2s, background .2s; display: flex; flex-direction: column; align-items: center; gap: .35rem; }
  .vol-dropzone:hover, .vol-dropzone--over { border-color: var(--vol-teal); background: rgba(42,157,143,.06); }
  .vol-dropzone-icon { font-size: 1.5rem; }
  .vol-dropzone-text { font-size: .87rem; color: var(--vol-text); }
  .vol-dropzone-link { color: var(--vol-teal-lt); text-decoration: underline; }
  .vol-dropzone-sub { font-size: .74rem; color: var(--vol-muted); }
  .vol-file-list { list-style: none; margin-top: .55rem; display: flex; flex-direction: column; gap: .4rem; }
  .vol-file-item { display: flex; align-items: center; gap: .5rem; background: rgba(42,157,143,.06); border: 1px solid rgba(42,157,143,.18); border-radius: 8px; padding: .5rem .75rem; font-size: .82rem; }
  .vol-file-icon { flex-shrink: 0; }
  .vol-file-name { flex: 1; color: var(--vol-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vol-file-size { color: var(--vol-muted); white-space: nowrap; }
  .vol-file-remove { background: none; border: none; color: var(--vol-muted); cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0 .1rem; transition: color .15s; }
  .vol-file-remove:hover { color: var(--vol-error); }
  .vol-brochure-link { display: inline-flex; align-items: center; gap: .5rem; color: var(--vol-teal-lt); text-decoration: none; font-size: .88rem; font-weight: 600; padding: .6rem 1rem; background: rgba(42,157,143,.08); border: 1px solid rgba(42,157,143,.25); border-radius: 8px; margin-bottom: 1.25rem; transition: background .2s; }
  .vol-brochure-link:hover { background: rgba(42,157,143,.15); }
  .vol-notice { margin-top: 1rem; font-size: .78rem; color: var(--vol-muted); background: rgba(255,255,255,.03); border: 1px solid var(--vol-border); border-radius: 8px; padding: .65rem .9rem; line-height: 1.5; }
  .vol-done { text-align: center; padding: .75rem 0 .5rem; }
  .vol-done-anim { font-size: 3.5rem; margin-bottom: 1rem; animation: volfly 3s ease-in-out infinite; }
  @keyframes volfly { 0% { transform: translateY(0) rotate(0deg); } 30% { transform: translateY(-10px) rotate(-4deg); } 60% { transform: translateY(-5px) rotate(2deg); } 100% { transform: translateY(0) rotate(0deg); } }
  .vol-done .vol-step-title { margin: .5rem 0 .6rem; }
  .vol-done .vol-step-sub { font-size: .88rem; }
  .vol-done-steps { display: flex; flex-direction: column; gap: .55rem; margin: 1.25rem 0; text-align: left; }
  .vol-done-step { display: flex; gap: .75rem; align-items: flex-start; background: rgba(42,157,143,.06); border: 1px solid rgba(42,157,143,.18); border-radius: 10px; padding: .7rem .9rem; font-size: .84rem; color: var(--vol-muted); line-height: 1.5; }
  .vol-done-step span { font-size: 1.1rem; flex-shrink: 0; }
  .vol-done-badge { display: inline-block; margin-top: .75rem; background: rgba(61,139,94,.15); border: 1px solid var(--vol-green); color: var(--vol-green-lt); font-size: .8rem; font-weight: 700; letter-spacing: .06em; padding: .4rem 1.2rem; border-radius: 99px; }
  .vol-error { color: var(--vol-error); font-size: .85rem; margin-top: .75rem; padding: .6rem .9rem; background: rgba(224,93,93,.08); border-radius: 8px; border-left: 3px solid var(--vol-error); }
  .vol-nav { display: flex; gap: .75rem; justify-content: flex-end; }
  .vol-btn { padding: .75rem 1.5rem; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 600; cursor: pointer; border: none; transition: opacity .2s, transform .15s; }
  .vol-btn:active { transform: scale(.97); }
  .vol-btn--primary { background: linear-gradient(135deg, var(--vol-teal), var(--vol-teal-lt)); color: #fff; }
  .vol-btn--primary:disabled { opacity: .5; cursor: default; }
  .vol-btn--ghost { background: transparent; color: var(--vol-muted); border: 1px solid var(--vol-border); }
  .vol-btn--ghost:hover { color: var(--vol-text); border-color: var(--vol-muted); }
  .vol-footer { text-align: center; color: var(--vol-muted); font-size: .73rem; margin-top: 1.25rem; letter-spacing: .05em; }

  /* ── Light theme (7:00–21:00): betere leesbaarheid ── */
  .vol-bg--light {
    --vol-dark: #e8eef4;
    --vol-card: #ffffff;
    --vol-card2: #f1f5f9;
    --vol-border: #cbd5e1;
    --vol-text: #1e293b;
    --vol-muted: #475569;
    --vol-teal-lt: #0d9488;
    background: linear-gradient(180deg, #e8eef4 0%, #dbe4f0 100%);
    background-image: radial-gradient(ellipse 55% 45% at 10% 5%, rgba(42,157,143,.12) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 90% 95%, rgba(26,127,181,.1) 0%, transparent 65%);
  }
  .vol-bg--light .vol-card {
    box-shadow: 0 20px 50px rgba(0,0,0,.1), 0 0 0 1px rgba(0,0,0,.06);
  }
  .vol-bg--light .vol-input {
    background: #ffffff;
    border-color: #94a3b8;
    color: #1e293b;
  }
  .vol-bg--light .vol-input::placeholder {
    color: #64748b;
  }
  .vol-bg--light .vol-input:focus {
    border-color: var(--vol-teal);
    box-shadow: 0 0 0 3px rgba(42,157,143,.2);
  }
  .vol-bg--light .vol-label { color: #475569; }
  .vol-bg--light .vol-hint { color: #64748b; }
  .vol-bg--light .vol-select option { background: #ffffff; color: #1e293b; }
  .vol-bg--light .vol-step-title { color: #0f172a; }
  .vol-bg--light .vol-step-sub { color: #475569; }
  .vol-bg--light .vol-thermo-track { background: #cbd5e1; }
  .vol-bg--light .vol-thermo-node--active .vol-thermo-dot,
  .vol-bg--light .vol-thermo-node--done .vol-thermo-dot { color: #fff; }
  .vol-bg--light .vol-thermo-step-label { color: #475569; }
  .vol-bg--light .vol-thermo-node--active .vol-thermo-step-label,
  .vol-bg--light .vol-thermo-node--done .vol-thermo-step-label { color: var(--vol-teal-lt); }
  .vol-bg--light .vol-dropzone { border-color: #94a3b8; color: #1e293b; }
  .vol-bg--light .vol-dropzone:hover, .vol-bg--light .vol-dropzone--over { background: rgba(42,157,143,.08); }
  .vol-bg--light .vol-file-item { background: #f1f5f9; border-color: #cbd5e1; }
  .vol-bg--light .vol-file-name { color: #1e293b; }
  .vol-bg--light .vol-file-size { color: #64748b; }
  .vol-bg--light .vol-logo-text { color: #0f766e; }
  .vol-bg--light .vol-btn--ghost { color: #475569; border-color: #94a3b8; }
  .vol-bg--light .vol-btn--ghost:hover { color: #1e293b; border-color: #64748b; }
  .vol-bg--light .vol-footer { color: #64748b; }

  @media (max-width: 480px) { .vol-grid-2 { grid-template-columns: 1fr; } .vol-card { padding: 2rem 1.25rem 1.75rem; } }
`;
