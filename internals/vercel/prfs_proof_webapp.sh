#/bin/bash

vercel link -p prfs-proof-webapp --yes
vercel pull --environment=production
vercel build --prod
vercel deploy --prod --prebuilt
