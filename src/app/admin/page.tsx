import Link from "next/link";
import {
  Activity,
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Brand } from "@/components/site-header";
import LogoutButton from "@/components/logout-button";
import { getCurrentUser, hasAdminRole } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";
import { Event } from "@/models/Event";
import { User } from "@/models/User";
import { redirect } from "next/navigation";

function timeAgo(value?: Date | string | null) {
  if (!value) return "just now";
  const then = new Date(value).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
}

function formatMonthDay(value: Date | string) {
  return new Date(value).toLocaleDateString("en", {
    day: "2-digit",
    month: "short",
  });
}

export default async function Admin() {
  const user = await getCurrentUser();
  if (!hasAdminRole(user)) redirect("/admin/announcements");

  await connectToDatabase();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalMembers,
    membersThisMonth,
    pendingApproval,
    pendingRequestsRaw,
    upcomingEvents,
    nextEvent,
    publishedNotices,
    scheduledNotices,
    latestAnnouncement,
  ] = await Promise.all([
    User.countDocuments({ status: { $in: ["pending", "verified", "memorial"] } }),
    User.countDocuments({ createdAt: { $gte: monthStart } }),
    User.countDocuments({ status: "pending" }),
    User.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("name email createdAt")
      .lean(),
    Event.countDocuments({ status: { $in: ["published", "scheduled"] }, startAt: { $gte: now } }),
    Event.findOne({ status: { $in: ["published", "scheduled"] }, startAt: { $gte: now } })
      .sort({ startAt: 1 })
      .select("title startAt")
      .lean() as Promise<{ title: string; startAt: Date } | null>,
    Announcement.countDocuments({ status: "published" }),
    Announcement.countDocuments({ status: "scheduled" }),
    Announcement.findOne({ status: { $in: ["published", "scheduled"] } })
      .sort({ updatedAt: -1 })
      .select("title updatedAt")
      .lean() as Promise<{ title: string; updatedAt?: Date } | null>,
  ]);

  const pendingRequests = (pendingRequestsRaw as any[]).map((member) => ({
    name: String(member.name || ""),
    email: String(member.email || ""),
    createdAt: member.createdAt ? new Date(member.createdAt) : undefined,
  }));

  const recentActivity = [
    pendingRequests[0]
      ? {
        id: `pending-${pendingRequests[0].email}`,
        text: `${pendingRequests[0].name} requested membership.`,
        when: pendingRequests[0].createdAt,
      }
      : null,
    nextEvent
      ? {
        id: `event-${String(nextEvent.startAt)}`,
        text: `${nextEvent.title} is upcoming.`,
        when: nextEvent.startAt,
      }
      : null,
    latestAnnouncement
      ? {
        id: `notice-${latestAnnouncement.title}`,
        text: `${latestAnnouncement.title} was updated.`,
        when: latestAnnouncement.updatedAt,
      }
      : null,
  ]
    .filter(Boolean)
    .sort((a, b) => new Date(b!.when || 0).getTime() - new Date(a!.when || 0).getTime())
    .slice(0, 4) as Array<{ id: string; text: string; when?: Date }>;

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <Brand />
        <div className="side-nav">
          <Link className="active" href="/admin">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>
          <Link href="/admin/members">
            <Users size={18} />
            <span>Members</span>
          </Link>
          <Link href="/admin/profiles">
            <ShieldCheck size={18} />
            <span>Profile moderation</span>
          </Link>
          <Link href="/admin/legacy-brothers">
            <Sparkles size={18} />
            <span>Legacy brothers</span>
          </Link>
          <Link href="/admin/announcements">
            <Megaphone size={18} />
            <span>Announcements</span>
          </Link>
          <Link href="/admin/events">
            <CalendarDays size={18} />
            <span>Events</span>
          </Link>
          <div className="side-label">Manage</div>
          <Link href="/admin/media">
            <FileText size={18} />
            <span>Media & gallery</span>
          </Link>
          <a href="#">
            <Activity size={18} />
            <span>Adverts & sponsors</span>
          </a>
          <a href="#">
            <Settings size={18} />
            <span>Site settings</span>
          </a>
          <div className="side-label">Account</div>
          <LogoutButton className="side-logout" />
        </div>
      </aside>
      <section className="dashboard-main">
        <div className="dash-head">
          <div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
              {now.toLocaleDateString("en", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1>Welcome back, {user!.name.split(" ")[0]}.</h1>
          </div>
          <div className="admin-user">
            <button className="dash-icon" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="avatar photo-1" />
            <div>
              <b style={{ fontSize: 12 }}>{user!.name}</b>
              <p style={{ fontSize: 10, color: "var(--muted)", margin: 0 }}>
                Super Admin
              </p>
            </div>
          </div>
        </div>
        <div className="dash-stats">
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Total members</span>
              <span className="dash-icon">
                <Users size={17} />
              </span>
            </div>
            <b>{totalMembers}</b>
            <span className="up">↑ {membersThisMonth} this month</span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Pending approval</span>
              <span className="dash-icon">
                <ShieldCheck size={17} />
              </span>
            </div>
            <b>{pendingApproval}</b>
            <span className="up">Needs your review</span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Upcoming events</span>
              <span className="dash-icon">
                <CalendarDays size={17} />
              </span>
            </div>
            <b>{upcomingEvents}</b>
            <span className="up">
              {nextEvent ? `Next: ${formatMonthDay(nextEvent.startAt)}` : "No upcoming event"}
            </span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Published notices</span>
              <span className="dash-icon">
                <Megaphone size={17} />
              </span>
            </div>
            <b>{publishedNotices}</b>
            <span className="up">{scheduledNotices} scheduled</span>
          </article>
        </div>
        <div className="dash-grid">
          <article className="card panel">
            <div className="panel-head">
              <h3>Recent membership requests</h3>
              <Link className="text-link" href="/admin/members">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length ? pendingRequests.map((member, i) => (
                  <tr key={`${member.email}-${i}`}>
                    <td>
                      <div className="person">
                        <div className={`avatar photo-${(i % 3) + 1}`} />
                        <div>
                          <b>{member.name}</b>
                        </div>
                      </div>
                    </td>
                    <td>{member.email}</td>
                    <td>{timeAgo(member.createdAt)}</td>
                    <td>
                      <span className="status">Pending</span>
                    </td>
                  </tr>
                )) : <tr><td colSpan={4}><span style={{ color: "var(--muted)" }}>No pending requests right now.</span></td></tr>}
              </tbody>
            </table>
          </article>
          <article className="card panel">
            <div className="panel-head">
              <h3>Recent activity</h3>
              <Activity size={17} />
            </div>
            <div className="activity">
              {recentActivity.length ? recentActivity.map((item) => (
                <div className="activity-item" key={item.id}>
                  <span className="activity-dot" />
                  <p>
                    <b>{item.text}</b>
                    <br />
                    {timeAgo(item.when)}
                  </p>
                </div>
              )) : <div className="activity-item"><span className="activity-dot" /><p><b>No recent activity yet.</b></p></div>}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
