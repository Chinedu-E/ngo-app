// app/admin/page.tsx
import { InquiryCard } from "@/components/admin/inquiryview";
import { AdminSidebar } from "@/components/admin/sidebar";
import { StatCard } from "@/components/admin/statcard";
import { FileText, MoreHorizontal, User } from "lucide-react";

const mockSubmissions = [
  {
    id: 1,
    name: "Ahmad Saadi",
    email: "ahmad.s@email.com",
    service: "Career Mapping",
    date: "2 mins ago",
    resume: true,
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    email: "elena.r@email.com",
    service: "Settlement Assist",
    date: "4 hours ago",
    resume: false,
  },
  {
    id: 3,
    name: "Chen Wei",
    email: "c.wei@email.com",
    service: "Volunteer Placement",
    date: "1 day ago",
    resume: true,
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "s.johnson@email.com",
    service: "Career Mapping",
    date: "2 days ago",
    resume: true,
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#050810] mt-20">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">Inquiry Overview</h1>
            <p className="text-slate-400 text-sm">
              Managing newcomer requests and support tickets.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[#0A0F1C]">
              NE
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Inquiries" value="128" trend="+12%" />
          <StatCard label="Pending Review" value="14" trend="Action Required" />
          <StatCard label="Resumes Received" value="89" trend="70% Rate" />
        </div>

        {/* Submissions Table */}
        {/* <div className="bg-white/2 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/1">
            <h3 className="font-bold text-white">Recent Submissions</h3>
            <button className="text-sm text-emerald-400 font-semibold hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="px-8 py-5 font-semibold">User</th>
                  <th className="px-8 py-5 font-semibold">Service</th>
                  <th className="px-8 py-5 font-semibold">Resume</th>
                  <th className="px-8 py-5 font-semibold">Date</th>
                  <th className="px-8 py-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {sub.name}
                          </p>
                          <p className="text-xs text-slate-500">{sub.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {sub.service}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {sub.resume ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs font-bold">Attached</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-400">
                      {sub.date}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
        {/* Submissions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockSubmissions.map((sub) => (
            <InquiryCard key={sub.id} sub={sub} />
          ))}
        </div>
      </main>
    </div>
  );
}
