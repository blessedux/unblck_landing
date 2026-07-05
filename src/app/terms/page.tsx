import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | UNBLCK",
  description: "Terms and conditions for UNBLCK Hub membership",
};

export default function TermsPage() {
  const termsVersion = process.env.TERMS_VERSION || "2026-07-01";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-4 text-4xl font-bold">Terms & Conditions</h1>
        <p className="mb-8 text-sm text-gray-400">
          Version: {termsVersion}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By applying to UNBLCK Hub, you agree to these terms and conditions.
              Your access to the hub and its facilities is contingent upon your
              acceptance and compliance with these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Membership Access</h2>
            <p className="text-gray-300 mb-4">
              UNBLCK Hub membership provides access to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Coworking space during operational hours</li>
              <li>Community events and networking opportunities</li>
              <li>Mentorship programs (subject to availability)</li>
              <li>Funding opportunities (subject to eligibility)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Booking System</h2>
            <p className="text-gray-300 mb-4">
              Ambassador members receive 3 booking credits per week (Monday-Sunday).
              Stellar-funded members receive unlimited access. All bookings are
              subject to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>24-hour advance booking requirement</li>
              <li>Hub operational schedule</li>
              <li>Space availability</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Stellar Passport</h2>
            <p className="text-gray-300">
              Members are required to provide a valid Stellar Passport Builder
              account address. This is used for identity verification and to
              enable participation in the Stellar ecosystem programs offered
              through UNBLCK.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Code of Conduct</h2>
            <p className="text-gray-300 mb-4">
              Members agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Respect fellow members and staff</li>
              <li>Maintain a professional environment</li>
              <li>Follow hub rules and policies</li>
              <li>Report any issues or concerns promptly</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Privacy & Data</h2>
            <p className="text-gray-300">
              We collect and process personal information as described in our
              Privacy Policy. By accepting these terms, you consent to such
              processing and warrant that all data provided is accurate.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Termination</h2>
            <p className="text-gray-300">
              UNBLCK reserves the right to terminate or suspend membership at any
              time for violation of these terms, non-payment, or other reasonable
              cause. Members may terminate their membership by providing written
              notice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Liability</h2>
            <p className="text-gray-300">
              UNBLCK is not liable for any loss, damage, or injury occurring on
              the premises or in connection with membership activities. Members
              use facilities at their own risk.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Modifications</h2>
            <p className="text-gray-300">
              UNBLCK may modify these terms at any time. Members will be notified
              of material changes and continued use constitutes acceptance of
              modified terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Contact</h2>
            <p className="text-gray-300">
              For questions about these terms, contact us at{" "}
              <a
                href="mailto:hub@unblck.com"
                className="text-white hover:underline"
              >
                hub@unblck.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Last updated: {termsVersion}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            UNBLCK · Santiago, Chile
          </p>
        </div>
      </div>
    </div>
  );
}
