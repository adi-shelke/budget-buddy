import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          {/* Skeleton for the greeting text */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
          </div>

          {/* Skeleton for the button */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-[150px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
