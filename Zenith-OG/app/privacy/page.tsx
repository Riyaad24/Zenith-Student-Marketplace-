import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                At Zenith Student Marketplace, we value your privacy and are committed to protecting your personal
                information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our
                platform.
              </p>

              <p className="mb-4">
                When you register on Zenith, we collect essential personal information such as your name, email address,
                student ID, and institution for the purpose of verifying your identity and ensuring a trusted community.
                We may also collect data related to your transactions, communication, and usage patterns to improve user
                experience and platform performance.
              </p>

              <p className="mb-4">
                All user data is stored securely, protected by encryption and access controls. We do not sell, rent, or
                share your personal information with third parties for marketing purposes. However, we may share data
                with trusted service providers (such as payment gateways) solely to facilitate transactions and maintain
                platform functionality.
              </p>

              <p className="mb-4">
                Users have the right to access, update, or delete their personal information at any time. We also
                provide options to control communication preferences and data usage settings.
              </p>

              <p className="mb-4">
                By using Zenith, you agree to the collection and use of your information as described in this policy. We
                may update this Privacy Policy periodically, and users will be notified of significant changes.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Detailed Privacy Information</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Information We Collect</h3>
                <p className="text-muted-foreground mb-2">We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Account information (name, email, password)</li>
                  <li>Student verification information (student ID, institution)</li>
                  <li>Transaction data (listings, purchases, payment information)</li>
                  <li>Communication data (messages between users)</li>
                  <li>Usage data (how you interact with our platform)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">2. How We Use Your Information</h3>
                <p className="text-muted-foreground mb-2">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Verify your identity and student status</li>
                  <li>Process transactions and payments</li>
                  <li>Facilitate communication between users</li>
                  <li>Improve our platform and user experience</li>
                  <li>Ensure compliance with our terms and policies</li>
                  <li>Send important notifications about your account or transactions</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">3. Data Security</h3>
                <p className="text-muted-foreground">
                  We implement robust security measures to protect your personal information, including encryption,
                  secure socket layer technology (SSL), regular security assessments, and strict access controls. We
                  regularly review and update our security practices to maintain the highest standards of data
                  protection.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">4. Your Privacy Rights</h3>
                <p className="text-muted-foreground mb-2">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Access and review your personal information</li>
                  <li>Update or correct your personal information</li>
                  <li>Delete your account and personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Control your privacy settings</li>
                  <li>Request a copy of your data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">5. Cookies and Tracking</h3>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. These
                  technologies help us understand how you use our services, remember your preferences, and improve our
                  platform. You can manage your cookie preferences through your browser settings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">6. Changes to This Policy</h3>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. We will notify you of any material changes through email or
                  a prominent notice on our platform before the changes become effective.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> privacy@zenithmarketplace.co.za
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
