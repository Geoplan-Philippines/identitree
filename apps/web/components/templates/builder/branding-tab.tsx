"use client";

import { useState, useCallback } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { TemplateFormValues } from "./builder-types";
import { Plus, X, Check, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const GOOGLE_FONTS = [
  { value: "Inter", label: "Inter (Modern)" },
  { value: "Outfit", label: "Outfit (Premium)" },
  { value: "Sora", label: "Sora (Bold)" },
  { value: "Syne", label: "Syne (Brutalist)" },
  { value: "Montserrat", label: "Montserrat (Classic)" },
  { value: "Roboto", label: "Roboto (Standard)" },
  { value: "Playfair Display", label: "Playfair (Elegant)" },
  { value: "Poppins", label: "Poppins (Friendly)" },
  { value: "Lexend", label: "Lexend (Readable)" },
  { value: "Space Grotesk", label: "Space Grotesk (Tech)" },
];

interface BrandingTabProps {
  form: UseFormReturn<TemplateFormValues>;
}

// ─── Gradient direction options ───
const GRADIENT_DIRECTIONS = [
  { value: "to right", label: "→ Left to Right" },
  { value: "to left", label: "← Right to Left" },
  { value: "to bottom", label: "↓ Top to Bottom" },
  { value: "to top", label: "↑ Bottom to Top" },
  { value: "to bottom right", label: "↘ Diagonal" },
  { value: "to bottom left", label: "↙ Diagonal" },
  { value: "to top right", label: "↗ Diagonal" },
  { value: "to top left", label: "↖ Diagonal" },
  { value: "135deg", label: "135°" },
  { value: "45deg", label: "45°" },
];

// Parse a gradient CSS string back into direction + stops
function parseGradient(css?: string): { direction: string; stops: string[] } {
  const fallback = { direction: "to right", stops: ["#667eea", "#764ba2"] };
  if (!css) return fallback;
  const match = css.match(/linear-gradient\(([^,]+),\s*(.+)\)/);
  if (!match || !match[1] || !match[2]) return fallback;
  const direction = match[1].trim();
  const colorMatches = match[2].match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  const stops = colorMatches && colorMatches.length >= 2 ? colorMatches : ["#667eea", "#764ba2"];
  return { direction, stops };
}

// Build CSS string from direction + stops
function buildGradient(direction: string, stops: string[]): string {
  if (stops.length < 2) return "";
  const positions = stops.map((color, i) => {
    const pct = Math.round((i / (stops.length - 1)) * 100);
    return `${color} ${pct}%`;
  });
  return `linear-gradient(${direction}, ${positions.join(", ")})`;
}

// ─── Gradient Builder sub-component ───
function GradientBuilder({ value, onChange }: { value?: string; onChange: (val: string) => void }) {
  const parsed = parseGradient(value);
  const [direction, setDirection] = useState(parsed.direction);
  const [stops, setStops] = useState<string[]>(parsed.stops);

  const emitChange = useCallback((dir: string, s: string[]) => {
    onChange(buildGradient(dir, s));
  }, [onChange]);

  const updateDirection = (dir: string) => {
    setDirection(dir);
    emitChange(dir, stops);
  };

  const updateStop = (index: number, color: string) => {
    const next = [...stops];
    next[index] = color;
    setStops(next);
    emitChange(direction, next);
  };

  const addStop = () => {
    const next = [...stops, "#888888"];
    setStops(next);
    emitChange(direction, next);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return; // minimum 2 stops
    const next = stops.filter((_, i) => i !== index);
    setStops(next);
    emitChange(direction, next);
  };

  const gradient = buildGradient(direction, stops);

  return (
    <div className="space-y-3">
      {/* Live preview bar */}
      <div
        className="w-full h-10 border border-border"
        style={{ background: gradient }}
      />

      {/* Direction picker */}
      <Field>
        <FieldLabel>Direction</FieldLabel>
        <Select value={direction} onValueChange={updateDirection}>
          <SelectTrigger className="rounded-none h-9 border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {GRADIENT_DIRECTIONS.map((d) => (
              <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Color stops */}
      <div className="space-y-2">
        <FieldLabel>Color stops</FieldLabel>
        {stops.map((color, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => updateStop(i, e.target.value)}
              className="w-8 h-8 p-1 rounded-none border-border shrink-0"
            />
            <Input
              value={color}
              onChange={(e) => updateStop(i, e.target.value)}
              className="flex-1 rounded-none font-mono text-[10px] h-8 border-border"
            />
            {stops.length > 2 && (
              <button
                type="button"
                onClick={() => removeStop(i)}
                className="shrink-0 size-8 flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addStop}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <Plus className="size-3.5" />
          Add color stop
        </button>
      </div>
    </div>
  );
}

// ─── Main BrandingTab ───
export function BrandingTab({ form }: BrandingTabProps) {
  const backgroundType = form.watch("config.backgroundType");

  return (
    <div className="pt-6 space-y-8">
      {/* Page Colors */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Page Background</p>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="config.backgroundType"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val);
                      if (val === "gradient" && !form.getValues("config.backgroundGradient")) {
                        // Apply a beautiful professional default gradient if none exists
                        form.setValue("config.backgroundGradient", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)");
                      }
                    }} 
                    value={field.value ?? "solid"}
                  >
                    <SelectTrigger className="rounded-none h-10 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="solid">Solid color</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            {(!backgroundType || backgroundType === "solid") && (
              <Controller
                name="config.pagePattern"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Pattern overlay</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                      <SelectTrigger className="rounded-none h-10 border-border">
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
            )}
          </div>

          {backgroundType === "solid" && (
            <Controller
              name="config.backgroundColor"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Background color</FieldLabel>
                  <div className="flex gap-2">
                    <Input type="color" {...field} value={field.value ?? "#ffffff"} className="w-8 h-8 p-1 rounded-none border-border" />
                    <Input {...field} value={field.value ?? "#ffffff"} className="flex-1 rounded-none font-mono text-[10px] h-8 border-border" />
                  </div>
                </Field>
              )}
            />
          )}
          {backgroundType === "gradient" && (
            <Controller
              name="config.backgroundGradient"
              control={form.control}
              render={({ field }) => (
                <GradientBuilder
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          {backgroundType === "image" && (
            <Controller
              name="config.backgroundImage"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Image URL</FieldLabel>
                  <Input {...field} value={field.value ?? ""} placeholder="https://example.com/bg.jpg" className="rounded-none border-border text-sm" />
                  {field.value && (
                    <div className="mt-1.5 h-16 w-full rounded-none border border-border overflow-hidden">
                      <img src={field.value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}
                </Field>
              )}
            />
          )}
        </FieldGroup>
      </div>

      {/* Accent Colors */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Accent & Text</p>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="config.primaryColor"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Accent color</FieldLabel>
                  <div className="flex gap-2">
                    <Input type="color" {...field} value={field.value ?? "#000000"} className="w-8 h-8 p-1 rounded-none border-border" />
                    <Input {...field} value={field.value ?? "#000000"} className="flex-1 rounded-none font-mono text-[10px] h-8 border-border" />
                  </div>
                </Field>
              )}
            />
            <Controller
              name="config.textColor"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Text color</FieldLabel>
                  <div className="flex gap-2">
                    <Input type="color" {...field} value={field.value ?? "#0f172a"} className="w-8 h-8 p-1 rounded-none border-border" />
                    <Input {...field} value={field.value ?? "#0f172a"} className="flex-1 rounded-none font-mono text-[10px] h-8 border-border" />
                  </div>
                </Field>
              )}
            />
          </div>

            <Controller
              name="config.fontFamily"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Typography</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? "Inter"}>
                    <SelectTrigger className="rounded-none h-10 border-border">
                      <div className="flex items-center gap-2">
                        <Type className="size-3.5 text-muted-foreground" />
                        <SelectValue placeholder="Select font" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {GOOGLE_FONTS.map(font => (
                        <SelectItem key={font.value} value={font.value} className="rounded-none">
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
        </FieldGroup>
      </div>

      {/* Badges & Trust */}
      <div className="space-y-4 pb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Badges & Trust Indicators</p>
        <FieldGroup>
          <div className="space-y-6">
            {/* Top Badge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Top Badge (Status)</FieldLabel>
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
                    className="rounded-none border-border text-sm"
                    disabled={form.watch("config.showTopBadge") === false}
                  />
                )}
              />
            </div>

            {/* Verification Badge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel className="mb-0">Verification Badge</FieldLabel>
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
                    className="rounded-none border-border text-sm"
                    disabled={form.watch("config.showVerifyBadge") === false}
                  />
                )}
              />
            </div>
          </div>
        </FieldGroup>
      </div>
    </div>
  );
}
