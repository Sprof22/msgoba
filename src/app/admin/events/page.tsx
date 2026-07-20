"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  CalendarDays,
  Download,
  Edit3,
  LoaderCircle,
  Plus,
  Save,
  X,
} from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary-uploader";

type Item = Record<string, any>;

const empty = {
  title: "",
  summary: "",
  description: "",
  startAt: "",
  endAt: "",
  timezone: "Africa/Lagos",
  venue: "",
  mapUrl: "",
  agenda: "",
  dressCode: "",
  contactEmail: "",
  capacity: 0,
  allowGuests: false,
  maxGuests: 0,
  visibility: "members",
  status: "draft",
  featured: false,
  publishAt: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function local(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function validateEventPayload(body: {
  title: string;
  summary: string;
  description: string;
  startAt: string;
  endAt?: string;
  contactEmail?: string;
}) {
  if (body.title.trim().length < 5)
    return "Title must be at least 5 characters.";
  if (body.summary.trim().length < 10)
    return "Summary must be at least 10 characters.";
  if (body.description.trim().length < 20)
    return "Description must be at least 20 characters.";
  if (!body.startAt) return "Start date/time is required.";

  if (body.endAt) {
    const start = new Date(body.startAt);
    const end = new Date(body.endAt);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Start and end date/time must be valid.";
    }
    if (end < start) return "End time must be after start time.";
  }

  if (body.contactEmail && !isValidEmail(body.contactEmail)) {
    return "Contact email must be a valid email address.";
  }

  return null;
}

export default function EventAdmin() {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState<any>(null);
  const [error, setError] = useState("");

  async function load() {
    const r = await fetch("/api/admin/events");
    const d = await r.json();
    setItems(d.events || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const isEditing = Boolean(editing?._id);
    const f = new FormData(e.currentTarget);
    const body: any = {
      title: String(f.get("title") || ""),
      summary: String(f.get("summary") || ""),
      description: String(f.get("description") || ""),
      startAt: String(f.get("startAt") || ""),
      endAt: String(f.get("endAt") || "") || undefined,
      timezone: String(f.get("timezone") || "Africa/Lagos"),
      venue: String(f.get("venue") || ""),
      mapUrl: String(f.get("mapUrl") || ""),
      agenda: String(f.get("agenda") || ""),
      dressCode: String(f.get("dressCode") || ""),
      contactEmail: String(f.get("contactEmail") || ""),
      capacity: Number(f.get("capacity")) || 0,
      allowGuests: f.get("allowGuests") === "on",
      maxGuests: Number(f.get("maxGuests")) || 0,
      visibility: String(f.get("visibility") || "members"),
      status: String(f.get("status") || "draft"),
      featured: f.get("featured") === "on",
      publishAt: String(f.get("publishAt") || "") || undefined,
      coverImage: cover?.secureUrl || editing?.coverImage || "",
      coverImagePublicId: cover?.publicId || editing?.coverImagePublicId || "",
    };

    const validationError = validateEventPayload(body);
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    const r = await fetch(
      isEditing ? `/api/admin/events/${editing?._id}` : "/api/admin/events",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const d = await r.json();

    if (!r.ok) {
      setError(d.error);
    } else {
      setEditing(null);
      setCover(null);
      await load();
    }

    setSaving(false);
  }

  async function archive(id: string) {
    if (!confirm("Archive this event?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="media-page">
      <div className="media-container wide">
        <Link className="text-link" href="/admin">
          <ArrowLeft size={15} />
          Dashboard
        </Link>

        <div className="media-heading">
          <div>
            <span className="eyebrow">Gather the brothers</span>
            <h1>Events & RSVPs</h1>
            <p>
              Plan reunions and meetings, control attendance, and keep every
              response organised.
            </p>
          </div>
          <button className="btn btn-navy" onClick={() => setEditing({ ...empty })}>
            <Plus size={16} />
            New event
          </button>
        </div>

        <section className="card panel content-table">
          <div className="panel-head">
            <h3>Event library</h3>
            <span className="tag">
              <CalendarDays size={12} />
              {items.length} events
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spin" />
              Loading events...
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i._id}>
                      <td>
                        <b>{i.title}</b>
                        <br />
                        <small>{i.venue || i.visibility}</small>
                      </td>
                      <td>{new Date(i.startAt).toLocaleString()}</td>
                      <td>
                        <span className={`status ${i.status}`}>{i.status}</span>
                      </td>
                      <td>
                        {i.attendeeCount || 0}
                        {i.capacity ? ` / ${i.capacity}` : ""}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => setEditing(i)}>
                            <Edit3 />
                          </button>
                          <a
                            href={`/api/admin/events/${i._id}/attendees`}
                            title="Export attendance"
                          >
                            <Download />
                          </a>
                          <button onClick={() => archive(i._id)}>
                            <Archive />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {editing && (
          <div className="modal-backdrop">
            <form className="content-modal card" onSubmit={submit}>
              <div className="content-modal-head">
                <div>
                  <span className="eyebrow">
                    {editing._id ? "Edit event" : "New event"}
                  </span>
                  <h2>{editing._id ? editing.title : "Plan a gathering"}</h2>
                </div>
                <button type="button" onClick={() => setEditing(null)}>
                  <X />
                </button>
              </div>

              {error && <div className="form-alert error">{error}</div>}

              <div className="edit-form-grid">
                <F
                  label="Title"
                  name="title"
                  value={editing.title}
                  required
                  minLength={5}
                  maxLength={160}
                />
                <F label="Venue" name="venue" value={editing.venue} maxLength={200} />
                <A
                  label="Summary"
                  name="summary"
                  value={editing.summary}
                  wide
                  minLength={10}
                  maxLength={350}
                />
                <A
                  label="Full description"
                  name="description"
                  value={editing.description}
                  wide
                  large
                  minLength={20}
                  maxLength={30000}
                />
                <F
                  label="Starts"
                  name="startAt"
                  type="datetime-local"
                  value={local(editing.startAt)}
                  required
                />
                <F
                  label="Ends"
                  name="endAt"
                  type="datetime-local"
                  value={local(editing.endAt)}
                />
                <F label="Timezone" name="timezone" value={editing.timezone} />
                <F label="Map URL" name="mapUrl" value={editing.mapUrl} />
                <F
                  label="Dress code"
                  name="dressCode"
                  value={editing.dressCode}
                  maxLength={150}
                />
                <F
                  label="Contact email"
                  name="contactEmail"
                  type="email"
                  value={editing.contactEmail}
                />
                <F
                  label="Capacity (0 = unlimited)"
                  name="capacity"
                  type="number"
                  value={String(editing.capacity || 0)}
                />
                <F
                  label="Max guests per member"
                  name="maxGuests"
                  type="number"
                  value={String(editing.maxGuests || 0)}
                />
                <F
                  label="Visibility"
                  name="visibility"
                  select
                  value={editing.visibility}
                  options={["public", "members", "admins"]}
                />
                <F
                  label="Workflow status"
                  name="status"
                  select
                  value={editing.status}
                  options={[
                    "draft",
                    "review",
                    "scheduled",
                    "published",
                    "cancelled",
                    "completed",
                    "archived",
                  ]}
                />
                <F
                  label="Publish at"
                  name="publishAt"
                  type="datetime-local"
                  value={local(editing.publishAt)}
                />
                <A label="Agenda" name="agenda" value={editing.agenda} wide />
              </div>

              <div className="check-row">
                <label>
                  <input
                    type="checkbox"
                    name="allowGuests"
                    defaultChecked={editing.allowGuests}
                  />
                  Allow guests
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editing.featured}
                  />
                  Feature event
                </label>
              </div>

              <div className="content-upload">
                <h3>Event artwork</h3>
                {editing.coverImage && !cover && (
                  <img src={editing.coverImage} alt="Current artwork" />
                )}
                <CloudinaryUploader folder="announcements" onUploaded={setCover} />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn upload-remove"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-navy" disabled={saving}>
                  {saving ? <LoaderCircle className="spin" /> : <Save />}
                  {saving ? "Saving..." : "Save event"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function F({
  label,
  name,
  value,
  type = "text",
  required,
  select,
  options,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  value?: string;
  type?: string;
  required?: boolean;
  select?: boolean;
  options?: string[];
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      {select ? (
        <select className="select" name={name} defaultValue={value}>
          {options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          className="input"
          name={name}
          type={type}
          defaultValue={value || ""}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
        />
      )}
    </div>
  );
}

function A({
  label,
  name,
  value,
  wide,
  large,
  minLength,
  maxLength,
}: {
  label: string;
  name: string;
  value?: string;
  wide?: boolean;
  large?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <div className={`form-group ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      <textarea
        className={`input textarea ${large ? "content-body" : ""}`}
        name={name}
        defaultValue={value || ""}
        required={label !== "Agenda"}
        minLength={minLength}
        maxLength={maxLength}
      />
    </div>
  );
}
