export const metadata = {
  title: 'Privacy Policy — xparse',
  description: 'How xparse collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="text-sm text-slate-500">Last updated: April 2026</p>

        <p>
          xparse (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the xparse.ai document
          parsing platform. This Privacy Policy explains what information we collect, why we collect
          it, and how we use and protect it. By using xparse, you agree to the terms described here.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>
          When you create an account, we collect your email address and, if you sign in via Google,
          your public Google profile information (name and profile picture). We do not collect or
          store passwords — authentication is handled by our identity provider.
        </p>

        <h3>Documents You Upload</h3>
        <p>
          Files you upload for parsing are processed in real time by our parsing engine. We temporarily
          store uploaded files and their parsed outputs (Markdown, structured JSON) in our secure
          infrastructure to display results to you and to maintain your parsing history. We do not
          read, sell, or share the contents of your documents with third parties.
        </p>

        <h3>Usage Data</h3>
        <p>
          We collect standard server logs including IP addresses, request timestamps, file types, and
          file sizes. This data is used solely for security monitoring, abuse prevention, and improving
          service performance.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and operate the xparse document parsing service</li>
          <li>To maintain your parsing history and account activity</li>
          <li>To detect and prevent fraud, abuse, or unauthorized access</li>
          <li>To communicate service updates or important account notices</li>
          <li>To improve our parsing algorithms and service quality</li>
        </ul>

        <h2>3. Data Storage &amp; Security</h2>
        <p>
          Your data is stored on servers located in secure, SOC 2-compliant data centers. We use
          industry-standard encryption (TLS in transit, AES-256 at rest) to protect your information.
          Uploaded documents and parsed results are retained in your account history until you choose
          to delete them. Anonymous (non-logged-in) parse jobs are not retained beyond the active session.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          xparse uses the following third-party services to operate:
        </p>
        <ul>
          <li><strong>TextIn (Intsig)</strong> — our AI document parsing engine. Files are sent to
          their API for processing. TextIn&apos;s own privacy policy governs their data handling.</li>
          <li><strong>Supabase</strong> — database and authentication infrastructure.</li>
          <li><strong>Cloudflare</strong> — CDN, DDoS protection, and edge caching.</li>
          <li><strong>Google OAuth</strong> — optional sign-in method.</li>
        </ul>
        <p>We do not sell your data to any third party.</p>

        <h2>5. Cookies</h2>
        <p>
          We use strictly necessary cookies for session management and authentication. We do not use
          advertising cookies or third-party tracking cookies.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may request deletion of your account and all associated data at any time by contacting us
          at <a href="mailto:support@xparse.ai">support@xparse.ai</a>. We will process your request
          within 30 days.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify registered users of
          material changes via email. Continued use of xparse after changes constitutes acceptance
          of the updated policy.
        </p>

        <h2>8. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:support@xparse.ai">support@xparse.ai</a>.
        </p>
      </div>
    </main>
  );
}
