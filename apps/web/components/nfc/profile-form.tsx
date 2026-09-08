"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema, CreateProfileValues } from "@/lib/zod/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Loader2, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { Profile, getTemplates, Template } from "@/lib/services/nfc-cards.service";
import { useState, useEffect } from "react";
import { renderProfileCard } from "../profile/layouts/layouts-registry";
import { useOrganization } from "@/hooks/use-organization";
import { cn } from "@/lib/utils";

type ProfileFormProps = {
  cardId: string;
  initialData?: Profile | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const formatPhoneDisplay = (val: string) => {
  let clean = val.replace(/\D/g, "");
  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }
  const part = clean.slice(0, 10);
  if (part.length <= 3) return part;
  if (part.length <= 6) return `${part.slice(0, 3)} ${part.slice(3)}`;
  return `${part.slice(0, 3)} ${part.slice(3, 6)} ${part.slice(6)}`;
};

const normalizePhoneForStorage = (num: string) => {
  if (!num) return "";
  let clean = num.replace(/\D/g, "");
  if (clean.startsWith("63")) clean = clean.substring(2);
  if (clean.startsWith("0")) clean = clean.substring(1);
  return `0${clean}`; // Save as 09XXXXXXXXX
};

const stripPrefix = (num: string | undefined | null) => {
  if (!num) return "";
  let clean = num.replace(/\D/g, "");
  if (clean.startsWith("63")) clean = clean.substring(2);
  if (clean.startsWith("0")) clean = clean.substring(1);
  return formatPhoneDisplay(clean);
};

