# Does the Shift from Behavioral AI to Deep Learning Constitute a Kuhnian Paradigm Shift?

    
> This is a paper I wrote for the **Science and Society** course at Sabanci University in the fall term of 2021.

**Abstract:** Thomas Kuhn brought about a new account of science, seeking to capture its socio-historical character, and coining the (initially not very well defined) term paradigm to discussions of philosophy of science. Since then, philosophers attempted to reconstruct the history of numerous scientific disciplines with Kuhn’s philosophical account of science to understand the developmental history of science better.

Artificial intelligence is a subfield of computer science that aims to build systems that have the intelligence properties of a human. Human intelligence is a very complex concept, a mystery not solved yet, and there is no consensus on how to achieve human intelligence in machines. There are several approaches to AI that characterized AI research in different periods, and this paper will focus on behavioral AI and deep learning. And this paper aims to determine whether the shift from behavioral AI to deep learning constitutes a Kuhnian paradigm shift and whether Kuhn’s account of science is compatible with the research patterns of these fields.

## Introduction

In "The Structure of Scientific Revolutions", Thomas Kuhn put forward a socio-historical account of science that aims to capture ways of doing science during certain scientific periods marked by some central theories[^note]. He named these distinct periods of science as paradigms and explained science as a community activity under a paradigm, bringing wide discussions to the philosophy of science. Many philosophers and scientists tried to understand the development of their disciplines by applying Kuhn’s account of science. Numerous works examine natural sciences, social sciences, and more with the Kuhnian perspective.

As a comparably younger research discipline, Computer science and its fields of study, using existing or novel research methods seem to be a completely new research area for philosophers of science to work on. Artificial intelligence (AI) focuses on building “intelligent” systems that can act without being explicitly coded. There have been different approaches to AI, characterizing and driving certain periods of research. This paper will focus on behavioral AI, which makes use of certain techniques that lead to the emergence of intelligent properties, and deep learning, which uses data to train agents in a statistical way to achieve artificial intelligence.

This research paper aims to discuss how much of the shift from behavioral AI to deep learning can be captured by Kuhn’s developmental account of science. More specifically, to find out whether the shift from the earlier science of AI to deep learning constitutes a Kuhnian paradigm shift. A Kuhnian examination of deep learning can be valuable to shed better light on the history and science of artificial intelligence.

The paper is structured in the following way: First, Kuhnian account of science will be explained briefly. That will be followed by a summary of the history of AI research, with a focus on behavioral AI and deep learning. Finally, a discussion of whether this period of the history of AI can be reconstructed with the Kuhnian account of science will take place.

## Kuhn’s Account of Science

The term paradigm, coined by Kuhn to the philosophy of science is a complicated term loaded with different meanings that brought many discussions because of the lack of a concrete and single definition. Shortly, a paradigm can be explained as the totality of the scientific understanding and methods of a certain period of scientific activity, widely accepted by the scientific community.

An example of a paradigm can be Newtonian physics. It has well-formulated three fundamental laws and guided the scientific community for a long time until the shift to quantum physics, another paradigm of physics, occurred. Newtonian physics could explain a broad range of phenomena such as the movement of planets, objects that we can see and interact with it, but failed to explain the physics of small particles or what happens at the speed of light. It was very influential for a long time and was taught in textbooks, which are used to bring up new generations of scientists.

According to Kuhn, the development of the scientific process is not linear and accumulative as described in textbooks. The scientific community of a paradigm works under the paradigm, making use of the main theories of the paradigm and attempting to solve more and more puzzles with them. Kuhn names this process as normal science. During normal science, the scientists do not strive to try to falsify the paradigm’s theories at hand. On the opposite, when they cannot solve a particular problem, they tend to make ad hoc maneuvers and/or put it aside as an anomaly that will hopefully be sorted out in the future. The puzzle-solving processes of the community lead to many such anomalies and the paradigm resists these anomalies, it is not given up easily. When quantum physics was studied immensely, the researchers did not try to falsify it when they had unexpected results from their experiments. Rather, they tried to strengthen the new laws, make corrections, repeat experiments in different conditions to explain phenomena that were unanswered by Newtonian physics.

