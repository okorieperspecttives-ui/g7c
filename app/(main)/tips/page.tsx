import { Metadata } from "next";
import TipsClient from "./TipsClient";

export const metadata: Metadata = {
  title: "Energy Tips & News",
  description: "Learn how to optimize your power usage, maintain your solar system, and stay updated on the latest clean energy trends in Nigeria.",
};

export default function TipsPage() {
  return <TipsClient />;
}
