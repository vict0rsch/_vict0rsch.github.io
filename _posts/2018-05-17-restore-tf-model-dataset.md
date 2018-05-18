---
layout: post

title: "Save and Restore a Tensorflow model with its Dataset using simple_save"
subtitle: "Restoring a graph, finding the appropriate Tensors and Operations"
cover_image: tf.png
comments: true

excerpt: "The saved_model API allows for easy saving. Restoring the model and performing inference is a bit trickier when the input Tensors come from a tf.data.Dataset. We'll see here how this works."

author:
  name: Victor Schmidt
  twitter: vict0rsch
  github: vict0rsch

---

# Introduction

I recently found my self in a tricky situation. Never had it been easier to save and restore a Tensorflow model than with `tf.saved_model.simple_save` and then `tf.saved_model.loader.load`. On the other hand, very little documentation exists regarding the interaction with the Dataset API and how to restore a saved `tf.data.Dataset`'s `Iterator`.

This post contains standalone and deterministic code (at the end) to make it easily reproducible for you. It runs under python 3 and Tensorflow 1.8.

# What was my issue?

It took me a long time to figure it out. I had to go through several StackOverflow questions and many blog posts to even phrase my problem. I even got to Google's second search page..!

I kept running into this error :

```text
FailedPreconditionError (see above for traceback): GetNext() failed because the iterator has not been initialized
```

## Code draft