export function ProfileForm({ cardId, initialData, onSuccess, onCancel }: ProfileFormProps) {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: organization } = useOrganization(slug);

  const updateMutation = useUpdateNfcCard();
  const isEditing = !!initialData;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch((err) => {
        console.warn("Templates API not found, using defaults:", err);
        setTemplates([
          { id: "tpl_default", name: "Default", layoutKey: "default", availability: "GLOBAL" },
          { id: "tpl_modern_dark", name: "Modern Dark", layoutKey: "modern-dark", availability: "GLOBAL" },
          { id: "tpl_glass", name: "Glass", layoutKey: "glass", availability: "GLOBAL" },
        ]);
      });
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateProfileValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      positionTitle: initialData.positionTitle,
      contactNumber: stripPrefix(initialData.contactNumber),
      avatarUrl: initialData.avatarUrl || "",
      linkedinUsername: initialData.linkedinUsername || "",
      whatsappNumber: stripPrefix(initialData.whatsappNumber),
      viberNumber: stripPrefix(initialData.viberNumber),
      templateId: initialData.templateId || "tpl_default",
    } : {
      firstName: "",
      lastName: "",
      email: "",
      positionTitle: "",
      contactNumber: "",
      avatarUrl: "",
      linkedinUsername: "",
      whatsappNumber: "",
      viberNumber: "",
      templateId: "tpl_default",
    },
  });

  const formValues = useWatch({ control });

  const selectedTemplate = templates.find(t => t.id === formValues.templateId);

  const previewProfile: Profile = {
    id: initialData?.id || "preview",
    firstName: formValues.firstName || "First",
    lastName: formValues.lastName || "Last",
    email: formValues.email || "email@example.com",
    positionTitle: formValues.positionTitle || "Position Title",
    contactNumber: formValues.contactNumber || "0912 345 6789",
    avatarUrl: imageFile ? URL.createObjectURL(imageFile) : (formValues.avatarUrl || null),
    organization: organization ? {
      name: organization.name,
      logo: organization.logo ?? undefined,
      website: (organization as any).website ?? undefined,
    } : (initialData?.organization || { name: "Handshakes" }),
    linkedinUsername: formValues.linkedinUsername,
    whatsappNumber: formValues.whatsappNumber,
    viberNumber: formValues.viberNumber,
    templateId: formValues.templateId,
    template: selectedTemplate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<any>("/upload/image", formData);
    return response.url;
  };

  const onSubmit = async (values: CreateProfileValues) => {
    try {
      let finalAvatarUrl = values.avatarUrl;

      if (imageFile) {
        setIsUploading(true);
        try {
          finalAvatarUrl = await uploadToCloudinary(imageFile);
          setValue("avatarUrl", finalAvatarUrl);
        } catch (error) {
          toast.error("Failed to upload image");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const finalValues = {
        ...values,
        avatarUrl: finalAvatarUrl,
        contactNumber: normalizePhoneForStorage(values.contactNumber),
        whatsappNumber: values.whatsappNumber ? normalizePhoneForStorage(values.whatsappNumber) : undefined,
        viberNumber: values.viberNumber ? normalizePhoneForStorage(values.viberNumber) : undefined,
        templateId: values.templateId,
      };

      if (isEditing && initialData) {
        await apiClient.patch(`/profiles/${initialData.id}`, finalValues);
        toast.success("Profile updated successfully!");
      } else {
        const profile = await apiClient.post<any>("/profiles", finalValues);
        await updateMutation.mutateAsync({ id: cardId, payload: { profileId: profile.id, status: "ACTIVE" } });
        toast.success("Profile created and activated!");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} profile`);
    }
  };

  const isFormLoading = isSubmitting || isUploading;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-transparent">
        <FieldGroup className="gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {isEditing ? "Update Identity" : "New Identity"}
            </h3>
            {onCancel && (
              <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="rounded-lg uppercase font-bold text-xs">
                Cancel
              </Button>
            )}
          </div>

          {/* Section 1: Identity Details */}
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">
              Step 1: Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input {...field} id="firstName" placeholder="John" className="rounded-lg" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input {...field} id="lastName" placeholder="Doe" className="rounded-lg" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input {...field} id="email" type="email" placeholder="john.doe@example.com" className="rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="positionTitle"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="positionTitle">Position Title</FieldLabel>
                  <Input {...field} id="positionTitle" placeholder="Software Developer" className="rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="contactNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 bg-muted text-foreground text-sm font-bold rounded-l-lg border border-r-0 border-input">
                      +63
                    </span>
                    <Input
                      {...field}
                      id="contactNumber"
                      onChange={(e) => {
                        e.target.value = formatPhoneDisplay(e.target.value);
                        field.onChange(e);
                      }}
                      placeholder="912 345 6789"
                      className="rounded-l-none rounded-r-lg border-l-0"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="avatarFile">Profile Photo (Optional)</FieldLabel>
              <div className="flex items-center gap-4">
                {(imageFile || initialData?.avatarUrl) && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-foreground/10 bg-muted">
                    <img
                      src={imageFile ? URL.createObjectURL(imageFile) : initialData?.avatarUrl || ""}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="avatarFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="rounded-lg border-dashed"
                  />
                </div>
              </div>
            </Field>
          </div>

          {/* Section 2: Socials */}
          <div className="space-y-6 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">
              Step 2: Social & Messaging
            </p>
            <div className="space-y-4">
              <Controller
                name="linkedinUsername"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="linkedinUsername">LinkedIn (Optional)</FieldLabel>
                    <Input {...field} id="linkedinUsername" placeholder="johndoe" className="rounded-lg" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="whatsappNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="whatsappNumber">WhatsApp</FieldLabel>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 bg-muted text-foreground text-[10px] font-bold rounded-l-lg border border-r-0 border-input">
                          +63
                        </span>
                        <Input
                          {...field}
                          id="whatsappNumber"
                          onChange={(e) => {
                            e.target.value = formatPhoneDisplay(e.target.value);
                            field.onChange(e);
                          }}
                          placeholder="912 345 6789"
                          className="rounded-l-none rounded-r-lg border-l-0 text-sm"
                        />
                      </div>
                    </Field>
                  )}
                />
                <Controller
                  name="viberNumber"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="viberNumber">Viber</FieldLabel>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 bg-muted text-foreground text-[10px] font-bold rounded-l-lg border border-r-0 border-input">
                          +63
                        </span>
                        <Input
                          {...field}
                          id="viberNumber"
                          onChange={(e) => {
                            e.target.value = formatPhoneDisplay(e.target.value);
                            field.onChange(e);
                          }}
                          placeholder="912 345 6789"
                          className="rounded-l-none rounded-r-lg border-l-0 text-sm"
                        />
                      </div>
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Visual Theme Selection */}
          <div className="space-y-6 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">
              Step 3: Card Design
            </p>
            <Controller
              name="templateId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange(template.id)}
                        className={cn(
                          "h-auto w-full flex-col gap-2 whitespace-normal p-3 text-center",
                          field.value === template.id
                            ? "border-foreground bg-foreground text-background shadow-md hover:bg-foreground hover:text-background"
                            : "hover:border-foreground/50 hover:bg-background hover:text-foreground"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{template.name}</span>
                      </Button>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Live Preview sits right under the selector */}
            <div className={cn(
              "mt-4 border border-border p-8 rounded-lg transition-colors duration-500",
              (previewProfile.template?.layoutKey === "glass" || previewProfile.template?.layoutKey === "modern-dark")
                ? "bg-slate-950 border-slate-800"
                : "bg-muted/30 border-border"
            )}>
              <div className="mb-6 flex items-center justify-between">
                <h4 className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-colors",
                  (previewProfile.template?.layoutKey === "glass" || previewProfile.template?.layoutKey === "modern-dark")
                    ? "text-slate-500"
                    : "text-muted-foreground"
                )}>
                  Final Card Preview
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors"
                >
                  <RotateCcw className="size-3" />
                  Flip
                </button>
              </div>

              <div
                className="flex justify-center cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ perspective: 1200 }}
              >
                <div className="w-full max-w-sm">
                  {renderProfileCard(previewProfile, isFlipped, previewProfile.template?.layoutKey)}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-lg font-bold uppercase" disabled={isFormLoading}>
            {isFormLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Save Changes" : "Create Profile"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
