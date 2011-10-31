 _____ _         _   _____            __ _____ 
| __  | |___ ___| |_|  _  |___ ___ __|  |   __|
| __ -| | . |  _| '_|     | . | . |  |  |__   |
|_____|_|___|___|_,_|__|__|  _|  _|_____|_____|
                          |_| |_|              
===============================================

## Summary

BlockAppJS is an open-source client-side pure JavaScript framework
that empowers you create complex, dynamic, and leading-edge
web-based application.

BlockAppJS is like other JavaScript based client-side MVC framework,
significantly differs in that BlockAppJS is Module/Block oriented. 

Creating an application become more easy with BlockAppJS.
Your main task is to make pairs of a view template file and
a JavaScript file. The pair is called a "Block".

The applicaiton making in Module/Block oriented way guides you
extricate from the VAR-OBJECT-HELL situation. Each blocks are
independent because they are coded in respective files.
Block files are loaded automatically by XMLHttpRequest,
and their namespaces are carefully controlled so that you never
pollute the global namespace - except you export variables to
the global scope.


## Requirement

* Template engine : [EJS](http://embeddedjs.com)

Currently, BlockAppJS uses EJS as a template engine.
Minified version of EJS JavaScript is included in this repository.


## Browser Support

* Requires modern browsers.

* Tested manually on:
	* Firefox 7, 8
	* Chrome 14
	* Safari 5
	* Opera 11.50
	* IE 9


## Version

* v0.0.1 / 2011-10-31
	* Initial commit.


## License - "Apache License 2.0"

See [LICENSE](https://github.com/blockappjs/BlockAppJS/blob/master/LICENSE)

Copyright (C) 2011 Kulikala.
