import { LegalLayout } from "@/components/LegalLayout";
import { ShieldAlert } from "lucide-react";

export const metadata = { title: "Jeu responsable — Footwik Pro" };

export default function JeuResponsablePage() {
  return (
    <LegalLayout title="Jeu responsable" updatedAt="24 septembre 2026">
      <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold-darker/30 p-4">
        <ShieldAlert className="mt-0.5 shrink-0 text-gold" size={20} />
        <p className="text-ink-muted">
          Les analyses de Footwik Pro sont des aides à la décision. Aucun
          résultat n&apos;est garanti. Le pari sportif comporte des risques
          financiers réels : ne pariez jamais plus que ce que vous pouvez vous
          permettre de perdre.
        </p>
      </div>

      <div>
        <h2>Nos principes</h2>
        <ul>
          <li>Nous ne présentons jamais nos pronostics comme des &laquo; gains garantis &raquo;.</li>
          <li>Nous affichons publiquement tous nos pronostics, gagnés et perdus, avec le taux de réussite réel.</li>
          <li>L&apos;indice de confiance (1 à 5 étoiles) exprime un niveau de conviction statistique, jamais une certitude.</li>
        </ul>
      </div>

      <div>
        <h2>Signes d&apos;un jeu à risque</h2>
        <ul>
          <li>Parier plus que ce que vous aviez prévu pour &laquo; se refaire &raquo;.</li>
          <li>Emprunter de l&apos;argent pour parier.</li>
          <li>Négliger ses obligations personnelles, familiales ou professionnelles à cause des paris.</li>
          <li>Ressentir de l&apos;anxiété ou de l&apos;irritabilité en cas d&apos;impossibilité de parier.</li>
        </ul>
      </div>

      <div>
        <h2>Bonnes pratiques</h2>
        <ul>
          <li>Fixez-vous un budget de paris à l&apos;avance et respectez-le.</li>
          <li>Ne considérez jamais les paris comme une source de revenu.</li>
          <li>Faites des pauses régulières et ne pariez jamais sous l&apos;effet de l&apos;alcool ou de l&apos;émotion.</li>
          <li>Utilisez les fiches d&apos;analyse comme un complément à votre propre jugement, pas comme une vérité absolue.</li>
        </ul>
      </div>

      <div>
        <h2>Besoin d&apos;aide ?</h2>
        <p>
          Si vous pensez que votre rapport au jeu devient problématique,
          parlez-en à un proche ou à un professionnel de santé. Des
          associations d&apos;aide au jeu responsable existent dans de
          nombreux pays francophones ; renseignez-vous auprès des autorités
          sanitaires locales.
        </p>
      </div>
    </LegalLayout>
  );
}
