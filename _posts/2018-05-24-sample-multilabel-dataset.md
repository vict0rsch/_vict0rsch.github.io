---
layout: post

title: "Sampling a multilabel dataset"
subtitle: "Implementing the Iterative Stratifier from Sechidis et al., 2011"
cover_image: iterative.png
comments: true

excerpt: "Splitting a multi-label dataset into train and test sets is more complicated than the single-label case. You can't simply split each class. You have to be more clever, and stratify - here's how."

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---

1. 
{:toc}

# The specificity of multilabel datasets

A *label* is the (discrete) information you which to infer from your dataset. This label can be of multiple *classes*: it is a *binary* classification task if you have 2 classes, a *multiclass* problem if you have more.

The **multilabel** case is quite different from the number of values it can take. It means that each sample in your dataset can have *multiple* target values (each of these being of a different class, possibly with replacement).

{% details Still not clear? Let's look at an example %}

Say you want to predict pieces of information about a book :

* Single Label, Binary Classification: is the book a good read, or not?
* Single Label, Multiclass Classification: is the book about Love? Adventure? Philosophy? History? You may only chose one answer
* Multi Label, Multiclass Classification: is the book about Love? Adventure? Philosophy? History? You may only chose several answers

I'll let you think about the multi label, binary classification case.

{% enddetails %}

In most Machine Learning problems you need to split your data into *at least* two sets, ideally three. You *need* a test set to evaluate your model trained on the training set. And you *need* these two to have the **same label distributions**!

## Why not go the easy way?

In the *single-label* situation, the usual and easy way to keep the datasets' statistics equal is to sample independantly each class of the original dataset. It's a valid procedure in this case: if you want 70% of your data in the train set, you take 70% of samples with class *A*, 70% of samples with class *B* and so on.

How would you do that if each sample can be of multiple classes simultaneously? The single-label procedure is only valid as long as you can sample **independantly** each class, which is no longer possible!

Say you have 3 *classes* and each sample can have up to 2 *labels*, and want a 60/40 *split*:

```
0: [C]
1: [A, B]
2: [B]
3: [A, C]
4: [A, C]
5: [C]
6: [A, C]
7: [A, C]
8: [A]
9: [A, B]
```

You want 4 and 3 `A` per split. How do you chose which one to put in which dataset? They are not equivalent! How do you chose how to put 2 `B` in a set, 1 in the other? It depends on how you chose the repartition of `A` and the distribution of `C` will be as tricky.

## Stratifying

In their 2011 [**paper**](http://lpis.csd.auth.gr/publications/sechidis-ecmlpkdd-2011.pdf), Sechidis *et. al* propose a (partial) solution to this problem: **first** focus on the least represented labels, as they are the most likely to suffer from distriution variations, **then** put these samples in the subset which need it the most.

{% details Here is an example for such a procedure%}

In our previous example, we want to sets, 60/40, which would ideally contain:

 * Train set:
   * `0.6 * 7 = 4.2` samples with a label `A`
   * `0.6 * 3 = 1.8` samples with a label `B`
   * `0.6 * 6 = 3.6` samples with a label `C`
 * Test set:
   * `0.4 * 7 = 2.8` samples with a label `A`
   * `0.4 * 3 = 1.2` samples with a label `B`
   * `0.4 * 6 = 2.4` samples with a label `C`

The stratifying procedure says:

* Label count in the dataset: `A: 7, B: 3, C: 6`
  * **Choose label `B`**
    * The train set needs `1.8` so put sample `1: [A, B]` in the train set.
      * It now needs `0.8` labels `B` and `3.2` labels `A`
    * The test set now needs more labels `B`: `1.2 > 0.8` so put sample `2: [B]` in the test set
      * It now needs `0.2` labels `B`
    * The train set now needs more labels `B`: `0.8 > 0.2` so put sample `9: [A, B]` in the train set
      * It now needs `2.2` labels `A` and `-0.2` labels `B` but it does not matter, we are **done** with `B`
* Label count in the dataset: `A: 5, B: 0, C: 6`
  * **Choose label `A`** (*surprise!* even though `C` was more rare in the original dataset, `B`'s repartition makes it so that we should focus on `A` more, now)
    * Do the same thing

{% enddetails %}

## Checking the validity of the procedure
  
### Labels and Examples Distributions

From the paper (lower is better):

![LD and ED from Sechidis et. al, 2011](/images/ld-ed.png)

### Kullback-Leibler divergence

This one is not mentionned in the paper but I think it's also a good indicator that the procedure is valid. The [Kullback-Leibler divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence) is a measure of (dis-)similarity between two probabilty distributions. 

The distributions we'll compare are those of the flattened **class** distributions: each sample's labels count one for each class. So in out previous example, `0: [A, C]` adds 1 to the count of **both** `A` and `C`.

A low KL-divergence of the class distributions is not a guarantee but it's still a good indicator in my opinion.

# Iterative Stratifier

## Implementation

This implementation only relies on `numpy` and Python 3.

{% highlight python%}
def stratify(data, classes, ratios, one_hot=False):
    """Stratifying procedure.

    data is a list of list: a list of labels, for each samples.
    Each sample's labels should be ints, if they are one-hot encoded, use one_hot=True
    
    classes is the list of classes each label can take

    ratios is a list, summing to 1, of how the dataset should be split

    """
    # one-hot decoding
    if one_hot:
        temp = [[] for _ in range(len(data))]
        indexes, values = np.where(np.array(data).astype(int) == 1)
        for k, v in zip(indexes, values):
            temp[k].append(v)
        data = temp

    # Organize data per label: for each label l, per_label_data[l] contains the list of samples
    # in data which have this label
    per_label_data = {c: set() for c in classes}
    for i, d in enumerate(data):
        for l in d:
            per_label_data[l].add(i)

    # number of samples
    size = len(data)

    # In order not to compute lengths each time, they are tracked here.
    subset_sizes = [r * size for r in ratios]
    target_subset_sizes = deepcopy(subset_sizes)
    per_label_subset_sizes = {
        c: [r * len(per_label_data[c]) for r in ratios]
        for c in classes
    }

    # For each subset we want, the set of sample-ids which should end up in it
    stratified_data_ids = [set() for _ in range(len(ratios))]

    # For each sample in the data set
    while size > 0:
        # Compute |Di|
        lengths = {
            l: len(label_data)
            for l, label_data in per_label_data.items()
        }
        try:
            # Find label of smallest |Di|
            label = min(
                {k: v for k, v in lengths.items() if v > 0}, key=lengths.get
            )
        except ValueError:
            # If the dictionary in `min` is empty we get a Value Error. 
            # This can happen if there are unlabeled samples.
            # In this case, `size` would be > 0 but only samples without label would remain.
            # "No label" could be a class in itself, your choice when you feed `data` in the stratifier.
            break
        current_length = lengths[label]

        # For each sample with label `label`
        while per_label_data[label]:
            # Select such a sample
            current_id = per_label_data[label].pop()

            subset_sizes_for_label = per_label_subset_sizes[label]
            # Find argmax clj i.e. subset in greatest need of the current label
            largest_subsets = np.argwhere(
                subset_sizes_for_label == np.amax(subset_sizes_for_label)
            ).flatten()

            if len(largest_subsets) == 1:
                subset = largest_subsets[0]
            # If there is more than one such subset, find the one in greatest need
            # of any label
            else:
                largest_subsets = np.argwhere(
                    subset_sizes == np.amax(subset_sizes)
                ).flatten()
                if len(largest_subsets) == 1:
                    subset = largest_subsets[0]
                else:
                    # If there is more than one such subset, choose at random
                    subset = np.random.choice(largest_subsets)

            # Store the sample's id in the selected subset
            stratified_data_ids[subset].add(current_id)

            # There is one fewer sample to distribute
            size -= 1
            # The selected subset needs one fewer sample
            subset_sizes[subset] -= 1

            # In the selected subset, there is one more example for each label
            # the current sample has
            for l in data[current_id]:
                per_label_subset_sizes[l][subset] -= 1
            
            # Remove the sample from the dataset, meaning from all per_label dataset created
            for l, label_data in per_label_data.items():
                if current_id in label_data:
                    label_data.remove(current_id)

    # Create the stratified dataset as a list of subsets, each containing the orginal labels
    stratified_data_ids = [sorted(strat) for strat in stratified_data_ids]
    stratified_data = [
        [data[i] for i in strat] for strat in stratified_data_ids
    ]

    # Return both the stratified indexes, to be used to sample the `features` associated with your labels
    # And the stratified labels dataset
    return stratified_data_ids, stratified_data
{% endhighlight %}

## Experiment

I created a synthetic dataset, with `100` classes drawn from an decreasing exponential distribution. Each example in the dataset, `100 000` in total, has up to `10` labels (at least one, and non-repeating), each one being drawn from the class distribution.

The following figures show 

* The target class distribution and their distribution in the synthetic dataset
* The synthetic dataset class distribution and the 2 sampled datasets'

{::nomarkdown}
<div style="width:100%; text-align:center">
<img src="/images/target-dist.png" alt="" style="max-width:300px; display:inline-block;"/>
<img src="/images/train-test-dist.png" alt="" style="max-width:300px; display:inline-block;"/>
<img src="/images/val-test-dist.png" alt="" style="max-width:300px; display:inline-block;"/>
</div>
{:/nomarkdown}

Zooming in, you'd see no difference, lines overlap perfectly! Computed KL-divergences agree: `KL(original, train) = KL(original, test) = -0.0001`. Final repartition is `69912 | 14890 | 15198`, *i.e.* `train: 69.9% | val: 14.9% | test: 15.2%`.

Experiments with different distributions, number of classes, number of labels and number of examples agree, this is not a best-case scenario.


## More info

* This implementation can handle string labels just as well
* For some reason, sampling 3 datasets (train, val, test) works best by sequentially stratifying than specifying 3 ratios. Could be because of the low classes
* I could not reproduce the paper's metrics on the dataset. I'm not far from them but I may have made a mistake in the metrics' code. I did raise the issue. But looking at the distribution, my implementation can't be so far off
* I implemented the [Second Order Iterative Stratifier](https://arxiv.org/abs/1704.08756) by Szymański *et. al*, 2017 but I do not use it because its complexity is squared in the number of labels and it does not seem to result in much more than slightly lowering the variance of the algorithm. If you wanted to, it would be quite easy to code from the regular Iterative Stratifier above