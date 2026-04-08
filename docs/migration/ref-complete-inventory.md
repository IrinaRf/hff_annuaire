# Inventaire complet du legacy `ref`

## 1. But

Ce document constitue la reference d’inventaire exhaustive pour la migration de `ref/` vers `backend/` (API) et `frontend/` (UI React).

## 2. Couverture facturee

Inventaire calcule automatiquement sur tous les fichiers de `ref/` hors metadonnees `ref/.git`.

### 2.1 Volumetrie globale

- fichiers inventories: 1789
- controllers: 210
- entities: 137
- repositories: 102
- services: 131
- forms: 121
- models: 76
- validators: 1
- scripts SQL: 98
- fichiers de vues: 641
- fichiers de tests: 49

### 2.2 Repartition top-level (volume)

La masse principale est concentree dans:

- `src` (902)
- `Views` (641)
- `sql` (98)
- `test` (49)
- `config` (25)
- `scripts` (14)

## 3. Cartographie technique par domaine

### 3.1 Densite des routes

Domaines avec le plus de routes relevees:

1. `admin`
2. `da`
3. `magasin`
4. `pol`
5. `dit`

Conclusion: la priorisation de migration doit commencer par admin + da + dit + magasin, puis ouvrir pol et modules RH.

### 3.2 Densite des entites

Domaines d’entites dominants:

1. `admin`
2. `dw`
3. `da`
4. `dit`
5. `tik`

Conclusion: le modele de donnees cible doit garantir d’abord la coherence admin + da + dit + dw.

### 3.3 Densite des services

Bloc fort observe:

- `genererPdf`
- `historiqueOperation`
- `magasin`
- `da`
- `dit`

Conclusion: les flux documentaires PDF/notification sont centraux et doivent etre migres avec tests de non-regression dedies.

### 3.4 Densite des models legacy

Dominantes:

- `dit`
- `magasin`
- `da`
- `badm`
- `dom`
- `planning`

Conclusion: les chantiers a risque eleve sont ceux qui combinent controllers + model SQL brut + PDF + workflows multi-statuts.

## 4. Couverture SQL

Le corpus SQL couvre notamment:

- DIT: devis, BC, OR, facture, RI, historiques
- DA/APPRO: demandes, lignes, observations, soumissions
- MAGASIN/POL: devis negoce, BC client, BL
- RH: DOM, DDC
- COMPTA: DDP, BDC
- TIK: tickets informatiques
- DW: tables documentaires
- PROFIL/SECURITE: profils, pages, affectations

Ce point confirme une migration multi-domaine et multi-flux, avec un besoin fort de normaliser les etats metier dans l’API cible.

## 5. References d’inventaire (preuve)

### 5.1 Inventaire global

- `docs/migration/generated/ref-file-manifest.txt`
- `docs/migration/generated/ref-top-level-counts.txt`
- `docs/migration/generated/ref-layer-counts.txt`

### 5.2 Inventaires applicatifs

- `docs/migration/generated/ref-routes-index.txt`
- `docs/migration/generated/ref-controller-domain-route-counts.txt`
- `docs/migration/generated/ref-php-types-index.txt`
- `docs/migration/generated/ref-entities-files.txt`
- `docs/migration/generated/ref-repositories-files.txt`
- `docs/migration/generated/ref-services-files.txt`
- `docs/migration/generated/ref-forms-files.txt`
- `docs/migration/generated/ref-models-files.txt`

### 5.3 Inventaires data et contenu

- `docs/migration/generated/ref-sql-files.txt`
- `docs/migration/generated/ref-sql-ddl-dml-index.txt`
- `docs/migration/generated/ref-sql-create-table-names.txt`
- `docs/migration/generated/ref-docs-files.txt`
- `docs/migration/generated/ref-document-files.txt`
- `docs/migration/generated/ref-views-files.txt`
- `docs/migration/generated/ref-scripts-files.txt`
- `docs/migration/generated/ref-tests-files.txt`

## 6. Roadmap d’implementation detaillee (du plus petit au plus grand)

### Phase A: stabilisation socle (backend + frontend)

1. Normaliser contrat d’erreur API.
2. Poser les DTO d’entree/sortie.
3. Poser conventions de pagination/filtrage/sorting.
4. Brancher observabilite (logs structurels + correlation ID).
5. Poser routeur frontend et couche API centralisee.

### Phase B: referentiels transverses

1. API admin: utilisateurs, agences, services, roles, permissions.
2. UI admin minimale: listes + details + formulaires.
3. Tests d’autorisation et regression ACL.

### Phase C: flux coeur DA/DIT/magasin

1. Lecture DA + DIT + magasin en mode consultation.
2. Ecriture progressive: creation, validation, soumission.
3. Migration des statuts critiques et historique d’operations.
4. Tests end-to-end des parcours critiques.

### Phase D: flux documentaires et exports

1. PDF generation equivalence fonctionnelle.
2. Exports Excel equivalence colonnes et filtres.
3. Passage DW/DOCUWARE via adaptateurs dedies.

### Phase E: modules specialises

1. DOM/BADM/DDC/DDP/BDC/TIK/planning.
2. Validation metier avec utilisateurs pilotes.
3. Mesure de non-regression par module.

### Phase F: decommission progressive

1. Coexistence controlee legacy/cible.
2. Bascule par module selon criteres de sortie.
3. Arret routes legacy a faible valeur.
4. Gel puis archivage legacy runtime.

## 7. Criteres de “vraiment complet”

L’analyse est consideree complete uniquement si:

1. 100% des references fichiers sont inventoriees (ok).
2. 100% des parcours metier critiques ont un mapping API + UI.
3. 100% des etats metier critiques sont modelises et testes.
4. 100% des integrations externes (LDAP, DW, PDF, Excel) ont une strategie cible et des tests de verification.
