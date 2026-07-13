"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import MemberProfileView from "@/components/member-profile-view";
export default function Member(){const {id}=useParams<{id:string}>(),[profile,setProfile]=useState<any>(),[error,setError]=useState("");useEffect(()=>{fetch(`/api/members/${id}`).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error);setProfile(d.profile)}).catch(e=>setError(e.message))},[id]);return <><SiteHeader/>{error?<div className="profile-loading"><div><h2>{error}</h2><Link className="text-link" href="/members"><ArrowLeft size={14}/>Back to directory</Link></div></div>:profile?<MemberProfileView profile={profile}/>:<div className="profile-loading"><LoaderCircle className="spin"/>Loading member profile…</div>}<SiteFooter/></>}
