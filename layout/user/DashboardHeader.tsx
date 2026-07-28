"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useLogout from "@/hooks/useLogout";
import { useSession } from "@/lib/auth-context";
import { getUserInitials } from "@/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  const { session } = useSession();

  const user = session?.user;

  const { handleLogout } = useLogout();

  return (
    <header className="sticky top-0 z-50 flex h-19.5 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <SidebarTrigger className="hidden lg:flex" />
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 !px-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {getUserInitials(user?.name || "Admin")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/admin-dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/admin-dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
