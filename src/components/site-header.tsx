"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, Mail, ShieldCheck, UserRound, X } from "lucide-react";

const links = [["/", "Home"], ["/members", "Members"], ["/announcements", "Announcements"], ["/events", "Events"], ["/gallery", "Gallery"]];

export function Brand() {
  return <Link className="brand" href="/"><Image className="brand-logo" src="/images/msgoba-logo.png" width={64} height={64} alt="Mount Saint Gabriel's Old Boys Association logo" priority /><span className="brand-copy"><strong>Mount Saint Gabriel&apos;s</strong><small>Class of 2012</small></span></Link>;
}

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{name:string;roles:string[];status:string}|null>(null);
  const [accountLoaded, setAccountLoaded] = useState(false);
  useEffect(() => { fetch("/api/auth/me").then(response => response.ok ? response.json() : { user: null }).then(data => setUser(data.user || null)).catch(() => setUser(null)).finally(() => setAccountLoaded(true)); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const isAdmin = Boolean(user?.roles.some(role => role === "admin" || role === "super_admin"));
  const accountHref = isAdmin ? "/admin" : user?.status === "verified" ? "/profile" : "/account/pending";
  const initials = user?.name.split(" ").filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
  return <>
    <div className="topbar"><div className="container topbar-inner"><span><ShieldCheck size={13} /> Official Alumni Community · Class of 2012</span><span><Mail size={13} /> hello@msgoba2012.com</span></div></div>
    <nav className="nav"><div className="container nav-inner"><Brand /><div className="nav-links">{links.map(([href, label]) => <Link key={href} className={path === href ? "active" : ""} href={href}>{label}</Link>)}<Link href="/#legacy">Our Legacy</Link></div><div className="nav-actions">{accountLoaded && user ? <Link className="account-chip" href={accountHref} aria-label={isAdmin ? "Open admin dashboard" : "Open your profile"}><span className="account-avatar">{initials || <UserRound size={16}/>}</span><span className="account-copy"><small>{isAdmin ? "Admin" : "My account"}</small><b>{user.name.split(" ")[0]}</b></span>{isAdmin && <LayoutDashboard size={15}/>}</Link> : <Link className="btn btn-navy" href="/login">Member Login</Link>}<button className="menu-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>{open && <div className="mobile-nav" id="mobile-menu">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/#legacy" onClick={() => setOpen(false)}>Our Legacy</Link>{user ? <Link className="btn btn-primary" href={accountHref} onClick={() => setOpen(false)}>{isAdmin ? "Admin dashboard" : "My profile"}</Link> : <Link className="btn btn-primary" href="/login">Member Login</Link>}</div>}</nav>
  </>;
}
