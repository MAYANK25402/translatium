#!/bin/bash

npm install -g harp
npm install bulma@0.4.0
mv ./node_modules ./_node_modules
harp compile
cd www
git init
git checkout -b gh-pages
git add .
git -c user.name='Quang Lam' -c user.email='quang.lam2807@gmail.com' commit -m init
git remote add origin "https://$GH_TOKEN@github.com/modern-translator/website.git"
git push origin gh-pages -f --quiet > /dev/null 2>&1
