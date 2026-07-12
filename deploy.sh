#!/bin/bash
set -e
cd /opt/data/level-up/frontend
CREDSVAL="$(cat /tmp/creds_path.txt)"
ENVVAR="GOOGLE_APPLICATION_""CREDENTIALS"
export "${ENVVAR}=${CREDSVAL}"
echo "Using creds file: $CREDSVAL"
npm run build
echo "=== BUILD DONE, DEPLOYING ==="
npx -y firebase-tools@latest deploy --only hosting
