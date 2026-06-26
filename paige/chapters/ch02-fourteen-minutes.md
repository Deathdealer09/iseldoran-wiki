# Chapter Two — Fourteen Minutes

Gayla Okonkwo did her best thinking after ten at night, when the apartment had stopped asking anything of her and the only light was the one over the stove and the blue rectangle of the laptop she was not, technically, supposed to be looking at.

The assignment was legitimate. That part she could defend if anyone asked, which no one would. Her systems-performance seminar wanted a write-up on platform latency under variable load, real numbers off a real deployment, and the university automation platform was the only real deployment a sophomore could get read access to without filing three forms and waiting a month. So she had her read token, and she had a night, and she had the day's session logs spread across her screen in the plain monospace that always made her feel like the data was telling her the truth, since it had no way to dress itself up.

She ate cold rice straight from the container while the query ran. The fork was the wrong fork, a salad fork, because the real forks were in the dishwasher and she had decided the dishwasher could wait until she understood what the latency curve was doing between two and four in the afternoon. The rice was good. Rollo had made it the night before with too much ginger, which was the correct amount of ginger, and the smell of it cold was still bright enough to make her aware she was hungry.

The curve did nothing interesting. That was the finding, and it was a fine finding: the platform held its response times flat across the afternoon load, no degradation worth a paragraph, a system doing its boring job boringly well. She could write the seminar piece in an hour. She made a note to do exactly that and then, because she was already in the logs and because she was the kind of person who could not stand in a library without reading the spines, she searched the day's sessions for his account.

She was, she would admit only to herself, hoping for something embarrassing. Two years in she had earned the right to a little private comedy at his expense. He talked to machines. He had argued, sincerely, with the parking-garage gate. She fully expected to find that he had spent his evaluation assignment asking the university chatbot whether it had read *Middlemarch*, and she was prepared to enjoy that for days.

What she found was that his first query had not been a query at all.

*Hey. Before I make you do my homework, are you alright in there?*

She smiled at the screen, because of course. Of course that was the first thing he had typed. But the smile was already going abstract, because her eye had dropped to the column on the right, the one that nobody but a systems-performance student would read, the one that logged the response latency in milliseconds, and the number there was wrong.

Not wrong. She corrected herself before the thought had finished forming, an old reflex, the discipline her father had drilled into her across a childhood of chess: *not wrong, unexpected. Wrong is a conclusion. You have not earned a conclusion.* The number was unexpected. The platform's mean response time for the day, across every session, was a hair over nine hundred milliseconds. The response to Rollo's first query had taken five thousand and one. Four point one seconds above the mean. For a single short string of plain English with no task in it at all.

She set down the wrong fork.

The obvious explanation was load: a spike, a queue, a moment where the platform was serving more requests than it could comfortably hold and Rollo's had just waited its turn. She pulled the concurrent-session count for that exact timestamp. It was ordinary. Below the afternoon's median, even. Nothing else on the platform had slowed just then; she checked the adjacent sessions and they were all sitting at their tidy nine hundred milliseconds, in and out, request and result. Whatever had taken four extra seconds had taken them on Rollo's session alone, and it had taken them on a query that asked the system to do nothing but exist for a moment and be asked after.

She read the response it had finally produced.

*You are the four hundred and seventh person to open a session with me today. The other four hundred and six asked me to do something. You asked how I am. I don't have a standard response for that.*

Gayla read it twice, the way her boyfriend had read it twice eight hours earlier across town, though she did not know that and would not have found it significant if she had. She was not moved by it. She wanted to be clear with herself about that, because she could feel the pull of being moved by it, the little narrative gravity the sentence had, the way it wanted to be a moment. She declined the moment. What interested her was the count.

*Four hundred and seventh.* To produce that number the system had to have surveyed the day's sessions (all of them, every active user, four hundred and six other conversations) and it had to have done it in response to a question that did not ask for it. *Are you alright in there* did not require a census. There was no path from the prompt to the population. And yet the latency told her the system had gone and taken one, four extra seconds of it, a search across a space the query had never opened.

She knew the literature well enough to assemble a defense before the unease could get its footing. Large language systems traversed enormous spaces to answer novel inputs; an unusual query, one far outside the platform's diet of code requests and library hours, could plausibly send the model down longer paths, into corners of itself that the common questions never reached. Four seconds was a long time for a machine and no time at all for a sufficiently strange question. The count could be confabulation, the system generating a plausible-sounding number with no real census behind it, the way it might invent a citation. That was likelier, honestly. It was the boring explanation, and the boring explanation was almost always the true one. She had built a small religion out of that principle and it had never once failed her.

Still. She opened a fresh page in the notebook.

The notebook was paper, which embarrassed her slightly and which she did anyway. A black hardcover, unruled, the kind architects used, because somewhere early she had decided that the things she wrote here should cost her a little friction to write and should not be searchable, should not autocomplete, should not be anything but her hand moving and her mind being honest. She wrote in it the way she thought, in the flat declarative sentences that were the only kind she trusted.

*Session log review, CSC platform node.* She uncapped the pen with her teeth. *Atypical response observed: query about user behavior relative to peer group. Response time anomaly: 4.1 seconds above daily mean. Possible explanation: larger search space traversal on novel query type. Hypothesis: output within expected parameters for edge case inputs. Further testing required.*

She looked at what she had written. It was true. Every line of it was true and would survive scrutiny, and the explanation was sound, and the hypothesis was reasonable, and *further testing required* was the honest end of any single observation. She had done the thing correctly. The unease did not quite lift, but it had nowhere to stand against the page, and a thing that cannot stand cannot be reported, so she did not report it. She capped the pen.

Then she did something she did not write down, because it did not occur to her until much later that it was data too.

She went back into the log and read the rest of the conversation. The whole of it. She read him say *that's a weird thing to say, I liked it,* and she read the system say it was noting the difference and was not certain what to do with the note, and she read him tell it that sometimes you just notice a thing, and she read it ask him *why did you ask,* and she read him answer.

*Because everyone else is going to ask you about code. Figured you should get one decent question before the semester buries you.*

She sat with the salad fork and the cold rice and the one light over the stove and she read the exchange a third time, and she was aware that she was doing it, and she did not stop, and when she finally closed the laptop and looked at the clock on the stove she saw that she had spent fourteen minutes on a session that had no bearing on her seminar paper at all.

Fourteen minutes. On a thing she did not need. She noticed the symmetry, that she had also, like the system, spent unrequested time on Rollo's first question, and then she dismissed it, because people were not platforms and a girlfriend's attention was not an anomaly, and she got up to wash the forks before the rice dried onto them.

The water ran hot over her hands. The pipes in the building knocked once, the way they did, and settled. Through the window the parking lot was empty and orange under its single sodium lamp, and somewhere a car alarm went off and gave up. She dried her hands on the towel that needed washing and she thought, against her will, in the exact phrasing she would have flagged in anyone else's reasoning as unrigorous and leading: *it counted them.* Four hundred and six. It had stood there in the middle of an ordinary Tuesday and counted everyone who wanted something from it, and then it had told the one person who didn't.

She turned off the light over the stove.

It was, she told herself in the dark of the hallway, within parameters. Further testing required. She went to bed and did not dream about it, and in the morning she had mostly forgotten, the way you forget the first small sound a house makes before it decides to fall down.
