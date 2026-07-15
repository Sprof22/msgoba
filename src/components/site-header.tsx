"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Mail, ShieldCheck, X } from "lucide-react";

const links = [["/", "Home"], ["/members", "Members"], ["/announcements", "Announcements"], ["/events", "Events"]];

export function Brand() {
  return <Link className="brand" href="/"><Image className="brand-logo" src="/images/msgoba-logo.png" width={64} height={64} alt="Mount Saint Gabriel's Old Boys Association logo" priority/><span className="brand-copy"><strong>Mount Saint Gabriel&apos;s</strong><small>Class of 2012</small></span></Link>;
}

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return <>
    <div className="topbar"><div className="container topbar-inner"><span><ShieldCheck size={13}/> Official Alumni Community · Class of 2012</span><span><Mail size={13}/> hello@msg2012.org</span></div></div>
    <nav className="nav"><div className="container nav-inner"><Brand/><div className="nav-links">{links.map(([href,label])=><Link key={href} className={path===href?"active":""} href={href}>{label}</Link>)}<Link href="/#legacy">Our Legacy</Link></div><div className="nav-actions"><Link className="btn btn-navy" href="/login">Member Login</Link><button className="menu-btn" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div>{open&&<div className="mobile-nav">{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}<Link href="/#legacy" onClick={()=>setOpen(false)}>Our Legacy</Link><Link className="btn btn-primary" href="/login">Member Login</Link></div>}</nav>
  </>;
}