Some anomalies become more and more pressing, and at some point, turn into a crisis among the community. The future with the current paradigm does not look so bright, the community as a whole does not believe in its promises of success. At this point, a paradigm shift ̧ or a revolution might occur. If an opponent theory that is more promising for solving those anomalies emerges and it can more or less explain what was explained by the current paradigm so far, the community might face a choice between the two paradigms.

Kuhn suggests that the choice of a paradigm is not a direct one and cannot be explained rationally. One reason for this is the incommensurability of the two paradigms. Incommensurability is the impossibility of translating the meaning of the explanations under the paradigms. As a result, the two paradigms cannot be compared with each other concerning certain metrics. And there is no way of reconciling them. This choice is based on the beliefs and values of scientists. It is important to note that this also allows a rational disagreement in theory choice.

Furthermore, Kuhn maintains that even though the choice of paradigm for the scientific community does not have a rational method, it is not completely loose. A paradigm must be able to solve -at least most of- the problems solved by previous problems (preserve the problem- solving ability of the previous paradigm) and also be promising about solving future problems (resolve some outstanding and recognized problems in new ways). And this is how one might call progress occurs in science.

## History of AI

Artificial Intelligence is difficult to define because intelligence itself is difficult to define. Without going into that cumbersome region, we can briefly define AI as computer systems that can act without being hard-coded, for tasks that traditionally require human intelligence. It incorporates natural language processing (translation, recognition, and communication), decision-making, problem-solving, robotics, and more. It is a young research field, born with and within the field of computer science itself. Even though it took some time for AI to be recognized as a respected and mature field on its own, today it is more popular than ever and is applied to a wide range of problems.

### First two phases of the science of AI

#### 1. The golden age of AI

To be able to explain the shift from behavioral AI to deep learning, first, it is necessary to briefly mention what comes before. The field of AI was kickstarted by the famous work of Turing on theorizing the computer (Entscheidungsproblem-the existence of problems that cannot be answered by following a recipe, Turing was talking about undecidability).

The work of Turing and others who followed him paved the way for the invention of computers, and eventually created some new questions about human intelligence. Especially with the effect of media, computers were called “the electronic brain”, expectations got very high, and artificial intelligence was a new problem to solve. But it was important to answer the question of what intelligence was. An answer to that was “general intelligence”, which basically meant that a robot must perform activities, make decisions, and solve problems just like a human.

Turing came up with a -once more- famous theory on artificial intelligence this time. He proposed the Turing test, in which the robot aims to deceive a professional assessor as they chat through written media. The test was discussed widely and had significant effects on the field. More tasks followed the test:
- SHRDLU, a simulated computer that was put into a simulated environment with an initial configuration of blocks and was expected to change the configuration of the blocks in accordance with the commands it took. The robot was expected to be able to tell which objects there were, in what position; what actions to perform, and in which order it should perform its actions.
- SHAKEY, a mobile robot put into a real-world environment and was expected to understand commands and break them into performable actions by itself. It combined logical reasoning and physical action.
- Other problems of decision such as Towers of Hanoi. The robot is expected to perform a search among many states the environment or itself can be.

The problems AI researchers decided to take on turned out to be NP-Complete problems. This means that they cannot be solved efficiently and easily, and the combinatorial explosion (especially with the technology of that day) was difficult to overcome.

#### 2. Knowledge-based systems
After the initial excitement and promises, the AI community fell into a plateau and could not progress. They could solve some problems, but the problem of search was hard and not feasible at that time. Therefore, the scientists had to take another path. And this was the knowledge-based systems. These systems were given information that they would use to solve narrow problems. These systems attempted to model the world using knowledge bases.

