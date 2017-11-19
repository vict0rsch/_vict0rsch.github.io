---
layout: post

title: Teaching Machine Learning to a Consultant - The Shell
subtitle: "Part 0: Introduction to the command line"
cover_image: 
comments: true
excerpt: "First article on my series on Teaching Machine Learning to a Consultant. We'll start with the basics: the Command Line"

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch


---

 1. The Shell
 2. Python
 3. Maths with Python
 4. Machine Learning Overview
 5. Deep Learning Overview

I wont' teach everything there is to know about ML. I'll teach you how to get started, especially with the code. There are tons of valuable MOOCs, tutorials, courses etc. out there, no need to reinvent the wheel! (But don't you worry, I'll point them out).

Let us start with a fundamental part of coding: **interacting with your computer with command lines**.  I'll assume you have a Mac, because consultants have a Mac :p However all commands will stand for Linux users and it will not matter for the next parts of the tutorial.

---

## Table of Contents:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. <a href="#what-is-the-terminal">What is the Terminal?</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. <a href="#why-use-it">Why use it?</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. <a href="#locations">Locations</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. <a href="#the-command-prompt">The command prompt</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d. <a href="#home">Home</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. <a href="#commands">Commands</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. <a href="#where-am-i-pwd">Where am I? (`pwd`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. <a href="#seeing-files-ls">Seeing files (`ls`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. <a href="#how-do-i-move-around-cd">How do I move around? (`cd`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#absolute-vs-relative-paths-">Absolute vs Relative paths </a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d. <a href="#handle-files-and-directories">Handle Files and Directories</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#create-empty-text-file-touch">Create empty text file (`touch`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. <a href="#create-a-new-directory-mkdir">Create a new directory (`mkdir`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. <a href="#copy-a-file-cp">Copy a file (`cp`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iv. <a href="#move-and-rename-a-file-mv">Move and Rename a File (`mv`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v. <a href="#edit-a-text-file-nano">Edit a text file (`nano`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vi. <a href="#see-what-is-in-a-text-file-cat">See what is in a text file (`cat`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;vii. <a href="#delete-a-file-rm">Delete a file (`rm`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e. <a href="#variables">Variables</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f. <a href="#printing-stuff-echo">Printing stuff (`echo`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;g. <a href="#add-options-to-commands">Add options to Commands</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#delete-a-directory-rm--rf">Delete a directory (`rm -rf`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. <a href="#copy-a-directory-cp--r">Copy a directory (`cp -r`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. <a href="#see-hidden-files-ls--a">See hidden files (`ls -a`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iv. <a href="#wildcards-*">Wildcards (`*`)</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. <a href="#going-further">Going Further</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. <a href="#chaining-commands">Chaining Commands</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. <a href="#autocomplete">Autocomplete</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. <a href="#case-sensitivity">Case sensitivity</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d. <a href="#configuration-files">Configuration files</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#the-path">The `PATH`</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. <a href="#alias">`alias`</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e. <a href="#package-management">Package management</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#improving-on-nano:-micro">Improving on Nano: Micro</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f. <a href="#exercise-:-be-more-productive-with-oh-my-zsh">Exercise : be more productive with Oh-my-zsh</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i. <a href="#installing-zsh">Installing ZSH</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ii. <a href="#getting-oh-my-zsh">Getting Oh-my-zsh</a>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iii. <a href="#exercise-on-you-own:-ohmyzsh-plugins">Exercise on you own: Ohmyzsh plugins</a>

<br id="end-of-toc"/>

