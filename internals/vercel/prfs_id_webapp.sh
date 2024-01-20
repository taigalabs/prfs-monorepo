#/bin/bash

vercel link -p prfs-id-webapp --yes
vercel pull
vercel build --prod
vercel deploy --prod --prebuilt
