import Link from "next/link";
import { ArrowRight, Bell, BriefcaseBusiness, CalendarDays, CheckCircle2, Globe2, MapPin, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { connectToDatabase } from "@/lib/mongodb";
import { liveContentFilter, liveEventFilter } from "@/lib/content";
import { Announcement } from "@/models/Announcement";
import { Event } from "@/models/Event";
import { LegacyBrother } from "@/models/LegacyBrother";

export const dynamic = "force-dynamic";

const fallbackPhotos = ["photo-1", "photo-2", "photo-3", "photo-4"];

export default async function Home() {
  await connectToDatabase();
  const [event, announcements, legacyBrothers] = await Promise.all([
    Event.findOne({ ...liveEventFilter(["public"]), status: { $ne: "cancelled" }, startAt: { $gte: new Date() } }).sort({ featured: -1, startAt: 1 }).lean() as Promise<any>,
    Announcement.find(liveContentFilter(["public"])).sort({ pinned: -1, featured: -1, publishAt: -1 }).limit(2).lean() as Promise<any[]>,
    LegacyBrother.find({ active: true }).sort({ order: 1, updatedAt: -1 }).limit(8).lean() as Promise<any[]>,
  ]);
  const updates = [
    ...(event ? [{ ...event, kind: "event", date: event.startAt }] : []),
    ...announcements.map(a => ({ ...a, kind: "announcement", date: a.publishAt || a.publishedAt || a.createdAt })),
  ];
  return <>
    <SiteHeader />
    <main>
      <section className="hero"><div className="container"><div className="hero-content"><div className="hero-kicker"><i /> Mount Saint Gabriel&apos;s · Class of 2012</div><h1>From the Mount.<br /><em>For a lifetime.</em></h1><p>More than classmates. We are a brotherhood forged by shared memories, strengthened by every journey, and united by a legacy that still calls us home.</p><div className="hero-actions"><Link className="btn btn-primary" href="/register">Join the community <ArrowRight size={17} /></Link><Link className="btn btn-outline" href="/members">Explore our directory</Link></div></div></div><div className="hero-foot"><div className="container hero-stats"><div className="stat"><b>180+</b><span>Classmates</span></div><div className="stat"><b>14</b><span>Years of brotherhood</span></div><div className="stat"><b>12</b><span>Countries represented</span></div><div className="stat"><b>One</b><span>Unbreakable bond</span></div></div></div></section>
      <section className="quick-strip"><div className="container quick-grid"><Link className="quick-item" href="/members"><span className="quick-icon"><Search size={19} /></span><span><b>Find a classmate</b><span>Browse our directory</span></span></Link><Link className="quick-item" href="/announcements"><span className="quick-icon"><Bell size={19} /></span><span><b>Latest updates</b><span>News from the set</span></span></Link><Link className="quick-item" href="/events"><span className="quick-icon"><CalendarDays size={19} /></span><span><b>Upcoming events</b><span>Reconnect in person</span></span></Link><Link className="quick-item" href="/register"><span className="quick-icon"><BriefcaseBusiness size={19} /></span><span><b>Member businesses</b><span>Support a brother</span></span></Link></div></section>

      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Stay in the loop</span><h2>What&apos;s happening<br />in our community</h2></div><p>From reunion plans to community projects, never miss the moments that keep our brotherhood moving forward.</p></div>{updates.length ? <div className="announcement-grid live-home-updates">{updates.map((item, index) => { const date = new Date(item.date); return <article className={`card news-card ${index === 0 ? "featured" : ""}`} key={String(item._id)}><div className="visual" style={item.coverImage ? { backgroundImage: `linear-gradient(135deg,rgba(7,29,60,.08),rgba(7,29,60,.48)),url(${item.coverImage})` } : undefined}><span className="date-badge"><b>{date.getDate().toString().padStart(2, "0")}</b><span>{date.toLocaleString("en", { month: "short" }).toUpperCase()}</span></span></div><div className="news-body"><span className="tag">{item.kind === "event" ? "Upcoming event" : item.category}</span><h3>{item.title}</h3><p>{item.summary}</p><Link className="text-link" href={item.kind === "event" ? `/events/${item.slug}` : `/announcements/${item.slug}`}>{item.kind === "event" ? "View event details" : "Read announcement"} <ArrowRight size={14} /></Link></div></article> })}</div> : <div className="empty-state compact-empty"><Bell /><h3>Fresh updates are coming</h3><p>Published announcements and the next event will appear here.</p></div>}</div></section>

      <section className="section legacy" id="legacy"><div className="container legacy-grid"><div className="legacy-photo"><div className="legacy-seal">In God<br />Our Strength</div></div><div><span className="eyebrow">Our shared legacy</span><h2>We left the school.<br />The school never left us.</h2><p>We arrived as boys from different homes and left as brothers with a common story. The discipline, faith and friendships formed at Mount Saint Gabriel&apos;s continue to shape the men we are today.</p><div className="quote">“The Mount gave us more than an education. It gave us each other.”</div><p>This digital home keeps that bond alive—wherever life has taken us—and creates room for the next chapter of our collective story.</p><div className="legacy-values"><div><ShieldCheck size={18} /> Faith & character</div><div><Users size={18} /> Lifelong brotherhood</div><div><Sparkles size={18} /> Service & legacy</div></div></div></div></section>

      <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Across the world</span><h2>Meet the brothers<br />behind the legacy</h2></div><div><p>Different paths, one foundation. Reconnect, collaborate, and celebrate how far we have all come.</p><Link className="text-link" href="/members">View all members <ArrowRight size={14} /></Link></div></div>{legacyBrothers.length ? <div className="member-row">{legacyBrothers.map((m, index) => <Link href="/members" className="card member-card" key={String(m._id)}><div className={`member-photo ${m.photo ? "" : fallbackPhotos[index % fallbackPhotos.length]}`} style={m.photo ? { backgroundImage: `url(${m.photo})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}><i className="member-status" /></div><div className="member-info"><h3>{m.name}</h3><p>{m.role}</p><div className="member-meta"><span><MapPin size={12} />{m.place}</span><span><Globe2 size={12} />2012</span></div></div></Link>)}</div> : <div className="empty-state compact-empty"><Users /><h3>Legacy section is being curated</h3><p>Profiles selected by administrators will appear here soon.</p></div>}</div></section>

      <section className="cta-band"><div className="container cta-inner"><div><h2>Your story belongs here.</h2><p>Join the official Class of 2012 directory and reconnect with the brotherhood.</p></div><Link className="btn btn-navy" href="/register">Create your profile <ArrowRight size={17} /></Link></div></section>
    </main>
    <SiteFooter />
  </>
}
