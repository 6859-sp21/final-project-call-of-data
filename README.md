## Call of Data: Exposing The Bias in Data Visualization
Authors: Axelle Clochard and Lama Aoudi

<img width="943" alt="FrontPage" src="https://user-images.githubusercontent.com/10040180/118859573-61d07500-b8a8-11eb-845b-461ef3d668bf.png">

### Abstract:

Data exploration is often introduced as a crucial first step to creating a visualization. However, interacting with one’s data throughout the design process introduces a huge potential for bias by increasing the likelihood that designers will make data decisions based on whether the resulting graph agrees with their prior assumptions. Our final project, Call of Data, is an attempt to simulate the experience of creating a visualization in “data-blind” conditions. Throughout the course of this interactive experience, users will be asked to make a number of data decisions guided only by their _a priori_ knowledge of the variables in question. At the conclusion of the experience, they will find out which caricatural personality type the biases of their resulting graph most closely resembled. They will then be able to visualize the impact of each of their decisions in real time, and be prompted to contemplate whether they would have made different decisions had they had access to this knowledge. We hope that this experience will inspire users to consider a new design protocol: one where experimental interaction with data does not drive the creation of a data product, but rather becomes secondary to what we know about the variables at hand.

##### Link to Paper: hhttps://github.com/6859-sp21/final-project-call-of-data/blob/main/final/FinalPaper_SP21.pdf 
##### Link to Visualization: https://6859-sp21.github.io/final-project-call-of-data/
##### Link to Video: https://github.com/6859-sp21/final-project-call-of-data/blob/main/final/final-presentation-SP21.mp4 

---
### Commentary on Process
Once we agreed that we wanted to build a game that would shed light on how bias works its way into the visualization process, we started by developing and refining a narrative. This was done over conversation between the two team members, and involved going over relevant class readings as well as surfing through White-Hat/Black-Hat submissions. We started storyboarding on a shared slide deck how we thought our narrative could unfold, and the various points at which the user would have to make decisions. We also browsed through past submissions and agreed that we liked the structure of Candace Okumko’s final project (https://github.mit.edu/6894-sp20/FP-Ethical-Visualization) - i.e. a narrative with embedded user choices culminating in a dashboard- although we ended up pursuing different implementation techniques.

At this point, we agreed that it would be more efficient to start specializing the work. Lama started digging deeper into potential datasets and putting a base dataset together. This included choosing which variables to measure, in what regions, and at what granularity. Axelle started putting our skeleton narrative into HTML/JavaScript/CSS and building some of the basic interactions and animations, such as creating buttons that allowed the user to navigate and reset the storyline, character choices, and animated “typewriter effect” text.

Once the dataset was ready, Axelle and Lama manipulated the data so that it was in the appropriate format to respond to the many potential data choices that the user would have to make. This involved creating a number of new variables. In parallel, Lama was conducting data exploration to identify interesting junctions in the data: data decisions that could lead to different trends overall but could still be used to answer the global question of “Does Climate Change Exist”. She created a decision tree to keep track of how these data junctions and their associated choices could chain together to form graphs that were more likely to be associated with certain positions on the validity of climate change. Axelle started creating a structure for a responsive line chart based on a series of user input, using existing code by Diana Ow as a starter, adding a number of transition and reactivity features (such as reactive axes, reactive axes labels and titles, reactive legends, and animations of the transitions).

We then started implementing a “personality quiz”-like structure so that the series of user choices could be stored and evaluated to return a “personality” upon submission. Axelle created the initial setup in Javascript/HTML following an example from code{actually} and Lama then expanded on this example to implement her decision tree. Axelle also kept track of the user choices to generate their final graph, and created a dashboard that would let users toggle back and forth between their earlier decisions to reveal the precise impact each decision had had on the graph. Finally, we split the write up equally as well as the final polishing and tightening of the final product in CSS/HTML.

This ended up being a somewhat challenging experience given that for both of us, A4 had been our first venture into D3 and JavaScript. However, we feel that we were able to flex some new muscles and acquire some new skills and gain some meta-insight into the process of visualization making. We estimate that this amounted to approximately 100 hours worth of work between the two of us.

------
#### Coding Sources:
- For the sidebar: “How To Create a Collapsed Sidebar.” W3 Schools. Accessed May 19, 2021. https://www.w3schools.com/howto/howto_js_collapse_sidebar.asp.
- For the typewriter effect: CodePen. “Multiline Typewriter Effect.”  David Carr. Accessed May 19, 2021. https://codepen.io/daviddcarr/details/XVyQMM.
- For the text reveal: “Trigger Animation When Element Is in View (Pure JS).” JR Cologne. Accessed May 19, 2021. https://codepen.io/jr-cologne/pen/zdYdmx.
- For the image reveal: Stack Overflow. “Html - How to Display Div after Click the Button in Javascript?” Ahsan Rathod. Accessed May 19, 2021. https://stackoverflow.com/questions/6957443/how-to-display-div-after-click-the-button-in-javascript.
- For the quiz structure: “CodeActually: More Interactive Examples.” Accessed May 19, 2021. https://codeactually.com/examples.html.
- For the final graph structure: “D3 V4 Multiple-Line Chart: Hover Tooltip.” Dianaow. Accessed May 19, 2021. https://bl.ocks.org/dianaow/0da76b59a7dffe24abcfa55d5b9e163e.
- For the reactive axes: Holtz, Yan. “Update X Axis Limits in D3.Js Scatterplot.” Accessed May 19, 2021. https://www.d3-graph-gallery.com/graph/scatter_buttonXlim.html.

#### Motivating Literature:
* “6.859: Interactive Data Visualization (Spring 2021).” Accessed May 16, 2021. http://vis.mit.edu/classes/6.859/A3/.
Chapter 4: What Gets Counted Counts. Catherine D'Ignazio. Data Feminism. 2020.
* Viral Visualizations: How Coronavirus Skeptics Use Orthodox Data Practices to Promote Unorthodox Science Online. Crystal Lee, Tanya Yang, Gabrielle Inchoco,
* Graham M. Jones, Arvind Satyanarayan. ACM CHI. 2021.
* Michael Correll. 2019. Ethical Dimensions of Visualization Research. In CHI Conference on Human Factors in Computing Systems Proceedings (CHI 2019), May 4–9, 2019, Glasgow, Scotland UK. ACM, New York, NY, USA, 13 pages. https://doi.org/10.1145/3290605.3300418.

#### Data Sources:
* Data on CO2 and Greenhouse Gas Emissions by Our World in Data: https://github.com/owid/co2-data
