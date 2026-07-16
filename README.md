# MonSavoir

Webapp personnelle pour capturer et retrouver les mots, définitions et questions du quotidien.

---

## Stack

| Outil | Rôle |
|-------|------|
| Next.js 16 (App Router) | Framework React — routing, rendu, API |
| TypeScript | Typage statique |
| Tailwind CSS | Styles utilitaires |
| Firebase Auth | Authentification (email + Google) |
| Firestore | Base de données temps réel |
| Firebase Storage | Stockage images |
| Framer Motion | Animations |
| Lucide React | Icônes |

---

## Structure du projet

```
monsavoir/
├── app/
│   ├── page.tsx           → Redirection auth/dashboard selon connexion
│   ├── auth/page.tsx      → Page connexion / inscription
│   ├── dashboard/page.tsx → App principale (4 onglets)
│   ├── layout.tsx         → Layout global + AuthProvider
│   └── globals.css        → Styles globaux
│
├── components/
│   ├── ui/                → Composants réutilisables (Button, Input, Badge, Card...)
│   ├── entries/
│   │   ├── EntryCard.tsx  → Carte d'affichage d'une entrée
│   │   └── EntryForm.tsx  → Formulaire création / modification
│   └── layout/
│       └── BottomNav.tsx  → Navigation bas de page (mobile)
│
├── context/
│   └── AuthContext.tsx    → État global de l'utilisateur connecté
│
├── hooks/
│   └── useEntries.ts      → Écoute temps réel Firestore (entrées + tags)
│
├── lib/
│   ├── firebase.ts        → Initialisation Firebase
│   ├── firestore.ts       → Fonctions CRUD (créer, lire, modifier, supprimer)
│   └── utils.ts           → Utilitaires (formatage dates, cn())
│
├── types/
│   └── index.ts           → Types TypeScript (Entry, Tag, EntryType...)
│
└── .env.local             → Clés Firebase (ne jamais committer)
```

---

## Types d'entrées

**Mot / Définition**
- Titre (le mot)
- Définition
- Exemples (optionnel)
- Image (optionnel)
- Tags

**Question**
- La question
- La réponse / explication
- Exemples / cas concrets (optionnel)
- Source URL (optionnel)
- Tags

---

## Lancer en local

```bash
# Nécessite Node.js >= 20
nvm use 20

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvre `http://localhost:3000`

---

## Firebase — ce qui est configuré

### Authentication
- Email / Mot de passe ✅
- Google ✅

### Firestore — Collections

**`entries`** — une entrée = un document
```
{
  userId: string        → ID de l'utilisateur propriétaire
  type: "word" | "question"
  title: string
  content: string
  examples: string[]
  imageUrl?: string
  source?: string
  tags: string[]        → tableau d'IDs de tags
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**`tags`** — un tag = un document
```
{
  userId: string
  name: string
  color: string         → nom de couleur (violet, blue, green...)
  createdAt: Timestamp
}
```

### Règles de sécurité Firestore
Chaque utilisateur ne peut lire/écrire que ses propres données (`userId == request.auth.uid`).

### Index Firestore (composites)
Requis pour les requêtes `where + orderBy` :
- `entries` → userId (ASC) + createdAt (DESC)
- `tags` → userId (ASC) + createdAt (ASC)

Ces index se créent automatiquement en cliquant le lien dans l'erreur console au premier lancement.

---

## Fonctionnalités

- [x] Inscription / Connexion (email + Google)
- [x] Créer une entrée (mot ou question)
- [x] Modifier / Supprimer une entrée
- [x] Upload d'image (drag & drop ou sélection)
- [x] Exemples par entrée
- [x] Tags colorés (créés à la volée)
- [x] Recherche full-text (titre + contenu)
- [x] Filtres par type et par tag
- [x] Statistiques (compteurs)
- [x] Design mobile-first
- [ ] Résumé IA (Claude API) — prévu v2
- [ ] Firebase Storage rules — à configurer quand Storage disponible

---

## Variables d'environnement

Fichier `.env.local` à la racine — ne jamais committer ce fichier.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Déploiement (Vercel)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Puis dans Vercel Dashboard → Settings → Environment Variables → coller les mêmes valeurs que `.env.local`.
