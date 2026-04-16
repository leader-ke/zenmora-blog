import Link from "next/link";
import { loginAction } from "@/lib/actions";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="login-page">
      <div className="panel login-card">
        <div className="eyebrow">Zenmora Admin</div>
        <h2>Sign in to publish</h2>
        <p>Use the password from your local environment to manage categories, homepage copy, and blog posts.</p>
        {params?.error ? <div className="status-note">The password was not correct.</div> : null}
        <form action={loginAction} className="login-form">
          <label>
            Password
            <input type="password" name="password" required />
          </label>
          <button type="submit" className="primary-button">
            Sign in
          </button>
        </form>
        <Link href="/" className="secondary-button">
          Back to site
        </Link>
      </div>
    </main>
  );
}
