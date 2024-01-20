#/bin/bash

vercel link -p shy-docs-website --yes
vercel pull
vercel build --prod
vercel deploy --prod --prebuilt
