import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Connexion — Footwik Pro" };

export default function ConnexionPage() {
  return (
    <div className="px-4 py-14">
      <AuthForm mode="connexion" />
    </div>
  );
}
