import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                By accessing and using the Zenith Student Marketplace website, you agree to comply with and be bound by
                the following Terms of Service. Zenith is a student-focused platform designed for the exchange of study
                materials and academic services. Users must be current or former students of a South African tertiary
                institution and must provide accurate and verifiable information during registration. All transactions
                conducted on the platform must involve legal, educational-related products or services.
              </p>

              <p className="mb-4">
                Zenith provides a secure environment through features such as escrow payment protection, two-factor
                authentication, and identity verification, but is not liable for disputes arising from misrepresentation
                or failed transactions between users. Users are responsible for the content they upload and must not
                post illegal, offensive, or harmful materials. We reserve the right to suspend or terminate accounts
                that violate these terms.
              </p>

              <p className="mb-4">
                Use of Zenith implies consent to data collection for service optimization, in accordance with our{" "}
                <Link href="/privacy" className="text-purple-700 hover:underline">
                  Privacy Policy
                </Link>
                . Continued use of the platform constitutes acceptance of any updates or changes to these terms.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Detailed Terms</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. User Eligibility</h3>
                <p className="text-muted-foreground">
                  To use Zenith Student Marketplace, you must be at least 18 years old and a current or former student
                  of a recognized South African tertiary institution. We may require verification of your student
                  status.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">2. Account Responsibility</h3>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. Notify us immediately of any unauthorized use.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3. Acceptable Use</h3>
                <p className="text-muted-foreground">
                  You may only use Zenith for lawful purposes related to educational materials and services. Prohibited
                  activities include selling illegal items, copyright infringement, and any form of harassment.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Listing and Transaction Policies</h3>
                <p className="text-muted-foreground">
                  All listings must accurately represent the item or service being offered. Zenith facilitates
                  transactions but is not a party to any transaction between users.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5. Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  In case of disputes between users, Zenith will provide reasonable assistance but cannot guarantee
                  resolution. We encourage users to resolve disputes amicably.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">6. Termination</h3>
                <p className="text-muted-foreground">
                  Zenith reserves the right to suspend or terminate accounts that violate these terms or engage in
                  fraudulent activity, at our sole discretion and without prior notice.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">7. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We may modify these terms at any time. Continued use of Zenith after changes constitutes acceptance of
                  the updated terms.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> support@zenithmarketplace.co.za
            </p>
            <p className="text-muted-foreground">
              <strong>Address:</strong> Zenith Student Marketplace, University Office Park, Johannesburg, South Africa
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">Last updated: May 15, 2025</p>
        </div>
      </div>
    </div>
  )
}
