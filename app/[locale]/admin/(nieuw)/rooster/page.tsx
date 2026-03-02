import RoosterClient from "./RoosterClient";

export const metadata = {
  title: "Rooster | Admin",
  robots: { index: false, follow: false },
};

export default function RoosterPage() {
  return <RoosterClient />;
}
