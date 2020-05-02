# How the algorithm works (in plain English)

The algorithm generates random matrices (under a certain rule), applies a Thurstone scaling algorithm to it, and tests if the algorithm output is what we designed it to be; if yes, we call this a valid matrix. We measure the ratio of valid matrices to all the matrices generated.

## The assumption

For the purpose of our experiment, we need to compare the complexity of 10 different images (each named #1, #2, …, #10). We assume that the complexity is a unidimensional characteristic of the images. 

Using a random number generator, we generate a random vector $v \in \mathbb{R}^{10}$, with $v_1 = 0$ (We are one-indexed). We call this random vector our **model**: a vector, $v$, that represents the "true complexity" of each image. The first image (in a vector) is always assigned a complexity of 0 (as an "anchor point", otherwise the whole numerial axis can be shifted up and down arbitrarily).

Here is a sample model vector $v$ generated randomly, which we will reuse later in this document:
$$
v = \left[\begin{array}{c} 
0\\
-0.7104039\\
-0.7659690\\
-0.7687082\\
-1.7198466\\
0.9960819\\
2.2598838\\
1.1505354\\
-0.5871464\\
1.7390977
\end{array}\right]
$$
In the real experiment, this will be the complexity score for a set of 10 images. That is, image #1 has complexity = 0, image #2 has complexity = -0.7104039, etc. The higher the score, the more complex it is. 

Naturally, we know that the closer the scores of two images get, the harder it is for our subjects to judge the difference between the complexities of the two images. For example, suppose we have two images that are equally complex. Since we do not allow ties, the chance that either image will be chosen as the more complex image is 50 - 50. As the difference in complexity gets bigger and bigger, we can foresee that the chance that one image gets chosen above another becomes 40-60, 30-70, or even 1-99, if the two images are really quite different.

Since we are using the Thurstone Scaling model, we are assuming a normal distribution, so this chance can be determined by the CDF of a standard normal distribution (mean = 0, standard deviation = 1), based on how far apart the image pair is in our model vector $v$. So for image #i and #j, their "true" difference in complexity, according to our model vector $v$, will be $v_i - v_j$. We use  $v_i - v_j$ to estimate the chance that any subject will prefer image #i over #j.  (This is done by calling the R function `pnorm(v[i] - v[j])`) 

## Generate the matrix

For our simulation experiment, we will generate many preference matrices (explained below). Each matrix indicates one round of experiment with a lot of independent subjects, so if we generate several hundred matrices, we are "running" several hundred of experiments in our computer sandbox.

We use **preference matrices** to log subjects' choices. In our case, since we have 10 images, the preference matrix is a $10 \times 10$ matrix $M = [m_{i,j}] \in \mathbb{N}^{10 \times10}$. The integer on entry $m_{i,j}$ means “$m_{i,j}$ subjects choose $i$ over $j$”, or, in our case, $m_{i,j}$ people believe image #$i$ is more complex than image #$j$. 

We randomly generate preference matrices based on the assumption mentioned in the previous section. Specifically, we generate the matrix entries using the binomial distribution ${n \choose x} p^x(1-p)^x$, where $n$ is the number of subjects, and $p$ is the possibility that any subject will choose #i over #j. 

Specifically: 

- Diagonals: Diagonal entries are always 0.
- Upper triangle: generated with the binomial distribution, with probability $p$ calculated by `pnorm(v[i] - v[j])` described in the previous section. (We use the R function `rbinom(1, number.of.subjects, pnorm(model[j] - model[k]))`)
- Lower triangle: $m_{j,i} = number.of.subjects - m_{i,j}$. If we have 80 subjects, and 30 of them choose #$i$ over #$j$, then the remaining 50 subjects should choose #$j$ over #$i$ (since no ties are allowed).

Again, here is a sample preference matrix, generated using the model $v$ shown in the example in the previous section:
$$
M = \left[\begin{array}{cccccccccc}
0 &  8 &  5 &  9 &  8 &  1 &  1 &  2 &  0 &   0\\
2 &  0 &  4 &  5 &  4 &  0 &  0 &  0 &  0 &   0\\
5 &  6 &  0 &  9 &  7 &  0 &  1 &  1 &  0 &   0\\
1 &  5 &  1 &  0 &  6 &  0 &  0 &  1 &  0 &   0\\
2 &  6 &  3 &  4 &  0 &  0 &  0 &  0 &  0 &   0\\
9 & 10 & 10 & 10 & 10 &  0 &  6 &  3 &  6 &   1\\
9 & 10 &  9 & 10 & 10 &  4 &  0 &  8 &  6 &   2\\
8 & 10 &  9 &  9 & 10 &  7 &  2 &  0 &  3 &   1\\
10 & 10 & 10 & 10 & 10 &  4 &  4 &  7 &  0 &   3\\
10 & 10 & 10 & 10 & 10 &  9 &  8 &  9 &  7 &   0
\end{array}\right]
$$
As an example of how to read the matrix: $m_{2,3} = 4$, then we know that 4 subjects believe #2 is more complex than #3.

Following the rule above, we generate a new preference matrix on every iteration.

## Test the matrix

We take the preference matrix described above and feed it into the Thurstone Scaling algorithm (`thurstone(M)` provided by the R package eba). The algorithm will generate a score for each item. 

A sample output from R, using $M$ from the previous section as our preference matrix:

```
Thurstone-Mosteller model (Case V)

Parameter estimates:
 [1]   0.0000  -0.9244  -0.2390  -0.9631  -0.9276   1.4222   1.5450   1.1193   1.5818   2.3927

Goodness of fit (-2 log likelihood ratio):
	G2(36) = 21.15, p = 0.9768
```

How to read the program output:

- The line under `Parameter estimates` is the estimated scoring vector; call it $v'$. Here, the algorithm has scored image #1 to be 0.0000, image #2 to be -0.3350, …, image #10 to be -1.6297. Again, the first entry in $v'$  is always scored zero. 
- The `goodness of fit ` statistic includes the likelihood ratio fitted vs. saturated model (-2logL), the degrees of freedom, and the p-value of the corresponding chi-square distribution
  - Here, the p-value indicates the probability that our null hypothesis $H_0$ holds. According to [the eba package documentation](https://cran.r-project.org/web/packages/eba/eba.pdf), $H_0$ means "$v_1 = v_2 = v_3 = ... = v_{10}$". In this context, it means "assume $v$ is a zero vector $[0, 0, ... ,0]^T$, 97.68% of the time we are going to observe a result like $v'$". The $p$ value is high here probably because we are simulating with only 10 subjects. 

We now use the program output $v'$ and compare it with our model $v$. The goal is to see how close these two vectors are. We do a one-by-one comparison for each vector entry (compare $v_i$ with $v_i'$).

We set up a **tolerance** $\tau$, or a threshold, to describe how "close" we want our simulated result to be to the actual result. If the resulting $v'$ is below the threshold, we consider it close enough to our model $v$ and accept this simulation; otherwise, we reject it. 

So, if our tolerance $\tau$ = 0.1, then for the $v$ and $v'$ in our example, we have 
$$
|v' - v| = \left[\begin{array}{c} 
0.0000000\\
0.2139961\\
0.5269690\\
0.1943918\\
0.7922466\\
0.4261181\\
0.7148838\\
0.0312354\\
2.1689464\\
0.6536023
\end{array}\right]
$$
Nearly all the entries of $|v' - v|$ are larger than our tolerance $\tau$! So we will reject this one. 

Had we had more subjects (like, 500, instead of 10), by the Law of Large Numbers, the resulting preference matrix would be more "stable" and less likely to be rejected.

## Iteration

We repeat the matrix generation and the matrix test multiple times, and calculate the ratio of acceptance to the total number of iterations. The ratio will be our indicator of confidence level: Given this many subjects, how likely is our result going to be close enough to the "true" complexity?

## Result

With the same number of subjects, the following points can result in a higher confidence level:

* More subjects
* "True" complexity less spread out (has a larger range)  
* Have a cluster at the middle (score is normally distributed) 

Thus we'd like to conduct a pilot study to help us guesstimate how many more subjects we need. Assuming a 90% confidence level, a pilot study of ~50 people is preferred (the minimum we need for each category without "wasting" any subject data).

# Glossary

**Model**

* a vector, $v$, that represents the "true complexity" of each image.
* In our case, $v \in \mathbb{R}^{10}$ 

**Preference matrix**

- a matrix, $M$, whose entries represent the frequency with which one item is chosen over another.
- In our case, it is a $10 \times 10$ matrix.

**Tolerance**

* a number, $\tau \in \mathbb{R}$, that indicates how "close" we want our simulated result to be to the actual result.
