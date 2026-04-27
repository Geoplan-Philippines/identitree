"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateNfcCard, useUpdateNfcCard } from "@/hooks/use-nfc-cards";
import { createNfcCardSchema, CreateNfcCardValues } from "@/lib/zod/nfc-cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NfcCard } from "@/lib/services/nfc-cards.service";

import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NfcCardDialogProps {
  initialData?: NfcCard | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NfcCardDialog({ initialData, trigger, onSuccess, open, onOpenChange }: NfcCardDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!initialData;

  const actualOpen = open !== undefined ? open : internalOpen;
  const actualOnOpenChange = onOpenChange || setInternalOpen;

  const createMutation = useCreateNfcCard();
  const updateMutation = useUpdateNfcCard();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateNfcCardValues>({
    resolver: zodResolver(createNfcCardSchema),
    defaultValues: { 
      cardType: "GEOPLAN_ISSUED",
      name: "",
      hardwareId: "",
    },
  });

  const cardType = watch("cardType");

  useEffect(() => {
    if (initialData && actualOpen) {
      reset({
        name: initialData.profile?.firstName ? `${initialData.profile.firstName} ${initialData.profile.lastName}` : (initialData as any).name || "",
        cardType: initialData.cardType,
        hardwareId: initialData.hardwareId || "",
      });
    } else if (!isEditing && actualOpen) {
      reset({
        name: "",
        cardType: "GEOPLAN_ISSUED",
        hardwareId: "",
      });
    }
  }, [initialData, actualOpen, reset, isEditing]);

  const onSubmit = async (values: CreateNfcCardValues) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, payload: values });
        toast.success("NFC card updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("NFC card created successfully");
      }
      actualOnOpenChange(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      const message = error.message || `Failed to ${isEditing ? 'update' : 'create'} NFC card`;
      toast.error(message);
    }
  };

  return (
    <Dialog open={actualOpen} onOpenChange={actualOnOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md w-full p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit NFC card" : "Create new NFC card"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? "Update the details of this card." : "Fill in the details below to issue a new NFC card."}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-2 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="font-medium">Name</Label>
            <Input id="name" {...register("name")}/>
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cardType" className="font-medium">Card Type</Label>
            <Select 
              onValueChange={val => setValue("cardType", val as any)} 
              value={cardType}
            >
              <SelectTrigger id="cardType" className="w-full">
                <SelectValue placeholder="Select card type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GEOPLAN_ISSUED">Geoplan Issued</SelectItem>
                <SelectItem value="CUSTOMER_OWNED">Customer Owned</SelectItem>
              </SelectContent>
            </Select>
            {errors.cardType && <p className="text-xs text-red-500 mt-0.5">{errors.cardType.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hardwareId" className="font-medium">Hardware ID <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="hardwareId" {...register("hardwareId")}/>
            {errors.hardwareId && <p className="text-xs text-red-500 mt-0.5">{errors.hardwareId.message}</p>}
          </div>
          <div className="flex flex-row items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => actualOnOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {isEditing 
                ? (updateMutation.isPending ? "Updating..." : "Update Card") 
                : (createMutation.isPending ? "Creating..." : "Create Card")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

