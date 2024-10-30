"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { MobileLogo } from "./Logo";
import { navbarItems } from "@/lib/constants";
import NavbarItem from "./NavbarItem";
import ThemeSwitcherBtn from "./ThemeSwitcherBtn";
import { UserButton } from "@clerk/nextjs";
import { Root } from "@radix-ui/react-visually-hidden";

const MobileNavbar = () => {
  const [isOpen, setisOpen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setisOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px]">
            <Root>
              <SheetTitle></SheetTitle>
            </Root>
            <MobileLogo />
            <div className="flex flex-col gap-1 pt-4">
              {navbarItems.map((item) => (
                <NavbarItem
                  key={item.label}
                  label={item.label}
                  link={item.link}
                  clickCallback={() => setisOpen(!isOpen)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <MobileLogo />
        </div>
        <div className="flex items-center gap-2 ">
          <ThemeSwitcherBtn />
          <UserButton />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
