import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/data";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }
  const content = await getContent();
  return <Dashboard initial={content} />;
}
