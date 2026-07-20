"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  LoaderCircle,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import PageShell from "@/components/page-shell";

type Member = {
  id: string;
  fullName: string;
  nickname?: string;
  profileImage?: string;
  occupation?: string;
  city?: string;
  country?: string;
  memorial?: boolean;
};

type Pagination = {
  page: number;
  pages: number;
  total: number;
};

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function load(page = 1, q = query) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set("q", q);

    const response = await fetch(`/api/members?${params}`);
    const data = await response.json();

    setMembers(data.members || []);
    setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function search(e: FormEvent) {
    e.preventDefault();
    load(1);
  }

  return (
    <PageShell
      eyebrow="The brotherhood"
      title="Member directory"
      description="Find old friends, discover new paths, and stay connected with verified members of the Mount Saint Gabriel's Class of 2012."
    >
      <section className="section">
        <div className="container">
          <form className="filters" onSubmit={search}>
            <div className="search">
              <Search size={18} />
              <input
                className="input"
                placeholder="Search name, nickname, profession or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-navy">Search</button>
          </form>

          <div className="directory-summary">
            <p>
              <Users size={14} /> {pagination.total} verified brothers
            </p>
            <Link className="btn upload-remove compact" href="/profile">
              View my profile
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spin" />
              Searching the directory...
            </div>
          ) : members.length ? (
            <>
              <div className="directory-grid">
                {members.map((m) => (
                  <Link
                    href={`/members/${m.id}`}
                    className="card directory-card real"
                    key={m.id}
                  >
                    <div className="avatar">
                      {m.profileImage ? (
                        <img src={m.profileImage} alt="" />
                      ) : (
                        <span>
                          {m.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>
                    <div className="directory-copy">
                      <h3>
                        {m.fullName}
                        {m.memorial ? " -b7 In memoriam" : ""}
                      </h3>
                      <p>{m.occupation || "Profession not added"}</p>
                      <div className="meta">
                        <span>
                          <MapPin size={13} />
                          {[m.city, m.country].filter(Boolean).join(", ") ||
                            "Location not added"}
                        </span>
                        <span>
                          <Globe2 size={13} /> 2012
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pagination">
                <button
                  className="btn btn-light"
                  disabled={pagination.page <= 1}
                  onClick={() => load(pagination.page - 1)}
                >
                  <ChevronLeft size={15} /> Prev
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-light"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => load(pagination.page + 1)}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state compact-empty">
              <Users />
              <h3>No matching members found</h3>
              <p>Try a different name, nickname, profession or location.</p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
