"use client";

import { useParams } from "next/navigation";
import SponsorCheckout from "../../../../../components/SponsorCheckout";

export default function SponsorCatCheckoutPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return <SponsorCheckout animalType="cat" animalId={id} />;
}
