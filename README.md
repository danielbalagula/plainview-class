WikiThinks
=====
Operated by: Jordan Coimbra, Daniel Balagula

##Current Bugs:
- ~~deselecting highlighted text selects a response node (it shouldn't)~~ Fixed 10/19/2016
- page doesn't immediately add node to graph when user makes a response (it should)
- long words don't wrap around response node (they should)
- typeahead.js suggestion dropdown doesn't show (it should)
- mouse selecting nodes is not as fluid as it could be
- labels for form info overflow when screen is tight (they shouldn't)
- edge styles have grey at the ends (they shouldn't)

##To Do:
- ~~link a citation instead of writing an argument as a response~~ Compelted 10/19/2016
- implement article data type
- accept JSON request from client
- add comments to debate experiences and arguments
- text highlighting and quoting
- ~~style edges between response nodes based on response type~~ Completed 10/20/2016
- implement better argument title suggestion algorithm/api
- editing previous arguments and keeping a version history of arguments
- implement search box
- implement filters for queries
- make buttons for response types look better
- style selected/unselected nodes better
- implement max/min zoom
- implement tags (possibly?)
- add a meta data structure in db that holds things like arguments that cite, etc.

##Mottos:
- Test all possible solutions, no matter how cryptic the code
- Know the limitations of the libraries you find before you use them
- Reflect upon all design decisions

##Questions:
- How would having a slightly grey background look on the graph?
- Should we implement tags?
- What font do we want arguments to use?
- What restrictions will we place on user input? (word length, characters, allowable words, etc.)
- Do we want edges to be curved or rigid? Rigid
- Do we want a seperate data structure for argument titles? What is the performance difference?
