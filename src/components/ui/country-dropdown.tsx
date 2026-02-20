"use client";

// data
import { countries } from "country-data-list";
// assets
import { CheckIcon, ChevronDown, Globe } from "lucide-react";
import type React from "react";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { CircleFlag } from "react-circle-flags";
import { type Control, Controller } from "react-hook-form";
// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// utils
import { cn } from "@/lib/utils";

export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

interface CountryDropdownProps {
  control: Control<any>;
  name: string;
  label?: string;
  options?: Country[];
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
  className?: string;
}

const CountryDropdownComponent = (
  {
    control,
    name,
    label,
    options = countries.all.filter(
      (country: Country) =>
        country.emoji && country.status !== "deleted" && country.ioc !== "PRK",
    ),
    disabled = false,
    placeholder = "Select a country",
    slim = false,
    className,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        // Find the full country object based on the current form value (alpha3)
        const selectedCountry = options.find((c) => c.alpha3 === field.value);

        return (
          <FormItem className={cn("flex flex-col w-full", className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <button
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                      slim && "w-20",
                      !field.value && "text-muted-foreground",
                    )}
                    {...props}
                  >
                    {selectedCountry ? (
                      <div className="flex items-center flex-grow w-0 gap-2 overflow-hidden text-foreground">
                        <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                          <CircleFlag
                            countryCode={selectedCountry.alpha2.toLowerCase()}
                            height={20}
                          />
                        </div>
                        {!slim && (
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {selectedCountry.name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="flex items-center gap-2">
                        {slim ? <Globe size={20} /> : placeholder}
                      </span>
                    )}
                    <ChevronDown size={16} className="opacity-50 shrink-0" />
                  </button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[--radix-popover-trigger-width] min-w-[200px]"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {options
                        .filter((c) => c.name && c.alpha3)
                        .map((option) => (
                          <CommandItem
                            key={option.alpha3}
                            value={option.name} // for searching
                            onSelect={() => {
                              field.onChange(option.alpha3);
                              setOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                              <CircleFlag
                                countryCode={option.alpha2.toLowerCase()}
                                height={20}
                              />
                            </div>
                            <span className="flex-1 truncate">
                              {option.name}
                            </span>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4",
                                option.alpha3 === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

CountryDropdownComponent.displayName = "CountryDropdown";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
