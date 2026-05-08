"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import {
  Layers,
  LayoutTemplate,
  Palette,
  Share2,
  ExternalLink,
  Text,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  LayoutGrid,
  List,
  Sparkles,
  CreditCard,
  Moon,
  Sun
} from "lucide-react";
import { Reorder, AnimatePresence, motion } from "motion/react";
import { TemplateFormValues } from "./builder-types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface LayersTabProps {
  form: UseFormReturn<TemplateFormValues>;
  expandedSection: string | null;
  setExpandedSection: (id: string | null) => void;
}

const sectionLabels: Record<string, { label: string; icon: any }> = {
  avatar: { label: "Profile Identity", icon: Layers },
  header: { label: "Business Card", icon: LayoutTemplate },
  bio: { label: "Introduction / Bio", icon: Text },
  socials: { label: "Social Links", icon: Share2 },
  actions: { label: "Primary Actions", icon: ExternalLink },
  footer: { label: "Branding Footer", icon: Palette },
};

export function LayersTab({ form, expandedSection, setExpandedSection }: LayersTabProps) {
  const sectionsOrder = form.watch("config.sectionsOrder") || [];
  const [pendingPreset, setPendingPreset] = useState<string | null>(null);

  const handleReorder = (newOrder: string[]) => {
    form.setValue("config.sectionsOrder", newOrder);
  };

  const applyCardPreset = (preset: "classic" | "midnight" | "frosted" | "gold" | "ocean" | "carbon" | "rose") => {
    const presets = {
      classic: { layout: "default", primary: "#ffffff", secondary: "#101312", text: "#0f172a" },
      midnight: { layout: "modern-dark", primary: "#09090b", secondary: "#18181b", text: "#ffffff" },
      frosted: { layout: "glass", primary: "#334155", secondary: "#1e293b", text: "#f1f5f9" },
      gold: { layout: "default", primary: "#92400e", secondary: "#78350f", text: "#fef3c7" },
      ocean: { layout: "default", primary: "#0c4a6e", secondary: "#0e7490", text: "#e0f2fe" },
      carbon: { layout: "modern-dark", primary: "#1c1917", secondary: "#292524", text: "#d6d3d1" },
      rose: { layout: "default", primary: "#4c0519", secondary: "#881337", text: "#fce7f3" },
    };

    const data = presets[preset];
    if (!data) return;

    form.setValue("config.cardPrimaryColor", data.primary);
    form.setValue("config.cardSecondaryColor", data.secondary);
    form.setValue("config.cardTextColor", data.text);
    form.setValue("config.cardLayoutKey", data.layout as any);
    form.setValue("config.cardBackgroundImage", "");
    // Note: We deliberately DO NOT reset alignments or patterns here to retain user customizations
  };

  const AlignmentToggle = ({ name }: { name: any }) => (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <div className="flex gap-1 bg-muted p-1 rounded-none border border-border w-fit">
          {["left", "center", "right"].map((align) => (
            <Button
              key={align}
              type="button"
              size="icon"
              variant={field.value === align ? "default" : "ghost"}
              className="h-7 w-7 rounded-none"
              onClick={() => field.onChange(align)}
            >
              {align === "left" && <AlignLeft size={14} />}
              {align === "center" && <AlignCenter size={14} />}
              {align === "right" && <AlignRight size={14} />}
            </Button>
          ))}
        </div>
      )}
    />
  );

  return (
    <div className="pt-6 space-y-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-tight">Layer Manager</span>
        <span className="text-[10px] text-muted-foreground uppercase">Reorder & Configure</span>
      </div>

      <Reorder.Group axis="y" values={sectionsOrder} onReorder={handleReorder} className="space-y-2">
        {sectionsOrder.map((sectionId) => {
          const section = sectionLabels[sectionId];
          if (!section) return null;

          const visibilityField = `config.show${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}` as any;
          const isVisible = form.watch(visibilityField);
          const isExpanded = expandedSection === sectionId;

          return (
            <Reorder.Item key={sectionId} value={sectionId} className="group relative">
              <div className={cn(
                "border flex flex-col transition-all duration-200 overflow-hidden",
                isVisible ? "border-border bg-background" : "border-border/50 bg-muted/30 opacity-60",
                isExpanded ? "ring-1 ring-foreground" : ""
              )}>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground group-hover:text-foreground">
                      <GripVertical size={14} />
                    </div>
                    <div className="cursor-pointer" onClick={() => setExpandedSection(isExpanded ? null : sectionId)}>
                      <span className="text-[10px] font-black uppercase tracking-tight block">{section.label}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">{isVisible ? 'Active' : 'Disabled'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none"
                      onClick={() => setExpandedSection(isExpanded ? null : sectionId)}
                    >
                      <ChevronDown size={14} className={cn("transition-transform", isExpanded ? "rotate-180" : "")} />
                    </Button>
                    <Controller
                      name={visibilityField}
                      control={form.control}
                      render={({ field }) => (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-none"
                          onClick={() => field.onChange(!field.value)}
                        >
                          {field.value ? <Eye size={12} /> : <EyeOff size={12} />}
                        </Button>
                      )}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-muted/20"
                    >
                      <div className="p-4 space-y-4">
                        {sectionId === "avatar" && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Avatar alignment</FieldLabel>
                                <AlignmentToggle name="config.avatarAlignment" />
                              </Field>
                              <Field>
                                <FieldLabel>Name & info</FieldLabel>
                                <AlignmentToggle name="config.infoAlignment" />
                              </Field>
                            </div>

                            <div className="space-y-4 border-t border-border pt-4">
                              <p className="text-[9px] font-black uppercase text-muted-foreground">Identity Badges</p>
                              
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-tight">Status Badge (Top)</span>
                                  <Controller
                                    name="config.showTopBadge"
                                    control={form.control}
                                    render={({ field }) => (
                                      <Switch 
                                        checked={field.value !== false} 
                                        onCheckedChange={field.onChange} 
                                      />
                                    )}
                                  />
                                </div>
                                <Controller
                                  name="config.topBadgeText"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Input 
                                      {...field} 
                                      placeholder="e.g. Digital Business Card" 
                                      className="h-8 rounded-none border-border text-[10px]"
                                      disabled={form.watch("config.showTopBadge") === false}
                                    />
                                  )}
                                />
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-tight">Verification Badge</span>
                                  <Controller
                                    name="config.showVerifyBadge"
                                    control={form.control}
                                    render={({ field }) => (
                                      <Switch 
                                        checked={field.value !== false} 
                                        onCheckedChange={field.onChange} 
                                      />
                                    )}
                                  />
                                </div>
                                <Controller
                                  name="config.verifyBadgeText"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Input 
                                      {...field} 
                                      placeholder="e.g. Identity Verified" 
                                      className="h-8 rounded-none border-border text-[10px]"
                                      disabled={form.watch("config.showVerifyBadge") === false}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {sectionId === "header" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <FieldLabel>Sample card designs</FieldLabel>
                              <div className="grid grid-cols-4 gap-1.5">
                                {([
                                  { id: "classic", label: "Classic", bg: "#ffffff", border: "#d1d5db", textColor: "#374151", hoverBorder: "#111827" },
                                  { id: "midnight", label: "Midnight", bg: "#09090b", border: "#3f3f46", textColor: "#a1a1aa", hoverBorder: "#a1a1aa" },
                                  { id: "frosted", label: "Frosted", bg: "#475569", border: "#64748b", textColor: "#e2e8f0", hoverBorder: "#e2e8f0" },
                                  { id: "gold", label: "Gold", bg: "#78350f", border: "#92400e", textColor: "#fcd34d", hoverBorder: "#fcd34d" },
                                  { id: "ocean", label: "Ocean", bg: "#0c4a6e", border: "#0369a1", textColor: "#7dd3fc", hoverBorder: "#7dd3fc" },
                                  { id: "carbon", label: "Carbon", bg: "#1c1917", border: "#44403c", textColor: "#a8a29e", hoverBorder: "#a8a29e" },
                                  { id: "rose", label: "Rose", bg: "#4c0519", border: "#9f1239", textColor: "#fda4af", hoverBorder: "#fda4af" },
                                ] as const).map(({ id, label, bg, border, textColor: tc, hoverBorder }) => (
                                  <button
                                    key={id}
                                    type="button"
                                    onClick={() => applyCardPreset(id)}
                                    className="h-10 rounded-none border transition-all duration-150 flex flex-col items-center justify-center gap-0.5 px-1 hover:scale-105 hover:shadow-md"
                                    style={{ backgroundColor: bg, borderColor: border, color: tc }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = hoverBorder)}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
                                  >
                                    <span className="text-[8px] font-semibold" style={{ color: tc }}>{label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <Controller
                              name="config.cardLayoutKey"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Base card theme</FieldLabel>
                                  <Select 
                                    onValueChange={(val) => {
                                      field.onChange(val);
                                      form.setValue("layoutKey", val);
                                    }} 
                                    value={field.value ?? "default"}
                                  >
                                    <SelectTrigger className="rounded-none h-9 border-border">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                      <SelectItem value="default">Standard</SelectItem>
                                      <SelectItem value="modern-dark">Modern Dark</SelectItem>
                                      <SelectItem value="glass">Glass</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <Field>
                                <FieldLabel>Logo position</FieldLabel>
                                <AlignmentToggle name="config.cardLogoAlignment" />
                              </Field>
                              <Field>
                                <FieldLabel>Name position</FieldLabel>
                                <AlignmentToggle name="config.cardNameAlignment" />
                              </Field>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              <Field>
                                <div className="flex items-center justify-between">
                                  <FieldLabel>Contact Details Alignment</FieldLabel>
                                  <AlignmentToggle name="config.cardDetailsAlignment" />
                                </div>
                              </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4 mt-2">
                              <Controller
                                name="config.cardShowPhone"
                                control={form.control}
                                render={({ field }) => (
                                  <div className="flex items-center justify-between">
                                    <FieldLabel className="mb-0">Show Number</FieldLabel>
                                    <Switch
                                      checked={field.value !== false}
                                      onCheckedChange={field.onChange}
                                      className="scale-75"
                                    />
                                  </div>
                                )}
                              />
                              <Controller
                                name="config.cardShowEmail"
                                control={form.control}
                                render={({ field }) => (
                                  <div className="flex items-center justify-between">
                                    <FieldLabel className="mb-0">Show Email</FieldLabel>
                                    <Switch
                                      checked={field.value !== false}
                                      onCheckedChange={field.onChange}
                                      className="scale-75"
                                    />
                                  </div>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Controller
                                name="config.cardPrimaryColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Front face color</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#ffffff"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#ffffff"} placeholder="Default" className="flex-1 rounded-none text-[10px] h-8 border-border uppercase font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                              <Controller
                                name="config.cardSecondaryColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Back face color</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#101312"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#101312"} placeholder="Default" className="flex-1 rounded-none text-[10px] h-8 border-border uppercase font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                            </div>
                            <Controller
                              name="config.cardTextColor"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel className="text-[9px] font-black uppercase">Text Color Override</FieldLabel>
                                  <div className="flex gap-2">
                                    <Input type="color" {...field} value={field.value ?? "#0f172a"} className="w-8 h-8 p-1 rounded-none border-border" />
                                    <Input {...field} value={field.value ?? "#0f172a"} placeholder="Default" className="flex-1 rounded-none text-[10px] h-8 border-border uppercase font-mono" />
                                  </div>
                                </Field>
                              )}
                            />
                            <Controller
                              name="config.cardPattern"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Background pattern</FieldLabel>
                                  <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                                    <SelectTrigger className="rounded-none h-9 border-border">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                      <SelectItem value="none">None</SelectItem>
                                      <SelectItem value="dots">Dots</SelectItem>
                                      <SelectItem value="grid">Grid</SelectItem>
                                      <SelectItem value="diagonal">Diagonal stripes</SelectItem>
                                      <SelectItem value="waves">Waves</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </Field>
                              )}
                            />
                            <Controller
                              name="config.cardBackgroundImage"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Background image URL</FieldLabel>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="https://example.com/image.jpg"
                                    className="rounded-none border-border text-sm"
                                  />
                                  {field.value && (
                                    <div className="mt-1.5 h-12 w-full rounded-none border border-border overflow-hidden">
                                      <img src={field.value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                        )}
                        {sectionId === "bio" && (
                          <div className="space-y-4">
                            <Field>
                              <FieldLabel>Text alignment</FieldLabel>
                              <AlignmentToggle name="config.bioAlignment" />
                            </Field>
                            <Controller
                              name="config.bioText"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Bio text</FieldLabel>
                                  <Textarea {...field} value={field.value ?? ""} rows={3} className="text-xs rounded-none border-border" />
                                </Field>
                              )}
                            />
                          </div>
                        )}
                        {sectionId === "socials" && (
                          <div className="grid grid-cols-2 gap-4">
                            <Controller
                              name="config.socialsLayout"
                              control={form.control}
                              render={({ field }) => (
                                <Field>
                                  <FieldLabel>Display mode</FieldLabel>
                                  <div className="flex gap-1 bg-muted p-1 rounded-none border border-border w-fit">
                                    <Button
                                      type="button" size="icon" variant={field.value === "grid" ? "default" : "ghost"}
                                      className="h-7 w-7 rounded-none" onClick={() => field.onChange("grid")}
                                    >
                                      <LayoutGrid size={14} />
                                    </Button>
                                    <Button
                                      type="button" size="icon" variant={field.value === "list" ? "default" : "ghost"}
                                      className="h-7 w-7 rounded-none" onClick={() => field.onChange("list")}
                                    >
                                      <List size={14} />
                                    </Button>
                                  </div>
                                </Field>
                              )}
                            />
                            <Field>
                              <FieldLabel>Alignment</FieldLabel>
                              <AlignmentToggle name="config.socialsAlignment" />
                            </Field>
                            <div className="col-span-2 space-y-4 pt-2">
                              <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                                <Controller
                                  name="config.socialsButtonColor"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel className="text-[9px] uppercase font-bold opacity-70">Button Color</FieldLabel>
                                      <div className="flex gap-2">
                                        <Input type="color" {...field} value={field.value ?? "#000000"} className="w-8 h-8 p-1 rounded-none border-border" />
                                        <Input {...field} value={field.value ?? "#000000"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                      </div>
                                    </Field>
                                  )}
                                />
                                <Controller
                                  name="config.socialsIconColor"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field>
                                      <FieldLabel className="text-[9px] uppercase font-bold opacity-70">Icon Color</FieldLabel>
                                      <div className="flex gap-2">
                                        <Input type="color" {...field} value={field.value ?? "#000000"} className="w-8 h-8 p-1 rounded-none border-border" />
                                        <Input {...field} value={field.value ?? "#000000"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                      </div>
                                    </Field>
                                  )}
                                />
                                <Controller
                                  name="config.socialsFillColor"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Field className="col-span-2">
                                      <FieldLabel className="text-[9px] uppercase font-bold opacity-70">Background Fill</FieldLabel>
                                      <div className="flex gap-2">
                                        <Input type="color" {...field} value={field.value ?? "transparent"} className="w-8 h-8 p-1 rounded-none border-border" />
                                        <Input {...field} value={field.value ?? "transparent"} placeholder="transparent or #hex" className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                      </div>
                                    </Field>
                                  )}
                                />
                              </div>
                              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                                <FieldLabel className="mb-0 text-[10px] font-bold uppercase">Show Link Labels</FieldLabel>
                                <Controller
                                  name="config.showSocialLabels"
                                  control={form.control}
                                  render={({ field }) => (
                                    <Switch
                                      checked={field.value !== false}
                                      onCheckedChange={field.onChange}
                                      className="scale-75"
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {sectionId === "actions" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Controller
                                name="config.primaryButtonColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Primary button</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#0f172a"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#0f172a"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                              <Controller
                                name="config.primaryButtonTextColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Primary text</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#ffffff"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#ffffff"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Controller
                                name="config.secondaryButtonColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Secondary button</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#000000"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#000000"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                              <Controller
                                name="config.secondaryButtonTextColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Field>
                                    <FieldLabel>Secondary text</FieldLabel>
                                    <div className="flex gap-2">
                                      <Input type="color" {...field} value={field.value ?? "#000000"} className="w-8 h-8 p-1 rounded-none border-border" />
                                      <Input {...field} value={field.value ?? "#000000"} className="flex-1 rounded-none text-[10px] h-8 border-border font-mono" />
                                    </div>
                                  </Field>
                                )}
                              />
                            </div>
                            <Field>
                              <FieldLabel>Alignment</FieldLabel>
                              <AlignmentToggle name="config.actionsAlignment" />
                            </Field>
                          </div>
                        )}

                        <div className="text-[8px] text-muted-foreground uppercase font-black">Layer ID: {sectionId}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
}
