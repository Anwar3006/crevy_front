"use client";

import { currencies } from "country-data-list";
import * as React from "react";
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectProps {
  value?: { code: string; name: string };
  onChange: (value: { code: string; name: string }) => void;
  placeholder?: string;
  className?: string;
}

/**
 * CurrencySelect
 *
 * Uses country-data-list to provide a comprehensive list of world currencies.
 * Formats the selection as { code, name } for backend compatibility.
 */
export function CurrencySelect({
  value,
  onChange,
  placeholder = "Select currency",
  className,
}: CurrencySelectProps) {
  // Get all unique currencies and sort them by code
  const allCurrencies = React.useMemo(() => {
    return Object.values(currencies.all)
      .filter((c) => c.code && c.name)
      .sort((a, b) => a.code.localeCompare(b.code));
  }, []);

  const handleValueChange = (code: string) => {
    const selected = allCurrencies.find((c) => c.code === code);
    if (selected) {
      onChange({ code: selected.code, name: selected.name });
    }
  };

  return (
    <Select onValueChange={handleValueChange} value={value?.code}>
      <FormControl>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {allCurrencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="font-medium mr-2">{c.code}</span>
            <span className="text-muted-foreground text-xs">{c.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
