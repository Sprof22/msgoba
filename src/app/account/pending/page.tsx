import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import SiteHeader from "@/components/site-header";
export default async function Pending(){const user=await getCurrentUser();if(!user)redirect("/login");if(user.status==="verified")redirect("/members");return <><SiteHeader/><main className="status-page"><div className="status-card card"><span className="status-orb pending"><Clock3/></span><span className="eyebrow">Membership review</span><h1>You&apos;re in the queue, {user.name.split(" ")[0]}.</h1><p>Your email has been verified. An administrator will compare your information with the official Class of 2012 records before opening the private directory.</p><div className="review-steps"><span className="done"><ShieldCheck/>Email verified</span><span className="active"><Clock3/>Administrator review</span><span>Directory access</span></div><LogoutButton/></div></main></>}
