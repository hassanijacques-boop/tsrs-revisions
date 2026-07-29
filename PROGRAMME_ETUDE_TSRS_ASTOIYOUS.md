# 🎯 Programme d'Étude Progressive — TSRS (Technicien Systèmes Réseaux & Sécurité)

**Pour Astoiyous — Formation BAC+2 (RNCP niveau 5) — EXPERNET Campus Mayotte**

---

## 📋 Les 5 Blocs de Compétences (ce qui sera évalué)

| Bloc | Intitulé | Poids |
|------|----------|-------|
| **1** | Déployer les matériels, les systèmes et le réseau | Important |
| **2** | Administrer des serveurs hétérogènes et un réseau multi-sites | Très important |
| **3** | Sécuriser l'environnement numérique d'exploitation | Très important |
| **4** | Entretenir un parc informatique | Moyen |
| **5** | Assurer le support technique auprès des utilisateurs | Important |

> ⚠️ **Pour valider le diplôme, il faut valider TOUS les blocs.** Chaque bloc donne lieu à un dossier de validation (60 pages minimum) + présentation orale de 20 minutes devant un jury.

---

# 📖 PROGRAMME D'ÉTUDE PROGRESSIF (6 étapes)

## 🔰 ÉTAPE 1 — Les Fondamentaux (À maîtriser AVANT la formation)

Ces bases sont supposées connues. Si Astoiyous les maîtrise déjà, il sera en avance.

### 1.1 Culture informatique générale
- Qu'est-ce qu'un ordinateur ? (CPU, RAM, disque dur, carte mère)
- Qu'est-ce qu'un système d'exploitation ? (Windows, Linux, macOS)
- Différence entre logiciel et matériel
- Les types de réseaux : LAN, WAN, WLAN

### 1.2 Numération et unités informatiques
| Concept | À comprendre |
|---------|-------------|
| Binaire (0/1) | Comment un ordinateur stocke l'information |
| Décimal → Binaire → Hexadécimal | Savoir convertir |
| Octet, Ko, Mo, Go, To | Connaître les ordres de grandeur |
| Bit vs Octet | 1 octet = 8 bits |

**🎯 Objectif :** Être à l'aise avec les conversions (ex: 192 en binaire = 11000000)

### 1.3 Le modèle OSI (le "squelette" du réseau)
C'est **LA base** de tout le programme réseau :

| Couche | Nom | Exemple | Rôle simple |
|--------|-----|---------|-------------|
| 7 | Application | HTTP, FTP, SMTP | Logiciels que tu utilises |
| 6 | Présentation | SSL/TLS | Traduction des données |
| 5 | Session | NetBIOS | Gestion des connexions |
| 4 | Transport | TCP, UDP | Fiabilité de l'envoi |
| 3 | Réseau | IP, Routage | Adressage et chemin |
| 2 | Liaison | Ethernet, MAC | Accès au support physique |
| 1 | Physique | Câbles, Fibre | Le support lui-même |

**📌 Mnémo simple :** "**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way" (Physique-Donnée-Réseau-Transport-Session-Présentation-Application)

### 1.4 Premier contact avec les commandes
- `ipconfig` / `ifconfig` — voir son adresse IP
- `ping` — tester une connexion
- `tracert` / `traceroute` — voir le chemin parcouru
- `nslookup` — interroger un serveur DNS

