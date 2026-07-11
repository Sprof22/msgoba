import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import PageShell from "@/components/page-shell";

const events=[
 {title:"Homecoming 2026: Back to the Mount",date:"22–23 August 2026",time:"9:00 AM",place:"Mount Saint Gabriel's, Makurdi",image:"one",tag:"Flagship reunion"},
 {title:"Abuja Brothers' Dinner",date:"18 September 2026",time:"6:30 PM",place:"Wuse 2, Abuja",image:"two",tag:"Regional meetup"},
 {title:"Annual General Meeting",date:"12 December 2026",time:"4:00 PM",place:"Online · Google Meet",image:"three",tag:"Members only"},
];
export default function Events(){return <PageShell eyebrow="Reconnect in person" title="Events & reunions" description="Come for the memories, stay for the brotherhood. Discover reunions, regional meetups, service projects, and important set meetings."><section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Save the date</span><h2>Upcoming gatherings</h2></div><p>RSVPs are reserved for verified members. Sign in to confirm attendance, add a guest, and receive event reminders.</p></div><div className="event-grid">{events.map(e=><article className="card event-card" key={e.title}><div className={`event-image visual ${e.image}`}/><div className="event-body"><span className="tag"><Users size={11}/>{e.tag}</span><h3>{e.title}</h3><div className="event-details"><span><CalendarDays size={15}/>{e.date}</span><span><Clock3 size={15}/>{e.time}</span><span><MapPin size={15}/>{e.place}</span></div><Link className="btn btn-navy" href="/login">View details & RSVP</Link></div></article>)}</div></div></section></PageShell>}
