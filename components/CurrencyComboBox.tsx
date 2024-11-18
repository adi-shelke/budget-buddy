"use client";

import * as React from "react";
import { useEffect } from "react";
import { Root } from "@radix-ui/react-visually-hidden";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { updateUserCurrency } from "@/app/wizard/_actions/useSettings";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencies, Currency } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { toast } from "sonner";

export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCurrency, setSelectedCurrency] = React.useState<Currency | null>(
    null
  );

  // for fetching user settings
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });
 
  //setting the user currency
  useEffect(() => {
    if (!userSettings.data) return;
    const userCurrency = currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );
    if (userCurrency) setSelectedCurrency(userCurrency);
  }, [userSettings.data]);


 // Using React Query's useMutation hook to handle the currency update operation
const mutation = useMutation({
  // Function to call when the mutation is triggered
  mutationFn: updateUserCurrency,

  // Callback executed on a successful mutation
  onSuccess: (data: UserSettings) => {
    // Show a success toast notification
    toast.success("Currency updated successfully 🎉", {
      id: "update-currency",
    });
    // Update the selected currency in the state based on the server response
    setSelectedCurrency(
      currencies.find((currency) => currency.value === data.currency) || null
    );
  },

  // Callback executed when the mutation fails
  onError: (error) => {
    // Show an error toast notification with the error message
    toast.error(error.message, {
      id: "update-currency",
    });
  },
});


  const selectCurrency = React.useCallback((currency: Currency | null) => {
    if (!currency) {
      toast.error("Please select a currency");
      return;
    }
    toast.loading("Updating currency...", {
      id: "update-currency",
    });
    mutation.mutate(currency.value);
  },[mutation]);

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedCurrency ? (
                <>{selectedCurrency.label}</>
              ) : (
                <>Set currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CurrencyList
              setOpen={setOpen}
              setSelectCurrency={selectCurrency}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedCurrency ? (
              <>{selectedCurrency.label}</>
            ) : (
              <>Set currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <Root>
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
            </DrawerHeader>
          </Root>
          <div className="mt-4 border-t">
            <CurrencyList
              setOpen={setOpen}
              setSelectCurrency={selectCurrency}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function CurrencyList({
  setOpen,
  setSelectCurrency,
}: {
  setOpen: (open: boolean) => void;
  setSelectCurrency: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectCurrency(
                  currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
