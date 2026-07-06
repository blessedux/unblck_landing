import { FormPageShell } from "@/components/FormPageShell";

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormPageShell>{children}</FormPageShell>;
}
