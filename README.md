# 🌸 NoteBloom — Application de Notes Android

Une application Android moderne, intuitive et riche pour gérer toutes vos notes : projets, courses, rendez-vous, processus, et plus encore.

---

## ✨ Fonctionnalités

- 📝 **Notes enrichies** — Titre, contenu, emoji, couleur personnalisée
- ✅ **Listes de tâches** — Checklist avec suivi de progression visuel
- 📂 **8 Catégories** — Projet 🚀, Courses 🛒, RDV 📅, Processus ⚙️, Personnel 💖, Idées 💡, Voyage ✈️, Santé 🏃
- 🎯 **Priorités** — Faible / Moyen / Élevé
- 🏷️ **Tags** — Organisez avec des étiquettes
- 📌 **Épinglage** — Notes importantes en haut de liste
- ❤️ **Favoris** — Accès rapide à vos notes préférées
- 📦 **Archive** — Rangez les notes terminées
- 🔍 **Recherche** — Instantanée dans titres, contenu et tags
- 📊 **Statistiques** — Vue globale par catégorie
- 📤 **Partage** — Partagez vos notes facilement
- 🎨 **Design sombre** — Beau et élégant, thème sombre par défaut

---

## 🚀 Installation & Lancement

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Téléphone Android avec [Expo Go](https://expo.dev/go) **ou** Android Studio (émulateur)

### Étapes

```bash
# 1. Installer les dépendances
cd NoteBloom
npm install

# 2. Lancer l'application en mode développement
npx expo start

# 3. Scanner le QR code avec Expo Go (Android)
#    OU appuyer sur 'a' pour ouvrir dans l'émulateur Android
```

---

## 📦 Générer un APK (déployable)

### Option 1 — Via EAS Build (recommandé, cloud)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo (compte gratuit)
eas login

# Configurer le projet
eas build:configure

# Générer l'APK (build preview)
eas build --platform android --profile preview
```

L'APK sera disponible en téléchargement sur [expo.dev](https://expo.dev) après le build (~5-10 min).

### Option 2 — APK local (nécessite Android SDK)

```bash
# Générer le projet Android natif
npx expo prebuild --platform android

# Builder l'APK
cd android
./gradlew assembleRelease

# L'APK se trouve dans :
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📱 Structure du projet

```
NoteBloom/
├── app/                    # Routes Expo Router
│   ├── _layout.tsx         # Layout racine + Provider
│   ├── index.tsx           # Écran d'accueil
│   ├── new-note.tsx        # Créer une note
│   ├── note/[id].tsx       # Détail d'une note
│   ├── edit-note/[id].tsx  # Modifier une note
│   └── settings.tsx        # Paramètres
│
├── src/
│   ├── screens/            # Écrans principaux
│   │   ├── HomeScreen.tsx
│   │   ├── NoteEditorScreen.tsx
│   │   ├── NoteDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── components/         # Composants réutilisables
│   │   ├── NoteCard.tsx
│   │   └── UI.tsx
│   │
│   ├── context/
│   │   └── NotesContext.tsx  # State global
│   │
│   └── utils/
│       ├── theme.ts           # Couleurs, typographie, espacements
│       ├── types.ts           # Types TypeScript
│       └── storage.ts         # AsyncStorage wrapper
│
├── assets/                 # Icônes et images
├── app.json                # Config Expo
├── eas.json                # Config EAS Build
└── package.json
```

---

## 🛠️ Technologies utilisées

| Technologie | Usage |
|---|---|
| React Native | Framework mobile |
| Expo SDK 52 | Toolchain & APIs natives |
| Expo Router | Navigation file-based |
| AsyncStorage | Stockage local persistant |
| TypeScript | Typage statique |
| date-fns | Formatage des dates |
| EAS Build | Génération APK/AAB |

---

## 🎨 Design

- Thème sombre élégant (`#0F0F1A` background)
- Palette violette principale avec accents colorés par catégorie
- Cards avec bordure colorée à gauche
- Animations spring au tap
- Barres de progression pour les checklists
- Emojis omniprésents pour rendre l'app vivante et chaleureuse

---

## 📋 Cas d'usage

| Cas | Catégorie | Fonctionnalité clé |
|---|---|---|
| Plan de projet | 🚀 Projet | Checklist + progression |
| Liste de courses | 🛒 Courses | Checklist cochable |
| Rappel RDV | 📅 Rendez-vous | Date d'échéance |
| Suivi d'apprentissage | ⚙️ Processus | Barre de progression |
| Journal | 💖 Personnel | Note libre |
| Idées créatives | 💡 Idées | Tags + couleurs |
| Itinéraire voyage | ✈️ Voyage | Checklist + tags |
| Programme sportif | 🏃 Santé | Étapes + progression |

---

## 📄 Licence

MIT — Libre d'utilisation et de modification.
