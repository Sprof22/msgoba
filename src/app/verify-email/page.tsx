"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, MailCheck, XCircle } from "lucide-react";
import SiteHeader from "@/components/site-header";
function State(){const p=useSearchParams();const success=p.get("success")==="1",error=p.get("error");return <div className="status-card card"><span className={`status-orb ${error?"bad":""}`}>{error?<XCircle/>:success?<CheckCircle2/>:<MailCheck/>}</span><span className="eyebrow">Email verification</span><h1>{error?"That link did not work":success?"Email verified":"Check your inbox"}</h1><p>{error?"The verification link is invalid, expired, or has already been used.":success?"Your email is confirmed. Sign in to view the status of your membership request.":"Use the link sent to your email address. After verification, an administrator will review your Class of 2012 membership request."}</p><Link className="btn btn-navy" href={success?"/login":"/register"}>{success?"Continue to sign in":"Return to registration"}</Link></div>}
export default function VerifyEmail(){return <><SiteHeader/><main className="status-page"><Suspense><State/></Suspense></main></>}
