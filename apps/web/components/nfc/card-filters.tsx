"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  count: number;
}

export function CardFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  count
}: CardFiltersProps) {
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-black tracking-tight uppercase">NFC Cards</h2>
        <div className="rounded-none px-2 py-0.5 text-[10px] font-bold bg-secondary text-secondary-foreground">
          {count}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            className="pl-9 rounded-none h-9 text-xs border-foreground/10 focus-visible:ring-1 focus-visible:ring-foreground/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px] rounded-none h-9 text-xs border-foreground/10 focus-visible:ring-1 focus-visible:ring-foreground/20">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
