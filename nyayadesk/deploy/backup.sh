#!/bin/sh
# Nightly backup of the SQLite database (online-safe) to a dated file.
# Cron: 30 2 * * * /opt/nyayadesk/deploy/backup.sh
# Ship the output directory to object storage (e.g. S3 in ap-south-1) afterwards.
set -eu
OUT=${BACKUP_DIR:-/var/backups/nyayadesk}
mkdir -p "$OUT"
STAMP=$(date +%Y%m%d-%H%M)
docker compose exec -T app node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('/data/nyayadesk.db');
db.exec(\"VACUUM INTO '/data/backup-$STAMP.db'\");
"
docker compose cp "app:/data/backup-$STAMP.db" "$OUT/nyayadesk-$STAMP.db"
docker compose exec -T app rm -f "/data/backup-$STAMP.db"
find "$OUT" -name 'nyayadesk-*.db' -mtime +30 -delete
echo "Backup written to $OUT/nyayadesk-$STAMP.db"
