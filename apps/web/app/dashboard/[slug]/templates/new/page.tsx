import { PageHeader } from "@/components/shared/page-shell";
import { TemplateForm } from "@/components/templates/template-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewTemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-none">
          <Link href={`/dashboard/${slug}/templates`}>
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <PageHeader 
          title="Create New Design" 
          description="Build a custom brand identity for your organization's profiles."
        />
      </div>

      <div className="bg-background border border-border p-8 shadow-sm">
        <TemplateForm />
      </div>
    </div>
  );
}