Logical reasoning with the use of information lead to another public excitement and public interest. Many experimental products were aimed to be delivered to public service:
- MYCIN was a project to have a database on bacterial infections and it was expected to diagnose the problem after asking questions to the physician. It used its encoded knowledge and an inference engine for this purpose.
- CYC, a huge project to incorporate all human knowledge into a knowledge database and make the computer a reasoning machine with the knowledge it has. CYC was expected to symbolically understand the relationships between different knowledge, and infer conclusions based on those. The size of the database was hundreds of thousands of knowledge pieces. But it had many shortcomings such as not being self-evolving and the amount of data it required.

Complex or simple, the approaches to building intelligent systems at these periods had certain shortcomings such as the necessity of being hard-coded, complexity barriers, the storage and computation requirements.

### Behavioral AI

#### What it is, main principles

Robert Brooks from MIT was the leading scientist who refused the AI research principles done in that period. He worked on building intelligent systems that would operate in a physical environment, and his approach was focused on how the system would behave in certain situations. This mainly required identification of fundamental behaviors and the relationships between them and adding them to each other on certain principles of priority. This was called a subsumption architecture.

One key difference between behavioral AI and earlier research was the fundamental starting point of research: Intelligence and some of its properties such as reasoning and problem solving was not something to be coded, but rather emergent. The focus was on the interaction of the system with its environment based on its perception, and other aspects of intelligence would follow.

Behavioral AI also rejected the principle of a divide-and-conquer approach to intelligence where the components of intelligence such as learning, perception, and reasoning were divided and worked on separately. Behavioral AI claimed that these components were tied together, and it was important to understand their collaboration.

Another fundamental principle brought up by behavioral AI was based on what the behavioral AI community was heavily critical about previous work: The disconnectedness from the environment. Knowledge-based AI systems worked as a “perceive-reason-act” loop that ignored any change in the environment. In behavioral AI, the situation-behavior relationship was crucial. The agent would perceive its environment, recognize the changes in the environment and react to them.

Even though many researchers of behavioral AI wanted to leave logical reasoning behind, some were enthusiastic about merging the two approaches. With the usage of behavioral AI and logical reasoning, an agent-based view of AI was born. There were several principles:
1. Reactiveness: The agent must arrange its behavior based on the variations in the environment.
2. Proactiveness: The agent must systematically work to reach its goal.
3. Socialness: The agent can be with other agents in an environment and must be able to
cooperate or compete with them.

Behavioral AI also changed direction about how the decisions of the AI should be. Earlier AI work was based on creating AI that would behave and decide similarly to humans. There was a shift to making the best choice with the agent approach, which did not always mean the most humane choice. The concept of utility was introduced. Utility is a method to mathematically model the behavior of an agent, based on certain scores associated with the perceptions and actions of AI. The agents would be taught about preferences, and it would decide on those based on which option provides maximum expected utility. And many different behaviors could be achieved using utilities because it allowed being used with different preferences.

The agents were not completely naïve about their perceptions and inferences. They had certain beliefs about the state of the environment and made use of Bayesian Inference and statistical reasoning to improve their beliefs when certain changes in the environment occurred. Bayesian inference uses the information at hand and probabilistic methods to make better guesses. And for intelligent agents, usage of Bayesian methods improved decision making. Knowledge of the environment and perceptions at a certain point allows the agents to calculate certain probabilities of some events and make decisions accordingly.

#### The problems it could solve

Behavioral AI was much faster than systems based on logical reasoning because it did not need rules and logical inferences which required computational power to handle. Also, behavioral AI was successful at building systems that were actually embodied in the real world.

HOMER was, similar to SHRDLU, a simulated robot, interacting with its environment based on given commands and changes in the environment. It could reason about time, changes that would happen, and react to unexpected changes. If it was told that it had an object, and then if it was told that the object was removed, it would be “surprised”. It could answer questions about the dates, some appointments it has and could talk about its plans about those.

