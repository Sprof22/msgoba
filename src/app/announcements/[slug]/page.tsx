import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Download, LockKeyhole, Paperclip } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getCurrentUser } from "@/lib/auth";
import { audienceValues, liveContentFilter } from "@/lib/content";
import { connectToDatabase } from "@/lib/mongodb";
import { Announcement } from "@/models/Announcement";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

async function findAnnouncement(slug: string) {
  const viewer = await getCurrentUser();
  await connectToDatabase();
  return Announcement.findOne({
    ...liveContentFilter(audienceValues(viewer)),
    slug,
  }).lean() as Promise<any | null>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findAnnouncement(slug);
  if (!item) return { title: "Announcement not found | MSG Class of 2012" };
  return {
    title: `${item.title} | MSG Class of 2012`,
    description: item.summary,
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      publishedTime: (item.publishedAt || item.publishAt || item.createdAt)?.toISOString(),
      images: item.coverImage ? [{ url: item.coverImage, alt: item.title }] : undefined,
    },
  };
}

export default async function AnnouncementDetail({ params }: Props) {
  const { slug } = await params;
  const item = await findAnnouncement(slug);
  if (!item) notFound();
  await Announcement.updateOne({ _id: item._id }, { $inc: { viewCount: 1 } });
  const date = new Date(item.publishAt || item.publishedAt || item.createdAt);
  return <><SiteHeader/><main><article className="article-page">{item.coverImage&&<div className="article-cover" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(7,29,60,.7)),url(${item.coverImage})`}}/>}<div className="article-container"><Link className="text-link" href="/announcements"><ArrowLeft size={14}/>All announcements</Link><div className="article-meta"><span className="tag">{item.category}</span>{item.audience!=="public"&&<span><LockKeyhole/>Members only</span>}<span><CalendarDays/>{date.toLocaleDateString("en-NG",{dateStyle:"long"})}</span></div><h1>{item.title}</h1><p className="article-lead">{item.summary}</p><div className="article-body">{item.body.split(/\n+/).filter(Boolean).map((paragraph:string,index:number)=><p key={index}>{paragraph}</p>)}</div>{item.attachments?.length>0&&<section className="article-attachments"><h2><Paperclip/>Attachments</h2>{item.attachments.map((attachment:any)=><a href={attachment.url} key={attachment.publicId} target="_blank" rel="noopener noreferrer"><span><b>{attachment.name}</b><small>{String(attachment.format).toUpperCase()} · {(Number(attachment.bytes)/1024/1024).toFixed(2)} MB</small></span><Download/></a>)}</section>}</div></article></main><SiteFooter/></>;
}
