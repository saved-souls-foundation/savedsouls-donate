"use client";

import { usePathname } from "@/i18n/navigation";
import CarActionButton from "./CarActionButton";

/** Renders CarActionButton but hides it on /dashboard/ai (AI dashboard). */
export default function CarActionButtonWrapper() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/dashboard/ai") ?? false;
  return <CarActionButton hide={hide} />;
}
