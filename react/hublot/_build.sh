#!/usr/bin/bash
MSG=$(git log --format="Build %h, %cI" -n 1 HEAD)
cat > src/RPGitInfo.js <<EOF
export const RPGitInfo = "$MSG"
EOF
echo "GIT HASH: $MSG"
echo -n "Build started at " ; date
npm run build
echo -n "Build ended at " ; date

