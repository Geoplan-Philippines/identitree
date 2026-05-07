import { cookies } from "next/headers";
import { getTemplates, Template } from "@/lib/services/nfc-cards.service";
import { TemplatesClient } from "@/components/templates/templates-client";

export default async function TemplatesPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let initialData: Template[] = [];
  try {
    initialData = await getTemplates({ cookie: cookieHeader });
  } catch (error) {
    console.error("Failed to fetch templates on server:", error);
  }

  return <TemplatesClient initialData={initialData} />;
}
