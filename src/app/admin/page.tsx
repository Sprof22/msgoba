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
import { redirect } from "next/navigation";

const recent = [
  ["Terna Iorfa", "terna@example.com", "Blue House", "photo-1"],
  ["Gabriel Onoja", "gabriel@example.com", "Red House", "photo-2"],
  ["Paul Orngu", "paul@example.com", "Blue House", "photo-3"],
];
export default async function Admin() {
  const user = await getCurrentUser();
  if (!hasAdminRole(user)) redirect("/admin/announcements");
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
              Saturday, 11 July 2026
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
            <b>184</b>
            <span className="up">↑ 12 this month</span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Pending approval</span>
              <span className="dash-icon">
                <ShieldCheck size={17} />
              </span>
            </div>
            <b>8</b>
            <span className="up">Needs your review</span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Upcoming events</span>
              <span className="dash-icon">
                <CalendarDays size={17} />
              </span>
            </div>
            <b>3</b>
            <span className="up">Next: 22 August</span>
          </article>
          <article className="card dash-stat">
            <div className="dash-stat-top">
              <span>Published notices</span>
              <span className="dash-icon">
                <Megaphone size={17} />
              </span>
            </div>
            <b>26</b>
            <span className="up">4 scheduled</span>
          </article>
        </div>
        <div className="dash-grid">
          <article className="card panel">
            <div className="panel-head">
              <h3>Recent membership requests</h3>
              <Link className="text-link" href="/members">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>House</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p, i) => (
                  <tr key={p[0]}>
                    <td>
                      <div className="person">
                        <div className={`avatar ${p[3]}`} />
                        <div>
                          <b>{p[0]}</b>
                          <br />
                          <span style={{ color: "var(--muted)", fontSize: 10 }}>
                            {p[1]}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{p[2]}</td>
                    <td>{i + 1}h ago</td>
                    <td>
                      <span className="status">Pending</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article className="card panel">
            <div className="panel-head">
              <h3>Recent activity</h3>
              <Activity size={17} />
            </div>
            <div className="activity">
              <div className="activity-item">
                <span className="activity-dot" />
                <p>
                  <b>Emmanuel Oche</b> updated his profile.
                  <br />
                  12 minutes ago
                </p>
              </div>
              <div className="activity-item">
                <span className="activity-dot" />
                <p>
                  <b>Homecoming 2026</b> received 6 new RSVPs.
                  <br />1 hour ago
                </p>
              </div>
              <div className="activity-item">
                <span className="activity-dot" />
                <p>
                  <b>Welfare Fund Update</b> was published.
                  <br />3 hours ago
                </p>
              </div>
              <div className="activity-item">
                <span className="activity-dot" />
                <p>
                  <b>Gabriel Onoja</b> requested membership.
                  <br />5 hours ago
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
