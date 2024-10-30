import React from "react";
import { Logo } from "./Logo";
import { navbarItems } from "@/lib/constants";
import NavbarItem from "./NavbarItem";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcherBtn from "./ThemeSwitcherBtn";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar/>
    </>
  );
};

const DesktopNavbar = () => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {navbarItems.map((item) => (
              <NavbarItem
                key={item.label}
                label={item.label}
                link={item.link}
              />
            ))}
          </div>
        </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcherBtn />
        <UserButton />
      </div>
      </nav>
    </div>
  );
};

export default Navbar;
