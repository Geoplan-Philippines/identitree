"use client";

import { useState } from "react";
import { useTemplates, useDeleteTemplate } from "@/hooks/use-templates";
import { Button } from "@/components/ui/button";
import { Template } from "@/lib/services/nfc-cards.service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { LayoutTemplate, Plus, Trash, ArrowLeft, ExternalLink, Info } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TemplatesClientProps {
  initialData: Template[];
}

export function TemplatesClient({ initialData }: TemplatesClientProps) {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data, refetch } = useTemplates(initialData);
  const deleteMutation = useDeleteTemplate();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const templates = data || [];
  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  return (
    <div className="flex h-full gap-6 overflow-hidden p-1">
      {/* Left Column: Template List */}
      <div className={cn(
        "transition-all duration-300 flex flex-col gap-4",
        selectedTemplateId ? "w-80" : "w-full"
      )}>
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tight">Templates</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Manage Organization Layouts
            </p>
          </div>
          <Button 
            size="sm" 
            asChild
            className="rounded-none font-bold uppercase text-[10px]"
          >
            <Link href={`/dashboard/${slug}/templates/new`}>
              <Plus className="size-3.5 mr-1.5" />
              New Template
            </Link>
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4 min-h-0">
          <div className={cn(
            "grid gap-5 pb-16",
            selectedTemplateId ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {templates.length === 0 ? (
              <div className="col-span-full py-20">
                <Empty>
                  <EmptyMedia variant="icon">
                    <LayoutTemplate className="size-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No templates found</EmptyTitle>
                    <EmptyDescription>
                      Create your first organization-specific template to standardize your cards.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link href={`/dashboard/${slug}/templates/new`}>
                        <Plus className="size-3.5 mr-1.5" />
                        Create First Template
                      </Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "relative group border p-4 flex flex-col gap-4 transition-all duration-200 overflow-hidden rounded-none cursor-pointer",
                    selectedTemplateId === template.id
                      ? "border-foreground bg-foreground/5 shadow-md"
                      : "bg-background hover:bg-muted/30 border-border hover:border-foreground/20 shadow-sm"
                  )}
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</span>
                      <span className="font-bold text-sm uppercase">{template.category || "General"}</span>
                    </div>
                    <Badge
                      variant={template.availability === "GLOBAL" ? "secondary" : "default"}
                      className="text-[9px] h-4 rounded-none px-1.5 uppercase font-bold"
                    >
                      {template.availability}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Template Name</span>
                    <span className="font-extrabold text-lg tracking-tight uppercase truncate">
                      {template.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Layout Base</span>
                      <span className="font-mono text-[11px] font-bold uppercase">{template.layoutKey}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Detail Panel */}
      {selectedTemplateId && selectedTemplate && (
        <div className="flex-1 border bg-muted/5 flex flex-col animate-in slide-in-from-right duration-300 border-border overflow-hidden h-full rounded-none">
          <div className="p-5 border-b flex items-center justify-between gap-4 bg-background sticky top-0 z-20 rounded-none">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTemplateId(null)}
                className="rounded-none hover:bg-muted shrink-0"
              >
                <ArrowLeft size={20} />
              </Button>
              <div className="space-y-0.5 min-w-0">
                <h3 className="font-black text-lg tracking-tight uppercase truncate">{selectedTemplate.name}</h3>
                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-none border border-border">
                  {selectedTemplate.id}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {selectedTemplate.availability !== "GLOBAL" && (
                <>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="rounded-none uppercase font-bold text-[10px]"
                  >
                    <Link href={`/dashboard/${slug}/templates/${selectedTemplate.id}`}>
                      <ExternalLink className="size-3.5 mr-1.5" />
                      Open Designer
                    </Link>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="rounded-none uppercase font-bold text-[10px]"
                      >
                        <Trash className="size-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold">Delete Template?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Any profiles using this template will revert to the default design.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none uppercase font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="rounded-none uppercase font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={async () => {
                            await deleteMutation.mutateAsync(selectedTemplate.id);
                            toast.success("Template deleted successfully");
                            setSelectedTemplateId(null);
                            refetch();
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 w-full min-h-0">
            <div className="p-8">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* System Message */}
                {selectedTemplate.availability === "GLOBAL" && (
                  <div className="bg-blue-50/50 border border-blue-200/50 p-6 flex items-start gap-4">
                    <Info className="size-5 text-blue-600 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">System Template</h4>
                      <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                        This is a core system design and cannot be modified. You can use it as a standard for your profiles or create a new custom design from the templates list.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Details Section */}
                  <div className="space-y-6 border border-border bg-background p-6">
                    <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                      <LayoutTemplate className="size-4 text-muted-foreground" />
                      <span className="text-xs font-black uppercase tracking-widest">Template Overview</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Category</span>
                        <span className="font-bold text-sm uppercase">{selectedTemplate.category || "General"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Availability</span>
                        <Badge className="w-fit rounded-none font-bold uppercase text-[9px] h-4">
                          {selectedTemplate.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Layout Configuration Section */}
                  <div className="space-y-6 border border-border bg-background p-6">
                    <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
                      <LayoutTemplate className="size-4 text-muted-foreground" />
                      <span className="text-xs font-black uppercase tracking-widest">Layout Engine</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base Layout Key</span>
                        <code className="text-xs font-bold bg-muted px-2 py-1 w-fit border border-border uppercase">
                          {selectedTemplate.layoutKey}
                        </code>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Card Aesthetic</span>
                        <span className="font-bold text-sm uppercase">{selectedTemplate.config?.cardStyle || "Default"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action for non-global */}
                {selectedTemplate.availability !== "GLOBAL" && (
                  <div className="p-10 border border-border bg-background flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="space-y-2">
                      <h4 className="font-black uppercase text-lg tracking-tight">Full-Page Designer</h4>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Launch the immersive design studio to customize every visual detail of this template.
                      </p>
                    </div>
                    <Button asChild size="lg" className="rounded-none font-bold uppercase px-10">
                      <Link href={`/dashboard/${slug}/templates/${selectedTemplate.id}`}>
                        <ExternalLink className="mr-2 size-4" />
                        Launch Design Studio
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
