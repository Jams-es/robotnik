#!/usr/bin/env bash
npm run doc
zip -r artifact index.js package.json package-lock.json src/ docs/
curl -F artifact=@./artifact.zip -F project=$MOLLY_PROJECT -F token=$MOLLY_TOKEN $MOLLY_URL"/deploy"
