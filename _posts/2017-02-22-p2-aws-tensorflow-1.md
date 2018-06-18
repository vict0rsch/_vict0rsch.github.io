---
layout: post

title: AWS AMI for p2 instances with Tensorflow 1.0
subtitle: "Meet vict0rsch-2.0 from North Virginia"
cover_image: 
comments: true
excerpt: "Here is my second AMI, ugraded from the previous one with a lot of what you need"

tags:
  - AWS
  - GPU
  - Hardware

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---


# AMI

This new AMI has :

* Anaconda
* Python 3.5
* Keras 1.2.2
* **Tensorflow 1.0**

  -

* Cuda 8.0
* CuDNN 5.1

  -

* [Rsub](/2016/12/03/aws_gpu/#gui-text-editor)
* [(Oh-my) ZSH shell](https://github.com/robbyrussell/oh-my-zsh/)

I tried to add OpenCV 3.1.0 but ran into so much trouble I could not. Still an open issue here. I will add it for the next version. Add suggestions and other libraries you'd need in the comments!

# Location

Its name is **`vict0rsch-2.0`** and is located in the `us-east-1` region i.e. **N. Virginia** (because p2 instances are not (yet) in California)

# Tutorial

Also if you have troubles with connecting and managing the instance, do have a look at this other **[post](/2016/12/03/aws_gpu/)**!

# ZS-Whaaat?

ZSH is the default shell in this AMI. It will only make things easier compared to Bash. Nothing less, a few very useful things more like the smarter tab completion, Up-key history (if you type for instance `ssh -i` + Up-key it will go through the history of command starting like this, not all commands!) and also the [z](https://www.smashingmagazine.com/2015/07/become-command-line-power-user-oh-my-zsh-z/#using-z-to-jump-to-frecent-folders) shortcut if you often go to the same locations. Dive in!