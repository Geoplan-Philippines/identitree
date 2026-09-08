"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { TemplateFormValues } from "./builder-types";

interface IdentityTabProps {
  form: UseFormReturn<TemplateFormValues>;
}

export function IdentityTab({ form }: IdentityTabProps) {
  return (
    <div className="pt-6 space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Template Name</FieldLabel>
              <Input {...field} value={field.value ?? ""} placeholder="Executive Card" className="rounded-lg border-border" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category</FieldLabel>
                <Input {...field} value={field.value ?? ""} placeholder="Executive" className="rounded-lg border-border" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="layoutKey"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Base Theme</FieldLabel>
                <Select 
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("config.cardLayoutKey", val);
                  }} 
                  value={field.value ?? "default"}
                >
                  <SelectTrigger className="rounded-lg h-10 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="default">Standard Light</SelectItem>
                    <SelectItem value="modern-dark">Deep Onyx</SelectItem>
                    <SelectItem value="glass">Frosted Glass</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </div>
  );
}
