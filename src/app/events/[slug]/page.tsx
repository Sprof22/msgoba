"use client";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  Shirt,
  Users,
} from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>(),
    [data, setData] = useState<any>(),
    [user, setUser] = useState<any>(),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false),
    [guestCount, setGuestCount] = useState(0);
  async function load() {
    try {
      const [er, ur] = await Promise.all([
          fetch(`/api/events/${slug}`),
          fetch("/api/auth/me"),
        ]),
        ed = await er.json();
      if (!er.ok) throw new Error(ed.error);
      setData(ed);
      if (ur.ok) setUser((await ur.json()).user);
      setGuestCount(ed.rsvp?.guestCount || 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Event not found.");
    }
  }
  useEffect(() => {
    load();
  }, [slug]);
  async function rsvp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const f = new FormData(e.currentTarget),
      response = String(f.get("response")),
      names = Array.from({ length: guestCount }, (_, i) =>
        String(f.get(`guest${i}`) || "").trim(),
      );
    const r = await fetch(`/api/events/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response,
          guestCount,
          guestNames: names,
          note: f.get("note"),
        }),
      }),
      d = await r.json();
    setMessage(d.message || d.error);
    setSaving(false);
    if (r.ok) load();
  }
  if (error)
    return (
      <>
        <SiteHeader />
        <div className="profile-loading">
          <div>
            <h2>{error}</h2>
            <Link className="text-link" href="/events">
              <ArrowLeft />
              Back to events
            </Link>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  if (!data)
    return (
      <div className="profile-loading">
        <LoaderCircle className="spin" />
        Loading event…
      </div>
    );
  const e = data.event,
    attending = data.stats?.attending;
  return (
    <>
      <SiteHeader />
      <main>
        <section
          className="event-detail-hero"
          style={
            e.coverImage
              ? {
                  backgroundImage: `linear-gradient(90deg,rgba(4,20,45,.92),rgba(4,20,45,.35)),url(${e.coverImage})`,
                }
              : undefined
          }
        >
          <div className="container">
            <Link className="text-link light" href="/events">
              <ArrowLeft />
              All events
            </Link>
            <span className="tag">
              {e.status === "cancelled"
                ? "Event cancelled"
                : e.visibility === "public"
                  ? "Community event"
                  : "Verified members"}
            </span>
            <h1>{e.title}</h1>
            <p>{e.summary}</p>
            <div className="event-hero-facts">
              <span>
                <CalendarPlus />
                {new Date(e.startAt).toLocaleDateString(undefined, {
                  dateStyle: "full",
                })}
              </span>
              <span>
                <Clock3 />
                {new Date(e.startAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>
                <MapPin />
                {e.venue || "To be announced"}
              </span>
            </div>
          </div>
        </section>
        <div className="container event-detail-grid">
          <article className="card event-copy">
            <span className="eyebrow">About this gathering</span>
            <div>
              {e.description.split(/\n+/).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {e.agenda && (
              <>
                <h3>Agenda</h3>
                <div>
                  {e.agenda.split(/\n+/).map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </>
            )}
            {e.dressCode && (
              <p className="event-note">
                <Shirt />
                Dress code: <b>{e.dressCode}</b>
              </p>
            )}
            <a
              className="btn upload-remove"
              href={`/api/events/${slug}/calendar`}
            >
              <CalendarPlus />
              Add to calendar
            </a>
          </article>
          <aside>
            <section className="card rsvp-card">
              <div className="rsvp-count">
                <Users />
                <span>
                  <b>{(attending?.members || 0) + (attending?.guests || 0)}</b>{" "}
                  people attending
                  {e.capacity ? ` · ${e.capacity} capacity` : ""}
                </span>
              </div>
              {e.status === "cancelled" ? (
                <div className="rsvp-login">
                  <h3>This event has been cancelled</h3>
                  <p>The organisers will share further information through announcements and email notifications.</p>
                </div>
              ) : user?.status === "verified" ? (
                <form onSubmit={rsvp}>
                  <h3>Your RSVP</h3>
                  {message && (
                    <div className="form-alert success">
                      <CheckCircle2 />
                      {message}
                    </div>
                  )}
                  <div className="form-group">
                    <label>Response</label>
                    <select
                      className="select"
                      name="response"
                      defaultValue={data.rsvp?.response || "attending"}
                    >
                      <option value="attending">I&apos;ll be there</option>
                      <option value="maybe">Maybe</option>
                      <option value="declined">Can&apos;t attend</option>
                    </select>
                  </div>
                  {e.allowGuests && (
                    <div className="form-group">
                      <label>Guests</label>
                      <select
                        className="select"
                        value={guestCount}
                        onChange={(x) => setGuestCount(Number(x.target.value))}
                      >
                        {Array.from({ length: e.maxGuests + 1 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {Array.from({ length: guestCount }, (_, i) => (
                    <div className="form-group" key={i}>
                      <label>Guest {i + 1} name</label>
                      <input className="input" name={`guest${i}`} required />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Note to organiser</label>
                    <textarea
                      className="input textarea"
                      name="note"
                      defaultValue={data.rsvp?.note || ""}
                    />
                  </div>
                  <button className="btn btn-navy" disabled={saving}>
                    {saving ? (
                      <LoaderCircle className="spin" />
                    ) : (
                      <CheckCircle2 />
                    )}
                    {saving ? "Saving…" : "Save RSVP"}
                  </button>
                </form>
              ) : (
                <div className="rsvp-login">
                  <h3>Ready to join us?</h3>
                  <p>Verified members can RSVP and add permitted guests.</p>
                  <Link
                    className="btn btn-navy"
                    href={`/login?next=/events/${slug}`}
                  >
                    Sign in to RSVP
                  </Link>
                </div>
              )}
            </section>
            {e.mapUrl && (
              <a className="card map-link" href={e.mapUrl} target="_blank">
                <MapPin />
                <span>
                  <b>Open venue map</b>
                  <small>{e.venue}</small>
                </span>
              </a>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
