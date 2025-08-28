import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function FAQPage() {
  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions (FAQ)</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  1. What is Zenith Student Marketplace?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Zenith is a student-run e-commerce platform created to help South African university and college
                    students buy, sell, rent, or trade study materials and tutoring services in a secure and affordable
                    environment.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">2. Who can use Zenith?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Zenith is exclusively for current and former students of South African tertiary institutions. A
                    valid student ID or proof of enrollment is required to register.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">3. How do I sign up?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Click the "Sign Up" button on our homepage, complete the registration form with your student
                    details, and verify your email. Once your account is approved, you can start listing or browsing
                    products.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">4. Is Zenith free to use?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes, registering and browsing is free. We may charge a small service fee for completed transactions
                    to cover security and maintenance costs. All fees will be clearly stated before payment.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  5. What can I sell or rent on Zenith?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    You can list textbooks, study guides, stationery, laptops, and tutoring services. All listings must
                    be academic-related and in compliance with our{" "}
                    <Link href="/terms" className="text-purple-700 hover:underline">
                      Terms of Service
                    </Link>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left font-medium">
                  6. How does the escrow payment system work?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    When a buyer pays for an item, the payment is held in escrow. Funds are only released to the seller
                    once the buyer confirms they've received the product or service. This ensures safety for both
                    parties.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left font-medium">
                  7. What payment methods are supported?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    We support South African-friendly options like PayFast, Ozow, EFT, and major bank transfers (FNB,
                    ABSA, Capitec, etc.).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left font-medium">8. How are users verified?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    All users must provide valid student identification during registration. We also use two-factor
                    authentication and content moderation to keep the platform safe.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left font-medium">
                  9. Can I access Zenith on my phone?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes! Zenith is fully mobile-responsive and works on all modern smartphones and tablets.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left font-medium">
                  10. Who do I contact if I have a problem?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    You can reach our support team via the{" "}
                    <Link href="/contact" className="text-purple-700 hover:underline">
                      Contact Us
                    </Link>{" "}
                    page or through the in-platform support chat. We're here to help with account issues, disputes, or
                    general queries.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Still have questions?</h2>
          <p className="text-muted-foreground">
            If you couldn't find the answer to your question, please feel free to contact our support team.
          </p>
          <div className="flex justify-center">
            <Link href="/contact">
              <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
