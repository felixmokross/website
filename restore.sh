#!/bin/sh

. .env

echo "Dropping database…"
mongosh $RESTORE_DATABASE_URI <<EOF
db.getCollectionNames().filter(c => !['users', 'payload-preferences'].includes(c)).forEach((c) => { db.getCollection(c).drop(); });
EOF

echo ""
echo "Restoring database…"
mongorestore --uri $RESTORE_DATABASE_URI  --nsExclude payload.users --nsExclude payload.payload-preferences --drop .backup/website-cms

echo "Restoring S3 bucket…"
aws s3 sync ./.s3-backup $RESTORE_S3_BUCKET --delete --profile website

echo "Done"