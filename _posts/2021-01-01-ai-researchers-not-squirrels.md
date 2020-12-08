---
layout: post
title: "We're AI researchers, not squirrels, learn how to code."
comments: true
cover_image:
excerpt: "Just because you are doing research does not mean your code quality does not matter. Personal feedback to improve your code, onboard your interns, be more efficient."
tags:
  - PyTorch
  - Code
author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch
draft: true
---

cd $HOME
mkdir bucket
cd bucket
gsutil -m cp -R gs://vicc-ai-dev/100postalcode .
gsutil -m cp -R gs://vicc-ai-dev/v1-weights .
cd $HOME/omnigan
python tpus.py -o /home/victor/outputs -d ~/bucket/100postalcode -m ~/bucket/v1-weights/masker -p ~/bucket/v1-weights/painter