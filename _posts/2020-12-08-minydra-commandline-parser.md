---
layout: post
title: "Minydra: a simple versatile Python command-line parser"
comments: true
cover_image: lizard.jpeg
excerpt: "Minydra allows you to parse arbitrary arguments passed through the commandline: strings, bools, numbers, lists and dicts. Ideal to handle complex configs without getting into the complexities of Hydra."
tags:
  - Python
  - Code
author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch
---

![minydra code example](https://raw.githubusercontent.com/vict0rsch/minydra/main/assets/code.png)

## Parse anything

Some argument parsers focus on security, others on automating help or on holding your hand, catching you when you fall before you hit the ground.

[**Minydra**](https://github.com/vict0rsch/minydra) is about freedom.

You can use it to parse arbitrary command-line arguments, it will accept any value, it will handle `int` `float` `bool` `lists`, `dicts` and dotted notations to specify nested keys.

![minydra call example](https://raw.githubusercontent.com/vict0rsch/minydra/main/assets/run.png)

Freedom has a price: Minydra will most often not break, especially not on typos. You might go crazy because of it. Just be aware of that.

```
pip install minydra
```

## MinyDict: enjoy dicts and dotted notations

Minydra's `Parser` parses the arguments the script receives into its `parser.args` argument. This is a custom class built upon Python's `dict` to enjoy dotted notations, auto-resolving dotted keys, with a `pretty_print()` method. Everything else's just a dict so you can use them as usual. It is not as advanced and versatile as dedicated libraries like `addict` or `bunch` but it's lightweight and without dependency.

![minydra's minydict](https://raw.githubusercontent.com/vict0rsch/minydra/main/assets/minydict.png)


## Using it in Machine Learning

I work on a large, shared project with large and nested configurations: hundreds of possible command-line overwrites from the default parameters.

Before [Facebook's Hydra](https://hydra.cc/) shifted away from `strict=False`, I used it to handle arbitrary changes to a configuration. Now instead of being stuck with `hydra-core==0.11.3` and `omegaconf==1.4.1` I decided to build my own lightweight tool.

Hydra's great to mix hierarchical configuration, run hyper-parameter searches and store everything in a specific structure. If you want to bind the arguments in your command-line to a configuration file as a safety net to make your interface more robust I suggest you use Hydra instead.

[Minydra](https://github.com/vict0rsch/minydra)'s spirit is to let you do whatever you want. You just need to want what's good for you :)

In my case this means I have a default config and I run jobs using `slurm`. So running experiments means writing a job-script. Every single time. Which I do with Python: a `yaml` config specifies overrides to the defaults which are passed as command-line arguments to the job.