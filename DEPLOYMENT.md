# Deployment Guide

Schritt-für-Schritt Anleitung für die Veröffentlichung der Website.

## Schnell-Deployment (für Eilige)

```bash
# 1. Alle Dateien auf Server hochladen
scp -r . user@server:/var/www/html/

# 2. Rechte setzen
ssh user@server "chmod -R 755 /var/www/html/"

# 3. Fertig!
```

## Detailliertes Deployment

### 1. Voraussetzungen prüfen

- [ ] Webspace mit PHP 7.4+ verfügbar
- [ ] FTP/SFTP/SSH Zugang vorhanden
- [ ] Domain eingerichtet (feuerwehr-esselborn.de)
- [ ] SSL-Zertifikat vorhanden (Let's Encrypt empfohlen)

### 2. Dateien vorbereiten

Lokale Prüfung vor dem Upload:

```bash
# Größe checken
du -sh .

# Wichtige Dateien vorhanden?
ls -la index.php css/style.css js/main.js

# JSON-Dateien validieren
php -r "json_decode(file_get_contents('data/mannschaft.json')); echo json_last_error() === JSON_ERROR_NONE ? 'OK' : 'FEHLER';"
```

### 3. Upload-Methoden

#### Option A: FTP/SFTP (für Anfänger)

1. FileZilla oder ähnliches FTP-Programm öffnen
2. Mit Server verbinden
3. Alle Dateien in das Web-Verzeichnis hochladen

#### Option B: SSH/SCP (empfohlen)

```bash
# Kompletter Upload
scp -r . user@server:/var/www/feuerwehr-esselborn.de/

# Oder via rsync (schneller bei Updates)
rsync -avz --exclude='.git' --exclude='README.md' . user@server:/var/www/feuerwehr-esselborn.de/
```

#### Option C: Git Deployment (fortgeschritten)

```bash
# Auf Server:
git clone https://github.com/muellerlukasopenclaw-design/feuerwehr-esselborn-website.git /var/www/feuerwehr-esselborn.de/

# Für Updates:
cd /var/www/feuerwehr-esselborn.de/ && git pull
```

### 4. Server-Konfiguration

#### Apache (.htaccess)

Die `.htaccess` Datei ist bereits im Repository enthalten:

- GZIP-Kompression aktiviert
- Browser-Caching für Assets
- Security-Headers
- Rewrite Rules für Clean URLs

#### Nginx

Falls Nginx verwendet wird, folgende Config im Server-Block:

```nginx
# GZIP
gzip on;
gzip_types text/css application/javascript application/json;

# Browser Caching
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# PHP für JSON-Lade
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
}
```

### 5. Berechtigungen setzen

```bash
# Auf Server:
chown -R www-data:www-data /var/www/feuerwehr-esselborn.de/
find /var/www/feuerwehr-esselborn.de/ -type f -exec chmod 644 {} \;
find /var/www/feuerwehr-esselborn.de/ -type d -exec chmod 755 {} \;
```

### 6. SSL-Zertifikat (Let's Encrypt)

```bash
# Certbot installieren (falls nicht vorhanden)
sudo apt install certbot python3-certbot-apache

# Zertifikat beantragen
sudo certbot --apache -d feuerwehr-esselborn.de -d www.feuerwehr-esselborn.de

# Auto-Renew testen
sudo certbot renew --dry-run
```

### 7. Post-Deployment Tests

- [ ] Website lädt unter HTTPS
- [ ] Alle Menüpunkte funktionieren
- [ ] JSON-Daten werden geladen (Mitgliederliste)
- [ ] Mobile Ansicht funktioniert
- [ ] Keine 404-Fehler in Konsole
- [ ] PageSpeed Insights Score > 80

### 8. Backup einrichten

```bash
# Backup-Script erstellen
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backup/feuerwehr-$DATE.tar.gz /var/www/feuerwehr-esselborn.de/
# Optional: Alt-Backups löschen (älter als 30 Tage)
find /backup/ -name "feuerwehr-*.tar.gz" -mtime +30 -delete
```

## Troubleshooting

### Problem: JSON-Daten werden nicht geladen

**Ursache:** PHP nicht aktiviert oder falsche Berechtigungen

**Lösung:**
```bash
# PHP-Modul prüfen
php -m | grep json

# Berechtigungen korrigieren
chmod 644 data/*.json
```

### Problem: 500 Internal Server Error

**Ursache:** .htaccess Syntax-Fehler

**Lösung:**
```bash
# Apache Config testen
apachectl configtest

# .htaccess vorübergehend umbenennen
mv .htaccess .htaccess.bak
```

### Problem: CSS/JS wird nicht geladen (404)

**Ursache:** Falsche Pfade oder fehlende Dateien

**Lösung:**
```bash
# Dateien vorhanden?
ls -la css/style.css js/main.js

# Pfad im HTML prüfen (sollte relativ sein: css/style.css)
```

## Update-Workflow

```bash
# 1. Lokal testen
php -S localhost:8000

# 2. Auf Server deployen
rsync -avz --exclude='.git' . user@server:/var/www/feuerwehr-esselborn.de/

# 3. Cache leeren (falls CDN verwendet wird)
# Cloudflare: Development Mode aktivieren

# 4. Online testen
```

## Performance-Monitoring

Empfohlene Tools:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Zielwerte:
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
