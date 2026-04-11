# CNC — Corbeau News Centrafrique PWA

Progressive Web App pour le site d'information **Corbeau News Centrafrique**, construite avec Next.js 14, Tailwind CSS et TypeScript.

## Stack technique

| Technologie | Usage |
|---|---|
| Next.js 14 (App Router) | Framework SSR + routing |
| TypeScript | Typage statique |
| Tailwind CSS + Typography | Styles |
| `@ducanh2912/next-pwa` | Service Worker + cache hors ligne |
| Firebase Cloud Messaging | Notifications push |
| WordPress REST API | Source de données |

## Démarrage rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Remplir les valeurs Firebase dans `.env.local` (voir section Firebase ci-dessous).

### 3. Lancer en développement

```bash
npm run dev
```

→ Ouvrir [http://localhost:3000](http://localhost:3000)

### 4. Build production

```bash
npm run build
npm start
```

## Structure des fichiers

```
cnc-app/
├── app/
│   ├── layout.tsx              # Layout racine (Header, Footer, PWA)
│   ├── page.tsx                # Page d'accueil (liste articles + filtre)
│   ├── globals.css             # Tailwind + styles WordPress content
│   └── article/[id]/
│       └── page.tsx            # Page article complète
├── components/
│   ├── Header.tsx              # Navigation + menu mobile
│   ├── ArticleCard.tsx         # Carte article (grille)
│   ├── CategoryFilter.tsx      # Barre de filtres par catégorie
│   ├── NotificationButton.tsx  # Bouton activation notifications push
│   └── InstallButton.tsx       # Bouton installation PWA
├── lib/
│   ├── api.ts                  # Fonctions WordPress REST API
│   └── firebase.ts             # Firebase Messaging
├── public/
│   ├── manifest.json           # Manifest PWA
│   ├── firebase-messaging-sw.js # Service Worker notifications
│   └── icons/                  # Icônes PWA (à générer, voir ci-dessous)
├── next.config.js              # Config Next.js + PWA + cache
├── tailwind.config.ts
└── .env.example
```

## Générer les icônes PWA

Les icônes doivent être placées dans `public/icons/`. Tailles requises :
`72`, `96`, `128`, `144`, `152`, `192`, `384`, `512` px.

**Option rapide** — avec [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) :

```bash
npx pwa-asset-generator logo-source.png public/icons \
  --background "#8B0000" \
  --padding "20%"
```

Ou utiliser [Maskable.app](https://maskable.app/) pour les icônes maskable.

## Configuration Firebase (Notifications Push)

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Aller dans **Paramètres > Général > Vos applications** → ajouter une app Web
3. Copier la configuration dans `.env.local`
4. Aller dans **Cloud Messaging > Web Push certificates** → générer une clé VAPID
5. Mettre à jour `public/firebase-messaging-sw.js` avec votre config Firebase réelle

## Fonctionnalités PWA

| Fonctionnalité | Statut |
|---|---|
| Installation sur l'écran d'accueil | ✅ |
| Mode hors ligne (articles en cache) | ✅ |
| Notifications push | ✅ (Firebase) |
| Mise à jour automatique du cache | ✅ (5 min pour les articles) |
| Responsive mobile-first | ✅ |
| Rendu côté serveur (SEO) | ✅ |
| Partage social (FB, X, WhatsApp) | ✅ |

## API WordPress

L'application consomme l'API REST WordPress :

| Endpoint | Usage |
|---|---|
| `GET /posts?_embed&per_page=12` | Liste des articles |
| `GET /posts/{id}?_embed` | Article complet |
| `GET /categories?per_page=50` | Liste des catégories |

Le paramètre `_embed` inclut les images à la une, les catégories et l'auteur.

## Design

- **Couleur principale** : `#8B0000` (rouge foncé)
- **Police** : Inter (Google Fonts)
- **Taille de texte minimum** : 16px
- **Mobile-first** : grille 1→2→3 colonnes
- **Premier article** : carte featured pleine largeur
