Lesson 03 - Clean Code
======================

* Why do we worry about Clean Code?  Is it just "gold plating" that you get around to when you have time for it?
  * You will read code more than you write it.
  * Reading code is harder than writing code.
  * Clean Code is what separates you as an educated college graduate frome the teen-aged hacker.
  * Clean Code is what will set you apart from your peers. They will appreciate your clean code far above your efficiency or your algorithms.
* Thinking like a term paper ...
  * Who is your audience? Computer? You? Me? Peers? Students?
  * Take time to edit (code review)
* It is an art
  * It is subjective ... but there are some principles
  * How do we judge it?  The number of "WTF's" per hour?
  * Clean Code book, Uncle Bob Martin ([http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882](http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882))
  * How far do you go? Make it easy for your audience.
* Extra Work? 
  * Get in the habit of following good principles AS YOU GO.
  * Make your code so clean that bugs cannot hide there -- if the intent is clear, bugs stand out. SAVES on DEBUG time.

## General Clean Code Guidelines

1. You only get one chance to make a good first impression ... 
  1. Draw my eyes to what I want to find. Tools in art exist to do that.
    1. Indentation, code organization, should read like a story. 
  2. Single file or multiple files? Judgment call.
  3. Make functions small.
  4. Make algorithms clean and small.
2. What's in a Name? Naming is a HUGE part of clean code!
  1. Use variables that have inherent meaning whenever possible, and NEVER break the meaning.
  2. Avoid variables that don't have meaning.
  3. Avoid names that are hard to read like l and o.
  4. If you ARE using single letter named variables, wrap them in a function to make the context clear
  5. Watch for inlining.  Sometimes it is ok, sometimes not.
    1. If the calculation for a value does not represent how the value will be used, wrap it up in its own named variable
    2. If the calculation DOES represent the use, AND calculating does not cause too much overhead, just inline it.
3. Avoid Magic Numbers
  1. Magic Numbers are ok in setup code, e.g. the size of the Canvas on the page, but ONE TIME ONLY.
  2. Why is duplication of magic numbers such a problem?
  3. If you use a constant, like PI or e, wrap it in a variable with a name.
  4. If you need a constant as a part of an algorithm, be sure to document why you were using that number and wrap it in a variable.
4. Functions
  1. Why make a function? Reuse? Clear Intent? Hide state to make it cohesive? Make the intent of the CLIENT more clear.
  2. Make the interface of every abstraction cleaner than the sum of its parts.
  3. Name functions and parameters so that I (the reader) can understand what the function does, needs, and returns without looking at the body.
    1. Then make sure if I DO look at the body, I am not surprised!
  4. Watch for coupling. Functions should be Context Independent. Only pass in what you need.
  5. Avoid side effects in functions.
5. Classes (persistent state with functions)
  1. Classes make it so you can have cohesion (the data and the methods that act on the data all reside together).
  2. Classes allow you to hold state to make things more efficient (e.g., if you wanted to keep the offset in the gradient example).
  3. Classes allow you to hide state related to implementation details from the client.
6. Comments are a Code Smell?
  1. If you are using a comment at the top of a block of code to say what the block does, consider extracting a method and naming it well.
  2. Avoid vacuous comments. Know your audience.
  3. Cute comments are ok, but make sure they have a reason.
  4. DO show comments when...
    1. Explaining an algorithm
    2. You are not sure about something, and you are asking a question.
    3. You have a reference about some method you used, like a URL.
    4. The reason for a particular section of code is not clear in context given your audience. Once again, consider extracting with a good name.
    5. You are providing the responsibility of a class or function if the name is not clear enough.
7. One Thing Only. The Single Responsibility Principle.
  1. What is a "Responsibility"?
  2. Responsibilties are relevant to the Client.
  3. It should read like a story from Top to bottom.
  4. Each line of a module should clearly advance the responsibilities of that module.
  5. The "One level of indention" rule of thumb. One layer of abstraction.
  6. Coding by good intentions. 
    1. If there were already a function that did EXACTLY what I wanted it to do from what I have, how would it look?
      1. What would it be named? What would it return? What would it need to do its job?
  7. What is the Responsibility of main (the HTML code)?
