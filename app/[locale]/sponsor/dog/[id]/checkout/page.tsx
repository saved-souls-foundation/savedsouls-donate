"use client";

import { useParams } from "next/navigation";
import SponsorCheckout from "../../../../../components/SponsorCheckout";

export default function SponsorDogCheckoutPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return <SponsorCheckout animalType="dog" animalId={id} />;
}