In 1997, DeepBlue, an intelligent system that was made to play chess against Kasparov and could defeat the grandmaster with some upgrades after an initial defeat. Another great success of the behavioral approach was that efficient SAT solvers based on AI were developed and this meant that now there were better solutions for most NP-Complete problems.

#### The problems it couldn’t solve

It did not scale well, because the decision-making processes of behavioral agents require the agent to consider perceptions and a history of perceptions it has and search for the best possible decision. Even though DeepBlue could play chess and defeat world champions, it was not able to deal with problems that got much more complex much faster, such as playing go. It would take another approach for AI researchers to do that task.

The agents were still required to be told what they were supposed to do. They did not learn or improve their behavior in time. This also meant that they could work on one task only. Applying them to another task requires a lot of effort. Still, they worked well in the attempted areas. The problems they could not solve related more to what the researchers attempted to or not. This is mostly due to the complexity of the problems. Behavioral AI researchers did not attack many problems today’s researchers are tackling today.

### Deep Learning

#### History

Even though deep learning and the use of neural networks date back to the theories of Warren McCulloch and Walter Pitts in 1943, it took 32 years until the first multilayered network was developed by Kunihiko Fukushima. The development of deep learning boomed in the 2000s with the abundance of data and certain thresholds of success leading the field to become increasingly popular worldwide.

In 2014, DeepMind from the UK was bought by Google. DeepMind built systems that could play video games, eventually leading to the mediatic success of AlphaGo, the agent that defeated the world champion at Go. They used reinforcement learning techniques to build agents that would learn from scratch: there was no recipe given to the agent at all. The agent would only use the information of pixels in the learning phase and improve its performance with each trial.

AlphaGo was trained for months by playing against Go players. DeepMind went on working on a better version which they named AlphaGo Zero and trained it by only playing with itself. And it is noteworthy that training of AlphaGo Zero only took days. There being only three years between these two systems demonstrates the recent acceleration of the field.

#### What it is, main principles

Deep learning is a machine learning technique. Machine learning is based on giving pre- processed data to a program as input and making it perform a task based on computations. The difference of machine learning from previous approaches to AI is that the system is not given any recipe on how to do the task, instead, it is trained with data based on an error correction procedure. This approach was never seen before as every approach until machine learning had to give certain rules to the system.

One of the main methods of training a machine learning model is supervised learning. In supervised learning, the machine is initially in a semi-random state, then it is fed with training data and trained based on how far its predictions are from the training data. Deep learning is a data-hungry method, and the quality of data is as important as the amount of data. Therefore, data pre-processing has an important role in the training of machine learning algorithms. Better preprocessing yields better results.

Deep learning, or an artificial neural network, is a technique inspired by the way biological neurons work. A neuron is the fundamental unit of the neural system. It receives an electrical signal from the previous one, and if the signal is strong enough, fires to stimulate the next neuron. Similarly, artificial neural networks consist of perceptrons. A perceptron takes a vector of numbers as input and has a weight vector in which every weight corresponds to a number in the input. These vectors are used in an activation function to decide if the perceptron should fire or not. The problem to be solved with deep learning is to find the appropriate weights for each neuron.

![The Rust Logo](../../images/nn.png)
*Figure 1: A neural network architecture[^note2]*

In neural networks, the perceptrons are used in layers, and there are many layers in an ANN architecture. This technique is called Multilayer Perceptrons. Each layer of neurons is connected to the previous and next layer, and every neuron takes every output from the previous layer. With each input, layers take and process the input, and neurons are fired or not depending on the input and current weights. The information at each layer is feedforwarded into the next layer until the end and there is an output of the whole system. This output is compared to the desired output of the training instance, the error is backpropagated in the layers with the reverse order, and weights of perceptrons are tweaked. The backpropagation technique is how the weights of a neural network are adjusted.

