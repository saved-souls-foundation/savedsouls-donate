'use client'
import dynamic from "next/dynamic";
const TestAIClient = dynamic(() => import("./client"), { ssr: false });

export default function TestAIPage() {
  return <TestAIClient />;
}
