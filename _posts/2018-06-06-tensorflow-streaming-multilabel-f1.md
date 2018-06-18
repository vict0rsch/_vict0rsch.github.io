---
layout: post

title: "Streaming f1-score in Tensorflow: the multilabel setting"
subtitle: "Going further than tf.contrib"
comments: true

excerpt: "This situation presents 2 challenges: computing an overall f1-score when you only have per-batch values, and doing so in a multilabel setting where micro, macro and weighted f1 scores are expected. What a journey!"

tags:
  - Tensorflow
  - Metrics
  - Multilabel

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---




My day to day occupation involves multilabel text classification with Tensorflow. It's quite new to me and not so common so I stumble upon a variety of problems. I share my solutions with you these days, including [How to sample a multilabel dataset](http://vict0rsch.github.io/2018/05/24/sample-multilabel-dataset/) and today's about how to compute the f1 score in Tensorflow. 

The first section will explain the *difference between the single and multi label cases*, the second will be about computing the *multi label f1 score* from the predicted and target values, the third section will be about how to deal with *batch-wise data* and get an overall final score and lastly I'll share a piece of code proving *it works*!
<br/>

1. 
{:toc}

<br/>

**TL;DR** -> Checkout the gist : [https://gist.github.com/Vict0rSch/...](https://gist.github.com/Vict0rSch/ce34af00a425fb322a2622de483ade9e)

# Multi label f1 score

From [Scikit-Learn](http://scikit-learn.org/stable/modules/generated/sklearn.metrics.f1_score.html):

>The F1 score can be interpreted as a weighted average of the precision and recall, where an F1 score reaches its best value at 1 and worst score at 0. The relative contribution of precision and recall to the F1 score are equal. The formula for the F1 score is: `F1 = 2 * (precision * recall) / (precision + recall)`

In a multi-label setting there a 3 main ways of extending this definition:

* Define the precision and recall globally, for all labels: it is the **micro** f1 score
  * for a `positive` prediction if 10 labels are predicted correctly but 1 is missing then it is a `False Positive`
* Define them per class and average:
  * if every class has the same importance, the f1 score is the mean of f1 scores per class: it is the **macro** f1 score
  * if each class should be weighted according to the number of samples with this class (the *support*), it is called the **weighted** f1 score


# Tensorflow implementation

This section is about implementing a multi-label f1 score in Tensorflow, in a similar way as Scikit-Learn. Most content originally comes from [my answer on Stackoverflow](https://stackoverflow.com/a/50251763/3867406).

{% highlight python %}
f1s = [0, 0, 0]

y_true = tf.cast(y_true, tf.float64)
y_pred = tf.cast(y_pred, tf.float64)

for i, axis in enumerate([None, 0]):
    TP = tf.count_nonzero(y_pred * y_true, axis=axis)
    FP = tf.count_nonzero(y_pred * (y_true - 1), axis=axis)
    FN = tf.count_nonzero((y_pred - 1) * y_true, axis=axis)

    precision = TP / (TP + FP)
    recall = TP / (TP + FN)
    f1 = 2 * precision * recall / (precision + recall)

    f1s[i] = tf.reduce_mean(f1)

weights = tf.reduce_sum(y_true, axis=0)
weights /= tf.reduce_sum(weights)

f1s[2] = tf.reduce_sum(f1 * weights)

micro, macro, weighted = f1s
{% endhighlight %}

I believe almost eveything is straightforward except the `axis` in `tf.count_nonzero`. If something else is unclear, ask in the comments.

1. `axis = None` means that we count **all** non-zero locations in the matrix (`y_pred * y_true` for instance).
2. `axis = 0` means that we count non-zero locations **per class**, which you could see as summing over lines, yielding 1 f1 score per column. 

# Streaming Multilabel f1 score

Now what if you can't compute `y_true` and `y_pred` for your whole dataset? You need to have a way to aggregate these results and *then* only compute the final f1 score. Obviously you can't just sum up f1 scores across batches. But you can sum counts! So we'll sum `TP`, `FP` and `FN` over batches and compute the f1 score accordingly

{% details Need a primer on Tensorflow metrics and updates to these? %}

When you compute a streaming metric you need 2 things: the `Tensor` holding the value you're looking for, and an `update_op` to feed new values to the metric, typically once per batch.

Here is an example, counting the sum of natural numbers to `100`:

{% highlight python %}
import tensorflow as tf

def count(value):
    # Define the variable holding the metric
    c = tf.get_variable("count", shape=[], dtype=tf.int64)
    # Define the operation which should update the metric
    # Here assign_add adds `value` to `c`
    update_op = tf.assign_add(c, value)
    return c, update_op

value = tf.placeholder(tf.int64, shape=[], name="value_to_add")
c, update = count(value)
with tf.Session() as sess:
    tf.global_variables_initializer().run()
    for i in range(101):
        # update the metric according to i
        _ = sess.run(update, {value:i})
        if i % 25 == 0:
            # from time to time check that the metric is indeed updated
            print('Sum of ints to {}: {}'.format(i, c.eval()))
    # Check the procedure is right:
    print('Should be: ', 100 * (100 + 1) // 2)
{% endhighlight %}

```
Sum of ints to 0: 0
Sum of ints to 25: 325
Sum of ints to 50: 1275
Sum of ints to 75: 2850
Sum of ints to 100: 5050
Should be:  5050
```

{% enddetails %}

There are therefore 3 steps:

1. Define the `Variables` which will hold the values of `TP`, `FP` and `FN`.
  a. We should have 2 for each because the `micro` ones will be summed over all dimensions but the `macro` ones only on the first.
  b. We don't need to define specific  `TP`, `FP` and `FN` for the `weighted` f1 score as it can be inferred from the `macro` f1 score provided we have the `weights`
2. Define the `update_ops`
3. Define the final f1 scores from the `Variables`

## Functions

Here are 3 functions: one to compute and update the counts, the other to compute the f1 scores from the counts. The `metric_variable` function comes from [Tensorflow's core code](https://github.com/tensorflow/tensorflow/blob/r1.8/tensorflow/python/ops/metrics_impl.py) and helps us define a `Variable` more easily as we know it'll hold a metric. 

{% highlight python %}
import tensorflow as tf
from tensorflow.python.ops import variable_scope
from tensorflow.python.ops import array_ops
from tensorflow.python.framework import ops

def metric_variable(shape, dtype, validate_shape=True, name=None):
    """Create variable in `GraphKeys.(LOCAL|METRIC_VARIABLES`) collections."""

    return variable_scope.variable(
        lambda: array_ops.zeros(shape, dtype),
        trainable=False,
        collections=[ops.GraphKeys.LOCAL_VARIABLES, ops.GraphKeys.METRIC_VARIABLES],
        validate_shape=validate_shape,
        name=name,
    )


def streaming_counts(y_true, y_pred, num_classes):
    # Weights for the weighted f1 score
    weights = metric_variable(
        shape=[num_classes], dtype=tf.int64, validate_shape=False, name="weights"
    )
    # Counts for the macro f1 score
    tp_mac = metric_variable(
        shape=[num_classes], dtype=tf.int64, validate_shape=False, name="tp_mac"
    )
    fp_mac = metric_variable(
        shape=[num_classes], dtype=tf.int64, validate_shape=False, name="fp_mac"
    )
    fn_mac = metric_variable(
        shape=[num_classes], dtype=tf.int64, validate_shape=False, name="fn_mac"
    )
    # Counts for the micro f1 score
    tp_mic = metric_variable(
        shape=[], dtype=tf.int64, validate_shape=False, name="tp_mic"
    )
    fp_mic = metric_variable(
        shape=[], dtype=tf.int64, validate_shape=False, name="fp_mic"
    )
    fn_mic = metric_variable(
        shape=[], dtype=tf.int64, validate_shape=False, name="fn_mic"
    )

    # Update ops, as in the previous section:
    #   - Update ops for the macro f1 score
    up_tp_mac = tf.assign_add(tp_mac, tf.count_nonzero(y_pred * y_true, axis=0))
    up_fp_mac = tf.assign_add(fp_mac, tf.count_nonzero(y_pred * (y_true - 1), axis=0))
    up_fn_mac = tf.assign_add(fn_mac, tf.count_nonzero((y_pred - 1) * y_true, axis=0))

    #   - Update ops for the micro f1 score
    up_tp_mic = tf.assign_add(
        tp_mic, tf.count_nonzero(y_pred * y_true, axis=None)
    )
    up_fp_mic = tf.assign_add(
        fp_mic, tf.count_nonzero(y_pred * (y_true - 1), axis=None)
    )
    up_fn_mic = tf.assign_add(
        fn_mic, tf.count_nonzero((y_pred - 1) * y_true, axis=None)
    )
    # Update op for the weights, just summing
    up_weights = tf.assign_add(weights, tf.reduce_sum(y_true, axis=0))

    # Grouping values
    counts = (tp_mac, fp_mac, fn_mac, tp_mic, fp_mic, fn_mic, weights)
    updates = tf.group(up_tp_mic, up_fp_mic, up_fn_mic, up_tp_mac, up_fp_mac, up_fn_mac, up_weights)

    return counts, updates


def streaming_f1(counts):
    # unpacking values
    tp_mac, fp_mac, fn_mac, tp_mic, fp_mic, fn_mic, weights = counts

    # normalize weights
    weights /= tf.reduce_sum(weights)

    # computing the micro f1 score
    prec_mic = tp_mic / (tp_mic + fp_mic)
    rec_mic = tp_mic / (tp_mic + fn_mic)
    f1_mic = 2 * prec_mic * rec_mic / (prec_mic + rec_mic)
    f1_mic = tf.reduce_mean(f1_mic)

    # computing the macro and wieghted f1 score
    prec_mac = tp_mac / (tp_mac + fp_mac)
    rec_mac = tp_mac / (tp_mac + fn_mac)
    f1_mac = 2 * prec_mac * rec_mac / (prec_mac + rec_mac)
    f1_wei = tf.reduce_sum(f1_mac * weights)
    f1_mac = tf.reduce_mean(f1_mac)

    return f1_mic, f1_mac, f1_wei
{% endhighlight %}

## Example

In this section we'll put to use the above functions. We'll first generate some data and comptue the f1 scores per batch of data

{% highlight python %}
def alter_data(_data):
    data = _data.copy()
    new_data = []
    for d in data:
        for i, l in enumerate(d):
            if np.random.rand() < 0.2:
                d[i] = (d[i] + 1) % 2
        new_data.append(d)
    return np.array(new_data)


def get_data():
    # Number of different classes
    num_classes = 10
    classes = list(range(num_classes))
    # Numberof samples in synthetic dataset
    examples = 10000
    # Max number of labels per sample. Minimum is 1
    max_labels = 5
    class_probabilities = np.array(
        list(6 * np.exp(-i * 5 / num_classes) + 1 for i in range(num_classes))
    )
    class_probabilities /= class_probabilities.sum()
    labels = [
        np.random.choice(
            classes, # Choose labels in 0..num_classes
            size=np.random.randint(1, max_labels), # number of labels for this sample
            p=class_probabilities,  # Probability of drawing each class
            replace=False,  # A class can only occure once
        )
        for _ in range(examples)  # Do it `examples` times
    ]
    y_true = np.zeros((examples, num_classes)).astype(np.int64)
    for i, l in enumerate(labels):
        y_true[i][l] = 1
    y_pred = alter_data(y_true)
    return y_true, y_pred

np.random.seed(0)

y_true, y_pred = get_data()
num_classes = y_true.shape[-1]

with tf.Graph().as_default():
    t = tf.placeholder(tf.int64, [None, None], "y_true")
    p = tf.placeholder(tf.int64, [None, None], "y_pred")

    counts, update = streaming_counts(t, p, num_classes)
    f1 = stream_f1(counts)

    with tf.Session() as sess:
        tf.local_variables_initializer().run()
        for i in range(len(y_true) // 100):
            y_t = y_true[i * 100 : (i + 1) * 100].astype(np.int64)
            y_p = y_pred[i * 100 : (i + 1) * 100].astype(np.int64)
            _ = sess.run(update, feed_dict={t: y_t, p: y_p})
        mic, mac, wei = [f.eval() for f in f1]
        print("\n", mic, mac, wei)
{% endhighlight %}

# Corectness

Using the previously defined functions, running the following code would prove the implementation is valid!

{% highlight python %}
from sklearn.metrics import f1_score

def tf_f1_score(y_true, y_pred):
    f1s = [0, 0, 0]

    y_true = tf.cast(y_true, tf.float64)
    y_pred = tf.cast(y_pred, tf.float64)

    for i, axis in enumerate([None, 0]):
        TP = tf.count_nonzero(y_pred * y_true, axis=axis)
        FP = tf.count_nonzero(y_pred * (y_true - 1), axis=axis)
        FN = tf.count_nonzero((y_pred - 1) * y_true, axis=axis)

        precision = TP / (TP + FP)
        recall = TP / (TP + FN)
        f1 = 2 * precision * recall / (precision + recall)

        f1s[i] = tf.reduce_mean(f1)

    weights = tf.reduce_sum(y_true, axis=0)
    weights /= tf.reduce_sum(weights)

    f1s[2] = tf.reduce_sum(f1 * weights)

    micro, macro, weighted = f1s
    return micro, macro, weighted

np.random.seed(0)
y_true, y_pred = get_data()
num_classes = y_true.shape[-1]

bs = 100

t = tf.placeholder(tf.int64, [None, None], "y_true")
p = tf.placeholder(tf.int64, [None, None], "y_pred")
tf_f1 = tf_f1_score(t, p)
counts, update = streaming_counts(t, p, num_classes)
streamed_f1 = streaming_f1(counts)

with tf.Session() as sess:
    tf.local_variables_initializer().run()

    mic, mac, wei = sess.run(tf_f1, feed_dict={t: y_true, p: y_pred})
    print("{:40}".format("\nTotal, overall f1 scores: "), mic, mac, wei)

    for i in range(len(y_true) // bs):
        y_t = y_true[i * bs : (i + 1) * bs].astype(np.int64)
        y_p = y_pred[i * bs : (i + 1) * bs].astype(np.int64)
        _ = sess.run(update, feed_dict={t: y_t, p: y_p})
    mic, mac, wei = [f.eval() for f in streamed_f1]
    print("{:40}".format("\nStreamed, batch-wise f1 scores:"), mic, mac, wei)

mic = f1_score(y_true, y_pred, average="micro")
mac = f1_score(y_true, y_pred, average="macro")
wei = f1_score(y_true, y_pred, average="weighted")
print("{:40}".format("\nFor reference, scikit f1 scores:"), mic, mac, wei)
{% endhighlight %}
```
Total, overall f1 scores:               0.665699032365699 0.6241802918567532 0.686824189759798

Streamed, batch-wise f1 scores:         0.665699032365699 0.6241802918567532 0.686824189759798

For reference, scikit f1 scores:        0.665699032365699 0.6241802918567531 0.6868241897597981
```


## Python file with everything

Check out the complete code here: [https://gist.github.com/Vict0rSch/...](https://gist.github.com/Vict0rSch/ce34af00a425fb322a2622de483ade9e)
