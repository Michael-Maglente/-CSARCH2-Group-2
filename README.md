# The Heartbeat of the CPU: Inside the Fetch-Decode-Execute Cycle

A virtual exhibit teaching visitors how a CPU processes instructions through the **Fetch**, **Decode**, and **Execute** stages — using real-world analogies, an interactive block diagram, and a hands-on data path challenge.

## Team

- Angel June Ferrer
- Simon Gabriel Kabiling
- Michael Stephen Maglente
- Atreuz Patrick Malicsi

## Topic

This exhibit walks visitors through how a CPU fetches, decodes, and executes instructions, breaking each stage down step-by-step so the role of components like the PC, MAR, RAM, IR, Control Unit, ALU, and Registers is easy to follow.

## Tech Stack

- **Astro 6** – main framework for the exhibit site
- **React** – powers the CPU simulator and interactive diagrams
- **MDX** – exhibit content with embedded React components
- **Tailwind CSS** – styling, responsive layout, animations
- **GitHub** – version control and collaboration

## Interactive Elements

**Intro: Real-World Analogies**
A short warm-up showing everyday FDE patterns (a chef following a recipe, a student answering an exam question, a traffic light reacting to sensors) broken into obtain → understand → act.

**1. FDE Intuition Test**
A drag-and-drop game where visitors label real-world actions as Fetch, Decode, or Execute across three rounds of increasing difficulty (human actions → automated systems → logistics), scored out of 9.

**2. Interactive CPU Block Diagram**
A clickable diagram of the CPU's components. Selecting Fetch, Decode, or Execute lights up the relevant hardware with animated data-flow arrows; a tick-by-tick clock simulator and clickable components with stage-specific info panels let visitors explore deeper.

**3. CPU Data Path Challenge**
A puzzle-style finale where visitors route data between components (e.g. PC → MAR, RAM → IR) in the correct order to execute simple code statements like `let score = 100;`, across progressively harder missions.

## Style Guide

**Typography**
- Bebas Neue – Titles
- Inter – Subtitles & body
- JetBrains Mono – Code & technical values

**Color Palette** (dark cyber-tech aesthetic)
- Background: `#0a0c0d` (dark mode) / `#f0fafa` (light mode)
- Text/Buttons: `#202425` (dark mode) / `#0a0c0d` (light mode)
- Secondary accents: `#00bafa`, `#8338ec`, `#fe006f`, `#fdbe0b`


## DEVELOPMENT ##

### Initial Development

After finalizing our proposal, we began by setting up the project using the provided Astro template and familiarizing ourselves with its structure. Before implementing any content, we explored how the layouts, pages, and React components were organized to better understand the workflow. Once the development environment was ready, we focused on creating a simple and functional version of the exhibit. At this stage, our priority was not visual design but ensuring that the website structure, navigation, and core content could be displayed correctly. Establishing this foundation allowed us to gradually build more advanced features without significantly changing the overall architecture.

### Feature Development

Once the basic website was functioning, we shifted our attention to improving the learning experience through interactive elements. Rather than implementing all features at once, we developed them incrementally and continuously evaluated how each addition contributed to the educational goals of the exhibit. Throughout the development process, the group held several discussions to determine what additional interactions could help visitors better understand the Fetch–Decode–Execute cycle. These discussions resulted in multiple improvements beyond the initial proposal, including more engaging visualizations, interactive activities, and clearer ways of presenting CPU operations. Instead of keeping the exhibit static, we focused on making the content interactive so users could actively participate in the learning process.

### Challenges Encountered

One of the biggest challenges throughout development was deciding what interactive element should be implemented next. While we already had the main concept of the exhibit, we wanted each interaction to provide educational value rather than simply making the website visually appealing. As a result, we spent considerable time discussing different ideas, evaluating whether they supported the learning objectives, and refining them before implementation. This iterative process occasionally slowed development but ultimately helped us create activities that complemented one another instead of feeling repetitive.

### Creative Development

As the project evolved, many ideas were improved through continuous collaboration and feedback within the group. We often revisited previously implemented sections to determine whether they could be made more engaging or easier to understand. Instead of settling for the first design, we refined layouts, adjusted the presentation of information, and enhanced interactions whenever we identified opportunities for improvement. Beginning with a simple prototype gave us the flexibility to experiment with different approaches before finalizing the overall user experience.

### Aha! Moments

One of our biggest realizations during development was that building an educational website involves much more than presenting technically correct information. We found that the order in which concepts are introduced and the way users interact with them significantly affect how easily the material can be understood. Starting with a simple implementation also proved to be an effective approach, as it allowed us to establish a stable foundation before gradually adding more advanced interactive features. This incremental development process made it easier to evaluate new ideas and improve the exhibit over time.

### Things Learned

Throughout the development process, we gained a deeper understanding of both the technical and design aspects of building an interactive educational website. Beyond learning how Astro, React, and MDX work together, we also learned the importance of planning features carefully, collaborating as a team, and continuously refining ideas through discussion and testing. The project reinforced the value of iterative development, where starting with a simple working version and improving it over time leads to a more polished and effective final product.

## Future Improvements ##

Although the current exhibit successfully demonstrates the Fetch–Decode–Execute cycle through interactive activities, there are several improvements that could further enhance the overall learning experience.

### User Experience (UX) 

We plan to further improve the user interface by making navigation more intuitive and reducing the number of clicks required to access different sections. Additional visual cues, smoother transitions, and clearer instructions can help visitors understand each activity more easily, especially first-time users.

### Learning Flow and Content Sequence

The current sequence follows the learning objectives of the exhibit, but it can still be refined. Future versions may introduce concepts in smaller, more gradual steps so visitors build their understanding before moving on to more advanced interactions. Additional explanations, summaries, and progress indicators could also help reinforce learning throughout the exhibit.

### Expanded Interactive Activities

The existing interactive elements provide hands-on learning, but additional activities could make the exhibit even more engaging. Possible additions include:

- Interactive memory access simulations
- Additional drag-and-drop exercises
- Timed challenges
- Achievement badges or completion rewards
- Step-by-step guided walkthroughs using basic concepts for beginners 

### Increased Quiz Replayability

Currently, the quiz serves as a review of the concepts presented throughout the exhibit. Future improvements include expanding the question pool with many more randomized questions so users receive different challenges each time they attempt the quiz. This would encourage repeated practice while reinforcing their understanding of the Fetch–Decode–Execute cycle.

### Performance Optimization

As more interactive components are added, optimizing performance will become increasingly important. Future work may focus on reducing loading times, improving responsiveness across devices, optimizing images and assets, and minimizing unnecessary rendering to provide a smoother user experience.

---

## Deployment ##

The exhibit is deployed and publicly accessible via **Netlify** at:
[https://csarch-2-g4-s40.netlify.app/](https://csarch-2-g4-s40.netlify.app/)

---

## AI Usage Disclaimer ##

Artificial intelligence tools were used throughout the development process as supporting resources rather than as replacements for the group's work. AI-assisted tools were primarily used to:

- Review code for potential syntax errors and implementation issues.
- Explain unfamiliar programming concepts and framework features.
- Suggest possible improvements to code readability and structure.
- Assist with grammar checking and improving the clarity of documentation.
- Help verify that written explanations remained clear and technically accurate.

All project planning, design decisions, implementation, testing, debugging, and final content were completed and reviewed by the group members. AI-generated suggestions were evaluated, modified when necessary, and only incorporated when they aligned with the educational objectives and project requirements.