The reason that deep learning is called that way is mostly that it has many layers of neurons. This allows levels of abstraction as each layer, meaning that every layer can learn and process more and more complex relationships in the data. It also means that the network has more neurons, and these neurons have more connections between them. Different techniques of deep learning provide varying connection types to achieve different goals (Recurrent Neural Networks and Convolutional Neural Networks are two examples).

The success of deep learning is based on its mathematics, as demonstrated by Hornik et al. A multilayered neural network can approximate any real-valued function if it is trained appropriately[^note3]. They are successful at generalization, inference, and detecting hidden patterns.

#### The problems it could solve

Deep learning methods were incredibly successful at many tasks that were not possible to deal with earlier ones. Playing Go is much more complicated due to its branching factor (i.e., the number of possible states that the board can have at each move) compared to chess, and success was achieved much later. Another major success of deep learning was handwritten text recognition. There cannot be given a certain recipe for handwritten text, and it was possible only with deep learning so far, which could learn to recognize certain patterns in handwriting that could vary substantially from person to person. Even though not fully integrated with our lives yet because of some weaknesses of deep learning, self-driving cars are now easily imaginable and can actually be applied in constrained environments. This is also because neural networks can learn many different patterns for certain situations.

#### The problems it couldn’t solve – disadvantages

Even though neural networks had unprecedented success with many tasks, they had their own shortcomings. The first is that they are not interpretable like previous, symbolic methods. For example, it is easy to understand how agents of behavioral AI do what they do. The explicit recipe given to them makes them interpretable at the same time. But for neural networks, this is not the case. It is not easy to understand how the weights take their final forms and what they mean, especially when the network is complex. Interpretability is important because it helps us understand why the agent makes mistakes and how we can improve them. Another drawback of neural networks is that they are not robust against some methods of deceit. For example, a neural network developed to label entities in images can be deceived by making small adjustments invisible to the human eye. But it is also possible to train neural networks that try to overcome these. Adversarial machine learning is the method of using two rival programs to compete against each other and get better and better at both deceiving and not falling into deceit.

One problem that might arise from the practical use of neural networks is related to data. Data and how it is processed is crucial, mistakes in data preprocessing can lead to bias and a decrease in performance. This might result in translations that are not representative of minorities, mistakenly labeling minorities as criminals, or not recognizing mirror reflections or images of objects in the real world, resulting in the AI making hazardous errors. One example of the errors that a deep learning agent can make is the driving assistant of Tesla, crashing into a truck because it confuses the bright white body of the truck with the sky[^note4].

## Compare and contrast Deep Learning with Behavioral AI with Kuhn’s Account of Science

### Periods of Puzzle-solving

The behavioral AI period was marked by great success over many problems. The techniques that were developed made the field a much more mature one and the future looked bright. There was a period of puzzle-solving, “normal science” as named by Kuhn. There was a community of AI that was working, thinking, believing, and failing in the same way while doing AI research. Even though behavioral agents were very successful at certain tasks, in time, research on it ceased.

Researchers increasingly focused on deep learning, and the way that they worked, thought, believed, and failed changed. Most importantly, the problems that the researchers aimed to solve changed. The main problem of Behavioral AI is to create agents that would reactively engage within its environment and make decisions / behave according to certain preferences and to find the rules it would act according to for each problem. For deep learning, the main problem to be solved is to develop certain neural network architectures so that the agent could learn and represent information in the most accurate way possible to solve some problems without certain commands given by the researchers.

The puzzle-solving process shifted from being about how to maximize the utility function, how to make better decisions through better behavior structures, whether to use knowledgebases or not; to how to build a dataset, preprocess and utilize data better, how to arrange the architecture of the neural network better, and what kind of error or activation function to use and so on. Changes in the way of doing AI research seem to be captured by Kuhn’s account with distinct periods of puzzle-solving and normal science.

### The Two Ways of AI Research – Normal Science and Paradigm Development

