#/bin/bash

vercel link -p shy-webapp --yes
vercel pull --environment=production
vercel build --prod
vercel deploy --prod --prebuilt
