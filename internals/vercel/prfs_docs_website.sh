#/bin/bash

vercel link -p prfs-docs-website --yes
vercel pull --environment=production
vercel build --prod
vercel deploy --prod --prebuilt
