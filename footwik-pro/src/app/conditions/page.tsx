import { LegalLayout } from "@/components/LegalLayout";

export const metadata = { title: "Conditions d'utilisation — Footwik Pro" };

export default function ConditionsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updatedAt="24 septembre 2026">
      <div>
        <h2>1. Objet du service</h2>
        <p>
          Footwik Pro est une plateforme d&apos;analyse de matchs de football
          par intelligence artificielle. Le service propose des fiches
          d&apos;analyse statistique, un historique public des pronostics et
          des abonnements payants donnant accès à des contenus
          complémentaires. Footwik Pro n&apos;est ni un bookmaker, ni un
          opérateur de paris sportifs : nous ne prenons aucun pari et ne
          gérons aucune mise pour le compte des utilisateurs.
        </p>
      </div>

      <div>
        <h2>2. Accès réservé aux personnes majeures</h2>
        <p>
          L&apos;utilisation de Footwik Pro est strictement réservée aux
          personnes âgées de 18 ans ou plus. En créant un compte, vous
          confirmez avoir l&apos;âge légal requis. Toute inscription
          frauduleuse d&apos;un mineur entraîne la suppression immédiate du
          compte.
        </p>
      </div>

      <div>
        <h2>3. Nature des analyses proposées</h2>
        <p>
          Les analyses, statistiques, indices de confiance et pronostics
          fournis sur Footwik Pro sont des aides à la décision basées sur des
          données statistiques et un modèle d&apos;intelligence artificielle.
          <strong className="text-ink"> Aucun résultat n&apos;est garanti.</strong>{" "}
          Le football reste un sport imprévisible et Footwik Pro ne saurait
          être tenu responsable des pertes financières résultant de décisions
          de pari prises par l&apos;utilisateur, quelle que soit leur nature.
        </p>
      </div>

      <div>
        <h2>4. Abonnements et paiements</h2>
        <ul>
          <li>Les abonnements sont proposés en formules Semaine, Mois et VIP mensuel.</li>
          <li>Les paiements s&apos;effectuent par Mobile Money (MTN, Moov, Wave, Orange Money) via nos prestataires FedaPay et KkiaPay, ou par carte bancaire pour les abonnés de la diaspora.</li>
          <li>Les tarifs sont affichés en FCFA pour l&apos;Afrique et en euros pour la diaspora, selon le pays de résidence déclaré.</li>
          <li>L&apos;abonnement se renouvelle automatiquement à la fin de chaque période, sauf résiliation depuis l&apos;espace abonné.</li>
          <li>Sauf disposition contraire prévue par la loi applicable, les sommes versées ne sont pas remboursables une fois l&apos;accès aux contenus premium accordé.</li>
        </ul>
      </div>

      <div>
        <h2>5. Programme de parrainage</h2>
        <p>
          Chaque abonné dispose d&apos;un lien de parrainage personnel. Toute
          personne s&apos;abonnant via ce lien offre une semaine gratuite au
          parrain. Footwik Pro se réserve le droit de suspendre ce programme
          en cas d&apos;usage abusif ou frauduleux (auto-parrainage, faux
          comptes).
        </p>
      </div>

      <div>
        <h2>6. Comportement attendu</h2>
        <p>
          Le partage non autorisé de contenus premium, la revente
          d&apos;accès ou l&apos;usage automatisé (scraping, bots) du service
          sont interdits et peuvent entraîner la suspension du compte sans
          remboursement.
        </p>
      </div>

      <div>
        <h2>7. Modification des conditions</h2>
        <p>
          Footwik Pro peut modifier les présentes conditions à tout moment.
          Les utilisateurs seront informés de toute modification substantielle
          par email, SMS ou notification sur la plateforme.
        </p>
      </div>

      <div>
        <h2>8. Jeu responsable</h2>
        <p>
          Nous encourageons vivement une pratique responsable du pari sportif.
          Consultez notre page{" "}
          <a href="/jeu-responsable" className="text-grass hover:underline">
            Jeu responsable
          </a>{" "}
          pour plus d&apos;informations et des ressources d&apos;aide.
        </p>
      </div>
    </LegalLayout>
  );
}
