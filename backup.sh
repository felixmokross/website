#!/bin/sh

. .env

echo "Backing up database…"
tar -c -z -f .previous-backup.tar.gz .backup
rm -r .backup
mongodump --uri $BACKUP_DATABASE_URI --out .backup

echo "Backing up S3 bucket…"
aws s3 sync $BACKUP_S3_BUCKET ./.s3-backup --delete --profile website

echo "Done"