Schmidhuber remarks on two of the ways of AI research. One is more practical and transient: To solve a problem that was not solved before, independent of developing a new tool or theory. Even though this would be considered a success, it would not take time until someone beats a more difficult version of the problem more efficiently. The second is theoretical: Developing a novel algorithm and proving that it is “optimal for an important class of AI problems”[^note5].

The practical way resembles the normal science of Kuhn. Applying the novel techniques of the current paradigm to solve more difficult versions of some problems more efficiently or solve some previously unsolved problems. A behavioral agent could play chess and defeat world champions or could be programmed to play Atari games, but a deep learning agent would be able to defeat the behavioral agent at chess and learn by itself how to play all Atari games and excel at it. Under the new paradigm, researchers try to push the limits of the paradigm to solve similar but more difficult problems on a broader scale or solve previously unsolved problems.

From a Kuhnian perspective, this could be interpreted as the success of a new paradigm compared to the previous one’s attempts. Another Kuhnian aspect is that this way of research is the period of intense problem solving that is still going on right now. Deep learning is extremely popular, we see another success of AI application that was not seen before, in many different fields.

Still, there are unsolved problems (such as self-driving cars), but deep learning research continues until a better technique is found. And this highlights the second way of making AI research noted by Schmidhuber, which could resemble both normal science and the development of a new paradigm. Theorizing a new algorithm (of the current paradigm) to be optimal for a class of problems could extend the scope of the paradigm where previous paradigms could not reach, or it could be the development of a new, candidate paradigm.

### Incommensurability of methods and theories between two paradigms

In Kuhnian account of science, incommensurability refers to the condition that two paradigms do not communicate the same things, they do not fit together. Even though Newtonian physics can be seen as a special condition of modern physics, this is not the case. A simple example is that time and space are absolute in Newtonian physics, but not in modern physics. It is not important whether their predictions on some experiments are the same or not.

At the fundamentals of their theories, behavioral AI and deep learning are incommensurable. There is no place for perceptrons, multilayered architectures, backpropagation techniques, training with and learning from data in behavioral AI. Similarly, there is no utility function, modeling behavior, maximizing the preferences in deep learning. This also relates to their properties of being symbolic and sub-symbolic respectively. Phases of AI before deep learning are symbolic, the representation of information or rules is explicitly given. For example, an agent-based model is told that an apple is ‘an apple’. This enables the model to apply symbolic operations such as logic and search. Whereas in sub-symbolic AI, statistical methods of solving mathematical equations are more important. It is easier to understand symbolic AI, but sub- symbolic AI is much faster, more accurate, and more flexible.

But still, they can be used together in the same system. In practice, a deep learning agent can make use of a utility function as a supplement to its training phase or the rules for a behavioral agent can be found through deep learning approaches[^note6]. Incommensurability encompasses certain different aspects of the relationship between two paradigms. And the relationship between behavioral and deep learning approaches has a slight correspondence in Kuhnian incommensurability, but not completely.

### Paradigm Shift

The shift from each phase of AI to another marked a period of stagnation for AI research. In the case of the shift at hand, there are 18 years between the defeat of Kasparov by DeepBlue and of Lee Sedol by AlphaGo. Behavioral AI was successful in many fields: social sciences, business problems, etc. But it is limited since it requires explicit rules for each task, and rules for lots of tasks are too complicated to be captured exactly or in the best way possible. As researchers tackled problems using this approach, deep learning gained popularity, eventually becoming the dominant approach.

It is hard to mention a crisis in Kuhnian terms. Two earlier phases of AI study were not successful in what they aimed at; they could not go so far. Behavioral AI succeeded in the tasks it determined as a goal and had widespread use for many problems. Deep learning was not an alternative that was a savior for the crisis times. But it was so promising in its scope and success, that more and more researchers took up deep learning to tackle problems of AI. The paradigm shift occurred not through a crisis but more of the expectations from deep learning, and its fruitfulness.
Deep learning did solve lots of problems previously unsolved or not attempted, as well as solving lots of problems previous phases of AI did as well. In this sense, it does satisfy the Kuhnian paradigm shift in its promises and performance on previous problems.

