"use client";

import Link from "next/link";
import { Plus, Nfc, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NfcCardDialog } from "@/components/nfc/nfc-card-dialog";

const actionButtonClasses =
  "w-full justify-between px-4 group hover:bg-[#E3DEC8] hover:border-brass/60 hover:shadow-sm";

export function QuickActions() {
  return (
    <Card className="rounded-xl overflow-hidden h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold uppercase tracking-wider">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <NfcCardDialog
          trigger={
            <Button variant="outline" className={actionButtonClasses}>
              <span className="flex items-center gap-3">
                <div className="text-primary">
                  <Plus className="size-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">New NFC Card</span>
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brass" />
            </Button>
          }
        />

        <Button variant="outline" className={actionButtonClasses} asChild>
          <Link href="/activate">
            <span className="flex items-center gap-3">
              <div className="text-primary">
                <Nfc className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">Activate Card</span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brass" />
          </Link>
        </Button>

        <Button variant="outline" className={actionButtonClasses} asChild>
          <Link href="/docs">
            <span className="flex items-center gap-3">
              <div className="text-primary">
                <FileText className="size-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">View Documentation</span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brass" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