Here is a skeleton of how my code worked (careful, it's **wrong**):

Saving

{% highlight python %}

features_ph = tf.Placeholder(...)
labels_ph = tf.Placeholder(...)

dataset = tf.data.Dataset.from_tensor_slices((features_data_ph, labels_data_ph))
iterator = dataset.make_initializable_iterator()

input_tensor, labels_tensor = iterator.get_next()

logits = my_model_function(input_tensor)
opt_op = my_optimizing_function(logits, labels_tensor)

with tf.Session() as sess:
    sess.run(dataset_init_op, feed_dict={
        features_data_ph: some_numpy_values,
        labels_data_ph: some_other_numpy_values
    })
    # training
    ...
    tf.saved_model.simple_save(...)
{% endhighlight %}

Restoring

{% highlight python %}
dataset = tf.data.Dataset.from_tensor_slices(
            (features_data_ph, labels_data_ph))
iterator = dataset.make_initializable_iterator()
input_tensor, labels_tensor = iterator.get_next()

with tf.Session() as sess:
    tf.saved_model.loader.load(...)

    restored_labels_data_ph = graph2.get_tensor_by_name(...)
    restored_features_data_ph = graph2.get_tensor_by_name(...)
    restored_logits = graph2.get_tensor_by_name(...)

    sess.run(iterator.initializer, feed_dict={
        restored_features_data_ph: some_numpy_values,
        restored_labels_data_ph: some_other_numpy_values
    })

    restored_logits.eval(session=sess)
>>> "FailedPreconditionError (see above for traceback): GetNext() failed because the iterator has not been initialized [...]"
{% endhighlight %}

<br/>

Can you spot what's wrong here?

# What's happening?

`tf.saved_model.simple_save` freezes a `graph`'s variables from a `session`'s values. When `tf.saved_model.loader.load` is called, it restores variables in the current default graph. However when we call `iterator.initializer`, we don't initilaize the *restored* `Iterator`, we initialize the *new* one! But `restored_logits` still depends on the restored graph's `input_tensor`, which itself was built from the *restored* `Iterator`.

So we need to find the right initializing operation. An easy way to do that is to build the `Iterator` in another way:

{% highlight python %}
dataset = tf.data.Dataset.from_tensor_slices((features_data_ph, labels_data_ph))
iterator = tf.data.Iterator.from_structure(dataset.output_types, dataset.output_shapes)
dataset_init_op = iterator.make_initializer(dataset, name='dataset_init')
input_tensor, labels_tensor = iterator.get_next()
{% endhighlight %}

Now the operation is super easy to grab from the restored graph:

{% highlight python %}
dataset_init_op = graph.get_operation_by_name('dataset_init')
{% endhighlight %}


# Code

The following code generates random data for the sake of the demonstration.

1. We start by creating the placeholders. They will hold the data at runtime. From them, we create the `Dataset` and then its `Iterator`. We get the iterator's generated tensor, called `input_tensor` which will serve as input to our model.
2. The model itself is built from `input_tensor`: a GRU-based bidirectional RNN followed by a dense classifier. Because why not.
3. The loss is a `softmax_cross_entropy_with_logits`, optimized with `Adam`. After 2 epochs (of 2 batches each), we save the "trained" model with `tf.saved_model.simple_save`. If you run the code as is, then the model will be saved in a folder called `simple/` in your current working directory.
4. In a new graph, we then restore the saved model with `tf.saved_model.loader.load`. We grab the placeholders and logits with `graph.get_tensor_by_name` and the `Iterator` initializing operation with `graph.get_operation_by_name`.
5. Lastly we run an inference for both batches in the dataset, and check that the saved and restored model both yield the same values. They do!

{% highlight python %}
import os
import shutil
import numpy as np
import tensorflow as tf
from tensorflow.python.saved_model import tag_constants


def model(graph, input_tensor):
    """Create the model which consists of
    a bidirectional rnn (GRU(10)) followed by a dense classifier

    Args:
        graph (tf.Graph): Tensors' graph
        input_tensor (tf.Tensor): Tensor fed as input to the model

    Returns:
        tf.Tensor: the model's output layer Tensor
    """
    cell = tf.nn.rnn_cell.GRUCell(10)
    with graph.as_default():
        ((fw_outputs, bw_outputs), (fw_state, bw_state)) = tf.nn.bidirectional_dynamic_rnn(
            cell_fw=cell,
            cell_bw=cell,
            inputs=input_tensor,
            sequence_length=[10] * 32,
            dtype=tf.float32,
            swap_memory=True,
            scope=None)
        outputs = tf.concat((fw_outputs, bw_outputs), 2)
        mean = tf.reduce_mean(outputs, axis=1)
        dense = tf.layers.dense(mean, 5, activation=None)

        return dense


def get_opt_op(graph, logits, labels_tensor):
    """Create optimization operation from model's logits and labels

    Args:
        graph (tf.Graph): Tensors' graph
        logits (tf.Tensor): The model's output without activation
        labels_tensor (tf.Tensor): Target labels

    Returns:
        tf.Operation: the operation performing a stem of Adam optimizer
    """
    with graph.as_default():
        with tf.variable_scope('loss'):
            loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(
                    logits=logits, labels=labels_tensor, name='xent'),
                    name="mean-xent"
                    )
        with tf.variable_scope('optimizer'):
            opt_op = tf.train.AdamOptimizer(1e-2).minimize(loss)
        return opt_op


