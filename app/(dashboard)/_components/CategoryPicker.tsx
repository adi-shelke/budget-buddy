import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { PopoverContent } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";

interface Props {
  type: TransactionType;
}
const CategoryPicker = ({ type }: Props) => {
  const [open, setopen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  //fetching the categories based on the type
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const validatedSelectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === selectedCategory
  );
  return (
    <Popover open={open} onOpenChange={setopen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between "
        >
          {validatedSelectedCategory ? (
            <CategoryRow category={validatedSelectedCategory} />
          ) : (
            "Select a category"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.name}</span>
      <span>{category.name}</span>
    </div>
  );
}

