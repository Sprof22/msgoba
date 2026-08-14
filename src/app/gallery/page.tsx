import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import GalleryViewer from "@/components/gallery-viewer";
import { connectToDatabase } from "@/lib/mongodb";
import { GalleryPhoto } from "@/models/GalleryPhoto";
export const dynamic="force-dynamic";
export default async function GalleryPage(){await connectToDatabase();const rows=await GalleryPhoto.find({active:true}).sort({takenAt:-1,createdAt:-1}).lean() as any[];const photos=rows.map(p=>({id:String(p._id),imageUrl:p.imageUrl,caption:p.caption,album:p.album,takenAt:p.takenAt?new Date(p.takenAt).toISOString():null,credit:p.credit||""}));return <><SiteHeader/><main><section className="page-hero"><div className="container"><span className="eyebrow">Our shared archive</span><h1>Moments worth<br/>remembering.</h1><p>School days, reunions, and the memories that have kept our brotherhood close.</p></div></section><GalleryViewer photos={photos}/></main><SiteFooter/></>}
