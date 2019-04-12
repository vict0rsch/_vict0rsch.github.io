---
layout: post
title: "Generating 100 000 000 primes with Python"
comments: true
cover_image: https://fr.cdn.v5.futura-sciences.com/buildsv6/images/wide1920/f/a/d/fadba6db83_107981_02-1791.jpg
excerpt: "I needed primes. A lot of primes. So I generated them. Here they are!"
tags:
  - Maths
author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch
---

1. 
{:toc}

# Generating a hundred million primes

I did not reinvent the wheel and simply used the code from [this StackOverflow answer](https://stackoverflow.com/questions/2211990/how-to-implement-an-efficient-infinite-generator-of-prime-numbers-in-python/10733621#10733621) and included it in a script. It's a smart [Eratosthene Sieve](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)

The script uses Python 3.6 but it can easily be adapted to older versions. Beware of the string formating and `itertools` mainly

{% highlight python %}
import argparse
import time
import itertools as it

def erat3():
    D = { 9: 3, 25: 5 }
    yield 2
    yield 3
    yield 5
    MASK= 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0,
    MODULOS= frozenset( (1, 7, 11, 13, 17, 19, 23, 29) )

    for q in it.compress(
            it.islice(it.count(7), 0, None, 2),
            it.cycle(MASK)):
        p = D.pop(q, None)
        if p is None:
            D[q*q] = q
            yield q
        else:
            x = q + 2*p
            while x in D or (x%30) not in MODULOS:
                x += 2*p
            D[x] = p


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--n", type=int, default=int(1e6), help="number of primes to generate"
    )
    parser.add_argument("--outf", default="", help="output file, with extension")
    opt = parser.parse_args()
    if not opt.outf:
        opt.outf = "./%d_primes.txt" % opt.n

    primes_gen = erat3()
    s = time.time()
    l = [0] * int(1e6)
    for i, p in enumerate(primes_gen):
        j = i % int(1e6)
        l[j] = p
        if j == int(1e6) - 1 or i >= opt.n:
            with open(opt.outf, "a") as f:
                f.writelines([str(_) + "\n" for _ in l])
            l = [0] * int(1e6)
            print(f'({int(time.time() - s)}s) wrote at step {i}')
            if i >= opt.n:
                break
    print(f'{opt.n} prime numbers in {time.time() - s}s')
{% endhighlight %}

To generate a million primes:

```
$ python generate_primes.py --n=1000000 --outf='./1e6_primes.txt'
```

## Optimizing

I suggest you have a look at the PrimeSieve project -> [primesieve.org](https://primesieve.org/) they have a highly optimized C++ implementation and its associated [Python bindings](https://github.com/hickford/primesieve-python).

# I just want the file!

[**Here you go.**](https://drive.google.com/file/d/1Cf4eqqwURkWwIBXF0e8T0qwzsCKkq0uo/view?usp=sharing)