"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div
      className={`transition-all duration-160ms ease-in-out overflow-hidden ${
        isOpen ? "h-[90px]" : "h-0"
      }`}
    >
      <form className="border-t border-white/5">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for tracks, artists, etc."
          className="h-[65px] text-[30px] font-light text-white placeholder:text-[#999] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-10"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onClose();
            }
          }}
        />
      </form>
    </div>
  );
};
