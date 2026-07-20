"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  Edit3,
  Eye,
  LoaderCircle,
  Megaphone,
  Plus,
  Paperclip,
  Save,
  Trash2,
  X,
} from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary-uploader";
import CloudinaryAttachmentUploader, { type UploadedAttachment } from "@/components/cloudinary-attachment-uploader";
type Item = {
  _id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  audience: string;
  status: string;
  featured: boolean;
  pinned: boolean;
  coverImage?: string;
  coverImagePublicId?: string;
  attachments?: UploadedAttachment[];
  publishAt?: string;
  expiresAt?: string;
  updatedAt: string;
};
const empty = {
  title: "",
  summary: "",
  body: "",
  category: "general",
  audience: "members",
  status: "draft",
  featured: false,
  pinned: false,
  publishAt: "",
  expiresAt: "",
};
export default function AnnouncementAdmin() {
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<Item[]>([]),
    [editing, setEditing] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [cover, setCover] = useState<any>(null),
    [error, setError] = useState(""),
    [preview, setPreview] = useState<any>(null),
    [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  function openEditor(item: any) {
    setCover(null);
    setPreview(null);
    setError("");
    setAttachments(item.attachments || []);
    setEditing(item);
  }
  function showPreview() {
    if (!formRef.current) return;
    const form = new FormData(formRef.current);
    setPreview({
      title: form.get("title"),
      summary: form.get("summary"),
      body: form.get("body"),
      category: form.get("category"),
      audience: form.get("audience"),
      coverImage: cover?.secureUrl || editing?.coverImage || "",
    });
  }
  async function load() {
    const r = await fetch("/api/admin/announcements"),
      d = await r.json();
    setItems(d.announcements || []);
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
    const f = new FormData(e.currentTarget),
      body = {
        title: f.get("title"),
        summary: f.get("summary"),
        body: f.get("body"),
        category: f.get("category"),
        audience: f.get("audience"),
        status: f.get("status"),
        featured: f.get("featured") === "on",
        pinned: f.get("pinned") === "on",
        coverImage: cover?.secureUrl || editing?.coverImage || "",
        coverImagePublicId:
          cover?.publicId || editing?.coverImagePublicId || "",
        publishAt: f.get("publishAt") || undefined,
        expiresAt: f.get("expiresAt") || undefined,
        attachments,
      },
      url = isEditing
        ? `/api/admin/announcements/${editing._id}`
        : "/api/admin/announcements",
      r = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
      d = await r.json();
    if (!r.ok) setError(d.error);
    else {
      setEditing(null);
      setCover(null);
      setAttachments([]);
      await load();
    }
    setSaving(false);
  }
  async function archive(id: string) {
    if (!confirm("Archive this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
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
            <span className="eyebrow">Editorial desk</span>
            <h1>Announcements</h1>
            <p>
              Create trusted updates, control their audience, and schedule
              publication across the platform.
            </p>
          </div>
          <button
            className="btn btn-navy"
            onClick={() => openEditor({ ...empty })}
          >
            <Plus size={16} />
            New announcement
          </button>
        </div>
        <section className="card panel content-table">
          <div className="panel-head">
            <h3>Content library</h3>
            <span className="tag">
              <Megaphone size={12} />
              {items.length} items
            </span>
          </div>
          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spin" />
              Loading content…
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Audience</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i._id}>
                      <td>
                        <b>{i.title}</b>
                        <br />
                        <small>
                          {i.category}
                          {i.featured ? " · Featured" : ""}
                        </small>
                      </td>
                      <td>{i.audience}</td>
                      <td>
                        <span className={`status ${i.status}`}>{i.status}</span>
                      </td>
                      <td>{new Date(i.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => openEditor(i)}>
                            <Edit3 />
                          </button>
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
            <form ref={formRef} className="content-modal card" onSubmit={submit}>
              <div className="content-modal-head">
                <div>
                  <span className="eyebrow">
                    {editing._id ? "Edit announcement" : "New announcement"}
                  </span>
                  <h2>{editing._id ? editing.title : "Create an update"}</h2>
                </div>
                <button type="button" onClick={() => setEditing(null)}>
                  <X />
                </button>
              </div>
              {error && <div className="form-alert error">{error}</div>}
              {preview && (
                <div className="editor-preview">
                  <div className="editor-preview-head">
                    <span className="tag">Preview · {preview.category}</span>
                    <button type="button" onClick={() => setPreview(null)}><X size={15} /></button>
                  </div>
                  {preview.coverImage && <img src={preview.coverImage} alt="Announcement preview" />}
                  <h2>{String(preview.title || "Untitled announcement")}</h2>
                  <p className="article-lead">{String(preview.summary || "Add a summary to preview it here.")}</p>
                  <div className="article-body">{String(preview.body || "Add announcement content to preview it here.").split(/\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                </div>
              )}
              <div className="edit-form-grid">
                <Field
                  label="Title"
                  name="title"
                  value={editing.title}
                  required
                />
                <Field
                  label="Category"
                  name="category"
                  select
                  value={editing.category}
                  options={[
                    "general",
                    "welfare",
                    "reunion",
                    "executive",
                    "community",
                    "business",
                    "memorial",
                  ]}
                />
                <Area
                  label="Summary"
                  name="summary"
                  value={editing.summary}
                  wide
                />
                <Area
                  label="Body"
                  name="body"
                  value={editing.body}
                  wide
                  large
                />
                <Field
                  label="Audience"
                  name="audience"
                  select
                  value={editing.audience}
                  options={["public", "members", "admins"]}
                />
                <Field
                  label="Workflow status"
                  name="status"
                  select
                  value={editing.status}
                  options={[
                    "draft",
                    "review",
                    "scheduled",
                    "published",
                    "archived",
                  ]}
                />
                <Field
                  label="Publish at"
                  name="publishAt"
                  type="datetime-local"
                  value={localDate(editing.publishAt)}
                />
                <Field
                  label="Expires at"
                  name="expiresAt"
                  type="datetime-local"
                  value={localDate(editing.expiresAt)}
                />
              </div>
              <div className="check-row">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editing.featured}
                  />
                  Feature this announcement
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="pinned"
                    defaultChecked={editing.pinned}
                  />
                  Pin above others
                </label>
              </div>
              <div className="content-upload">
                <h3>Cover image</h3>
                {editing.coverImage && !cover && (
                  <div className="current-content-cover"><img src={editing.coverImage} alt="Current cover" /><button type="button" onClick={() => setEditing({ ...editing, coverImage: "", coverImagePublicId: "" })}>Remove cover</button></div>
                )}
                <CloudinaryUploader
                  folder="announcements"
                  onUploaded={setCover}
                />
              </div>
              <div className="content-attachments">
                <div><h3>Attachments</h3><p>Optional supporting PDF or office documents. Maximum 15 MB each.</p></div>
                {attachments.length > 0 && <div className="attachment-list">{attachments.map((attachment, index) => <div key={attachment.publicId}><Paperclip size={14} /><span><b>{attachment.name}</b><small>{attachment.format.toUpperCase()} · {(attachment.bytes / 1024 / 1024).toFixed(2)} MB</small></span><button type="button" aria-label={`Remove ${attachment.name}`} onClick={() => setAttachments(items => items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button></div>)}</div>}
                <CloudinaryAttachmentUploader onUploaded={(asset) => setAttachments(items => items.length < 8 ? [...items, asset] : items)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn upload-remove" onClick={showPreview}><Eye size={15} />Preview</button>
                <button
                  type="button"
                  className="btn upload-remove"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-navy" disabled={saving}>
                  {saving ? <LoaderCircle className="spin" /> : <Save />}
                  {saving ? "Saving…" : "Save announcement"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
function localDate(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
function Field({
  label,
  name,
  value,
  required,
  select,
  options,
  type = "text",
}: {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  select?: boolean;
  options?: string[];
  type?: string;
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
        />
      )}
    </div>
  );
}
function Area({
  label,
  name,
  value,
  wide,
  large,
}: {
  label: string;
  name: string;
  value?: string;
  wide?: boolean;
  large?: boolean;
}) {
  return (
    <div className={`form-group ${wide ? "wide" : ""}`}>
      <label>{label}</label>
      <textarea
        className={`input textarea ${large ? "content-body" : ""}`}
        name={name}
        defaultValue={value || ""}
        required
      />
    </div>
  );
}
