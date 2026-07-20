"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import SiteHeader from "@/components/site-header";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const f = new FormData(e.currentTarget);
    if (f.get("password") !== f.get("confirm")) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          nickname: f.get("nickname"),
          email: f.get("email"),
          password: f.get("password"),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSuccess(data.message);
      setDevUrl(data.developmentUrl || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <section className="auth-visual">
          <div>
            <span className="eyebrow">The story continues</span>
            <h1>Take your place in our living yearbook.</h1>
            <p>
              Every profile adds another chapter to the story we started
              together in Makurdi. Membership requests are checked against the
              official Class of 2012 list.
            </p>
          </div>
        </section>

        <section className="auth-form-wrap">
          <form className="auth-box" onSubmit={submit}>
            <span className="eyebrow">Join the community</span>
            <h2>Request membership</h2>
            <p>Tell us how we knew you at the Mount.</p>

            {error && (
              <div className="form-alert error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="form-alert success">
                <CheckCircle2 size={17} />
                <span>
                  {success}
                  {devUrl && (
                    <a href={devUrl}>
                      Open development verification link <ExternalLink size={13} />
                    </a>
                  )}
                </span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                className="input"
                id="name"
                name="name"
                required
                minLength={3}
                autoComplete="name"
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nickname">
                School nickname <span style={{ fontWeight: 500 }}>(optional)</span>
              </label>
              <input
                className="input"
                id="nickname"
                name="nickname"
                autoComplete="off"
                placeholder="What the guys called you"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="two-col">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: 0,
                      background: "transparent",
                      color: "#637083",
                      padding: 0,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Confirm</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input"
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    required
                    minLength={10}
                    autoComplete="new-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"}
                    onClick={() => setShowConfirm((value) => !value)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: 0,
                      background: "transparent",
                      color: "#637083",
                      padding: 0,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            </div>

            <small className="password-tip">
              Use at least 10 characters with uppercase, lowercase and a number.
            </small>

            <button className="btn btn-navy auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={16} />
                  Submitting...
                </>
              ) : (
                <>
                  Submit membership request <ArrowRight size={16} />
                </>
              )}
            </button>

            <small className="auth-foot">
              Already verified? <Link href="/login">Sign in</Link>
            </small>
          </form>
        </section>
      </main>
    </>
  );
}
