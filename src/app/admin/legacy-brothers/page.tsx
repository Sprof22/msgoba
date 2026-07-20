"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import CloudinaryUploader from "@/components/cloudinary-uploader";

type LegacyBrother = {
  _id: string;
  name: string;
  role: string;
  place: string;
  photo?: string;
  photoPublicId?: string;
  order: number;
  active: boolean;
  updatedAt: string;
};

type EditorState = {
  _id?: string;
  name: string;
  role: string;
  place: string;
  photo?: string;
  photoPublicId?: string;
  order: number;
  active: boolean;
};

const emptyEditor: EditorState = {
  name: "",
  role: "",
  place: "",
  order: 0,
  active: true,
};

export default function LegacyBrothersAdminPage() {
  const [items, setItems] = useState<LegacyBrother[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditorState | null>(null);
  const [cover, setCover] = useState<{
    secureUrl: string;
    publicId: string;
  } | null>(null);

  async function load() {
    const response = await fetch("/api/admin/legacy-brothers");
    const data = await response.json();
    setItems(data.brothers || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openEditor(item?: LegacyBrother) {
    setError("");
    setCover(null);
    if (!item) {
      setEditing({ ...emptyEditor });
      return;
    }

    setEditing({
      _id: item._id,
      name: item.name,
      role: item.role,
      place: item.place,
      photo: item.photo,
      photoPublicId: item.photoPublicId,
      order: item.order,
      active: item.active,
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    setSaving(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      role: String(form.get("role") || ""),
      place: String(form.get("place") || ""),
      order: Number(form.get("order") || 0),
      active: form.get("active") === "on",
      photo: cover?.secureUrl || editing.photo || "",
      photoPublicId: cover?.publicId || editing.photoPublicId || "",
    };

    const url = editing._id
      ? `/api/admin/legacy-brothers/${editing._id}`
      : "/api/admin/legacy-brothers";
    const method = editing._id ? "PATCH" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not save this profile.");
      setSaving(false);
      return;
    }

    setEditing(null);
    setCover(null);
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this legacy profile?")) return;
    await fetch(`/api/admin/legacy-brothers/${id}`, { method: "DELETE" });
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
            <span className="eyebrow">Homepage curation</span>
            <h1>Legacy brothers section</h1>
            <p>
              Create and maintain the members shown in the "Meet the brothers
              behind the legacy" section on the homepage.
            </p>
          </div>
          <button className="btn btn-navy" onClick={() => openEditor()}>
            <Plus size={16} />
            Add profile
          </button>
        </div>

        <section className="card panel content-table">
          <div className="panel-head">
            <h3>Curated profiles</h3>
            <span className="tag">
              <UserRound size={12} />
              {items.length} profiles
            </span>
          </div>

          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spin" />
              Loading profiles...
            </div>
          ) : (
            <div className="table-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <b>{item.name}</b>
                      </td>
                      <td>{item.role}</td>
                      <td>{item.place}</td>
                      <td>{item.order}</td>
                      <td>
                        <span className={`status ${item.active ? "published" : "draft"}`}>
                          {item.active ? "active" : "hidden"}
                        </span>
                      </td>
                      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => openEditor(item)}>
                            <Edit3 />
                          </button>
                          <button onClick={() => remove(item._id)}>
                            <Trash2 />
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
            <form className="content-modal card" onSubmit={onSubmit}>
              <div className="content-modal-head">
                <div>
                  <span className="eyebrow">
                    {editing._id ? "Edit profile" : "New profile"}
                  </span>
                  <h2>
                    {editing._id
                      ? `Update ${editing.name}`
                      : "Create legacy profile"}
                  </h2>
                </div>
                <button type="button" onClick={() => setEditing(null)}>
                  <X />
                </button>
              </div>

              {error && <div className="form-alert error">{error}</div>}

              <div className="edit-form-grid">
                <Field label="Full name" name="name" value={editing.name} />
                <Field label="Role / title" name="role" value={editing.role} />
                <Field label="Location" name="place" value={editing.place} />
                <Field
                  label="Display order"
                  name="order"
                  type="number"
                  min={0}
                  max={999}
                  value={String(editing.order)}
                />
              </div>

              <div className="check-row">
                <label>
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editing.active}
                  />
                  Show on homepage
                </label>
              </div>

              <div className="content-upload">
                <h3>Profile photo</h3>
                {editing.photo && !cover && (
                  <div className="current-content-cover">
                    <img src={editing.photo} alt="Current profile" />
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          photo: "",
                          photoPublicId: "",
                        })
                      }
                    >
                      Remove photo
                    </button>
                  </div>
                )}
                <CloudinaryUploader folder="legacy" onUploaded={setCover} />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-navy" disabled={saving}>
                  {saving ? (
                    <>
                      <LoaderCircle className="spin" size={14} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Save profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  min,
  max,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="input"
        type={type}
        name={name}
        min={min}
        max={max}
        defaultValue={value}
        required
      />
    </div>
  );
}
