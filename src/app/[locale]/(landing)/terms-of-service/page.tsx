export const metadata = {
  title: 'Terms of Service — xparse',
  description: 'Terms and conditions for using the xparse document parsing platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: April 2026</p>

        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of xparse.ai
          (the &quot;Service&quot;), operated by xparse. By creating an account or using the Service,
          you agree to be bound by these Terms.
        </p>

        <h2>1. Description of Service</h2>
        <p>
          xparse is an AI-powered document processing platform that converts PDFs, images, and office
          documents into structured Markdown and JSON output suitable for use with large language models
          (LLMs) and data pipelines. The Service is provided via our web application and API.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use xparse. By using the Service, you represent that
          you meet this requirement and that all information you provide is accurate and complete.
        </p>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to use xparse to:</p>
        <ul>
          <li>Upload or process documents containing illegal content</li>
          <li>Violate any third party&apos;s intellectual property rights or privacy</li>
          <li>Attempt to reverse-engineer, scrape, or overload our infrastructure</li>
          <li>Use automated scripts to abuse the free tier beyond fair use</li>
          <li>Resell or sublicense access to the Service without written permission</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these rules at our
          sole discretion.
        </p>

        <h2>4. Your Content</h2>
        <p>
          You retain full ownership of all documents you upload to xparse. By uploading a document,
          you grant xparse a limited, non-exclusive license to process it solely for the purpose of
          providing the Service to you. We do not claim ownership of your content and do not use it
          to train our models.
        </p>

        <h2>5. Free &amp; Paid Plans</h2>
        <p>
          xparse offers a free tier with usage subject to fair-use limits. Paid plans provide higher
          limits and additional features. Pricing is displayed on our Pricing page and is subject to
          change with 30 days&apos; notice to existing subscribers. All fees are non-refundable unless
          required by applicable law.
        </p>

        <h2>6. Service Availability</h2>
        <p>
          We aim for high availability but do not guarantee uninterrupted access. We may perform
          maintenance, updates, or modifications at any time. xparse is not liable for any losses
          resulting from downtime or service interruptions.
        </p>

        <h2>7. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. XPARSE MAKES NO
          WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. PARSED OUTPUT ACCURACY IS NOT
          GUARANTEED AND SHOULD BE REVIEWED BEFORE USE IN PRODUCTION SYSTEMS.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, XPARSE SHALL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, REVENUE,
          OR PROFITS, ARISING OUT OF YOUR USE OF THE SERVICE.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may update these Terms at any time. Material changes will be communicated via email to
          registered users at least 14 days before taking effect. Continued use of the Service
          constitutes acceptance of the revised Terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms are governed by applicable laws. Any disputes shall be resolved through
          good-faith negotiation, and if unresolved, through binding arbitration.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, please contact us at{' '}
          <a href="mailto:support@xparse.ai">support@xparse.ai</a>.
        </p>
      </div>
    </main>
  );
}
