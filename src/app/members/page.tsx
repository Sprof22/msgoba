"use client";
import { useMemo, useState } from "react";
import { Globe2, MapPin, Search, Users } from "lucide-react";
import PageShell from "@/components/page-shell";

const people=[
 ["Terna Iorfa","Civil Engineer","Abuja, Nigeria","Blue House","photo-1"],
 ["Emmanuel Oche","Product Designer","Lagos, Nigeria","Red House","photo-2"],
 ["David Utsaha","Medical Doctor","Manchester, UK","Green House","photo-3"],
 ["Samuel Gbaa","Entrepreneur","Makurdi, Nigeria","Blue House","photo-4"],
 ["Joseph Terkimbi","Software Engineer","Toronto, Canada","Yellow House","photo-1"],
 ["Gabriel Onoja","Legal Practitioner","Abuja, Nigeria","Red House","photo-2"],
 ["Moses Aondofa","Architect","Port Harcourt, Nigeria","Green House","photo-3"],
 ["Daniel Ogbole","Financial Analyst","London, UK","Yellow House","photo-4"],
 ["Paul Orngu","Agribusiness Founder","Makurdi, Nigeria","Blue House","photo-1"],
];

export default function Members(){const [query,setQuery]=useState("");const shown=useMemo(()=>people.filter(p=>p.join(" ").toLowerCase().includes(query.toLowerCase())),[query]);return <PageShell eyebrow="The brotherhood" title="Member directory" description="Find old friends, discover new paths, and stay connected with verified members of the Mount Saint Gabriel's Class of 2012."><section className="section"><div className="container"><div className="filters"><div className="search"><Search size={18}/><input className="input" placeholder="Search by name, profession or city..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select className="select" aria-label="Filter by location"><option>All locations</option><option>Nigeria</option><option>United Kingdom</option><option>Canada</option></select><select className="select" aria-label="Filter by house"><option>All houses</option><option>Blue House</option><option>Red House</option><option>Green House</option><option>Yellow House</option></select></div><p style={{color:"var(--muted)",fontSize:13,marginBottom:20}}><Users size={14} style={{verticalAlign:"middle"}}/> Showing {shown.length} verified brothers</p><div className="directory-grid">{shown.map((p,i)=><article className="card directory-card" key={p[0]}><div className={`avatar ${p[4]}`}/><div><h3>{p[0]}</h3><p>{p[1]}</p><div className="tiny-meta"><span><MapPin size={11}/>{p[2]}</span><span><Globe2 size={11}/>{p[3]}</span></div></div></article>)}</div></div></section></PageShell>}
