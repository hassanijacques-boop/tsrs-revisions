#!/usr/bin/env bash
set -euo pipefail

# =============================================================
# Script de déploiement pour Hifz & Récitation Sentinel
# =============================================================
# Utilisation :
#   sudo bash deploy.sh /chemin/vers/le/site [nom-de-domaine.com]
#
# Exemple :
#   sudo bash deploy.sh /var/www/quran-app mon-domaine.com
# =============================================================

INSTALL_DIR="${1:-/var/www/quran-app}"
DOMAIN="${2:-localhost}"

echo "📦 Installation de l'application Hifz & Récitation Sentinel"
echo "   Répertoire : $INSTALL_DIR"
echo "   Domaine     : $DOMAIN"
echo ""

# 1. Vérifier qu'on est root
if [[ $EUID -ne 0 ]]; then
    echo "❌ Ce script doit être exécuté en root (sudo)."
    exit 1
fi

# 2. Installer Nginx si pas présent
if ! command -v nginx &>/dev/null; then
    echo "📥 Installation de Nginx..."
    apt-get update -qq
    apt-get install -y -qq nginx
fi

# 3. Copier les fichiers
echo "📂 Copie des fichiers vers $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
cp -r ./* "$INSTALL_DIR/"
cp nginx.conf /etc/nginx/sites-available/quran-app

# 4. Configurer le domaine dans Nginx
sed -i "s/server_name ton-domaine.com www.ton-domaine.com;/server_name $DOMAIN;/g" /etc/nginx/sites-available/quran-app
sed -i "s|root /var/www/quran-app;|root $INSTALL_DIR;|g" /etc/nginx/sites-available/quran-app

# 5. Activer le site
if [[ ! -f /etc/nginx/sites-enabled/quran-app ]]; then
    ln -sf /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/
fi

# 6. Tester la config Nginx
echo "🔍 Test de la configuration Nginx..."
nginx -t

# 7. Redémarrer Nginx
echo "🔄 Redémarrage de Nginx..."
systemctl restart nginx

echo ""
echo "✅ Déploiement terminé !"
echo "   Application accessible sur : http://$DOMAIN"
echo ""
echo "   ⚠️  Assure-toi que ton DNS pointe vers ce serveur."
echo "   ⚠️  Pour du HTTPS, installe Certbot :"
echo "       sudo apt install certbot python3-certbot-nginx"
echo "       sudo certbot --nginx -d $DOMAIN"
