# CultureMaster — PWA

Application de culture générale progressive (PWA) avec 3 modes : Apprendre, Réviser, Quiz.

## Structure du projet

```
culturemaster/
├── public/
│   ├── icon-192.svg        ← Icône PWA (192px)
│   └── icon-512.svg        ← Icône PWA (512px, maskable)
├── src/
│   ├── main.jsx            ← Point d'entrée React
│   └── CultureMaster.jsx   ← Application complète
├── index.html
├── package.json
├── vite.config.js          ← Config Vite + plugin PWA
├── vercel.json             ← Config routing Vercel
└── .gitignore
```

## Démarrage local

```bash
npm install
npm run dev
```

## Format des fichiers de leçons (.txt)

Chaque fichier `.txt` doit contenir un tableau JSON :

```json
[
  {
    "ID": "HF-001",
    "Titre": "Nom de la leçon",
    "Contenu": "Texte détaillé...",
    "Memo": ["Point clé 1", "Point clé 2"],
    "Quiz": [
      {
        "Texte": "Question ?",
        "Options": ["A", "B", "C", "D"],
        "RéponseCorrecte": 0,
        "Explication": "Parce que..."
      }
    ]
  }
]
```

## Déploiement Vercel

1. Push sur GitHub
2. Connecter le repo sur vercel.com
3. Framework preset : **Vite**
4. Build command : `npm run build`
5. Output directory : `dist`
