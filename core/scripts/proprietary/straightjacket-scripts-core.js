// ================================================= /
// ======   PHANTASM STRAIGHTJACKET   ============== /
// ================================================= /
// ------   SCRIPTS CORE   ------------------------- /
// ================================================= /



/* DESCRIPTION: -------------------------------------/

   A lightweight and powerful scripts library
   to support StraightJacket UI elements.

   These functions aim for great performance and
   accessibility accross all modern browsers
   (suck it, IE8), and act solely on vanilla JS
   functions... no jQuery required!   

/ ------------------------------------------------- */


/* VERSION: 1.0 ------------------------------------ /
/- RELEASE: OCTOBER 27, 2016 ----------------------- /
/- AUTHOR: NICK PATTERSON AT FIFTEEN FOUR ---------- /

/- PHANTASM: Phantasmcs.net ------------------------ /
/- 15FOUR: fifteenfour.com ------------------------- /
/ ------------------------------------------------- */


/* TABLE OF CONTENTS ------------------------------- /
/-
/- #0 Core Functions ------------------------------- /
/- #1 Accessibility Core --------------------------- /
/-
/ ------------------------------------------------- */




/* TODOS: -------------------------------------/

   1: Add ability to pass DOM element in as
      an argument to the PSJ function   
      -- Simply add element to empty nodelist
         and attach methods

    2: Flesh out event system
       -- Include delegation
       -- Include namespacing
       -- Include function to delete events
          from the global object when they
          are 'unlistened'

    3: Finish removeClass function

/ ------------------------------------------------- */




// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /



// ------   Helper Functions   -------------- /
// ------------------------------------------ /

var psjHelpers = {

	getClass: function(element) {
		return element.getAttribute && element.getAttribute( 'class' ) || '';
	},

	stripAndCollapse: function(string) {
		var tokens = string.match( ( /[^\x20\t\r\n\f]+/g ) ) || [];
		return tokens.join(' ');
	},

	// Iterating over a nodeList or array
	each: function(obj, callback) {

		for (var i = 0; i < obj.length ; i++) {
			if (callback.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}

		return obj;
	},
};



// ------   Event Handling   ---------------- /
// ------------------------------------------ /

var psjEvents = {};

// TODO: EVENT NAMESPACING

function PSJEvent(elements, type, filter, handler) {
	this.elements = elements;
	this.type = type;
	this.filter = filter;
	this.handler = handler;
}

PSJEvent.prototype = {
	register: function() {
		var self = this;		
		psjHelpers.each(this.elements, function(index, element) {

			if (!psjEvents[element]) {
				psjEvents[element] = [];
				psjEvents[element].push(self);
			}
			else if (!psjEvents[element].indexOf(self)) {
				psjEvents[element].push(self);
			}
			element.addEventListener(self.type, self.handler);
		});	
	}
};


// ------   PSJ Object   -------------------- /
// ------------------------------------------ /


function PSJObject(selector, name) {
	var self = this;
	this.selector = selector;
	this.elements = document.querySelectorAll(selector);
	this.name = name;
}

function PSJ(selector, name) {
	var newObject = new PSJObject(selector, name);
	return newObject;
}

PSJObject.prototype = {

	constructor: PSJ,

	// Saying hello
	sayHello: function() {
		console.log('Hello, ' + this.name + '!');
		console.log('Your elements array is an ' + typeof this.elements);
		console.log(this.elements);
		return this;
	},

	// Check to see if element has a certain class
	hasClass: function(selector) {
		var classesToCheck = psjHelpers.stripAndCollapse(selector).split(' '),
			element,
			i = 0,
			c = 0;
		while ((element = this.elements[i++])) {
			var classOfElement = psjHelpers.stripAndCollapse(psjHelpers.getClass(element));
			for (c; c < classesToCheck.length; c++) {
				if (classOfElement.indexOf(classesToCheck[c]) === -1) {
					return false;
				}
			}
		}
		return true;
	},

	// Adding classis if they don't exist
	addClass: function(classToAdd) {
		if (!this.hasClass(classToAdd)) {
			psjHelpers.each(this.elements, function(index, element) {
				element.className += ' ' + classToAdd;
			});
		}
		return this;
	},

	// Removing classes if they exist
	removeClass: function(element, classToAdd) {

	},

	// Attaches events
	listen: function(eventType, filter, handler) {
		var event = new PSJEvent(this.elements, eventType, filter, handler);
		event.register();
		return this;
	},

	// Removes events
	ignore: function(eventType) {
		var self = this;
		console.log(psjEvents);
		psjHelpers.each(this.elements, function(index, element) {
			psjHelpers.each(psjEvents[element], function(index, eventObject) {
				if (eventObject.type === eventType) {
					console.log('eventRemoved');
					element.removeEventListener(eventType, eventObject.handler);
				}
			});
		});
	}
};




// ================================================= /
// ======   #1 Accessibility Core   ================ /
// ================================================= /





// ================================================= /
// ======   #2 Popover Modals Module   ============= /
// ================================================= /


function PSJPopoverModals(className, onLaunch, onClose) {

	var self = this;

    this.current = '';
    this.initializingElement = '';
    this.closingElement = '';
    this.currentInitializer = '';

    this.className = className;
    this.classSelector = '.' + className;
    this.onlaunch = onLaunch;
    this.onClose = onClose;

    this.events = function() {

    	// Clicking on initializer
		self.initializingElement.listen('click', null, function(event) {
			self.launch(this);
		});

		// Clicking on initializer
		PSJ('.modal__destroyer').listen('click', null, function(event) {
			console.log('clickDestroy');
			self.initializingElement.ignore('click');
		});

        /*$('.modal').on('click', function(event) {
            if (!$(event.target).is('.modal__box *')) {
                modal.closeModal();
            }
        });*/

        // Clicking on close button
        self.closingElement.listen('click', null, function(event) {
        	console.log('close modal');
            //modal.closeModal();
        });

        /*$('.modal').on('childrenLoseFocus', function(event) {
            $.accessibility.focusFirstElement(modal.current);
        });*/

        // Wire up synthetic focusout event
        //$.accessibility.childrenLoseFocus($('.modal'));
    };

    this.init = function() {

        // Define initializing element
        self.initializingElement = PSJ(self.classSelector + '__initializer');

        // Define closing element
        self.closingElement = PSJ(self.classSelector + '__closer');

        self.events();
    };

    this.launch = function(initializer) {

    	//event.preventDefult();

        //initializer = PSJ(initializer);

        // Update vars
        self.current = PSJ(initializer.dataset.target);
        self.currentInitializer = initializer;


        // Display modal
        self.current.addClass('modal--is-staged modal--is-visible');

        /*// Wire up ESC key listener
        $(document).on('keydown.modalCloseKeydown', function(event) {
            if ( event.keyCode &&  event.keyCode === 27 ) {
              console.log('Running');
                event.preventDefault();
                modal.closeModal();
            }
        });

        // Focus first element
        $.accessibility.focusFirstElement(modal.current);*/

        // Execute specified onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call();
        }
    };

   /* this.closeModal = function() {

   		// Hide modal
        modal.current.removeClass('modal--is-staged modal--is-visible');

        // Remove ESC key listener
        $(document).off('keydown.modalCloseKeydown');

        modal.currentInitializer.focus();


        // Execute specified onClose function
        if (self.onClose && typeof self.onClose === 'function') {
        	self.onClose.call();
        }
    };*/
}

var psjPopoverModals = new PSJPopoverModals('modal');
psjPopoverModals.init();