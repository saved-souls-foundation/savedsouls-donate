"use client";

import { useState, useEffect } from "react";
import BankTransferSection from "./BankTransferSection";

export default function BankTransferAutoOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#bank-transfer") {
      setOpen(true);
    }
  }, []);
  return <BankTransferSection defaultOpen={open} />;
}
