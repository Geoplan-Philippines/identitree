"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createNfcCard } from "@/lib/services/nfc-cards.service";
import { createNfcCardSchema, CreateNfcCardValues } from "@/lib/zod/nfc-cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Plus } from "lucide-react";

export function NewNfcCardDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateNfcCardValues>({
    resolver: zodResolver(createNfcCardSchema),
    defaultValues: { cardType: "GEOPLAN_ISSUED" },
  });

  const onSubmit = async (values: CreateNfcCardValues) => {
    await createNfcCard(values);
    setOpen(false);
    reset();
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-3.5 mr-1.5" aria-hidden="true" />
          New card
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold">Create new NFC card</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Fill in the details below to issue a new NFC card.</p>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-2 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="font-medium">Name</Label>
            <Input id="name" {...register("name")}/>
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cardType" className="font-medium">Card Type</Label>
            <Select onValueChange={val => setValue("cardType", val as any)} defaultValue="GEOPLAN_ISSUED">
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
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
