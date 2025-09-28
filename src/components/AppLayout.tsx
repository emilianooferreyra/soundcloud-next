"use client";

import { AppHeader } from "@/components/AppHeader";
import { ReactNode } from "react";
import { Player } from "./Player";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-screen flex flex-col bg-[#262728]">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pt-16 pb-5">{children}</main>
      <Player />
    </div>
  );
};
