WikiThinks
=====
Operated by: Jordan Coimbra, Daniel Balagula

##Current Bugs:
- ~~deselecting highlighted text selects a response node (it shouldn't)~~ Fixed 10/19/2016
- page doesn't immediately add node to graph when user makes a response (it should)
- ~~long words don't wrap around response node (they should)~~ Fixed 10/21/2016
- ~~typeahead.js suggestion dropdown doesn't show (it should)~~ Fixed 10/20/2016
- mouse selecting nodes is not as fluid as it could be
- labels for form info overflow when screen is tight (they shouldn't)
- ~~edge styles have grey at the ends (they shouldn't)~~ Altered: edge styles don't represent response relationships
- lines wrap and break in-between words (they shouldn't)
- line breaks sometimes go beyond node widths (they shouldn't)
- ~~responses' original uses are not recorded (they should be)~~ Fixed 10/24/2016

##To Do:
- ~~link a citation instead of writing an argument as a response~~ Completed 10/19/2016
- implement article data type
- accept JSON request from client
- add comments to debate experiences and arguments
- text highlighting and quoting
- ~~style edges between response nodes based on response type~~ Completed 10/20/2016
- implement better argument title suggestion algorithm/api
- editing previous arguments and keeping a version history of arguments
- implement search box
- implement filters for queries
- ~~make buttons for response types look better~~ Altered: responses won't be happening with one field on the right side
- style selected/unselected nodes better
- implement max/min zoom
- implement tags (possibly?)
- ~~add a meta data structure in db that holds things like arguments that cite, etc.~~ Completed 10/22/2016
- Look into potential usability of: http://cpettitt.github.io/project/dagre-d3/latest/demo/clusters.html
- ~~Get Handlebars to work on server and client sides instead of using two different templating engines~~ Altered: not necessary because there isn't a redundance of client-slide templating libaries
- Implement Require.js: http://requirejs.org/docs/start.html
- Figure out best place to put responseTemplate
- A better way to getting relationship types when drawing nodes
- ~~Fix adding response when zoomed~~ Completed 10/24/2016
- Redo title finding to make it filter-based and use /responses with req.body.filter to specify titles

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
- Do we want to denormalize certain data structures (Holding aggregate values instead of complex queries)? <- Will have to measure performance evetually
- Is it more efficient to register a reply button click on a node click, or is it more efficient to have a unique id to each reply button?