if __name__ == '__main__':
    # Set random seed for reproducibility
    # and create synthetic data
    np.random.seed(0)
    features = np.random.randn(64, 10, 30)
    labels = np.eye(5)[np.random.randint(0, 5, (64,))]

    graph1 = tf.Graph()
    with graph1.as_default():
        # Random seed for reproducibility
        tf.set_random_seed(0)
        # Placeholders
        batch_size_ph = tf.placeholder(tf.int64, name='batch_size_ph')
        features_data_ph = tf.placeholder(tf.float32, [None, None, 30], 'features_data_ph')
        labels_data_ph = tf.placeholder(tf.int32, [None, 5], 'labels_data_ph')
        # Dataset
        dataset = tf.data.Dataset.from_tensor_slices((features_data_ph, labels_data_ph))
        dataset = dataset.batch(batch_size_ph)
        iterator = tf.data.Iterator.from_structure(dataset.output_types, dataset.output_shapes)
        dataset_init_op = iterator.make_initializer(dataset, name='dataset_init')
        input_tensor, labels_tensor = iterator.get_next()

        # Model
        logits = model(graph1, input_tensor)
        # Optimization
        opt_op = get_opt_op(graph1, logits, labels_tensor)

        with tf.Session(graph=graph1) as sess:
            # Initialize variables
            tf.global_variables_initializer().run(session=sess)
            for epoch in range(3):
                batch = 0
                # Initialize dataset
                # (could feed epochs in Dataset.repeat(epochs))
                sess.run(
                    dataset_init_op,
                    feed_dict={
                        features_data_ph: features,
                        labels_data_ph: labels,
                        batch_size_ph: 32
                    }
                )
                while True:
                    try:
                        if epoch < 2:
                            # Training
                            _, values = sess.run([opt_op, logits])
                            print(epoch, batch, values[0])
                            batch += 1
                        else:
                            # Final inference
                            values = sess.run(logits)
                            print(epoch, batch, values[0])
                            batch += 1
                    except tf.errors.OutOfRangeError:
                        break
            # Save model state
            cwd = os.getcwd()
            path = os.path.join(cwd, 'simple')
            shutil.rmtree(path, ignore_errors=True)
            inputs_dict = {
                "batch_size_ph": batch_size_ph,
                "features_data_ph": features_data_ph,
                "labels_data_ph": labels_data_ph
            }
            outputs_dict = {
                "logits": logits
            }
            tf.saved_model.simple_save(
                sess, path, inputs_dict, outputs_dict
            )
    # Restoring
    graph2 = tf.Graph()
    with graph2.as_default():
        with tf.Session(graph=graph2) as sess:
            # Restore saved values
            tf.saved_model.loader.load(
                sess,
                [tag_constants.SERVING],
                path
            )
            # Get restored placeholders
            labels_data_ph = graph2.get_tensor_by_name('labels_data_ph:0')
            features_data_ph = graph2.get_tensor_by_name('features_data_ph:0')
            batch_size_ph = graph2.get_tensor_by_name('batch_size_ph:0')
            # Get restored model output
            restored_logits = graph2.get_tensor_by_name('dense/BiasAdd:0')
            # Get dataset initializing operation
            dataset_init_op = graph2.get_operation_by_name('dataset_init')

            # Initialize restored dataset
            sess.run(
                dataset_init_op,
                feed_dict={
                    features_data_ph: features,
                    labels_data_ph: labels,
                    batch_size_ph: 32
                }

            )
            # Compute inference for both batches in dataset
            for _ in range(2):
                restored_values = sess.run(restored_logits)
                print(restored_values[0])
    # Check if original inference and restored inference are equal
    valid = (values == restored_values).all()
    print('\nInferences match: ', valid)
{% endhighlight %}

```shell
$ python3 save_and_restore.py
0 0 [-0.35928762 -0.19438529  0.10040186  0.17297073 -0.6134796 ]
0 1 [ 0.09662652 -0.04785472 -0.18622595 -0.21482113  0.19705738]
1 0 [-0.33089647 -0.19087324 -0.02834633  0.0427071  -0.49164948]
1 1 [ 0.06050131  0.00975212 -0.2111744  -0.25762773  0.2569645 ]
2 0 [-0.3587499  -0.18573113 -0.12040734 -0.05728728 -0.38345984]
2 1 [ 0.03078173  0.03761462 -0.22916263 -0.27559632  0.28450522]
INFO:tensorflow:Assets added to graph.
INFO:tensorflow:No assets to write.
INFO:tensorflow:SavedModel written to: b'/some_path/simple/saved_model.pb'
INFO:tensorflow:Restoring parameters from b'/some_path/simple/variables/variables'
[-0.3587499  -0.18573113 -0.12040734 -0.05728728 -0.38345984]
[ 0.03078173  0.03761462 -0.22916263 -0.27559632  0.28450522]

Inferences match:  True

```
