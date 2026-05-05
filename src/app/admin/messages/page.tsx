import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listMessages } from "@/lib/messages";
import MessagesView from "./MessagesView";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  if (!isAuthenticated()) {
    redirect("/admin");
  }
  const messages = await listMessages();
  return <MessagesView initial={messages} />;
}
