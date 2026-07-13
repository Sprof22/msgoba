"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
export default function LogoutButton({className="btn btn-navy"}:{className?:string}){const router=useRouter(),[loading,setLoading]=useState(false);return <button className={className} disabled={loading} onClick={async()=>{setLoading(true);await fetch("/api/auth/logout",{method:"POST"});router.push("/login");router.refresh()}}>{loading?<LoaderCircle className="spin" size={16}/>:<LogOut size={16}/>} {loading?"Signing out…":"Sign out"}</button>}
