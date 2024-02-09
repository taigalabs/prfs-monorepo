#/bin/bash

vercel link -p shy-docs-website --yes
vercel pull --environment=production
vercel build --prod
vercel deploy --prod --prebuilt
