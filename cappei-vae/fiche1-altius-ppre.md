# FICHE DESCRIPTIVE N°1 — CAPPEI VAE
## Domaine de Compétence 1 : Piloter et animer une démarche d'éducation inclusive
### Action : Conception et déploiement de l'outil « Altius PPRE »

---

## 1. CONTEXTE

| Élément | Description |
|---------|-------------|
| **Établissement** | École primaire publique La Rose, Bandraboua (REP+) — Mayotte |
| **Public** | Classe de CM2 (24 élèves), dont 40 % d'élèves allophones, 30 % en grande difficulté de lecture, plusieurs profils relevant de l'ASH non formellement notifiés |
| **Année scolaire** | 2025-2026 |
| **Acteurs concernés** | Enseignants de l'ordinaire (cycle 2 et 3), AESH, coordonnateur du RASED, directrice d'école |

### Problématique de départ

Dans une école REP+ à Mayotte, les enseignants de l'ordinaire sont submergés par la charge administrative liée aux dispositifs d'inclusion (PPRE, PAP, notifications MDPH). Les PPRE sont rédigés avec des objectifs trop larges (« améliorer la lecture ») et manquent d'opérationnalité. Les AESH, faute de fiches de route précises, tendent à faire « à la place de » l'élève plutôt qu'à l'accompagner vers l'autonomie. Aucun outil numérique n'existe pour rationaliser ce processus tout en garantissant la gratuité et la souveraineté des données.

---

## 2. OBJECTIFS VISÉS

- **Objectif 1** : Fournir aux enseignants un outil de découpage des macro-difficultés en micro-objectifs mesurables (jalons de 4 à 6 semaines)
- **Objectif 2** : Générer des protocoles de co-intervention précis pour les AESH (stratégies de maintien de l'attention, relances métacognitives, outils de manipulation)
- **Objectif 3** : Assurer l'interopérabilité avec les logiciels officiels (Eduline, LSU) via un format texte brut structuré (Markdown)
- **Objectif 4** : Garantir la gratuité éternelle, le respect du RGPD (données anonymisées) et l'hébergement indépendant par chaque école

---

## 3. MISE EN ŒUVRE

### Phase 1 — Conception technique (septembre 2025)

J'ai développé **Altius PPRE**, une application web open-source intégrant :
- **Un moteur de découpage PPRE** (« L'Escalier des Progrès ») qui fragmente une difficulté macro (ex : « ne comprend pas ce qu'il lit ») en micro-objectifs progressifs : discrimination phonologique → fluence mot à mot → fluence de phrase → compréhension littérale → compréhension inférentielle
- **Une règle ergonomique « Sine Tabula » (Zéro Tableau)** : les résultats sont générés exclusivement en Markdown pour un copier-coller fluide sans perte de mise en forme
- **Un générateur de protocole AESH** : pour chaque micro-objectif, un encart dédié décrit la posture de l'AESH (questionnement métacognitif, guidage progressif, retrait d'étayage)

### Phase 2 — Diffusion auprès de l'équipe (octobre 2025)

- Présentation de l'outil lors d'un conseil des maîtres
- Accompagnement individuel des 3 enseignants les plus réticents (créneaux de 20 minutes en APC)
- Mise à disposition du code source et d'un tutoriel vidéo pas-à-pas

### Phase 3 — Accompagnement des AESH (novembre 2025)

- Session de formation de 2 heures avec les 2 AESH de l'école
- Création d'un guide visuel « Mon rôle dans le PPRE » avec des exemples concrets de reformulation et de relance
- Suivi bimensuel : ajustement des protocoles en fonction des retours de terrain

### Phase 4 — Bilan et ajustements (janvier 2026)

- Analyse des PPRE générés : taux de complétion, nombre d'objectifs reformulés, satisfaction des enseignants et AESH
- Correctifs apportés à l'interface (ajout d'un champ « observations libres » pour l'AESH)
- Mise en ligne de la version 2.0 sur un serveur indépendant

---

## 4. RÉSULTATS OBSERVÉS

| Indicateur | Avant Altius PPRE | Après Altius PPRE |
|------------|-------------------|-------------------|
| Temps de rédaction d'un PPRE | 45 à 60 minutes | 10 à 15 minutes |
| Objectifs mesurables dans les PPRE | 0 % (objectifs flous) | 100 % (micro-objectifs SMARTS) |
| AESH disposant d'une fiche de route | 0 % | 100 % |
| Réutilisation des PPRE par les collègues | Aucune | Utilisation par 5 enseignants de l'école |

### Témoignages recueillis

> *« Avant, je passais mon samedi à écrire les PPRE. Maintenant, je clique et j'adapte. »* — Enseignante de CE2

> *« Je sais enfin ce que je dois faire avec Karim pendant les séances de soutien. »* — AESH

---

## 5. ANALYSE RÉFLEXIVE

### Ce que cette action m'a appris

1. **L'importance de l'ergonomie** : un outil, aussi performant soit-il, doit être d'une simplicité d'utilisation absolue pour être adopté par des enseignants en surcharge cognitive.
2. **La résistance au changement** : les enseignants les plus en difficulté sont aussi les plus réticents à utiliser un nouvel outil. L'accompagnement individualisé a été la clé de l'adoption.
3. **Le rôle de l'enseignant-ressource** : au-delà de l'outil, c'est la posture d'accompagnement et de conseil qui fait la différence. L'outil n'est qu'un levier ; la relation humaine reste centrale.

### Ce que j'aurais fait différemment

- J'aurais impliqué les AESH dès la phase de conception de l'outil (co-conception) pour coller encore plus finement à leurs besoins réels
- J'aurais prévu un comité de suivi trimestriel plutôt que bimensuel pour alléger la charge

### Perspectives

- Diffusion de l'outil à l'échelle de la circonscription de Bandraboua via le conseiller pédagogique de circonscription
- Adaptation pour les collèges du secteur (notamment la SEGPA de M'Tsamboro)

---

## 6. LIEN AVEC LE RÉFÉRENTIEL CAPPEI

| Compétence | Justification |
|------------|---------------|
| **C1.1** — Situer son rôle d'enseignant spécialisé dans le cadre de l'éducation inclusive | J'ai conçu un outil qui structure et outille l'ensemble de l'équipe éducative pour répondre aux besoins de tous les élèves |
| **C1.2** — Coordonner et animer une équipe | J'ai animé des temps de formation et de suivi avec les enseignants et les AESH |
| **C1.3** — Conseiller et accompagner les partenaires | J'ai formé les AESH et produit des ressources méthodologiques pour l'équipe |
| **C1.4** — Contribuer à l'accessibilité des établissements | L'outil Altius PPRE est un vecteur d'accessibilité pédagogique pour tous les élèves de l'école |
