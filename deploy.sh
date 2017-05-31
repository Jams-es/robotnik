#!/usr/bin/env bash
zip -r artifact index.js package.json package-lock.json node_modules/
curl -F artifact=@./artifact.zip -F project=$MOLLY_PROJECT -F token=$MOLLY_TOKEN $MOLLY_URL"/deploy"