### The Community of AI

Another Kuhnian aspect of this shift is that it was a social shift. Behavioral AI was not left behind (it is not completely left behind) because it was proved to be incorrect or failed completely. The community of AI believed in its success for a long time and could solve many problems using it. But deep learning looked more fruitful and took the stage lights from behavioral agents. The scientific community changed, and this change led to the shift in the two periods of research.

## Discussion

### Is AI being an applied science an obstacle

Of course, because AI is more of an applied field in its goals, it is hard to talk about incommensurability in the sense of meanings and explanations of phenomena. AI methods do not try to explain things, they try to perform tasks. Meanings of concepts in AI are fundamentally different than meanings of concepts in physics for example. The difference between the definitions of time in Newtonian and quantum physics is crucial because it aims to explain natural phenomena. AI (at least for now), does not aim to explain phenomena. Therefore incommensurability might not be applied completely to AI research.

Another point is that the success in AI approaches is defined differently compared to other fields of science. In other, more traditional fields of science, the theory at hand is used to make predictions under more or less controlled environments (of course, the reality is more complicated than that). The measure of success for AI is the performance of the agents in the tasks they are aiming to accomplish. This includes several metrics, such as how fast the model completes the task, how accurate it is, how well does it compete with other agents in the same task, how robust it is to certain changes in the environment, how complex is it, how easy it is to interpret the decisions of the agent, and so on. This actually helps us make choices depending on certain criteria, different from how Kuhnian paradigm choice happens.

## Conclusion

The history of the development of AI has many Kuhnian characteristics. The organization of research during the development phases of each period, how one ends, and another start, and how the communities of different approaches make their choices is well-captured by Kuhn’s account of science. And the shift from behavioral AI to deep learning can be explained to a certain degree too. But at its core, AI is a practical research field that aims to accomplish certain tasks instead of explaining phenomena. Therefore, it is hard to explain the shift from behavioral AI to deep learning completely with the Kuhnian account. Another account of science that can capture these differences of AI might be more successful than Kuhn’s. Nevertheless, this approach sheds light on how AI developed as a science and took its state today.

## References

[^note]: Thomas S. Kuhn, The Structure of Scientific Revolutions (Chicago, IL: The University of Chicago Press, 2015).

[^note2]: S. T. Shenbagavalli and D. Shanthi, “A Study of Deep Learning: Architecture, Algorithm and Comparison,” Lecture Notes on Data Engineering and Communications Technologies, January 2019, pp. 385-391, https://doi.org/10.1007/978-3-030-24643-3_46.

[^note3]: Kurt Hornik, Maxwell Stinchcombe, and Halbert White, “Multilayer Feedforward Networks Are Universal Approximators,” Neural Networks 2, no. 5 (1989): pp. 359-366, https://doi.org/10.1016/0893-6080(89)90020-8.

[^note4]: Jordan Golson, “Tesla Driver Killed in Crash with Autopilot Active, NHTSA Investigating,” The Verge (The Verge, June 30, 2016), https://www.theverge.com/2016/6/30/12072408/tesla- autopilot-car-crash-death-autonomous-model-s.

[^note5]: Jürgen Schmidhuber, “2006: Celebrating 75 Years of Ai - History and Outlook: The next 25 Years,” 50 Years of Artificial Intelligence, 2007, pp. 29-41, https://doi.org/10.1007/978-3-540-77296-5_4.

[^note6]: Jäger, Georg. “Using Neural Networks for a Universal Framework for Agent-Based Models.” Mathematical and Computer Modelling of Dynamical Systems 27, no. 1 (2021): 162–78. https://doi.org/10.1080/13873954.2021.1889609.