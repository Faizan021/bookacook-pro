import { PackageForm } from "@/components/packages/package-form";

export default function DemoNewPackagePage() {
  return (
    <div className="p-6">
      <PackageForm mode="create" />
    </div>
  );
}
