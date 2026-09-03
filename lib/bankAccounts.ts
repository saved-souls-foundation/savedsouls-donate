/** Shared bank account constants — not translated; identical in every locale. */
export const BANK_ACCOUNTS = {
  europe: {
    holder: "Saved Souls Animal Sanctuary / Tierheim Ban Fang",
    bank: "PostFinance AG",
    ibanDisplay: "CH17 0900 0000 8027 1722 9",
    ibanCopy: "CH1709000000802717229",
    bic: "POFICHBEXXX",
  },
  thailand: {
    holder: "Saved-Souls Foundation, Ban Fang, Khon Kaen",
    bank: "Kasikorn Bank (bank code 004)",
    account: "033-8-13623-4",
    bic: "KASITHBK",
  },
} as const;
