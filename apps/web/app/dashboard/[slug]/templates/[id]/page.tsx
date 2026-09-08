import { PageHeader } from "@/components/shared/page-shell";
import { TemplateForm } from "@/components/templates/template-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTemplate } from "@/lib/services/nfc-cards.service";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function EditTemplatePage({ 
  params 
}: { 
  params: Promise<{ slug: string; id: string }> 
}) {
  const { slug, id } = await params;
  const cookieHeader = (await cookies()).toString();

  let template;
  try {
    template = await getTemplate(id, { Cookie: cookieHeader });
  } catch (error) {
    console.error("Failed to fetch template:", error);
    return notFound();
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-lg">
          <Link href={`/dashboard/${slug}/templates`}>
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <PageHeader 
          title="Edit Design" 
          description={`Refining the ${template.name} brand experience.`}
        />
      </div>

      <div className="bg-background border border-border p-8 shadow-sm">
        <TemplateForm initialData={template} />
      </div>
    </div>
  );
}
