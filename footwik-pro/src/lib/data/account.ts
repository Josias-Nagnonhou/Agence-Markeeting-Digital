export interface PaymentRecord {
  id: string;
  date: string;
  plan: string;
  amount: string;
  method: string;
  status: "payé" | "échoué" | "en_attente";
}

export interface SubscriberAccount {
  name: string;
  email: string;
  phone: string;
  plan: string;
  planExpiry: string;
  referralCode: string;
  referralCount: number;
  favoriteMatchIds: string[];
  followedTeamIds: string[];
  payments: PaymentRecord[];
}

export const currentSubscriber: SubscriberAccount = {
  name: "Josias N.",
  email: "josiasnagnonhou021@gmail.com",
  phone: "+229 90 00 00 00",
  plan: "Mois",
  planExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
  referralCode: "FOOTWIK-JN241",
  referralCount: 3,
  favoriteMatchIds: ["psg-lens", "real-barca"],
  followedTeamIds: ["psg", "senegal", "asec"],
  payments: [
    { id: "p1", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), plan: "Mois", amount: "3 500 FCFA", method: "MTN Mobile Money", status: "payé" },
    { id: "p2", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 42).toISOString(), plan: "Mois", amount: "3 500 FCFA", method: "Orange Money", status: "payé" },
    { id: "p3", date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 72).toISOString(), plan: "Semaine", amount: "1 000 FCFA", method: "Wave", status: "payé" },
  ],
};
