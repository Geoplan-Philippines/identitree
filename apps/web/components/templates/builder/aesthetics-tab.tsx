"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { TemplateFormValues } from "./builder-types";

interface AestheticsTabProps {
  form: UseFormReturn<TemplateFormValues>;
}

export function AestheticsTab({ form }: AestheticsTabProps) {
  return (
    <div className="pt-6 space-y-6">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="config.buttonStyle"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Button Style</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value ?? "sharp"}>
                  <SelectTrigger className="rounded-lg border-border h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="sharp">Sharp</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="pill">Pill</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="config.avatarStyle"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Avatar Frame</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value ?? "square"}>
                  <SelectTrigger className="rounded-lg border-border h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="config.contentSpacing"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Page Spacing</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value ?? "relaxed"}>
                  <SelectTrigger className="rounded-lg border-border h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="loose">Loose</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <div className="flex items-center justify-between self-start">
            <FieldLabel className="mb-0">Glassmorphism</FieldLabel>
            <Controller
              name="config.glassmorphism"
              control={form.control}
              render={({ field }) => (
                <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </FieldGroup>
    </div>
  );
}
