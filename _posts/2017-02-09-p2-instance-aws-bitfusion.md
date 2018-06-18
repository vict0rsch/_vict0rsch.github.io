---
layout: post

title: 12 GB GPU for 0.1$ per hour? Hello AWS p2
subtitle: 
cover_image: 
comments: true
excerpt: "Use my vict0rsch-2.0 AMI on a p2.xlarge instance"

tags:
  - AWS
  - GPU
  - Hardware

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---

## Why p2.xlarge instances?

In [this post](http://vict0rsch.github.io/2016/12/03/aws_gpu/) I walked you through every single step towards running a g2.xlarge Amazon instance. 

**But what if 4GB memory is not enough? What if speed is critical?**  This is where you might want to use a p2 instance : they are powered by Tesla K80 Accelerators, each running a pair of NVIDIA GK210 GPUs. Each GPU provides 12 GiB of memory (accessible via 240 GB/second of memory bandwidth), and 2,496 parallel processing cores ([ref](https://aws.amazon.com/fr/blogs/aws/new-p2-instance-type-for-amazon-ec2-up-to-16-gpus/)). For the p2.xlarge instance you however have access to *only* 12GB.

According to [this benchmark](http://www.bitfusion.io/2016/11/03/quick-comparison-of-tensorflow-gpu-performance-on-aws-p2-and-g2-instances/), **the p2.xlarge is roughly twice as fast as a g2.xlarge and 3 times bigger** (memory wise, you got that already)!

## Pricing

The good news is : the pricing is not much worse with [0,900 USD / hour](https://aws.amazon.com/en/ec2/instance-types/p2/). And only ~ **0.11 USD / hour** for [spot instances](http://stackoverflow.com/questions/5188871/aws-amazon-ec2-spot-pricing).

## Where are the p2.xlarge instances?
p2.xlarge instances are not available in every region, for now (it will probably change) they are in the **US East** (N. Virginia), **US West** (Oregon), and **EU** (Ireland) Regions. This means that if you don't have an account in these regions, you'll have to go over the same [request process](http://vict0rsch.github.io/2016/12/03/aws_gpu/#before-you-go) over again...


## What AMI?

<del>I have to say I have not been brave enough to build another AMI that supports Tensorflow & cie on GPU. I have used Bitfusion's [Tensorflow AMI](https://aws.amazon.com/marketplace/pp/B01EYKBEQ0?ref=cns_srchrow). It costs 9 cents per hour + instance price which adds up to 0.99$/hour. Which is pretty fair I think. I don't know these guys, I'm not advertising here, I just have to say it ran flowlessly in my case (using bi-directional GRU RNNs 2*200 units). Of course I still recommend using [rsub](http://vict0rsch.github.io/2016/12/03/aws_gpu/#gui-text-editor) or any other GUI over ssh to smooth things out.</del>

Tensorflow 1.0 helped me get over it and go check this new AMI out! -> [vict0rsch-2.0](/2017/02/22/p2-aws-tensorflow-1/) (in N. Virginia, **free** of course..)

There is also [AWS's Deep Learning AMI](https://aws.amazon.com/marketplace/pp/B01M0AXXQB?qid=1475211685369&sr=0-1&ref_=srh_res_product_title). I have not tested it but be aware [Amazon Linux](https://aws.amazon.com/fr/amazon-linux-ami/) does not rely on Ubuntu, if ever that was critical for you.

#### Benchmark

I haven't had the time yet, but a benchmark is on the way comparing free tier micro instances, g2.xlarge and p2.xlarge. If you want to see larger instances at work, do send me some $ and I will!