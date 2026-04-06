import { VerificationModule } from "@/components/dashboard/verification-module";

export default function DemoCatererVerificationPage() {
  return (
    <div className="p-6">
      <VerificationModule
        profile={{
          id: "demo-caterer-001",
          businessName: "Berlin BBQ House",
          contactPerson: "Max Mustermann",
          phone: "+49 30 12345678",
          businessAddress: "Musterstraße 1, 10115 Berlin",
          licenseNumber: "HRB-123456",
          verificationStatus: "pending",
          payoutEnabled: false,
        }}
      />
    </div>
  );
}
