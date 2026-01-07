export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2026</p>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using Moova's services, you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-muted-foreground mb-4">
              Moova provides a platform connecting car owners ("Hosts") with people seeking to rent vehicles ("Renters"). 
              We facilitate the booking process, payment handling, and communication between parties.
            </p>
            <p className="text-muted-foreground mb-4">
              You must be at least 21 years old with a valid driver's license to rent a car on Moova. 
              Hosts must be at least 18 years old and the legal owner or authorized representative of the vehicle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              You are responsible for maintaining the confidentiality of your account and password. 
              You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Bookings and Payments</h2>
            <p className="text-muted-foreground mb-4">
              All bookings are subject to host acceptance. Payment is required at the time of booking. 
              Moova charges a service fee for facilitating the transaction, which is displayed before booking confirmation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cancellations</h2>
            <p className="text-muted-foreground mb-4">
              Cancellation policies vary by listing. Refund amounts depend on when you cancel and the host's cancellation policy. 
              Details are provided on each listing page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Insurance and Liability</h2>
            <p className="text-muted-foreground mb-4">
              All trips include basic insurance coverage. Renters and hosts are encouraged to review coverage details 
              before each trip. Additional coverage may be available for purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              Users may not use vehicles for illegal purposes, racing, off-road driving (unless permitted), 
              or any activity that violates the rental agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these terms, please contact us at legal@moova.ge
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
