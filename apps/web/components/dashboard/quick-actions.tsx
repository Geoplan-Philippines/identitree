"use client";

import Link from "next/link";
import { Plus, Nfc, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NfcCardDialog } from "@/components/nfc/nfc-card-dialog";

export function QuickActions() {
  return (
    <Card className="rounded-xl overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold uppercase tracking-wider">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NfcCardDialog
          trigger={
            <Button variant="outline" className="w-full justify-between h-12 px-4 group">
              <span className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <Plus className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">New NFC Card</span>
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          }
        />

        <Button variant="outline" className="w-full justify-between h-12 px-4 group" asChild>
          <Link href="/activate">
            <span className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                <Nfc className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Activate Card</span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <Button variant="outline" className="w-full justify-between h-12 px-4 group" asChild>
          <Link href="/docs">
            <span className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                <FileText className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">View Documentation</span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
