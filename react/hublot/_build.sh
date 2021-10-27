#!/usr/bin/bash
MSG=$(git log --format="Build %h, %cI" -n 1 HEAD)
cat > src/RPGitInfo.js <<EOF
export const RPGitInfo = "$MSG"
EOF
npm run build
