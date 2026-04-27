"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema, CreateProfileValues } from "@/lib/zod/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { Profile } from "@/lib/services/nfc-cards.service";

type ProfileFormProps = {
  cardId: string;
  initialData?: Profile | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProfileForm({ cardId, initialData, onSuccess, onCancel }: ProfileFormProps) {
  const updateMutation = useUpdateNfcCard();
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProfileValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      positionTitle: initialData.positionTitle,
      contactNumber: initialData.contactNumber,
      avatarUrl: initialData.avatarUrl || "",
      linkedinUsername: initialData.linkedinUsername || "",
      whatsappNumber: initialData.whatsappNumber || "",
      viberNumber: initialData.viberNumber || "",
    } : {},
  });

  const onSubmit = async (values: CreateProfileValues) => {
    try {
      if (isEditing && initialData) {
        // 1. Update existing profile
        await apiClient.patch(`/profiles/${initialData.id}`, values);

        // 2. Trigger cache refresh for the NFC cards to see the updated profile
        // We can just invalidate the cards query
        toast.success("Profile updated successfully!");
      } else {
        // 1. Create new profile
        const profile = await apiClient.post<any>("/profiles", values);

        // 2. Link the profile to the NFC card
        await updateMutation.mutateAsync({ id: cardId, payload: { profileId: profile.id } });

        toast.success("Profile created and linked to card!");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} profile`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-0 bg-transparent">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} placeholder="John" className="rounded-none" />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} placeholder="Doe" className="rounded-none" />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="john.doe@example.com" className="rounded-none" />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="positionTitle">Position Title</Label>
        <Input id="positionTitle" {...register("positionTitle")} placeholder="Software Engineer" className="rounded-none" />
        {errors.positionTitle && <p className="text-xs text-destructive">{errors.positionTitle.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input id="contactNumber" {...register("contactNumber")} placeholder="+1 234 567 890" className="rounded-none" />
        {errors.contactNumber && <p className="text-xs text-destructive">{errors.contactNumber.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
        <Input id="avatarUrl" {...register("avatarUrl")} placeholder="https://..." className="rounded-none" />
        {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedinUsername">LinkedIn (Optional)</Label>
          <Input id="linkedinUsername" {...register("linkedinUsername")} placeholder="johndoe" className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp (Optional)</Label>
          <Input id="whatsappNumber" {...register("whatsappNumber")} placeholder="1234567890" className="rounded-none" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="viberNumber">Viber (Optional)</Label>
          <Input id="viberNumber" {...register("viberNumber")} placeholder="1234567890" className="rounded-none" />
        </div>
      </div>

      <Button type="submit" className="w-full rounded-none font-bold uppercase" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isEditing ? "Save Changes" : "Create Profile"}
      </Button>
    </form>
  );
}
