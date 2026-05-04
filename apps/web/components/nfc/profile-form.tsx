"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { Profile } from "@/lib/services/nfc-cards.service";
import { useState } from "react";

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
  const updateMutation = useUpdateNfcCard();
  const isEditing = !!initialData;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
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
    },
  });

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
          toast.error("Failed to upload image to Cloudinary");
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      // Normalize phone numbers for storage (09XXXXXXXXX)
      const finalValues = { 
        ...values, 
        avatarUrl: finalAvatarUrl,
        contactNumber: normalizePhoneForStorage(values.contactNumber),
        whatsappNumber: values.whatsappNumber ? normalizePhoneForStorage(values.whatsappNumber) : undefined,
        viberNumber: values.viberNumber ? normalizePhoneForStorage(values.viberNumber) : undefined,
      };

      if (isEditing && initialData) {
        // 1. Update existing profile
        await apiClient.patch(`/profiles/${initialData.id}`, finalValues);
        toast.success("Profile updated successfully!");
      } else {
        // 1. Create new profile
        const profile = await apiClient.post<any>("/profiles", finalValues);

        // 2. Link the profile to the NFC card
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-0 bg-transparent">
      <FieldGroup className="gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black uppercase tracking-tight">
            {isEditing ? "Edit Profile" : "Create Profile"}
          </h3>
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="rounded-none uppercase font-bold text-xs">
              Cancel
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input {...field} id="firstName" placeholder="John" className="rounded-none" />
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
                <Input {...field} id="lastName" placeholder="Doe" className="rounded-none" />
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
              <Input {...field} id="email" type="email" placeholder="john.doe@example.com" className="rounded-none" />
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
              <Input {...field} id="positionTitle" placeholder="Software Engineer" className="rounded-none" />
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
                <span className="inline-flex items-center px-3 bg-muted text-foreground text-sm font-bold">
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
                  className="rounded-none border-l-0" 
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
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-muted">
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
                className="rounded-none"
              />
            </div>
          </div>
          {errors.avatarUrl && <FieldError errors={[errors.avatarUrl]} />}
        </Field>

        <FieldGroup className="pt-4 border-t gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Social & Messaging
          </p>

          <Controller
            name="linkedinUsername"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="linkedinUsername">LinkedIn (Optional)</FieldLabel>
                <Input {...field} id="linkedinUsername" placeholder="johndoe" className="rounded-none" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="whatsappNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="whatsappNumber">WhatsApp (Optional)</FieldLabel>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 bg-muted text-foreground text-sm font-bold">
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
                    className="rounded-none border-l-0" 
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="viberNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="viberNumber">Viber (Optional)</FieldLabel>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 bg-muted text-foreground text-sm font-bold">
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
                    className="rounded-none border-l-0" 
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full rounded-none font-bold uppercase" disabled={isFormLoading}>
          {isFormLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isEditing ? "Save Changes" : "Create Profile"}
        </Button>
      </FieldGroup>
    </form>
  );
}
