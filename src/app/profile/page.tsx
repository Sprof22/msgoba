"use client";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import MemberProfileView from "@/components/member-profile-view";
export default function Profile(){const [profile,setProfile]=useState<any>();useEffect(()=>{fetch("/api/profile").then(r=>r.json()).then(d=>setProfile(d.profile))},[]);return <><SiteHeader/>{profile?<MemberProfileView profile={profile} own/>:<div className="profile-loading"><LoaderCircle className="spin"/>Loading your profile…</div>}<SiteFooter/></>}
