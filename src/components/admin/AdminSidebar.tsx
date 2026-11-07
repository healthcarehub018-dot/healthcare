"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/auth";
import {
  LayoutDashboard,
  Layers,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Calendar,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Compass,
  Search,
  Scale,
  Settings,
  UserCheck,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Leads & Inquiries", href: "/admin/leads", icon: Users },
        { label: "Appointments", href: "/admin/appointments", icon: Calendar },
        { label: "Contact Messages", href: "/admin/messages", icon: MessageSquare },
      ],
    },
    {
      title: "CONTENT & CMS",
      items: [
        { label: "Homepage Editor", href: "/admin/homepage", icon: LayoutDashboard },
        { label: "Weight Loss Page", href: "/admin/landing-page", icon: Layers },
        { label: "Services Management", href: "/admin/services", icon: Briefcase },
        { label: "Programs & Pricing", href: "/admin/programs", icon: FileText },
        { label: "Patient Reviews", href: "/admin/testimonials", icon: Star },
        { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
        { label: "Navigation Menus", href: "/admin/navigation", icon: Compass },
      ],
    },
    {
      title: "SYSTEM & CONFIG",
      items: [
        { label: "SEO & Meta", href: "/admin/seo", icon: Search },
        { label: "Legal Pages", href: "/admin/legal", icon: Scale },
        { label: "Site Settings", href: "/admin/settings", icon: Settings },
        { label: "Admin Staff", href: "/admin/users", icon: UserCheck, role: "SUPER_ADMIN" },
        { label: "Audit Logs", href: "/admin/audit", icon: History },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#104D38] text-white select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#779B7C] flex items-center justify-center font-bold text-white text-lg">
            S
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">Suzzmed Portal</span>
            <span className="text-[10px] text-[#779B7C] font-semibold tracking-wider uppercase block">
              Clinical Admin
            </span>
          </div>
        </Link>
        <Link
          href="/"
          target="_blank"
          title="Open Public Website"
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* User Badge */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#779B7C]/40 text-[#E9F1E8] flex items-center justify-center font-bold text-sm shrink-0">
          {user.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <span className="inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#779B7C] text-white mt-0.5">
            {user.role}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.role && item.role !== user.role) return false;
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              <h4 className="text-[10px] font-bold tracking-widest text-[#779B7C] uppercase px-3 mb-2">
                {group.title}
              </h4>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-white text-[#104D38] shadow-sm"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#104D38]" : "text-[#779B7C]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/10">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-red-500/20 text-white hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#104D38] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#779B7C] flex items-center justify-center font-bold text-white text-base">
            S
          </div>
          <span className="font-bold text-sm">Suzzmed Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-white hover:bg-white/10"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 max-w-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 overflow-hidden shadow-xl">
        {sidebarContent}
      </aside>
    </>
  );
}
