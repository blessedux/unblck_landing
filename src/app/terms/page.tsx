import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Builder Participation Agreement | Tellus Builder Hub & UNBLCK",
  description: "Terms and conditions for participation in Tellus Builder Hub and UNBLCK Accelerator",
};

export default function TermsPage() {
  const termsVersion = process.env.TERMS_VERSION || "2026-07-01";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="mb-2 text-4xl font-bold">Builder Participation Agreement</h1>
        <p className="mb-2 text-sm text-gray-400">Version: {termsVersion}</p>
        <p className="mb-8 text-sm text-gray-400">Status: Participation Agreement</p>

        <div className="mb-8 p-6 border border-gray-800 bg-white/5">
          <h3 className="text-lg font-semibold mb-3">About This Agreement</h3>
          <p className="text-gray-300 text-sm mb-3">
            This Builder Participation Agreement governs your participation in:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm ml-4">
            <li><strong>Tellus Builder Hub</strong> — The physical workspace and community in Santiago de Chile</li>
            <li><strong>UNBLCK Accelerator Program</strong> — The structured accelerator program for AI and blockchain startups</li>
          </ul>
          <p className="text-gray-300 text-sm mt-3">
            The Tellus Builder Hub is operated by Mente Maestra SpA on behalf of Tellus Cooperative Foundation.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">1. Purpose</h2>
            <p className="text-gray-300 mb-3">
              The Tellus Builder Hub exists to help builders learn, collaborate, create, and launch meaningful 
              projects within the Stellar ecosystem and the broader technology community.
            </p>
            <p className="text-gray-300 mb-3">
              This Agreement establishes the mutual expectations between the Builder Hub, UNBLCK Accelerator, 
              and every participant.
            </p>
            <p className="text-gray-300">
              Participation is voluntary. Membership is a privilege founded upon trust, professionalism, and mutual respect.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">2. Eligibility</h2>
            <p className="text-gray-300 mb-4">
              Participants may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Builders</li>
              <li>Developers</li>
              <li>Students</li>
              <li>Founders</li>
              <li>Designers</li>
              <li>Researchers</li>
              <li>Mentors</li>
              <li>Volunteers</li>
              <li>Community members</li>
              <li>Partners</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Applicants may be required to complete onboarding procedures before participating in certain programs, 
              including the UNBLCK Accelerator.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">3. Community Commitment</h2>
            <p className="text-gray-300 mb-4">
              By participating, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Act professionally</li>
              <li>Respect other participants</li>
              <li>Support an inclusive community</li>
              <li>Protect community trust</li>
              <li>Contribute constructively</li>
              <li>Follow Builder Hub policies</li>
              <li>Treat shared resources responsibly</li>
              <li>Help strengthen the Builder Journey</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You acknowledge that community health is a shared responsibility.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Governance Documents</h2>
            <p className="text-gray-300 mb-4">
              You agree to comply with the Builder Hub governance documents, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Community Standards & Code of Conduct</li>
              <li>Builder&apos;s Oath</li>
              <li>Applicable program handbooks</li>
              <li>Safety procedures</li>
              <li>Operational policies applicable to specific activities</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Updated versions of these documents shall apply following reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Participation Types</h2>
            <p className="text-gray-300 mb-4">
              Participation may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Meetups and community events</li>
              <li>Workshops and educational sessions</li>
              <li>Hackathons</li>
              <li>Office Hours</li>
              <li>Coworking at Tellus Builder Hub</li>
              <li>UNBLCK Accelerator Program</li>
              <li>Mentorship programs</li>
              <li>Founder reviews</li>
              <li>Community discussions</li>
              <li>Partner activities</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Participation does not create employment, partnership, equity ownership, agency, or membership 
              rights within Tellus Foundation, Mente Maestra SpA, or the Stellar Development Foundation.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">6. Hub Access & Booking System</h2>
            <p className="text-gray-300 mb-4">
              <strong>Tellus Builder Hub</strong> members receive workspace access according to their membership tier:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li><strong>Ambassador Members:</strong> 3 booking credits per week (Monday-Sunday)</li>
              <li><strong>Stellar-Funded Members:</strong> Unlimited access</li>
            </ul>
            <p className="text-gray-300 mt-4 mb-4">
              All bookings are subject to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>24-hour advance booking requirement</li>
              <li>Hub operational schedule</li>
              <li>Space availability</li>
            </ul>
            <p className="text-gray-300 mt-4">
              <strong>UNBLCK Accelerator</strong> participants may receive different access terms as defined in their program materials.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Builder Journey Records</h2>
            <p className="text-gray-300 mb-4">
              The Builder Hub may maintain records relating to your Builder Journey, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Programs attended</li>
              <li>Skills and interests</li>
              <li>Mentorship participation</li>
              <li>Founder progression</li>
              <li>Community participation</li>
              <li>Funding readiness</li>
            </ul>
            <p className="text-gray-300 mt-4">
              The purpose of these records is to improve participant support and institutional learning.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Privacy & Data Processing</h2>
            <p className="text-gray-300 mb-3">
              You acknowledge that Builder Hub activities require the collection and processing of certain personal information.
            </p>
            <p className="text-gray-300 mb-3">
              Such processing shall occur in accordance with the Builder Hub Privacy Policy and applicable law.
            </p>
            <p className="text-gray-300">
              You may request access to or correction of your personal information in accordance with those policies.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">9. Stellar Passport</h2>
            <p className="text-gray-300">
              Participants are required to provide a valid Stellar Passport username. This is used for identity 
              verification and to enable participation in the Stellar ecosystem programs offered through the 
              Builder Hub and UNBLCK.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">10. Photography, Video & Media</h2>
            <p className="text-gray-300 mb-3">
              The Builder Hub regularly documents its activities through photography, video, audio recordings, 
              livestreams, interviews, and written stories.
            </p>
            <p className="text-gray-300 mb-3">
              Unless you communicate a reasonable objection before or during an event, you grant permission for 
              the Builder Hub, Tellus Foundation, and their authorized partners to use photographs, recordings, 
              and related media depicting you for educational, community, reporting, archival, and promotional purposes.
            </p>
            <p className="text-gray-300 mb-3">
              You may request not to be featured in close-up interviews or individually identifiable promotional 
              materials, and the Builder Hub will make reasonable efforts to respect such requests where practical.
            </p>
            <p className="text-gray-300">
              Nothing in this section transfers ownership of your own intellectual property.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">11. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              You retain ownership of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Your software</li>
              <li>Your startups</li>
              <li>Your inventions</li>
              <li>Your repositories</li>
              <li>Your presentations</li>
              <li>Your research</li>
              <li>Your brands</li>
              <li>Your creative works</li>
            </ul>
            <p className="text-gray-300 mt-4 mb-3">
              Participation in Builder Hub activities or UNBLCK Accelerator does not transfer ownership of 
              participant-created intellectual property unless separately agreed in writing.
            </p>
            <p className="text-gray-300">
              Builder Hub educational materials, operational documentation, UNBLCK curriculum, and institutional 
              resources remain the property of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">12. Confidentiality</h2>
            <p className="text-gray-300 mb-4">
              You should respect confidential information shared during:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Founder reviews</li>
              <li>Mentorship sessions</li>
              <li>Office Hours</li>
              <li>Private workshops</li>
              <li>Investor meetings</li>
              <li>Internal discussions</li>
            </ul>
            <p className="text-gray-300 mt-4">
              You agree not to intentionally disclose confidential information received through Builder Hub 
              activities without appropriate authorization.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">13. Assumption of Risks</h2>
            <p className="text-gray-300 mb-3">
              You understand that participation in community events, coworking activities, workshops, hackathons, 
              and similar programs involves ordinary risks associated with attending professional gatherings.
            </p>
            <p className="text-gray-300 mb-3">
              You agree to exercise reasonable care for your own safety and personal property.
            </p>
            <p className="text-gray-300">
              Nothing in this Agreement limits liability for matters that cannot legally be limited under applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">14. Code of Conduct</h2>
            <p className="text-gray-300 mb-4">
              You acknowledge having read, or having had the opportunity to read, the Community Standards & Code of Conduct.
            </p>
            <p className="text-gray-300 mb-4">
              Failure to comply may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Coaching</li>
              <li>Warnings</li>
              <li>Temporary suspension</li>
              <li>Removal from specific programs</li>
              <li>Permanent removal from Builder Hub activities where appropriate</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Actions shall follow applicable governance procedures.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">15. No Guarantees</h2>
            <p className="text-gray-300 mb-4">
              Participation does not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Grant funding</li>
              <li>Selection for UNBLCK Accelerator</li>
              <li>Admission to specialized programs</li>
              <li>Investment</li>
              <li>Employment</li>
              <li>Mentorship assignments</li>
              <li>Speaking opportunities</li>
              <li>Partnerships</li>
            </ul>
            <p className="text-gray-300 mt-4">
              The Builder Hub and UNBLCK seek to create opportunities but cannot guarantee outcomes.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">16. Limitation of Liability</h2>
            <p className="text-gray-300 mb-3">
              To the extent permitted by applicable law, the Builder Hub, Tellus Foundation, Mente Maestra SpA, 
              UNBLCK, volunteers, mentors, sponsors, and organizers shall not be liable for indirect, incidental, 
              or consequential losses arising solely from participation in ordinary Builder Hub activities.
            </p>
            <p className="text-gray-300">
              This limitation does not apply to liability that cannot legally be excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">17. Suspension or Removal</h2>
            <p className="text-gray-300 mb-4">
              The Builder Hub and UNBLCK reserve the right to suspend or terminate participation where necessary to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>Protect participant safety</li>
              <li>Protect institutional integrity</li>
              <li>Enforce the Code of Conduct</li>
              <li>Comply with legal obligations</li>
              <li>Preserve the Builder Journey for the broader community</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Whenever reasonably possible, decisions shall follow documented governance procedures.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">18. Changes to this Agreement</h2>
            <p className="text-gray-300 mb-3">
              The Builder Hub may update this Agreement from time to time.
            </p>
            <p className="text-gray-300">
              Material changes affecting participant rights or obligations shall be communicated through reasonable 
              notice before taking effect for ongoing participants.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">19. Governing Law</h2>
            <p className="text-gray-300 mb-3">
              This Agreement shall be interpreted in accordance with the laws of Chile.
            </p>
            <p className="text-gray-300">
              Any disputes shall first be addressed through good-faith discussion before formal legal proceedings, 
              unless immediate legal action is required.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">20. Entire Agreement</h2>
            <p className="text-gray-300 mb-3">
              This Agreement, together with the governance documents it incorporates by reference, constitutes 
              the understanding between you and the Builder Hub regarding participation.
            </p>
            <p className="text-gray-300">
              Nothing in this Agreement limits any rights granted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">21. Participant Acknowledgement</h2>
            <p className="text-gray-300 mb-4">
              By accepting these terms, you acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>You understand the purpose of the Tellus Builder Hub and UNBLCK Accelerator</li>
              <li>You agree to follow the Community Standards & Code of Conduct</li>
              <li>You understand how your participation data may be used to support the Builder Journey</li>
              <li>You understand that you retain ownership of your own intellectual property unless you separately agree otherwise</li>
              <li>You understand that participation does not guarantee grants, investment, employment, or admission to future programs</li>
              <li>You voluntarily choose to participate in the Builder Hub community and UNBLCK programs</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">22. Contact</h2>
            <p className="text-gray-300">
              For questions about these terms, contact us at{" "}
              <a
                href="mailto:hub@tellus.foundation"
                className="text-white hover:underline"
              >
                hub@tellus.foundation
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Version: {termsVersion}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Tellus Builder Hub · Operated by Mente Maestra SpA on behalf of Tellus Cooperative Foundation
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Santiago, Chile
          </p>
        </div>
      </div>
    </div>
  );
}