# What is the Terminal?
Most people interact with their computer through the default Graphical User Interface. I bet you do too sometimes ;) It mainly means that you use the **mouse**. You click on a folder, start Excel, drag and drop a new file etc. 
But there is another way to interact with your computer, mainly using the **keyboard** : the shell. This software performs the command you give it (like "move to this location", "create this directory" etc.). On Macs (and Ubuntu) the default one is called *Bash*. The program that runs this software and allows you to interact with it is called the terminal (or console). The default one on Mac is called Terminal (what a name) but I recomment you use [iTerm2](https://iterm2.com).


## Why use it?

The main idea is that you won't run your ML algorithm by just clicking on an icon. You'll run them from the command line so you need to be familiar with it. Also, you'll look more of a [Hackerman](http://knowyourmeme.com/memes/hackerman) at the office. 




## Locations

In your computer, files are organised from a special folder called the *root* of your hard drive. Everything in your computer is in this folder. It is the folder you land into when you click on `Macintosh HD` in your Finder.

This *root* directory (= folder) is noted with a `/`. The **_location_** of a directory or a file is the succession of folders one has to open, *from the root*, to get to it. In a location, folders are separated by a `/`. For instance `/Users/yourName` means that you are in the folder `yourName` which is in the folder `Users` which is at the root. If you have a file `blabla.txt` at the root of your hard drive, then its location is `/blabla.txt`.

## The command prompt

So now let's go! <span class='highlight'>Start the "Terminal" or "iTerm2" app</span> (you can search for it in Spotlight for instance). You should see something like 

```
mbpvs:~ victor$ 
```

This means that on the computer called `mbpvs`, the user `victor` is at the location `~`. The `$` is a mark for the begining of the command line, you can only write stuff after this `$`

**From now on, I will drop the device and user name from the commands I show you** as they are not informative for us and write stuff like `~ $ [some command]`. But don't try and get rid of them, it's just on my end, you keep everything as is.

To show that a command is supposed to be run in the terminal, it will start with a *location* and a `$`. Do not write these `$` as they simply mean "run what is after the `$` from this location". **Running** a command means writing it then pressing `enter`.
The lines which don't have the `$` are the output of the console. This is the answer from the shell to the command that you just ran.

## Home
When you open a new Finder window, you start somehwere: probably in your `Documents` folder. By default, when you start a terminal, you begin in another one called your Home folder. This is where everything which is yours, as a User, is stored (including your `Documents`). This is not the part where critical parts of your OS are stored, rather everything wich is specific to your own usage of the computer. It basically means your files, some software, and some configuration. 

**Your Home is represented by a tilde: `~`** and is located in the `/Users` folder, with your computer's username: the location designated by `~` is the same as `/Users/yourName` -> `mbpvs:~ victor$ ` is the same as `mbpvs:/Users/victor victor$ `.

# Commands

For the sake of the tutorial, create a folder called `ILoveExcel` (we'll look at this command in a couple minutes, just trust me). Run the following:

```
~ $ mkdir ./ILoveExcel
```


## Where am I? (`pwd`)

To know where you currently are, you can always run `pwd`: it will give your current location from the root of your hard drive. Go ahead and <span class='highlight'>run this command</span> (write `pwd` then press `Enter`), you should see something like `/Users/yourName`:

```
~ $ pwd
/Users/victor
```
This means that from the Root of your hard drive, you went to the folder `Users` then to the folder `yourName`. Pretty straight forward isn't it (if not, please do comment!). `pwd` means "print working directory" by the way, pretty transparent.


## Seeing files (`ls`)

To see what is in the directory you are currently in, <span class='highlight'>run `ls`</span>:

```
~ $ ls
Applications  Desktop       Downloads     Library       Music         Public        nltk_data
CLionProjects Documents     IloveExcel    Movies        Pictures      bin           pem
```

`ls` means "list" and will show you everything you have in the directory, which should be your Home directory right now. This is the same thing as if you opened the Finder clicked on your hard drive (Macintosh HD), went to Users and then clicked on your name. This is it. You should see those same files!


## How do I move around? (`cd`)

In the Finder, if you want to go to your Documents, you simply double click on the icon. What we'll do isn't much more complicated: <span class='highlight'>write `cd` then the name of the location</span> you want to go to:

```
~ $ cd ILoveExcel
```

Now check that everything is consistent! (`$ ls` and compare with your Finder)

<span class='highlight'>Let's go back home</span>. There are 3 ways to go back to your Home:

1. Move there! `$ cd ~`
2. Use the shortest shortcut ever : `$ cd` -> by default if you don't specify anything after `cd` you'll go Home
3. Move back one folder : `$ cd ..` If you wanted to move back **two** folders, you'd run `$ cd ../..` and land in `/Users`

Now remember the `ILoveExcel` folder (all consultants have one, don't they?). From your home if you wanted to move there, you could run 

```
(a) ~ $ cd ./ILoveExcel
```
or from anywhere in your computer:

```
(b) ~ $ cd ~/ILoveExcel
```

### Absolute vs Relative paths 

The 2 commands above seem to do the same thing but there is an important difference between the two : **(a)** is *relative* but **(b)** is *absolute*. 

This means that for **(a)** to work, `Documents` must be directly accessible from where you currently are. In other words `Documents` should appear in the list of files and directories printed by `$ ls`. On the other hand, **(b)** is absolute and will take you to the `ILoveExcel` folder from whatever location.

Remember how `~` is equivalent to `/Users/yourName` ? **This** is the key difference: **absolute paths declare a location with respect to the root folder and therefore start with a / but relative paths don't**, they declare a location with respect to the current working directory. The fact that a path is relative can be emphasized by prepending `./` to the destination : `cd ILoveExcel` is equivalent to `cd ./ILoveExcel`.

<span class='highlight'>In the rest of Part 0 I will always use the `./` prefix for pedagogical reasons but bear in mind it is not _necessary_</span>. I want to emphasize the fact that most commands actually take a *path* as argument, as `ls`:

```
~/ILoveExcel $ ls
```
is equivalent to: 

```
~/ILoveExcel $ ls ./
```

As `ls` takes a *path* as argument, you can specify a relative path or an absolute path. To see what is in your `ILoveExcel` folder, you can run (from your Home for instance)

```
~/ILoveExcel $ ls ./IloveExcel
```
or 

```
~/ILoveExcel $ ls ~/IloveExcel
```
or

```
~ /ILoveExcel$ ls /Users/yourName/IloveExcel
```
However the first command will only work from your Home folder.


## Handle Files and Directories


### Create empty text file (`touch`)

If you want to create an empty text file, use `touch`. You can create several files by putting a space between the paths to the files:

```
~/ILoveExcel $ touch ./revenue.csv ./costs_company_x.csv
```

As you can see if you run `ls`, a new file is here! It is empty though. We'll see later how to write to it from the terminal (you can still edit it with Excel or any text editor from your Finder!).

### Create a new directory (`mkdir`)

_Making_ a new directory is pretty straight forward with `mkdir`: this command takes, as `ls` and `touch`, a path as argument:

```
~/ILoveExcel $ mkdir ./Costs
```

With this command, we created a folder called `Revenues` in the `ILoveExcel` folder. `mkdir` can only create the _last_ directory in the path given. You can not create the folder `foo/bar/` if `foo` does not already exist. You can however create several directories in a row by adding a space between them:

```
~/ILoveExcel $ mkdir ./Revenues ./Revenues/Company_X ./Costs/Company_X
```


### Copy a file (`cp`)

I'm sure you could have guessed it, the command to copy a file is `cp`. It takes 2 arguments: the path to the file you want to copy **from**, then (with a white space in between) the path you want to copy **to**, including the new name you want to give it. Take `revenue.csv` in `ILoveExcel` and  duplicate it as `01-01-18.csv`:

```
~/ILoveExcel $ cp ./revenue.csv ./Revenues/Company_X/revenue_01-01-18.csv
```

Note that if you copy the file to a different directory as in the example, all directories in between your current location and the destination should exist *before* you copy the file as `cp` does not create directories on the fly (as with `mkdir`).


### Move and Rename a File (`mv`)

It's time to **move** `costs.csv` to its proper location in `Costs/Company_X`. We'll also **rename** it. Both at the same time! The `mv` command is used to move and/or rename files and directories:

```
~/ILoveExcel $ mv ./costs.csv ./Costs/Company_X/costs_01-01-18.csv
```

`mv` also works for directories. Rename `ILoveExcel` to `Excel`:

```
~/ILoveExcel $ cd
~ $ mv ./ILoveExcel ./Excel
~ $ cd ./Excel
```
Running `ls` you can check that the content is (obviously) preserved.

### Edit a text file (`nano`)

`nano` is a very simple text editor that runs in the terminal. It means you will not open another application like Word or TextEdit to write to a file. Let's try it with `revenue_01-01-18.csv`:

```
~/Excel $ nano ./Revenue/Company_X/revenue_01-01-18.csv
```
That's it! Now you can just write text in your file. But don't try and use the mouse, it is useless in `nano`. What happens is `nano` does not handle the information sent from the mouse, so your Terminal keeps this information: you can't move the cursor by simply clicking somewhere (let alone drag and dropping words or right-clicking to spell-check).

Ok so <span class='highlight'>write a few lines to it, enjoy your power and now save and quit</span>. How do you do that? Well, `nano` tells you how! At the bottom of the terminal, a few lines describe possible actions amongst which: 
`^O Write Out` (= Save) and `^X Exit`. So you have to press `ctrl + O` (*not* zero) to save, then specify the name of the file (in our case just press `Enter` to keep the same name and location) and then `ctrl + X`.

`nano` can also be used to create a *new* file: if `revenue_01-01-18.csv` had not existed before we ran the command, the file would have been created when we saved it.

### See what is in a text file (`cat`)

To have the shell print out to you what is in a text file <span class='highlight'>use `cat`</span>:

```
~/Excel $ cat ./Revenue/Company_X/revenue_01-01-18.csv
``` 

You should see what you wrote earlier.

### Delete a file (`rm`)

Remember the `revenue.csv` file we copied earlier. As it is now in `Revenue/Company_X`, we don't need it anymore and we'll *remove* it. Run `rm` with the path to the file:

```
~/Excel $ rm ./revenue.csv
```

Be careful with `rm`: the file is not sent to the Bin for potential later recovery. It is plainly deleted and your file can't be brought back (at least not without a lot of sweat)!

Now you know what, since you soon won't be a Consultant anymore, you don't need a folder full of Excel sheets anymore! Delete the `Excel` directory:

```
~/Excel
~ $ rm ./Excel
rm: ./Excel: is a directory
```
Wait... What? I know Excel is a directory! Why won't `rm` delete it? We'll have a look at that a bit later, when we learn how to use options with commands such as `rm`.

## Variables

You can define *variables* in your shell. These things are a way to store some kind of information. You **declare** a variable by giving it a name without any whitespace, putting an `=` sign next to it (still no whitespace) then saying what value it should store. You can then **call** it by putting a `$` in front of the declared name.

For instance if you like to go to `~/Documents/Github/vict0rsch/deep_learning`, you can store this location as a string of characters in a variable and then *call* it to get its value in the appropriate context. This is exactly what your system does with your `home` folder: the location associated with `~` is actually stored in a variable called... `HOME`.

```
~ $ myFavouritePath=~/Documents/Github/vict0rsch/deep_learning

~ $ cd $myFavouritePath

~/Documents/Github/vict0rsch/deep_learning $ echo $myFavouritePath
/Users/victor/Documents/experiments/test

~/Documents/Github/vict0rsch/deep_learning $ echo $HOME
/Users/victor
```

Variables are not remembered. If you open a new terminal window, `$myFavouritePath` will be empty and won't do anything. More on that later!

## Printing stuff (`echo`)

Did you notice the `echo` in the command above? It means we want to print something. Running it with your variable as an argument means you want to print the variable (more on this topic [here](https://www.howtogeek.com/howto/29980/whats-the-difference-between-single-and-double-quotes-in-the-bash-shell/)).

```
~ $ echo hello
hello
```

You can also print something **in** a text file using `>` and `>>`. If the text file does not exist, it is created in both cases. If it does exist however, `>` will overwrite the file:

```
~ $ echo $myFavouritePath > test.txt

~ $ echo $myFavouritePath > test.tx

~ $ cat test.txt
/Users/victor/Documents/experiments/test
```

Eventhough we wrote `$myFavouritePath`'s value twice in `test.txt`, since `>` overwrites, it is only present once. On the other hand, `>>` will add a line at the end of the file:

```
~ $ echo $myFavouritePath >> test.txt

~ $ cat test.txt
/Users/victor/Documents/experiments/test
/Users/victor/Documents/experiments/test
```

Now since `test.txt` already had `$myFavouritePath`'s value once as per the previous commands, using `>>` will add a new one.

## Add options to Commands

Most of the commands you'll ever run can take optionnal values. To tell a command that you want to specify an option you will use **flags**. These have a weird name but really, they are just letters with a `-` sign in front of it. As you'll see in the next section `rm` for instance has various options, including `-r` and `-f`. One can run `rm -r -f ...` or `rm -rf ...` equivalently.

### Delete a directory (`rm -rf`)

To delete a directory we need to specify to `rm` that we want it to act *recursively*, meaning delete a directory and all it contains. We'll also specify that we are sure we want to delete things and not be asked about it, *forcing* deletion:

```
~/Documents $ rm -rf ./Excel
```

### Copy a directory (`cp -r`)

Just like a directory has to be deleted recursively, copying a directory means we want also to copy everything it contains! We'll therefore use the same `-r` flag with cp.

We'll create a dummy example to test the command:

```
~/Documents $ mkdir ./test
~/Documents $ cd ./test
~/Documents $ mkdir ./folder1
~/Documents $ cp ./folder1 ./fodler2
cp: ./folder1 is a directory (not copied).
~/Documents $ cp -r ./folder1 ./fodler2
~/Documents $ ls
folder1 folder2
```

### See hidden files (`ls -a`)

Some files and directories on your computer are hidden. It is different from saying they are protected or whatever, it means they are not displayed by default. They all start with a `.` (and this is how you make a file/directory hidden: prepend a dot to its name).

To see those, <span class='highlight'>run `ls -a`</span>:

```
~ $ ls -a
.       .Trash              Applications        Desktop       Downloads     Movies        Pictures      anaconda      pem
..      .bash_history       CLionProjects       Documents     Library       Music         Public        bin           nltk_data
```

The first two elements, `.` and `..` symbolize the current and parent directory. If you look into `.bash_history` (`cat` or `nano`) you'll see the history of all commands you have run! To go through this history, press the `up` key!

### Wildcards (`*`)

This `*` is called a wildcard and basically means "anything". When specifying a path as argument to a command (as you know, this happens a lot), the `*` matches any number and kind of characters. Let's look at examples with `ls` in a dummy directory (`#` are *comments*, they are not taken into account as commands, this is just me talking to you).

First <span class='highlight'>create a few files and directories</span>:

```
~ $ mkdir ./dummy
~ $ cd ./dummy
~/dummy $ mkdir ./ab1 ./ab2 ./cb1 ./cb2 ./d1 ./d2 ./db
~/dummy $ touch ./test0.txt ./ab1/test1.txt ./cb1/test2.txt
```

<span class='highlight'>See everything</span>: the content of the current directory, and the content of children directories:

```
~/dummy $ ls ./*
```

Idem, but only for files and directories <span class='highlight'>ending</span> with a "2" (the wildcard stands for any number and kind of characters but the 3 is mandatory). Note that test2.txt does not show up as it is in cb1/ which is not listed by ls *2

```
~/dummy $ ls ./*2
```
Idem, <span class='highlight'>starting</span> with an "a"

```
~/dummy $ ls ./a*
```

Idem, <span class='highlight'>containing</span> a "b", anywhere: be it in the beginning, end or middle

```
~/dummy $ ls ./*b*
```

# Going Further

## Chaining Commands

You can run several commands in one by adding `&&` or `;` in between, for instance:

```
~ $ cd && pwd ; which python
/Users/victor
/Users/victor/anaconda3/bin/python
```

## Autocomplete

When running a command, hitting `tab` will tell the shell to autocomplete what you are writing: either a command or a path. Try writing `~ $ touc` and then hit `tab`. It should be autocompleted to `touch`. If there is more than one option, you will have to hit `tab` a second time and it will show you options.

## Case sensitivity

Your OS is case sensitive, that is to say that upper and lower case letters are different. `~ $ mkdir ./hello` and `~ $ mkdir ./Hello` will create two different directories. Likewise witing `~ $ cd L` + `tab` will autocomplete to `cd Library` but `~ $ cd l` + `tab` will not.

## Configuration files

When you open a new terminal window, `Bash` automatically runs a text file located in your `home` called `.bash_profile`. This (hidden) file can contain any type of command which `Bash` understands. For instance if you want to print `Hackerman` every time you open a new terminal, you can either run `~ $ echo "Hackerman"` each time (not very nice) or add this command to your `.bash_profile`.

To do so, in your `home` create a new file called `.bash_profile` and add a line with `echo "Hackerman"`. You have various options to do so, either using `echo`, `nano` or `micro`.

If you want variables to be remembered across terminals, `.bash_profile` is a good place to store it. If you add another line containing `myFavouritePath=~/Documents/Github/vict0rsch/deep_learning` in this file, then every time you open a terminal, `Bash` will execute `.bash_profile` therefore printing `Hackerman` and defining a variable called `myFavouritePath`.

Finally, for the changes in `.bash_profile` to be taken into account in the current terminal, you have to `source` it, meaning `Bash` will run the file's content.

```
~ $ echo echo Hackerman >> ./.bash_profile
~ $ echo myFavouritePath=~/Documents/Github/vict0rsch/deep_learning >> ./.bash_profile
~ $ source ./.bash_profile
```

### The `PATH`

### `alias`

A variable is meant to me used by other programs. For instance, one of t


## Package management

### Improving on Nano: Micro

## Exercise : be more productive with Oh-my-zsh

`Bash` is a nice shell but it can be improved. As an exercise, we'll install `ZSH` then `Oh-my-zsh`.

`ZSH` is a different Shell software, other than the default Bash you are using. The main difference is Autocompletion when hitting tab and moving around (more advanced explanations [here](https://www.quora.com/What-is-the-difference-between-bash-and-zsh?share=1)). It does not sound like much but it's a life saver really, being able to navigate through suggestions instead of having to write everything.

On top of `ZSH`, `Oh-my-zsh` adds a lot of features like layout customization and the extremely useful `z` plugin.

### Installing ZSH

On mac :

```
~ $ brew install zsh zsh-completions
```

On Linux :

```
~ $ sudo apt-get install zsh
```

Done! That was easy! Now let's make it the default shell instead of `Bash`, run:

```
~ $ chsh -s $(which zsh)
```

`chsh` stands for Change Shell, `-s` is to save this new configuration and `$(which zsh)` means that the new shell we want to use is the one prompted by `which zsh`'s directory. Now <span class='highlight'>close the terminal window and open a new one</span>. Run `echo $SHELL` and you should see something like `/bin/zsh`.

### Getting Oh-my-zsh

To download and install `Oh-my-zsh`, simply run the following command which you should be aple to understand (except the flags but you can look them up online). 

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

That's it! Again, close and re-open a terminal window: you have a bran new usable and beautiful shell! 

### Exercise on you own: Ohmyzsh plugins

To summarize what we've learned, use `micro` to edit your `.zshrc` file and add the following plugins: `git brew z osx sudo`. Also, personalize your `ZSH` theme as described **[here](https://github.com/robbyrussell/oh-my-zsh#themes)**

The `z` plugin is extremely useful to navigate to places you often go to. It records every directory you visit and orders them by number of visits. Then running `~ $ z doc`, `z` will take you to the most visited location whose path contains `doc` (not case sensitive!). So if you often go to `~/Documents/Github/vict0rsch/deep_learning` running `z deep` will take you there directly! It works for every directory, so it's way easier than defining a lot of variables.