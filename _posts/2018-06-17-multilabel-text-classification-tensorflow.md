---
layout: post

title: "Multi-label Text Classification with Tensorflow"
# subtitle: ""
# cover_image: tf.png
comments: true

excerpt: "Multilabel classification requires some changes to the mainstream single-label case: here they are!"

tags:
  - Tensorflow
  - Multilabel
  - Data

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch
---

Which loss should you use? How to use the `tf.data.Dataset` API with a train and a validation set? How to use streaming metrics? Here are my answers.

This post is about the specifics of the multilabel setting, and a little about how to handle sequences of sequences. It is not about an NLP pipeline nor is it about the model you should use. The overall idea is aimed at using the `Dataset` API and about a few gotchas to pay attention to when handling multilabel data. Check out the table of contents for more details.

A lot of the content here comes from 

* [Stanford's CS 230](https://cs230-stanford.github.io/tensorflow-input-data.html)
* [Sampling Multilabel Datasets](http://vict0rsch.github.io/2018/05/24/sample-multilabel-dataset/)
* [Streaming f1-score in a multilabel setting](http://vict0rsch.github.io/2018/06/06/tensorflow-streaming-multilabel-f1/)

Feel free to comment on what's written here: typos, suggestions, other changes I've missed or errors I've made! Also, some things may not be optimal, I'm open to improvements to my solutions! 


<br>

1. 
{:toc}

# Data

## Preparing the dataset

### Train, Validation, Test: Sampling

In the *single-label* situation, the usual and easy way to keep the datasets' statistics equal is to sample independently each class of the original dataset. It's a valid procedure in this case: if you want 70% of your data in the train set, you take 70% of samples with class *A*, 70% of samples with class *B* and so on.

How would you do that if each sample can be of multiple classes simultaneously? The single-label procedure is only valid as long as you can sample **independantly** each class, which is no longer possible!

Check out my [blog post on sampling multilabel datasets](http://vict0rsch.github.io/2018/05/24/sample-multilabel-dataset/) to appropriately do so.

### Text: sequences of sequences

You obviously need to prepare tour text according to standard nlp pipelines. As we'll use the `tf.data.Dataset` API, we'll simply write our texts to a text file, one text to be classified per line. Something like:

{% highlight python %}
processed_texts = my_nlp_pipeline()  # processed_texts = ['this is a text', 'this is another text to classify', ...]
with open('data.txt', 'w') as f:
    f.write('\n'.join(processed_texts))
{% endhighlight %}

My work involves working with 2-level sequences: the Hierarchical Attention Network requires the data to be processed as documents wich are lists of sentences which are lists of words. If you don't need this hierarchical structure, do move forward. If you need it, my solution is to still write one document per line, but separate sentences with a fixed token.

{% highlight python %}
hierarchical_processed_texts = my_nlp_pipeline()
with open('data.txt', 'w') as f:
    f.write(
        '\n'.join(
            '|&|'.join(doc) for doc in hierarchical_processed_texts
        )
    )
{% endhighlight %}

For instance, we'd write such a text file:

```
This is a comment from the yelp dataset .|&|It reprensents a document .|&|Its sentences are separated by a token .
This is another comment .|&|It says that John's pizzas are great .|&|The author would go back .|&|Nice staff .
...
```

This will allow us to split documents on `|&|` and then sentences on whitespaces `_`. 

### Vocabulary

In any case we need to write a text file with the vocabulary. Each line should contain a word and the line's number will be the word's index in the vocabulary.

{% highlight python %}
from collections import defaultdict

pad_token = "<pad>"

processed_texts = my_nlp_pipeline()

all_vocab = defaultdict(int)
for text in processed_texts:
    for word in text.split(' '):
        all_vocab[word] += 1

ordered_vocab = sorted(all_vocab.keys(), key=all_vocab.get, reverse=True)  # most frequent words first
ordered_vocab = [pad_token] + ordered_vocab  # you want the padding token to have index 0

max_vocab_size = int(1e5)  # you may not want all possible words
with open('./words.txt', 'r') as f:
    f.write('\n'.join(ordered_vocab[:max_vocab_size]))
{% endhighlight %}


### Labels

Again, we'll write labels in a text file:

* Find all possible labels
* Assign them an index
* One-hot encode lists of labels
* Write to text file.

For instance say you have 4 classes, up to 3 labels and 5 samples:

{% highlight python %}
samples = [
  ["Culture", "War"]
  ["War", "Philosophy", "Love"]
  ["Love", "Culture"]
  ["War"]
  ["Culture", "Love"]
]

all_labels = set(label for sample in samples for label in sample)
ordered_labels = sorted(all_labels)
labels_dict = {l:i for i, l in enumerate(ordered_labels)}

one_hot_labels = np.zeros((len(samples), len(all_labels))).astype(int)
for i, sample in enumerate(samples):
    for label in sample:
        one_hot_labels[i, labels_dict[label]] = 1

np.savetxt(one_hot_samples, './one_hot_labels.txt')
{% endhighlight %}

one_hot_labels.txt:

```
1, 0, 0, 1
0, 1, 1, 1
1, 1, 0, 0
0, 0, 0, 1
1, 1, 0, 0
```

## Loading the data with `tf.data.Dataset`

### Feeding sequences of sequences inside a Tensorflow Dataset

In the regular situation, all we have to do is split texts into words. In the hierarchical situation, we also need to split sentences:

{% highlight python %}
def extract_sents(doc):
    # Split the document line into sentences
    return tf.string_split([doc], '|&|').values

def extract_words(sentence):
    # Split characters
    out = tf.string_split(sentence, delimiter=" ")
    # Convert to Dense tensor, filling with default value
    out = tf.sparse_tensor_to_dense(out, default_value=pad_token)
    return out


num_threads = 4

vocabulary = tf.contrib.lookup.index_table_from_file(your_vocabulary_file, num_oov_buckets=1)
texts_dataset = tf.data.TextLineDataset(your_texts_file)

texts_dataset = texts_dataset.map(extract_sents, num_threads)
texts_dataset = texts_dataset.map(extract_words, num_threads)
texts_dataset = texts_dataset.map(vocabulary.lookup, num_threads)
{% endhighlight %}


### Processing the labels

We need to read the one-hot encoded text file and turn it into tensors:

{% highlight python %}
def one_hot_multi_label(string_one_hot):
    # split on ", " and get dense Tensor
    vals = tf.string_split([string_one_hot], split_label_token).values
    # convert to numbers
    numbs = tf.string_to_number(vals)
    return tf.cast(numbs, tf.int64)

labels_dataset = tf.data.TextLineDataset(your_texts_file)
labels_dataset = labels_dataset.map(one_hot_multi_label, num_threads)
{% endhighlight %}


### Creating a `Dataset` and input Tensors

Now we need to zip the labels and texts datasets together so that we can shuffle them together, batch and prefetch them:

{% highlight python %}
batch_size = 32  # could be a placeholder

padded_shapes = (
    tf.TensorShape([None, None]),
    tf.TensorShape([None]),
) 

padding_values = (np.int64(0), np.int32(0)) # 0 is the index of our <pad> token
# for some reason running the same code on linux or macOS raises type erros. Adjust the type
# of your 0 padding_values according to your platform

dataset = tf.data.Dataset.zip((texts_dataset, labels_dataset))
dataset = dataset.shuffle(10000, reshuffle_each_iteration=True)
dataset = dataset.padded_batch(batch_size, padded_shapes, padding_values)
dataset = dataset.prefetch(10)

iterator = tf.data.Iterator.from_structure(
    dataset.output_types,
    dataset.output_shapes,
)
dataset_init_op = iterator.make_initializer(
    dataset, name="dataset_init_op"
)

input_tensor, labels_tensor = iterator.get_next()

{% endhighlight %}

Repeating for several epochs will be done manually at run time for more flexibility.

{% details Wondering about `padded_shapes`? %}

`padded_shapes` is a tuple. The first `shape` will be used to pad the features (*i.e.* the 3D Tensor with the list of word indexes for each sentence in each document), and the second is for the labels. 

The **labels** won't require padding as they are already a consistent 2D array in the text file which will be converted to a 2D Tensor. But Tensorflow does not know it won't need to pad the labels, so we still need to specify the `padded_shape` argument: if need be, the Dataset should pad each sample with a 1D Tensor (hence `tf.TensorShape([None])`). For instance if a label was `[0, 1, 0, 0, 1]` and the next one was `[0, 1]` then the padding would be `[0, 0, 0]` as we said that the `padding_value` should be `0`.

The **features** on the other hand will need padding as within a batch (a list of documents, first dimension of the 3D batch Tensor), all documents won't have the same number of sentences (2nd dimension of the Tensor) and all sentences within the batch won't have the same number of words (last dimension). The Dataset may therefore need to patch 2 dimensions (sentences and words), hence `tf.TensorShape([None, None])`. And as we put the padding token first in the vocabulary, then its index is 0 and the `padding_value` is also 0.

Lastly, we need the types of `padding_values` to be consistent with the types of the `features` and `labels` tensors produced by the `text_dataset` and the `labels_dataset`, which is why I used `np.int*`.

{% enddetails %}

### Handling the validation data

Actually what you should do is have a dataset for your training data and another one for your validation data. This will allow you to use one without affecting the other. People usually use only one dataset and re-initialize it with validation data at the end of each epoch. I like having 2 datasets because I don't want to wait for the end of an epoch to validate.

To do so, just do the previous procedure inside a `with tf.variable_scope(train_or_val):` and use `tf.cond` to chose the dataset:

{% highlight python %}

is_training = tf.placeholder(bool)

with tf.variable_scope("train-dataset"):
    train_dataset = ...
    ...
    train_iter = ...
    train_dataset_init_op = ...

with tf.variable_scope("val-dataset"):
    val_dataset = ...
    ...
    val_iter = ...
    val_dataset_init_op = ...

input_tensor, labels_tensor = tf.cond(is_training, train_iter.get_next, val_iter.get_next)
{% endhighlight %}




# Model

## Loss

We want each dimension of our model's logits to be an independant logistic regression. We'll therefore use `tf.nn.sigmoid_cross_entropy_with_logits`.

{% highlight python %}

logits = your_model(input_tensor)
loss = tf.nn.sigmoid_cross_entropy_with_logits(logits=logits, labels=labels_tensor)
# loss has the same shape as logits: 1 loss per class and per sample in the batch
loss = tf.reduce_mean(
    tf.reduce_sum(loss, axis=1)
)
{% endhighlight %}

Notice how the loss is summed accross classes before it is averaged over the batch. I'm not 100% positive, if you have an opinion, do checkout the [discussion on github here](https://github.com/tensorflow/skflow/issues/113).

## Prediction

Unlike the single-label case, we should not output a softmax probability distribultion as labels are classified independently. We need just apply a `sigmoid` on the logits as they are independant logistic regressions:

{% highlight python %}
def multi_label_hot(prediction, threshold=0.5):
    prediction = tf.cast(prediction, tf.float32)
    threshold = float(threshold)
    return tf.cast(tf.greater(prediction, threshold), tf.int64)

prediction = tf.sigmoid(logits)
one_hot_prediction = multi_label_hot(prediction)
{% endhighlight %}

## Metrics

I highly recommend you [learn about streaming metrics](https://stackoverflow.com/a/46414395/3867406). Also, checkout my [previous blogpost about streaming f1-score](http://vict0rsch.github.io/2018/06/06/tensorflow-streaming-multilabel-f1/) in the multilabel setting to understand `streaming_f1`. Here is a function meant to gather training and validation metrics:

{% highlight python %}
def get_metrics(labels_tensor, one_hot_prediction, num_classes):
    metrics = {}
    with tf.variable_scope("metrics"):
        for scope in ["train", "val"]:
            with tf.variable_scope(scope):
                with tf.variable_scope("f1"):
                    f1s, f1_updates = streaming_f1(
                        labels_tensor,
                        one_hot_prediction,
                        num_classes,
                    )
                    micro_f1, macro_f1, weighted_f1 = f1s
                with tf.variable_scope("accuracy"):
                    accuracy, accuracy_update = tf.metrics.accuracy(
                        tf.cast(one_hot_prediction, tf.int32),
                        labels_tensor,
                    )
                metrics[scope] = {
                    "accuracy": accuracy,
                    "f1": {
                        "micro": micro_f1,
                        "macro": macro_f1,
                        "weighted": weighted_f1,
                    },
                    "updates": tf.group(f1_updates, accuracy_update),
                }
    return metrics

{% endhighlight %}


## Training

Here is the skeletton for a training procedure.

{% highlight python %}

metrics = get_metrics(labels_tensor, one_hot_prediction, num_classes)

opt_op = optimize(loss) # Create your own optimize() function with your preferred
                        # optimizer, clipped gradients and so on

train_fd = {is_training: True}
val_fd = {is_training: False}

with tf.Session() as sess:

    tf.global_variables_initializer().run(session=sess)
    tf.tables_initializer().run(session=sess)

    for epoch in range(nb_of_epochs):

        stop = False
        sess.run(train_dataset_init_op, feed_dict=train_fd)

        while not stop:
            try:
                loss, step, _, acc, mic, mac, wei = sess.run([
                    loss, 
                    global_step, # this variable is usually incremented by optimizer.optimize()
                    opt_op,
                    metrics["train"]["updates"],
                    metrics["train"]["accuracy"],
                    metrics["train"]["f1"]["micro"],
                    metrics["train"]["f1"]["macro"],
                    metrics["train"]["f1"]["weighted"]
                ], feed_dict=train_fd)

                if step > 0 and step % val_every == 0:
                    sess.run(val_dataset_init_op, feed_dict=val_fd)
                    while True:
                        try:
                            _, acc, mic, mac, wei = sess.run(
                                [
                                    metrics["val"]["updates"],
                                    metrics["val"]["accuracy"],
                                    metrics["val"]["f1"]["micro"],
                                    metrics["val"]["f1"]["macro"],
                                    metrics["val"]["f1"]["weighted"]
                                ], feed_dict=val_fd
                            )
                        except tf.errors.OutOfRangeError:
                            break
                    print('\nValidation : ', acc, mic, mac, wei)

            except tf.errors.OutOfRangeError:
                stop = True
            finally:
                print('Epoch {:3} step {:5}: {}'.format(
                    epoch, step, loss
                ), end="\r")

    print('End of Training')
{% endhighlight %}

