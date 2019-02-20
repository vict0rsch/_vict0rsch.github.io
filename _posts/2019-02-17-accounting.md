---
layout: post
title: "Amortized algorithm analysis: making sense of the Accounting Method"
comments: true
math: true
excerpt: "The Accounting Method is widely used to analyse the amortized cost of an algorithm. Lots of ressources out there try and explain it. Here's my view"
tags:
  - General
  - Algorithms
author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---

1. 
{:toc}

# The idea

It's called the **accounting method** because we want to get a feel of how **expensive** an algorithm is, *on average*.

The idea is that **expensive** operations will happen rarely enough so that if we **over-estimate** cheap operation, this over-estimation will compensate the cost of the expensive ones.

## Worst case

Say $C_{exp}$ is the cost of an expensive operation and $C_{cheap}$ is the cost of a cheap one. **Worst case** analysis for the algorithm would mean setting $C_{cheap} = C_{exp}$.

## Amortization

But we know that not all operation as as expensive as the most expensive so overestimating $C_{cheap}$ and underestimating $C_{exp}$ will give us an overall cost that will be larger than the actual cost but smaller than the worst case cost:

> Averaging the cost of cheap and expensive operations together, along the whole run of the algorithm is called amortization

# Example

## Theory

Take **inserting in an array** as a toy example. If the array is full, we need to double its size: you have to create a new, larger array and *copy all existing elements* inside it. Assigning an element (in a large enough array) on the other hand is cheap: you just have to assign a value to a location in the array.

So the array is initially empty

| Iteration | Insert |    Array    | Size  | Cost of operation | Credit for operation |   Credit left    |
| :-------: | :----: | :---------: | :---: | :---------------: | :------------------: | :--------------: |
|     0     |  null  |     [_]     |   1   |         0         |          0           |        0         |
|     1     |   1    |     [1]     |   1   |         1         |         $c$          |       c-1        |
|     2     |   2    |   [1, 2]    |   2   |       1 + 1       |         $c$          | (c - 1) + c - 2  |
|     3     |   3    | [1,2, 3, _] |   4   |       2 + 1       |         $c$          | (2c - 3) + c - 3 |
|     4     |   4    |  [1,2,3,4]  |   4   |         1         |         $c$          | (3c - 6) + c - 1 |

We always want to have credit left for later as we want to over-estimate (but not too much) the overall cost of the algorithm. In other words, we can set $c$ to 100 and we'll be sure to have a loooot of credits left. But we want the smallest $c$ such that we never go bankrupt, that is to say the tightest bound.

## Application

**So how do we chose $c$?**
* One could see that if **$c=3$** then we're good in the column *Credit Left* (iteration 2 would fail with $c=2$).
* Another way to put it is to realize that each element will be paid for **in two occasions**: 
  * once it is added to the array
  * once when it is copied into a new, larger array
    * if $c=2$, the first time the table expands, all good, the item pays $2$ for both its insertion and copy. But what about the next copy?
    * Subsequent copies would not be paid for so we need subsequent items to pay for this!
    * if $c=3$ each item pays for its insertion, its copy **and** the copy of a previous item.
      * it is guaranteed that it will be enough since we double the size of each array: when we need to copy, there are as many new elements as there were "old" element from the previous growth

So here what it'd look like:

| Iteration | Insert |                Array                | Size  | Cost of operation | Credit for operation | Credit left |
| :-------: | :----: | :---------------------------------: | :---: | :---------------: | :------------------: | :---------: |
|     0     |  null  |                 [_]                 |   1   |         0         |          0           |      0      |
|     1     |   1    |                 [1]                 |   1   |         1         |          3           |      2      |
|     2     |   2    |               [1, 2]                |   2   |       1 + 1       |          3           |      3      |
|     3     |   3    |             [1,2, 3, _]             |   4   |       2 + 1       |          3           |      3      |
|     4     |   4    |              [1,2,3,4]              |   4   |         1         |          3           |      5      |
|     5     |   5    |      [1, 3, 3, 4, 5, _, _, _]       |   8   |       4 + 1       |          3           |      3      |
|     6     |   6    |      [1, 3, 3, 4, 5, 6, _, _]       |   8   |         1         |          3           |      5      |
|     7     |   7    |      [1, 3, 3, 4, 5, 6, 7, _]       |   8   |         1         |          3           |      7      |
|     8     |   8    |      [1, 3, 3, 4, 5, 6, 7, 8]       |   8   |         1         |          3           |      9      |
|     9     |   9    | [1, 3, 3, 4, 5, 6, 7, 8, 9, _, ...] |  16   |       8 + 1       |          3           |      3      |

{% details How do elements pay for the copy of previous ones? %}

Leyt's look at iteration 9:
* it has a cost of 9: copying the 8 previous elements, and adding 9 in the new, expanded array
* Items $5..8$ have assign one of their 3 credits to 
  * their copy at next expansion
  * their insertion
  * **and saved for the copy of elements $1..4$ at next expansion**

This is why we need amortized analysis: the **sequence $insert(5),..,insert(8)$ as a whole pays for the one, expensive subsequent expansion**

{% enddetails %}

## Amortized cost

So what is the final amortizated complexity of **inserting** in a resizable array? It is $O(1)$ as the cost never grows: each credit is spent exactly (except for the first one as there is no resize, could be even tighter to assign it a special credit of 1).

# Resources

* [Wikipedia](https://en.wikipedia.org/wiki/Accounting_method_(computer_science))
* [Rebecca Fiebrink, Princeton University](https://www.cs.princeton.edu/~fiebrink/423/AmortizedAnalysisExplained_Fiebrink.pdf)
* [Stack Exchange](https://cs.stackexchange.com/questions/32867/how-can-i-make-sense-of-amortized-accounting-method)
* [Introduction to Algorithms, 17-2](https://labs.xjtudlc.com/labs/wldmt/reading%20list/books/Algorithms%20and%20optimization/Introduction%20to%20Algorithms.pdf)