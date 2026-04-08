# Matrice de migration par domaine (source -> cible)

## 1. Objectif

Ce document transforme l inventaire technique en plan de migration executable.

Perimetre prioritaire:
1. Admin
2. DA
3. DIT
4. Magasin

Sources de preuve:
- [docs/migration/ref-complete-inventory.md](docs/migration/ref-complete-inventory.md)
- [docs/migration/generated/ref-routes-index.txt](docs/migration/generated/ref-routes-index.txt)
- [docs/migration/generated/ref-layer-counts.txt](docs/migration/generated/ref-layer-counts.txt)
- [docs/migration/generated/ref-controller-domain-route-counts.txt](docs/migration/generated/ref-controller-domain-route-counts.txt)
- [docs/migration/ref-model.prisma](docs/migration/ref-model.prisma)

## 2. Regles de migration

1. Migrer en vertical slice: API + UI + persistance + tests pour un use case complet.
2. Conserver une periode de coexistence legacy/cible avec bascule progressive.
3. Interdire les regressions silencieuses sur statuts metier et permissions.
4. Valider chaque lot avec un jeu de tests metier + techniques.

## 3. Matrice domaine par domaine

## 3.1 Admin

### Source legacy principale
- Controllers: [ref/src/Controller/admin](ref/src/Controller/admin)
- API legacy: [ref/src/Api/security/SecurityApi.php](ref/src/Api/security/SecurityApi.php)
- Entites: [ref/src/Entity/admin](ref/src/Entity/admin)
- Repositories: [ref/src/Repository/admin](ref/src/Repository/admin)
- Services: [ref/src/Service/Admin](ref/src/Service/Admin)

### Cible backend
- Module API: security, users, roles, permissions, agences, services
- Endpoints cibles minimaux:
  - GET /admin/users
  - POST /admin/users
  - GET /admin/roles
  - GET /admin/permissions
  - GET /admin/agences
  - GET /admin/services

### Cible frontend
- Ecrans:
  - Liste utilisateurs
  - Edition utilisateur
  - Liste roles/permissions
  - Parametrage agence/service

### Donnees cibles
- Modeles pivots:
  - Utilisateur
  - Agence
  - Service
- Reference conceptuelle: [docs/migration/ref-model.prisma](docs/migration/ref-model.prisma)

### Tests obligatoires
- ACL par profil
- Authn/Authz API
- Regression CRUD admin

## 3.2 DA

### Source legacy principale
- Controllers: [ref/src/Controller/da](ref/src/Controller/da)
- API legacy: [ref/src/Api/da](ref/src/Api/da)
- Entites: [ref/src/Entity/da](ref/src/Entity/da)
- Repositories: [ref/src/Repository/da](ref/src/Repository/da)
- Services: [ref/src/Service/da](ref/src/Service/da)
- SQL: [ref/sql/APPRO/da](ref/sql/APPRO/da)

### Cible backend
- Module API: demande appro, lignes, observations, affectation, soumission BC/FAC-BL
- Endpoints cibles minimaux:
  - GET /da/requests
  - POST /da/requests
  - POST /da/requests/{id}/validate
  - POST /da/requests/{id}/submit-bc
  - POST /da/requests/{id}/submit-facbl

### Cible frontend
- Ecrans:
  - Liste DA
  - Creation DA (direct, avec DIT, reappro)
  - Detail DA et timeline
  - Validation et soumission

### Donnees cibles
- Entites prioritaires:
  - DemandeAppro
  - DemandeApproL
  - DemandeApproLR
  - DaSoumissionBc
  - DaSoumissionFacBl

### Tests obligatoires
- Changement de statut DA
- Integrite lignes DA
- Soumission BC/FAC-BL
- Non regression permissions DA

## 3.3 DIT

### Source legacy principale
- Controllers: [ref/src/Controller/dit](ref/src/Controller/dit)
- API legacy: [ref/src/Api/dit](ref/src/Api/dit)
- Entites: [ref/src/Entity/dit](ref/src/Entity/dit)
- Repositories: [ref/src/Repository/dit](ref/src/Repository/dit)
- Services: [ref/src/Service/dit](ref/src/Service/dit)
- SQL: [ref/sql/dit](ref/sql/dit)

### Cible backend
- Module API: demande intervention, soumission devis/OR/BC/RI, commentaires, statuts
- Endpoints cibles minimaux:
  - GET /dit/requests
  - POST /dit/requests
  - POST /dit/requests/{id}/submit-devis
  - POST /dit/requests/{id}/submit-or
  - POST /dit/requests/{id}/submit-ri

### Cible frontend
- Ecrans:
  - Liste DIT
  - Creation DIT
  - Detail DIT
  - Soumissions et validation

### Donnees cibles
- Entites prioritaires:
  - DemandeIntervention
  - DevisMagasin
  - OrSoumis
  - BcSoumis
  - HistoriqueStatut

### Tests obligatoires
- Workflow DIT complet
- Historisation des transitions
- Validation des pieces et statuts

## 3.4 Magasin

### Source legacy principale
- Controllers: [ref/src/Controller/magasin](ref/src/Controller/magasin)
- API legacy: [ref/src/Api/magasin](ref/src/Api/magasin)
- Entites: [ref/src/Entity/magasin](ref/src/Entity/magasin)
- Repositories: [ref/src/Repository/magasin](ref/src/Repository/magasin)
- Services: [ref/src/Service/magasin](ref/src/Service/magasin)
- SQL: [ref/sql/magasin](ref/sql/magasin)

### Cible backend
- Module API: devis negoce, BC magasin, OR a traiter/livrer, pointage relance
- Endpoints cibles minimaux:
  - GET /magasin/devis
  - POST /magasin/devis/{id}/validate
  - POST /magasin/devis/{id}/submit-bc
  - GET /magasin/or/to-process
  - GET /magasin/or/to-deliver

### Cible frontend
- Ecrans:
  - Liste devis magasin
  - Soumission verification prix
  - Soumission validation devis
  - Soumission BC
  - Liste OR traiter/livrer

### Donnees cibles
- Entites prioritaires:
  - DevisMagasin
  - BcSoumis
  - MagasinPiece
  - StockMouvement

### Tests obligatoires
- Validations metier devis
- Coherence stock/mouvements
- Parcours OR traiter/livrer

## 4. Decoupage sprint-ready (premiere vague)

## Sprint 1 (Socle + Admin minimal)
1. Contrat erreur API standard
2. Endpoints lecture admin (users, roles, permissions, agences, services)
3. Ecran frontend liste utilisateurs
4. Tests ACL de base

## Sprint 2 (DA lecture + detail)
1. Endpoints GET DA liste/detail
2. Ecran liste DA + detail DA
3. Timeline DA en lecture
4. Tests integration DA lecture

## Sprint 3 (DIT lecture + creation)
1. Endpoints GET/POST DIT
2. Ecran liste DIT + creation DIT
3. Historique statut initial
4. Tests workflow DIT initial

## Sprint 4 (Magasin lecture + soumission)
1. Endpoints devis magasin lecture
2. Endpoint soumission verification prix
3. Ecran liste devis + ecran soumission
4. Tests metier soumission magasin

## 5. Definition of done par lot

Un lot est termine si:
1. API documentee et testee
2. UI fonctionnelle pour les cas nominaux
3. Statuts metier valides
4. Permissions verifiees
5. Non regression validee sur parcours critique

## 6. Prochaine extension conseillee

Apres ces 4 domaines, appliquer la meme matrice a:
1. POL
2. DOM
3. BADM
4. DDP/BDC
5. TIK
6. DW
