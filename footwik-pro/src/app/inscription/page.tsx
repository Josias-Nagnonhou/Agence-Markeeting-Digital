import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Inscription — Footwik Pro" };

export default function InscriptionPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="px-4 py-14">
      <AuthForm mode="inscription" next={searchParams.next} />
    </div>
  );
}
