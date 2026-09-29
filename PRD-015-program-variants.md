---
title: "PRD-015 : Variantes de formations — parent_program_id et variants sur edu_program"
last_updated: "2026-06-18"
owner: "romain"
scope: "product"
ai_usage: "reference"
status: "accepted"
tags: [adr, decision, product, engineering, edu-program, variante, formation]
---
# PRD-015 : Variantes de formations
## Contexte
Une « formation » est aujourd'hui une ligne d'`edu_program`. Une même formation peut pourtant exister en plusieurs **déclinaisons** qui partagent le fond (intitulé, diplôme, contenu pédagogique) mais diffèrent sur quelques axes :
- **langue** d'enseignement (français / anglais) ;
- **modalité** (initiale / apprentissage) ;
- **track** / parcours (ex. *red team*) ;
- **majeure / mineure**, spécialisation ;
- **campus** de rattachement (cf. PRD-014).
Aujourd'hui ces déclinaisons sont soit dupliquées en lignes indépendantes (pas de lien entre elles, pas de notion de « formation parente »). On ne sait pas dire « ces N formations sont la même formation, déclinée différemment ».
Le besoin est analogue à un **catalogue e-commerce** : un *produit* générique (le t-shirt) et ses *variantes* (taille, couleur, motif). On veut le pendant côté formation : un **programme générique** et ses **variantes**.
Côté libellés, `edu_program` porte (comme `edu_school`) `short_title`, `title` et `long_title` ; `long_title` n'apporte rien d'exploité.
## Décision
### 1. Colonne `parent_program_id` — hiérarchie générique -> variante
Ajout d'une self-FK `parent_program_id` sur `edu_program`, sur le même modèle que `parent_school_id` (PRD-014) :
- une ligne **sans** `parent_program_id` = **programme générique** (le « produit ») ;
- une ligne **avec** `parent_program_id` = **variante** rattachée à son générique.
La hiérarchie reste une chaîne simple parent/enfant ; pas de `core_link` à ce stade (cf. Alternatives écartées).
### 2. Colonne `variants` JSONB — axes de variation
Ajout d'une colonne `variants` (JSONB) qui décrit **ce qui distingue** la variante de son générique. Le générique porte `variants = NULL` (ou `{}`) ; chaque variante porte la combinaison d'axes qui la caractérise.
```jsonc
// Vatel Bordeaux — MBA, variante anglais + apprentissage sur le campus des Halles
{ "language": "en", "apprenticeship": true, "school_id": "1231312-123-azd" }
// même MBA, variante track "red team"
{ "track": "red team" }
```
> ATTENTION : Les clés exactes (`language`, `apprenticeship`, `track`, `school_id`, `major`/`minor`...) et leurs valeurs sont **à valider**. L'objectif v0 est un sac d'axes souple, sans schéma figé en base.
`school_id` pointe le cas échéant vers une ligne `edu_school` : une variante peut être propre à un campus donné.
### 3. Générique vs variante = dérivé, pas un `kind`
On **ne crée pas** de colonne `kind` (`generic` / `variant`) sur `edu_program`. La distinction se déduit de `parent_program_id` :
- **générique** : `parent_program_id IS NULL` ;
- **variante** : `parent_program_id IS NOT NULL`.
On évite ainsi de dénormaliser un état dérivable.
### 4. Libellés : `short_title` + `title`, suppression de `long_title`
- `title` — libellé complet affiché (ex. *MBA Management Hôtelier — Anglais, Apprentissage*).
- `short_title` — libellé court (listes, fil d'ariane, ex. *MBA — EN / Apprentissage*).
- `long_title` — supprimé (non exploité).
## Alternatives écartées
- **Colonnes typées par axe (`language`, `is_apprenticeship`, `track`...)** : requêtable et contraint, mais rigide — chaque nouvel axe = migration de schéma. `variants` JSONB est retenu pour la souplesse au v0.
- **Une `variant_kind` enum (`generic`/`variant`)** : redondant avec `parent_program_id` (cf. §3).
- **Lignes indépendantes sans lien** : statu quo — perte du lien « même formation déclinée ».
- **Hiérarchie via `core_link` (PRD-001)** : repoussé tant que la relation reste une chaîne simple générique -> variante.
## Conséquences
- Modèle « produit / variantes » explicite côté formations, aligné sur la hiérarchie écoles (PRD-014).
- `variants` JSONB : flexibilité maximale, mais filtrage/recherche par axe à outiller ; cohérence des clés portée applicativement, non contrainte en base.
- Drop `long_title` : à confirmer qu'aucun code ne lit encore cette colonne.
## Hors périmètre
- Schéma/validation des clés de `variants`.
- Promotion d'axes `variants` en colonnes dédiées.
## Participants
- Décideur : Romain — Consultés : Julien, Gabriel.
