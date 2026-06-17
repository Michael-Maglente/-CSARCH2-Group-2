# The Heartbeat of the CPU: Inside the Fetch-Decode-Execute Cycle

A virtual exhibit teaching visitors how a CPU processes instructions through the **Fetch**, **Decode**, and **Execute** stages — using real-world analogies, an interactive block diagram, and a hands-on data path challenge.

## Team

- Angel June Ferrer
- Simon Gabriel Kabiling
- Michael Stephen Maglente
- Atreuz Patrick Malicsi
- Christopher Vincent Soriano

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
