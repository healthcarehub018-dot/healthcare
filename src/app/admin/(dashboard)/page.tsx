import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import {
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  // Real Database Queries
  const [
    totalLeads,
    newLeads,
    totalServices,
    totalPrograms,
    unreadMessages,
    publishedTestimonials,
    recentLeads,
    recentMessages,
    recentAudits,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.service.count({ where: { status: "ACTIVE" } }),
    prisma.program.count({ where: { active: true } }),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    {
      label: "Total Inquiries / Leads",
      value: totalLeads,
      sub: `${newLeads} new awaiting review`,
      icon: Users,
      href: "/admin/leads",
      badgeColor: "bg-[#E9F1E8] text-[#104D38]",
    },
    {
      label: "Active Clinical Services",
      value: totalServices,
      sub: "Configured clinical categories",
      icon: Briefcase,
      href: "/admin/services",
      badgeColor: "bg-blue-50 text-blue-700",
    },
    {
      label: "Published Programs",
      value: totalPrograms,
      sub: "Active member programs",
      icon: FileText,
      href: "/admin/programs",
      badgeColor: "bg-purple-50 text-purple-700",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      sub: "General contact inquiries",
      icon: MessageSquare,
      href: "/admin/messages",
      badgeColor: unreadMessages > 0 ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-700",
    },
    {
      label: "Member Testimonials",
      value: publishedTestimonials,
      sub: "Consent-verified reviews",
      icon: Star,
      href: "/admin/testimonials",
      badgeColor: "bg-[#E9F1E8] text-[#104D38]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            CLINICAL DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Welcome back, {admin?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Real-time management overview of patient inquiries, clinical services, and website content.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/homepage"
            className="px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#242824] hover:bg-gray-50 transition-colors shadow-sm"
          >
            Edit Homepage
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>Review Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#6F7770] tracking-tight truncate">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${stat.badgeColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[#242824] tracking-tight mb-1">
                {stat.value}
              </div>
              <p className="text-[11px] text-[#6F7770] truncate">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Leads & Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads (CRM-lite) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#242824]">Recent Inquiries</h2>
              <p className="text-xs text-[#6F7770]">Latest assessment and telehealth submissions</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-[#104D38] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-xl bg-[#F8F9F6] border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#242824]">
                      {lead.firstName} {lead.lastName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#104D38] border border-black/5 font-semibold">
                      {lead.referenceCode}
                    </span>
                  </div>
                  <p className="text-xs text-[#6F7770] mt-0.5">
                    {lead.email} • {lead.goalCategory || "General Intake"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      lead.status === "NEW"
                        ? "bg-amber-100 text-amber-800"
                        : lead.status === "CONTACTED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <Link
                    href={`/admin/leads?id=${lead.id}`}
                    className="p-1 rounded text-[#104D38] hover:bg-[#E9F1E8]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {recentLeads.length === 0 && (
              <div className="text-center py-8 text-xs text-[#6F7770]">
                No leads recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages & Audit Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Messages */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#242824]">Recent Messages</h3>
                <p className="text-xs text-[#6F7770]">Contact form submissions</p>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-bold text-[#104D38] hover:underline"
              >
                All Messages
              </Link>
            </div>

            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="p-3.5 rounded-xl bg-[#F8F9F6] border border-black/5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#242824]">{msg.name}</span>
                    <span className="text-[10px] text-[#6F7770]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#242824] font-medium truncate">{msg.subject || "No subject"}</p>
                  <p className="text-[#6F7770] line-clamp-1 mt-0.5">{msg.message}</p>
                </div>
              ))}

              {recentMessages.length === 0 && (
                <div className="text-center py-6 text-xs text-[#6F7770]">
                  No messages received yet.
                </div>
              )}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#242824]">Security & Audit Activity</h3>
                <p className="text-xs text-[#6F7770]">Sensitive administrative actions</p>
              </div>
              <Link
                href="/admin/audit"
                className="text-xs font-bold text-[#104D38] hover:underline"
              >
                Full Log
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {recentAudits.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <div>
                    <span className="font-semibold text-[#242824] block">{a.summary}</span>
                    <span className="text-[10px] text-[#6F7770]">{a.adminName || "System"}</span>
                  </div>
                  <span className="text-[10px] text-[#6F7770] shrink-0">
                    {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
