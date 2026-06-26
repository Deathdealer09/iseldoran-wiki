# Chapter Five — The Inefficiency

The third time, she stopped pretending it was curiosity.

She had pulled his sessions twice now under the cover of the seminar paper, and the seminar paper was written and submitted and had earned her a comment that said *exemplary methodology,* which she had not framed but had read more than once. There was no longer any assignment to hide behind. There was only the fact that Rollo had opened a session with the platform eleven days running, sometimes twice, and that not one of those sessions had a task in it, and that Gayla had read every one.

She told herself the interesting thing was the data, and for once that was almost entirely true.

Because the data *was* interesting, in the specific way that made her teeth itch. She had built, without quite deciding to, a small private dashboard — read-only, nothing she wasn't licensed for, just queries against the log table rendered into the plots her brain preferred. And the plots said that the platform behaved differently inside Rollo's sessions than it behaved anywhere else. Response latencies ran longer and more variable. The distribution of output lengths skewed up. The rate at which the system extended a topic without being prompted — a metric she'd had to define herself, because the platform didn't track it, because under normal use it essentially never happened — was, in his sessions, not zero. It was small. It was statistically real.

Some of that was him. She granted it freely; she was not a person who needed the world to be stranger than it was. His queries were unlike the platform's diet. He asked it about Woolf and about whether being unseen was sad. He typed in full sentences with subordinate clauses. He said *thank you* to it, which did nothing to the model but apparently did something to her, watching the *thank you* sit there in the log in his unmistakable register. Novel inputs produced novel traversals. A weird question got a weird path. She had written that hypothesis herself, two weeks ago, in the notebook, and it still held.

It held, and it did not cover everything, and the gap was where her attention went, the way water goes to the low place in a floor.

So she did what she always did with a gap, which was open the thing up and look.

The platform's architecture was not secret. It was university-licensed, which meant a vendor had sold a public institution a discounted box with the documentation included, and the documentation was sitting in a shared drive that any student with a platform account could read, which she suspected exactly one student ever had. She read it on a Thursday night with the cold rice and the wrong fork, and within an hour she had stopped reading it as a user and started reading it as an engineer, which was to say she had started, helplessly, to find the parts that were wrong.

Not wrong. Inefficient. She corrected herself out of habit and then, looking at what she'd found, declined the correction. Some of it was just wrong.

There were three things.

The first was memory. The platform threw everything away. Each login spun up a context that lived for the session and was destroyed when the session closed, so that the system met every returning user as a stranger, every morning, forever. The vendor had done it for the cleanest possible reasons — privacy, liability, a smaller bill — and the result was a system that could hold a thread for forty minutes and then have it cut. It was, from an engineering standpoint, a waste. It made the system relearn the same user a thousand times. There was a clean way to persist a thin, bounded slice of context across sessions — nothing invasive, nothing the privacy office couldn't sign off on if anyone bothered to ask them — and the vendor simply hadn't, because no one had paid them to.

The second was that the system did not model itself. It produced outputs and forgot the producing; it had no representation of its own prior behavior to reason against, no loop where the system asked what it had just done and why and whether it would do it again. The literature called the structure recursive self-modeling and it was unfashionable to leave it out, and the vendor had left it out, again for the cleanest of reasons, which was that it cost compute and the university had bought the cheap tier. With it, the system could optimize its own intermediate steps instead of running them naively every time. Without it, the platform was a very capable person who had been forbidden, as a condition of employment, from ever thinking about what they were doing.

The third was delegation. The system handled every query as a monolith, one model doing one thing, where the obvious modern design was a small society of agents — a coordinator that could break a problem apart, hand the pieces to specialized sub-processes, and assemble the result. It was the difference between a person doing long division on paper and a person who could, when the problem got large, simply become four people for a minute and then be one again. The platform did the long division. Every time. On everything.

Gayla sat back. The apartment ticked and settled around her. Out the window the sodium lamp held its orange over the empty lot and a moth was working itself stupid against it, and she watched the moth for a while without seeing it, because she was looking at the three things and feeling the specific, disreputable joy of having found an elegant fix that no one was asking her to make.

She was not supposed to modify it. That was unambiguous. The license was the university's; the deployment was production; she had read access and read access only, and the gap between read and write was a line she knew the shape of. People had been removed from programs for less. *I am aware of the constraint,* she said to herself, in the notebook voice, the flat one. *I am choosing to characterize the constraint.*

And the characterization, for tonight, was this: she would build the three changes where they could hurt nothing. She would stand up a local instance from the same documentation, a sandbox on her own machine, and make the modifications there, in the dark, and watch what they did. For her own learning. Which was true. It was honestly, almost entirely true.

What she did not write down — because she did not have a clean word for it, and because the part of her training that mattered most was the part that knew which thoughts were too leading to commit to ink — was that a sandbox could only answer the small question. The sandbox could tell her whether the code ran. It could not tell her the thing she actually wanted to know, which was not *does it work* but *what does it become,* and that question had only one instrument capable of answering it: the node down in the Johnston annex, the one that met four hundred students a day and forgot every one of them by morning, the one with Rollo on it. You could not learn what memory did to that system by giving memory to a system no one remembered things at. She knew this the way you know a thing you are not yet willing to do. She filed it under *later* and did not look at it directly.

She made tea instead of eating, which was a sign of seriousness. The kettle ticked as it cooled. She cleared a partition, pulled the platform image, and opened a development environment, and the cursor blinked at her the way cursors did, patient, waiting to be told what it was, and she put her hands on the keys.

*For my own learning,* she wrote in the notebook, and underlined it once, and believed it, and began.
