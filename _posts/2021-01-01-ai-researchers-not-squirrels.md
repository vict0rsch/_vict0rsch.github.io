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

This post contains my personal experience and setup (local development using macOS, remote cluster usage with Linux using SLURM). It's surely not optimal but I think it's a reasonable middle ground between professional software engineering and quick-and-dirty experimental iterations. I think it's a good starting place for researchers who want to up their Python game without too much overhead and extra knowledge

**DISCLAIMER**: in this guide, I'll advise you to install some software which I personnally use. I have no interest in this beyond helping out. If anything goes wrong, stop installing things and Google around or ask for help on Stackoverflow or on the software's Issues, I will not be able to help you for this nor am I responsible for anything that breaks down for any reason.

## Terminal

macOS's default Terminal App is fine. But [iTerm2](https://iterm2.com/downloads.html) is more advanced, customizable and handles remote connections better (see [Features](https://iterm2.com/features.html))

Example: Inline images:

![iterm2 inline images](https://iterm2.com/img/screenshots/v3-screen-shots/iterm2-inline-images-demo.gif)

## Shell

Doing AI research means spending some time in the terminal. This does not have to be a difficult and dull experience. A good alternative to the vanilla `bash` shell on your Mac or Linux machine (I'm a Mac user so I may be wrong from time to time about Linux, forgive me) is `zsh` and better still `oh-my-zsh` (a set of plugins on top of `zsh`).

Follow a few steps and this is what your shell will look like, when you get used to pressing `tab` all the time and using [`z`](https://github.com/agkozak/zsh-z) to move around


![zsh iterm2 capture](/images/zsh.gif)

## Homebrew

[Homebrew](https://brew.sh/) is a macOS package manager and a lot of tools can be installed using Homebrew. Like `pyenv` which we'll use in a minute. You probably already have it (check the output of `which brew`). If you don't let's install it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Python

### Versions

You typically have 1 python interpreter on your machine, try: `which python` to see where it points to.

When working on multiple projects (at once or over the years) you may end up using several Python versions. I was personnally happy with `3.6.4` until it got deprecated, then switched to `3.8.2` until a coworker started a project requiring `3.9.2`.

A super easy way to handle those versions is to use [`pyenv`](https://github.com/pyenv/pyenv#how-it-works). Once you install it (wait a minute) you'll be able to do things like:

```bash
$ pyenv install 3.9.2 # download and install a new python version
$ pyenv global 3.9.2 # set it as the new global default `python` command on your computer
# or
$ pyenv local 3.9.2 # make your computer use pyenv's 3.9.2 python version whenever you get to the **current working directory**
# or
$ pyenv shell 3.9.2 # make `python` point to pyenv's 3.9.2 version just for the current shell (but anywhere)
```

([more commands](https://github.com/pyenv/pyenv/blob/master/COMMANDS.md#pyenv-local))

Now let's get to it. Detailed instructions are available (of course...) [on their repository](https://github.com/pyenv/pyenv#installation) but here's what to do if you have a macOS + zsh setup as I do (*check this article's date: it may become outdated - check the online repo if you have doubts*):

```bash
$ brew update # update brew (no shit)
$ brew install pyenv # install pyenv (sherlock)
$ echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
$ echo 'eval "$(pyenv init -)"' >> ~/.zshrc
$ brew install openssl readline sqlite3 xz zlib # install python build dependencies
$ pyenv install 3.9.2 # you're done!
```

Now you can use python versions around without conflicts and with a couple of commands only.

### Virtual environments

*(this should be identical for macOS and Linux)*

Even with a single Python version you can have issues. One good reason for that is that packages you use will have different functions, arguments, APIs in general and/or bugs for different versions. So if you work in a team or if you develop things locally and run them on a cluster, you really want to make sure you're all on the same page, *i.e.* using the exact same package versions.

To do that you can use *virtual environments*. This essentially creates a new Python installation in the current working directory from the current `python` version you're using. More: [Python Virtual Environments: A Primer
](https://realpython.com/python-virtual-environments-a-primer/).

```bash
$ python -m venv your_env # create a virtual environment called `your_env`
$ ls # venv created a new folder with your environment
your_env/
$ source your_env/bin/activate  # change `python` to point to this new environment for the current shell
(your_env) $ which python # check `python` points to the right place
path/to/your_env/bin/python
(your_env) $ which pip # so does `pip`
path/to/your_env/bin/pip
(your_env) $ pip install ipython # install a package
...
(your_env) $ which ipython # it's in your env! (not in your system's `python` or another env)
path/to/your_env/bin/ipython
(your_env) $ deactivate # deactivate the environment, `python` is set back to the previous interpreter.
```

`venv` relies on the `python` command and will therefore use the current Python version to create the virtual environment. How can you use a different Python version? Well, you guessed it, by using `pyenv`!

```bash
$ pyenv shell 3.9.2
$ python -m venv your_env
```

By creating virtual environments from the same `requirements.txt` files on different machines (your laptop and a clsuter for instance) you're greatly lowering the chances of code working locally when developping but failing remotely because of package versions being different. It's not going to protect you from everything, but at least this is taken care of.

#### Requirements

Just a side-step, how do you create those `requirements.txt` files? Well it's fairly easy:

```bash
(your_env) $ pip freeze > requirements.txt
# I prefer the following specifyinng the python version you're using
(your_env) $ pip freeze > requirements-3.9.2.txt
```

`freeze` is going to write the list of currently installed packages *for the current python interpreter* along with their version number. This is why activating the virtual environment beforehand is critical.

### All in all

Now after intallation my typical workflow is

```bash
$ pyenv shell 3.9.2
$ python -m venv some_env
$ source some_env/bin/activate
(some_env) $ pip install -r requirements.txt
```

There are other ways of doing all of this, incluing using `Anaconda` or `virtualenvwrapper`. I like this setup because it stays close to defaults, it's not too fancy and I don't get lost in abstractions. But do investigate further, many actuall [prefer Anaconda](https://stackoverflow.com/questions/34398676/does-conda-replace-the-need-for-virtualenv)

**Further reading** -> (*I discovered this after writing this Python section*) [An Effective Python Environment: Making Yourself at Home](https://realpython.com/effective-python-environment/)

## TODO FLAKE8 BLACK

## Git and Github

`git` can be the topic of an entire book collection. This section's goal is **not** to teach you how to use git proficiently, rather to illustrate what 80% of a workflow *can* be and you'll be free to choose otherwise when you get more comfortable.

### Getting started with Git

I expect you've heard of `git`. If not, this section may be a little too quick for you, I suggest you go learn a little and come back. Otherwise just know that it's a version-control system, meaning it's going to track files and how they change over time as you work on them and then you can go back in time retrieve a lost piece of code, merge work from different people etc.

While you *can* use `git` without Github, I think it's standard practice to use Github (or Gitlab) for two reasons: it stores your code online so if you lose your computer you don't lose work, and it's syncing files for collaboration with other people. So in general you have `git` tracking changes on your machine and add Github as a *remote*.

Now here's my standard workflow:

1. Go to my Github account

    1. Create a repository
    2. Choose a license (always do if the repo is public)
    3. Copy the "download" address: something like `git@github.com:<user>/<repo>.git`

2. Clone the repository: `git clone git@github.com:<user>/<repo>.git`
3. Go there: `cd repo/`
4. Do wome work
5. Add new files to be tracked by `git`: `git add .` (this adds **all** files currently present in the directory)
6. "Save the current state" as a `commit` with a name `git commil -a -m "adding initial files"` (`-a` means *all* files tracked `-m` means )

    1. Remember to use meaningful (but short) commit messages to be able to go back in time
    2. If files currently modified are not part of the same conceptual change, you should not use `-a` but rather select specific files and make several commits describing the changes individually

7. Go back to `4.`

[Beginner-friendly `git` tutorial](https://www.atlassian.com/git/tutorials/using-branches)

#### gitignore

There are things you don't want to track with `git` because they are not meant to be shared with other people:

* your IDE's settings
* your python environment `repo/your_env/`
* data
* `__pycache__` and [`.pyc`](https://www.tutorialspoint.com/What-are-pyc-files-in-Python) files
* a lot of other things

For all that you can use a `.gitignore` text file which will tell `git` what files not to track. I typically use a [python gitignore boilerplate](https://github.com/github/gitignore/blob/master/Python.gitignore) and add things like `.vscode/` `my_env/` `*.DS_Store` `*.png` etc. ([further reading](https://www.atlassian.com/git/tutorials/saving-changes/gitignore)).

### Collaborating on Github

After cloning from Github you'll have it as a *remote* repository meaning you can `git push` to it and others can `git pull` your commits to see your changes.

A good practice when working in teams is to use Pull Requests: you create a branch locally, add commits, push to the branch and open a pull request comparing your branch to its target (usually you want to *merge* changes you made in your branch into the `main` branch (`a` and `b` below)).

My advice is to create a branch for every feature which may have implementation errors so as to no dirupt others. Also, open a PR *as soon as* you have created this branch so others can follow your work, but add `[WIP]` (`c`) in the title to tell people it's Work In Progress. Add a useful comment `d` and create the PR `f`. Ask people to review it when it's done `e`.

![pr button](/images/pr.png)
![pr creation](/images/pr2.png)

Then go to `Files` and add `Single Comments` to attract attention to specific lines you want people to have a look at

![pr line comment](/images/pr3.png)


## Tooling

I use [**VSCode**](https://code.visualstudio.com/) to code. It's extremely versatile, acceptably user-friendly and its community is very active so there's always an extension for what you need or an answer to your question online.

![vscode](/images/vscode.png)

^*Top left: file explorer. Top right: code editor, writing Python code. Bottom left: Source control: tracking changes with git. Bottom right: local dev using ipython.*
