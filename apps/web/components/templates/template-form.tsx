"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Template } from "@/lib/services/nfc-cards.service";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/use-templates";
import { toast } from "sonner";
import { Loader2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplatePreview } from "@/components/profile/template-preview";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useState } from "react";
import { templateSchema, TemplateFormValues, DEFAULT_CONFIG } from "./builder/builder-types";
import { IdentityTab } from "./builder/identity-tab";
import { BrandingTab } from "./builder/branding-tab";
import { LayersTab } from "./builder/layers-tab";
import { AestheticsTab } from "./builder/aesthetics-tab";

interface TemplateFormProps {
  initialData?: Template;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TemplateForm({ initialData, onSuccess, onCancel }: TemplateFormProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [activeTab, setActiveTab] = useState("basics");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const isEditing = !!initialData;

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      layoutKey: initialData?.layoutKey || "default",
      config: initialData?.config || DEFAULT_CONFIG,
    },
  });

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, payload: values as any });
        toast.success("Template updated successfully");
      } else {
        await createMutation.mutateAsync(values as any);
        toast.success("Template created successfully");
      }
      if (onSuccess) {
        onSuccess();
      }
      router.push(`/dashboard/${slug}/templates`);
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template. Please try again.");
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const currentValues = form.watch();

  const mockProfile = {
    id: "tpl_preview_12345678",
    firstName: "Alex",
    lastName: "Design",
    positionTitle: "Creative Director",
    email: "alex@example.com",
    contactNumber: "+63 912 345 6789",
    organization: { name: "Branding Studio" },
    template: {
      layoutKey: currentValues.layoutKey,
      config: currentValues.config as any,
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Editor Side */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList variant="line" className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-11 gap-6 overflow-x-auto no-scrollbar">
            {["basics", "branding", "layers", "aesthetics"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="shrink-0 rounded-none px-0 font-semibold text-sm h-full capitalize border-transparent data-active:border-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="basics">
            <IdentityTab form={form} />
          </TabsContent>

          <TabsContent value="branding">
            <BrandingTab form={form} />
          </TabsContent>

          <TabsContent value="layers">
            <LayersTab
              form={form}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          </TabsContent>

          <TabsContent value="aesthetics">
            <AestheticsTab form={form} />
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-3 pt-6 border-t border-border mt-8 sticky bottom-0 bg-background pb-4 z-50 w-full">
          <Button
            type="button"
            variant="outline"
            className="rounded-none font-black lg:hidden shrink-0"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button
            type="submit"
            className="rounded-none font-black flex-1 lg:flex-none bg-primary text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              isEditing ? "Save Design" : "Create Template"
            )}
          </Button>
        </div>
      </form>

      {/* Mobile Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          className="p-0 border-none max-w-[95vw] h-[90dvh] flex flex-col rounded-none overflow-hidden bg-transparent shadow-none [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-none [&>button]:top-4 [&>button]:right-4"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-white relative overflow-y-auto rounded-none shadow-2xl m-2 scrollbar-thin scrollbar-thumb-gray-300">
            <div className="min-h-full flex flex-col">
              <TemplatePreview
                profile={mockProfile as any}
                layoutKey={currentValues.config?.cardLayoutKey || currentValues.layoutKey || "default"}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                onSelectSection={(id) => {
                  setActiveTab("layers");
                  setExpandedSection(id);
                  setIsPreviewOpen(false);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Side */}
      <div className="relative hidden lg:block">
        <div className="sticky top-0 bg-muted/10 border border-border h-full min-h-[600px] flex flex-col rounded-none overflow-hidden">
          <div className="p-4 border-b border-border bg-background flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Live Preview</span>
            <div className="flex gap-1">
              <div className="size-1.5 rounded-full bg-border" />
              <div className="size-1.5 rounded-full bg-border" />
            </div>
          </div>
          <div className="flex-1 p-0 bg-slate-50 relative overflow-hidden flex items-center justify-center">
            <div className="w-full h-full max-w-2xl bg-white shadow-sm relative group">
              <TemplatePreview
                profile={mockProfile as any}
                layoutKey={currentValues.config?.cardLayoutKey || currentValues.layoutKey || "default"}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
                onSelectSection={(id) => {
                  setActiveTab("layers");
                  setExpandedSection(id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
