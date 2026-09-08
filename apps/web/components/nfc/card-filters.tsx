"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-shell";
import { cn } from "@/lib/utils";

interface CardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  count: number;
  total: number;
}

// Mirrors the status language in CardStatusBadge so the filter reads as a
// status menu, not a plain list.
const STATUS_OPTIONS: { value: string; label: string; dot: string }[] = [
  { value: "ALL", label: "All Status", dot: "bg-foreground/30" },
  { value: "ACTIVE", label: "Active", dot: "bg-emerald-500" },
  { value: "INACTIVE", label: "Inactive", dot: "bg-muted-foreground" },
  { value: "UNASSIGNED", label: "Unassigned", dot: "border border-muted-foreground/70" },
  { value: "UNACTIVATED", label: "Unactivated", dot: "border border-muted-foreground/70" },
  { value: "LOST", label: "Lost", dot: "bg-destructive" },
  { value: "REPLACED", label: "Replaced", dot: "bg-muted-foreground" },
];

export function CardFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  count,
  total,
}: CardFiltersProps) {
  const isFiltered = count !== total;
  const countLabel = isFiltered
    ? `${count} of ${total} cards`
    : `${total} ${total === 1 ? "card" : "cards"}`;

  return (
    <div className="flex flex-col gap-3 px-2">
      <PageHeader title="NFC Cards" description="Manage your NFC cards." />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            aria-label="Search cards"
            className="pl-9 rounded-lg h-9 text-xs bg-white shadow-sm border-border focus-visible:ring-1 focus-visible:ring-foreground/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            aria-label="Filter by status"
            className="w-[120px] rounded-lg h-9 text-xs bg-white shadow-sm border-border focus-visible:ring-1 focus-visible:ring-foreground/20"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent position="popper" align="start" className="min-w-[170px] p-1">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className={cn("size-1.5 shrink-0 rounded-full", opt.dot)}
                    aria-hidden="true"
                  />
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {total > 0 && (
        <p
          className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          aria-live="polite"
        >
          {countLabel}
        </p>
      )}
    </div>
  );
}
