---
layout: post
title: "A Calculator to quantify AI's carbon emissions"
comments: true
cover_image:
excerpt: "With a team of fellow researchers, I developped an online calculator allowing you to compute your GPU's CO2 emissions"
tags:
  - General
  - Climate Change
author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch
---

# Mila and Element AI researchers launch an AI carbon footprint calculator

With Alexandre Lacoste from Element AI, Sasha Luccioni from Mila and Thomas Dandres from Polytechnique Montreal, we have created the [**Machine Learning Emissions Calculator**](https://mlco2.github.io/impact), a tool for the AI community to better understand the environmental impact of training their models.

![ai calculator thumbnail](https://github.com/mlco2/impact/blob/master/img/thumbnail.png?raw=true)

Based on information such as the location of the server and the energy grid used, the length of the training, and even the make and model of hardware, the calculator can output an **estimate of the quantity of CO2 equivalents that have been produced**. Cloud providers often offset their carbon emissions so the calculator will also show how much of the emitted carbon was offset.

This is important information to take into consideration because modern Machine Learning (ML) approaches use large models trained on ever-growing amounts of data, which results in increasing emissions. Moreover, even though these emissions may be offset in some way, current offsetting systems are far from perfect and promoting awareness and transparency in emissions may help improving them. To that end, the website also automatically generates a template paragraph based on the calculator’s output which researchers can then include in their scientific publications, in the popular LaTeX format.

![latex template](/images/template.png)

The calculator's website also includes information regarding key concepts such as offsetting and carbon neutrality, as well as concrete actions that can be taken to reduce emissions, in the hopes that the Artificial Intelligence community will use it to learn more about the environmental impact of their field and will include this information in their research work.

We released this CO2 calculator as part of a publication in [NeurIPS’s](https://neurips.cc/) [Climate Change AI workshop](https://www.climatechange.ai/NeurIPS2019_workshop), a special track dedicated to promoting Machine Learning as a tool useful both in reducing greenhouse gas emissions and in helping society adapt to the effects of climate change. We hope that the paper, the website and the generated emissions template together will foster a healthy and informed discussion in their community, based on emissions reporting and open data.

[**Read our paper on ArXiv**](https://arxiv.org/abs/1910.09700)

[**Twitter thread**](https://twitter.com/vict0rsch/status/1205200957438615552)

[**Github repo**](https://github.com/mlco2/impact)
