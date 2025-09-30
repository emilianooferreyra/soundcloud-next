"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";

export const AppHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed left-0 top-0 z-50 w-full transform translate-z-0 border-b border-black/20 bg-[#262728] shadow-[0_3px_0_0_rgba(0,0,0,0.08)] min-h-[61px] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <h1 className="text-lg font-normal text-[#aaabac] py-2.5 h-[60px]">
            SoundCloud Next
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-[#98999a]  p-0 cursor-pointer"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};
