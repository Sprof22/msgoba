import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

export default function PageShell({eyebrow,title,description,children}:{eyebrow:string,title:string,description:string,children:React.ReactNode}){return <><SiteHeader/><main><section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>{children}</main><SiteFooter/></>}