**Ressources gratuites :**
- [Cisco Networking Academy — cours gratuits](https://www.netacad.com/)
- YouTube : "Modèle OSI expliqué simplement"
- Application mobile : "Packet Tracer" pour simuler des réseaux

---

## 📘 ÉTAPE 2 — Systèmes d'Exploitation (Windows & Linux)

### 2.1 Windows Client & Serveur

#### Windows Client (poste de travail)
- **VMware Workstation** : créer des machines virtuelles pour tester sans casser
- **Ligne de commande** (cmd) : commandes de base (dir, cd, copy, del, mkdir)
- **Gestion du stockage** : disques, partitions, formats (NTFS, FAT32)
- **Gestion des utilisateurs** : créer/supprimer des comptes
- **Permissions NTFS** : qui peut lire/écrire/exécuter
- **Partage de fichiers** : dossiers partagés sur le réseau
- **Pare-feu Windows** : ouvrir/fermer des ports
- **PowerShell (début)** : l'évolution de cmd, très puissant

#### Windows Server (serveur)
- **Active Directory (AD)** : l'annuaire qui gère tous les utilisateurs
- **DHCP** : attribue automatiquement les adresses IP
- **DNS** : transforme les noms (ex: google.com) en adresses IP
- **Stratégies de groupe (GPO)** : appliquer des règles à tous les PC
- **RDS** : bureau à distance
- **WDS** : déploiement d'images Windows sur plusieurs PC

### 2.2 Linux (Ubuntu/Debian)

#### Premiers pas
- **Arborescence** : `/` (racine), `/home`, `/etc`, `/var`, `/bin`
- **Commandes essentielles** : `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv`
- **Aide** : `man` + nom_commande
- **Éditeur Vim** : savoir ouvrir, éditer, sauvegarder (i pour insérer, Esc, :wq pour quitter)

#### Administration
- **Gestion des paquets** : `apt install`, `apt update`, `apt upgrade`
- **Utilisateurs** : `adduser`, `passwd`, `groupadd`
- **Permissions** : `chmod`, `chown` — comprendre rwx (lecture/écriture/exécution)
- **Disques** : partitionnement, montage, LVM
- **Processus** : `ps`, `top`, `kill`
- **Planification** : `cron` pour des tâches automatiques
- **Journalisation** : `syslog`, `journalctl`

**RESOURCES POUR APPRENDRE :**
- 🆓 Installer Linux sur VMware = gratuit et sans risque
- 📺 Chaines YouTube : "Linux pour débutants", "Grafikart"
- 📖 Livre : "Linux — Les bases indispensables" (Eyrolles)
- 🎮 Site : [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) — apprendre Linux en jouant

---

## 🌐 ÉTAPE 3 — Réseaux (Le Cœur du Métier)

### 3.1 Adressage IPv4 — À maîtriser ABSOLUMENT

| Notion | Explication |
|--------|-------------|
| Adresse IP | Identifiant unique d'un appareil sur le réseau |
| Masque de sous-réseau | Sépare la partie réseau de la partie machine |
| Passerelle (Gateway) | La porte de sortie vers Internet |
| DNS | L'annuaire téléphonique d'Internet |
| Classes d'adresses | A (grands réseaux), B (moyens), C (petits) |
| CIDR | Notation moderne : /24 = 255.255.255.0 |

**Exemple concret :**
- IP : `192.168.1.10`
- Masque : `255.255.255.0` (/24)
- Réseau : `192.168.1.0`
- Broadcast : `192.168.1.255`
- Passerelle : `192.168.1.1` (la box)

### 3.2 Équipements réseau

| Équipement | Couche OSI | Rôle |
|------------|-----------|------|
| **Hub** | 1 | Multiprise réseau (obsolète) |
| **Switch** | 2 | Relie les PC entre eux sur un même réseau |
| **Routeur** | 3 | Relie différents réseaux (ex: LAN → Internet) |
| **Pare-feu** | 3-4 | Filtre le trafic, protège |
| **Bornes WiFi** | 1-2 | Accès sans fil |

### 3.3 VLAN et QoS
- **VLAN** : découper un switch en plusieurs petits réseaux virtuels
- **QoS** : prioriser certains flux (ex: la voix avant le téléchargement)

### 3.4 Routage
- **Statique** : chemins écrits à la main
- **Dynamique** : protocoles comme OSPF, RIP qui apprennent automatiquement
- **NAT** : permet à plusieurs PC de partager une seule IP publique

### 3.5 Initiation Cisco
- Interface en ligne de commande Cisco (IOS)
- Commandes de base : `enable`, `configure terminal`, `show running-config`
- Outil gratuit : **Cisco Packet Tracer** pour simuler des réseaux

### 3.6 Téléphonie sur IP (ToIP/VoIP)
- La voix devient des données numériques
- Protocoles : SIP (signalisation), RTP (transport de la voix)
- **IPBX** : le standard téléphonique numérique (ex: Asterisk, 3CX)

---

## 🔐 ÉTAPE 4 — Sécurité & Cloud

### 4.1 Cybersécurité — Fondamentaux

- **Pilier CIA** : Confidentialité, Intégrité, Disponibilité
- **Menaces courantes** : virus, phishing, ransomware, DDOS
- **Pare-feu** : filtrer le trafic entrants/sortants
- **VPN** : tunnel chiffré pour accéder au réseau depuis l'extérieur
- **Antivirus / EDR** : protection des postes
- **PKI** : infrastructure de gestion des certificats
- **DMZ** : zone démilitarisée (serveurs accessibles depuis Internet)

### 4.2 Cloud Computing

| Modèle | Signification | Exemple |
|--------|--------------|---------|
| **SaaS** | Logiciel en ligne | Office 365, Gmail |
| **PaaS** | Plateforme pour développer | Heroku, AWS Elastic Beanstalk |
| **IaaS** | Infrastructure virtuelle | AWS, Azure, Google Cloud |

- **Office 365** : Exchange Online (messagerie), SharePoint (collaboration)
- **Migration vers le Cloud** : savoir déplacer des services

### 4.3 Supervision
- **SNMP** : protocole de gestion des équipements
- **Nagios / Centreon** : surveiller l'état des serveurs et services
- **GLPI** : gestion de parc et helpdesk

---

## 📜 ÉTAPE 5 — Scripting & Automatisation

### 5.1 Bash (Linux)
```bash
#!/bin/bash
# Variables
NOM="Astoiyous"
echo "Bonjour $NOM"

# Condition
if [ -f "/etc/passwd" ]; then
    echo "Fichier trouvé"
fi

# Boucle
for i in 1 2 3; do
    echo "Compteur: $i"
done
```

### 5.2 PowerShell (Windows)
```powershell
# Variables
$nom = "Astoiyous"
Write-Host "Bonjour $nom"

# Condition
if (Test-Path "C:\Windows") {
    Write-Host "Windows existe"
}

# Boucle
1..3 | ForEach-Object {
    Write-Host "Compteur: $_"
}
```

### 5.3 Algorithmique
- Logique de base (si/alors, boucles, fonctions)
- Savoir lire et écrire un pseudo-code
- Résoudre des problèmes simples avant de coder

---

## 🌍 ÉTAPE 6 — Compétences Transversales

### 6.1 Anglais technique — Objectif TOEIC 650
- Vocabulaire réseau : router, switch, firewall, bandwidth, latency
- Support utilisateur en anglais : "Please restart your computer"
- Lire des documentations techniques en anglais
- **Application** : Duolingo quotidien + chaîne YouTube "TechTerms"

### 6.2 Gestion de parc avec GLPI
- Inventaire du matériel
- Gestion des tickets (helpdesk)
- Suivi des interventions

### 6.3 Green IT (Informatique durable)
- Reconditionnement du matériel
- Bonnes pratiques écoresponsables
- Méthode 4R : Réduire, Réparer, Réemployer, Recycler

---

# 🎯 Objectifs par semaine (avant la formation)

| Semaine | Objectif |
|---------|----------|
| **S1** | Comprendre le modèle OSI + conversions binaires |
| **S2** | Adressage IPv4 : classes, masques, CIDR |
| **S3** | Installer VMware + Ubuntu en virtuel, premières commandes Linux |
| **S4** | Linux avancé : fichiers, permissions, processus |
| **S5** | Windows : AD, DHCP, DNS (vidéos YouTube) |
| **S6** | Packet Tracer : monter un mini-réseau |
| **S7** | Scripting Bash : premiers scripts |
| **S8** | Sécurité : pare-feu, VPN, quiz cybersécurité |

**⏱ Temps recommandé :** 30 min à 1h par jour — la régularité est plus importante que la durée.

---

## 🛠 Ressources GRATUITES recommandées

| Ressource | Pour quoi ? | Lien |
|-----------|------------|------|
| **Cisco Packet Tracer** | Simuler des réseaux | netacad.com |
| **VMware Workstation Player** | Machines virtuelles (gratuit pour usage perso) | vmware.com |
| **TryHackMe** | Cybersécurité en s'amusant (débutant gratuit) | tryhackme.com |
| **OverTheWire: Bandit** | Apprendre Linux en jeu | overthewire.org |
| **YouTube: NetworkChuck** | Réseaux expliqués simplement | youtube.com |
| **OpenClassrooms** | Cours gratuits "Apprenez le fonctionnement des réseaux" | openclassrooms.com |
| **Duolingo** | Anglais technique quotidien | duolingo.com |

---

## 🏢 Que chercher comme entreprise sur Mayotte ?

La responsable a raison : **pas besoin que ce soit une entreprise d'informatique pure**. Beaucoup d'entreprises ont un service informatique interne. Voici des pistes :

### 🏛 Administrations et collectivités
- **Conseil Départemental de Mayotte** (DSI — Direction des Systèmes d'Information)
- **Villes et communes** : Mamoudzou, Koungou, Bandraboua, etc. — ont des services informatiques
- **Centre Hospitalier de Mayotte** (CHM) — gros SI
- **Services de l'État** : Préfecture, DEAL, rectorat

### 📡 Opérateurs télécoms
- **Mayotte Mobile** (ex-Only)
- **Orange Réunion-Mayotte**
- **SFR Mayotte**
- **Zeop**

### 🏦 Banques et assurances
- **BFC Mayotte** (Banque de La Réunion)
- **Socoemo**
- **BIM**

### 🏭 Grandes entreprises présentes à Mayotte
- **Edena** — électricité
- **SMAE** — eau et assainissement
- **Aéroport de Mayotte**
- **CMA CGM** — transport maritime
- **Grandes surfaces** : Score, Jumbo, Sodifram — ont des services informatiques

### 🏗 PME/PMI locales
- Revendeurs informatiques (sav, maintenance)
- Prestataires de services (installateurs de réseaux, caméras)
- Télésurveillance / sécurité électronique

### 🏠 Chez des artisans du numérique à Mayotte
- Petites ESN (Entreprises de Services du Numérique) mahoraises
- Auto-entrepreneurs en maintenance informatique

### 💡 Comment chercher ?
1. **Faire une liste** des entreprises et administrations près de Bandraboua / Mamoudzou
2. **Appeler ou se déplacer** directement + CV et lettre de motivation en main
3. **Questionnaire au centre de formation** : EXPERNET a peut-être un carnet d'adresses d'entreprises partenaires
4. **Pôle emploi / France Travail Mayotte** : demander la liste des entreprises qui prennent des alternants
5. **LinkedIn** : chercher "DSI Mayotte", "Service informatique Mayotte"
6. **Bouche-à-oreille** : les réseaux locaux sont très importants à Mayotte

---

## ✅ VÉRIFICATION FINALE

Avant le début de la formation, Astoiyous devrait être capable de :

- [ ] Citer les 7 couches du modèle OSI
- [ ] Convertir une adresse IP en binaire
- [ ] Calculer un masque de sous-réseau
- [ ] Installer Ubuntu sur VMware
- [ ] Naviguer dans l'arborescence Linux (cd, ls, pwd)
- [ ] Expliquer ce qu'est Active Directory
- [ ] Faire un ping et lire le résultat
- [ ] Écrire un script Bash qui dit "Bonjour"
- [ ] Comprendre une doc technique simple en anglais

---

*"Celui qui a une connaissance solide des bases ne sera jamais perdu quand viendront les choses complexes."*

**Bon courage à Astoiyous ! 🤲**
