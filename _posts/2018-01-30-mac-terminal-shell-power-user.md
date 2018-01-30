---
layout: post

title: MacOS Terminal and Shell Setup with configuration files
subtitle: "Make your Terminal beautifully efficient"
cover_image: datacenter.jpg
comments: true
excerpt: "That's my personal setup: links, descriptions and configuration. From ZSH to Pyenv through Spaceship and Tmux"

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---

#Mac Terminal Power User

This article details my personnal configuration. Feel free to suggest improvements in the comments!

## Terminal: iTerm2

### Colors

`git clone https://github.com/mbadolato/iTerm2-Color-Schemes` wherever you want then in iTerm2 go to `preferences > profiles > colors > color preset > import... ` then chose the cloned folder. I use `Tomorrow Night`.

### Enable Word Jump

Usually `option + →` sends the cursor at the end of the current word. This is not enabled by default in iTerm. To enable it: `preferences > profiles > keys > load preset > Natural Text Editing`

## Command-line Text Editor: `micro`

"Micro is a terminal-based text editor that aims to be easy to use and intuitive, while also taking advantage of the full capabilities of modern terminals." ([https://github.com/zyedidia/micro](https://github.com/zyedidia/micro))

It has full mouse support and usual shortcuts (with control): `^ + c` to copy, `^ + v` to paste etc. 

Also, syntax highlighting! 

`brew install micro`

<script src="https://asciinema.org/a/JwIHf47OsYkCkf3O2iFI87dHF.js" id="asciicast-14" async data-theme='monokai' speed='2'></script>

## Shell: ZSH


### Plugins: Oh-My-ZSH

First [install ZSH](https://github.com/robbyrussell/oh-my-zsh/wiki/Installing-ZSH) then [install oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh#basic-installation). 

### Theme: Spaceship

Need 2 things: [powerline fonts](https://github.com/powerline/fonts#quick-installation) and [spaceship](https://denysdovhan.com/spaceship-prompt/#oh-my-zsh). 

Then in your `.zshrc` configure the theme: `ZSH_THEME="spaceship"`.

You'll need to activate the compatible fonts so in the iTerm preferences go to `preferences > profiles > text` there change the font to a powerline-compatible font (use the `powerline` key-word in the top right search box). Then verify that "use a different font for non-ASCII characters" is NOT checked. 

### Suggestions

Make ZSH suggest commands with [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions#zsh-autosuggestions)

`git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions` then we'll add it to the plugin list in the next section

### Configuration

* `HYPHEN_INSENSITIVE="true"` to make `-` and `_` interchangeable for ZSH's completion

* `plugins=(git, z, osx, sudo, brew, dirhistory, zsh-autosuggestions)` Check the available plugins in [Oh-my-zsh's wiki](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)

* `SPACESHIP_PROMPT_ORDER=(time, user, dir, host, git, aws, venv, pyenv, exec_time, line_sep, battery, jobs, exit_code, char)` to get rid of things I do not use, see more in the [docs](https://denysdovhan.com/spaceship-prompt/docs/Options.html#order)

* More `spaceship` conf:

```sh
SPACESHIP_CHAR_SYMBOL="╍ᗇ " #beginning of the line
SPACESHIP_PROMPT_ADD_NEWLINE=true #add line to prompt
SPACESHIP_TIME_SHOW=true #show execution time of the previous command if it's longer than usual
SPACESHIP_DIR_PREFIX='| ' #between the time and the dir you are currently in
SPACESHIP_PYENV_PREFIX='› ' #before your pyenv python version
SPACESHIP_PYENV_SYMBOL='🐍  '#symbol of pyenv python version
SPACESHIP_PYENV_COLOR=blue #color of pyenv python version
SPACESHIP_DIR_TRUNC=0 #show all dirs, don't truncate to the last 3 or whatever
SPACESHIP_DIR_TRUNC_REPO=true #if in a git repo -> show dirs with respect to the repo's root
```

### Useful `alias`

```sh

alias conf='micro ~/.zshrc'
alias ignore='micro .gitignore'
alias src='source ~/.zshrc'
alias mi='micro'
alias fs='du -hs * | gsort -h' #print size of current files and directories in the current directory, sorted by size
alias ip='ifconfig | grep "inet " | grep -v 127' #get your ip address
alias op='open .' #open current folder in the macOS Finder
alias wifi='networksetup -setairportpower en0' #wifi on and wifi off shortcuts
alias docs='cd ~/Documents'
alias dow='cd ~/Downloads'	
alias pm='python manage.py'
alias cdp='cd ..'#quicker to type in :p
alias ipy="python -c 'import IPython; IPython.terminal.ipapp.launch_new_instance()'" #user the powerline in the iPython shell
```

### Useful `function`

```sh
function coam (){
	git commit -a -m $1
} # "coam 'hello' " will commit all pending documents with a message of "hello"

function cds () {
	cd $1;
	ls;
} # "cds ~/Documents" goes there and lists the files

```

## Python

I manage Python versions with [`pyenv`](https://github.com/pyenv/pyenv). Great advantage is the variety of versions at the tip of your fingers and their hierarchical management : you can set a `global` version, a bit like a default, a `local` wich may vary per folder or a `shell` version, defined once per shell *via* an environment variable.

Of course I use [`virtualenv`](https://virtualenv.pypa.io/en/stable/) to avoid library conflicts and useless imports. To activate them automatically when you get into a folder, install [`autoenv`](https://github.com/kennethreitz/autoenv).

With these, adding a `.env` file in the folder that should use the `virtualenv` will automatically start it: `autoenv` will execute whatever is written in this file so `echo "source ./myenv/bin/activate" > .env` will do the trick! You can also add environment variables in this `.env` file.

### Configuration

A few lines should be added to your `.zshrc` for pyenv and autoenv to work correctly:

```sh
export PATH="/Users/victor/.pyenv:$PATH"
eval "$(pyenv init -)"

source /usr/local/opt/autoenv/activate.sh
```

## Tmux

Tmux is a way to run proccesses which do not depend on your shell being active. So if you close the terminal, the process will continue. If you work remotely and the SSH connection is broken the remote process will not stop. Then you just need to grab it back!

Tmux has sessions which have windows (a bit like the terminal's tabs) and windows can be split into panes. 

My conf file (`~/.tmux.conf`) is as follows:

So `tmux new -s test` starts a session called `test` then `^f c` creates a new window in the session, `^f ,` renames the current window `shift + arrow` navigates through windows `^f :` opens tmux's console (`kill-session` could be useful for instance or `source ~/.tmux.conf`), `^f v` splits the current window vertically into panes and `^f arrow` navigates through the panes. If youy close the terminal and open a new one, `tmux a -t test` to grab it back.