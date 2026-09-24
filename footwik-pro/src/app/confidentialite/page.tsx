import { LegalLayout } from "@/components/LegalLayout";

export const metadata = { title: "Politique de confidentialité — Footwik Pro" };

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="24 septembre 2026">
      <div>
        <h2>1. Données collectées</h2>
        <ul>
          <li>Données d&apos;identification : nom, email, numéro de téléphone.</li>
          <li>Données de compte : historique d&apos;abonnement, préférences (équipes suivies, matchs favoris).</li>
          <li>Données de paiement : transmises directement à nos prestataires FedaPay et KkiaPay ; Footwik Pro ne stocke aucune donnée de carte bancaire ou de Mobile Money.</li>
          <li>Données techniques : adresse IP, type d&apos;appareil, pages consultées, à des fins de sécurité et d&apos;amélioration du service.</li>
        </ul>
      </div>

      <div>
        <h2>2. Utilisation des données</h2>
        <p>
          Vos données sont utilisées pour : gérer votre compte et votre
          abonnement, vous envoyer les fiches d&apos;analyse par email,
          Telegram ou WhatsApp, personnaliser votre expérience (équipes
          suivies), et améliorer nos modèles d&apos;analyse.
        </p>
      </div>

      <div>
        <h2>3. Hébergement et sécurité</h2>
        <p>
          Les données sont hébergées via Supabase, avec chiffrement en
          transit et au repos. L&apos;accès aux données est limité à
          l&apos;équipe Footwik Pro strictement nécessaire à l&apos;exploitation
          du service.
        </p>
      </div>

      <div>
        <h2>4. Partage des données</h2>
        <p>
          Nous ne vendons aucune donnée personnelle. Certaines données
          peuvent être partagées avec nos prestataires techniques (Supabase,
          API-Football, FedaPay, KkiaPay, Telegram) dans la stricte mesure
          nécessaire au fonctionnement du service.
        </p>
      </div>

      <div>
        <h2>5. Vos droits</h2>
        <p>
          Vous pouvez à tout moment demander l&apos;accès, la correction ou la
          suppression de vos données personnelles en nous contactant depuis
          votre espace abonné ou par email.
        </p>
      </div>

      <div>
        <h2>6. Cookies</h2>
        <p>
          Footwik Pro utilise des cookies techniques nécessaires au
          fonctionnement du site (session, préférences) et, le cas échéant,
          des cookies de mesure d&apos;audience anonymisés.
        </p>
      </div>
    </LegalLayout>
  );
}
