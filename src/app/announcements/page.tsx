import Link from "next/link";
import { ArrowRight, Bell, Megaphone } from "lucide-react";
import PageShell from "@/components/page-shell";

const notices=[
 ["11","JUL","Set update","Registration for the 2026 Homecoming is now open","Secure your place for our biggest reunion yet. Early confirmation helps the planning committee create an unforgettable weekend."],
 ["08","JUL","Welfare","2026 welfare fund and support framework","The new welfare cycle is open. Learn how contributions are managed and how members can request support privately."],
 ["29","JUN","Leadership","Introducing the 2026–2028 executive council","Meet the brothers entrusted with serving our set during the next chapter of our shared journey."],
 ["16","JUN","Community project","Giving back to the Mount: library renewal project","We are partnering to renew key learning spaces for the boys following in our footsteps."],
 ["02","JUN","Business","Member business spotlight submissions are open","Tell us what you are building. Selected member ventures will be featured across our community."],
];
export default function Announcements(){return <PageShell eyebrow="News & notices" title="Announcements" description="Official updates from the executive council, reunion committee, welfare team, and the wider Class of 2012 community."><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Latest first</span><h2>Stay informed</h2></div><p><Bell size={16}/> Important notices can be restricted to verified members. Sign in to make sure you see everything intended for you.</p></div><div className="notice-list">{notices.map(n=><article className="card notice" key={n[3]}><div className="notice-date"><b>{n[0]}</b><span>{n[1]}</span></div><div><span className="tag"><Megaphone size={11}/>{n[2]}</span><h3>{n[3]}</h3><p>{n[4]}</p></div><Link className="btn btn-navy" href="/login">Read more <ArrowRight size={14}/></Link></article>)}</div></div></section></PageShell>}
