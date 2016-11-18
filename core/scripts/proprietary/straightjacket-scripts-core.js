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

    1: Flesh out event system
       -- Better organize how events are
          pooled in the global event set
          - Should it be an array since
            DOMElements aren't good as keys?
       -- Support multiple eventTypes
          being removed on ignore function
          by way of space-separated attsStrings

    2: Fix the damn outsideClick function

    3: Add conditional for psjallfocusout to
       account for when the modal contains
       the last element on the page (as to not
       reroute focus to browser UI)

/ ------------------------------------------------- */




// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /



// ------   Helper Functions   -------------- /
// ------------------------------------------ /

var psjHelpers = {

	// Returns whether or not an element is displayed (e.g. takes up space on the screen)
	isDisplayed: function(element) {
		return element.offsetWidth > 0 || element.offsetHeight > 0;
	},

	// Returns whether or not an element is both displayed and visible (visible defined as CSS visibility)
	isVisible: function(element) {
		var style = window.getComputedStyle(element);
		return style.getPropertyValue('visibility') !== 'hidden' && psjHelpers.isDisplayed(element);
	},

	// Strips and collapses whitespace in accordance with HTML spec
	stripAndCollapse: function(string) {
		var tokens = string.match( ( /[^\x20\t\r\n\f]+/g ) ) || [];
		return tokens.join(' ');
	},

	// Safely gets the class attribute of an element
	getClass: function(element) {
		return psjHelpers.stripAndCollapse(element.getAttribute && element.getAttribute('class') || '');
	},

	// Iterates over a nodeList or array
	each: function(obj, callback) {

		for (var i = 0; i < obj.length ; i++) {
			if (callback.call(obj[i], i, obj[i]) === false) {
				break;
			}
		}

		return obj;
	},

	// Parses an eventAtts string into an object containing a type and namespace
	parseEventAttsString: function(eventAttsString) {
		return {
			type: eventAttsString.indexOf('.') !== -1 ? eventAttsString.split('.')[0] : eventAttsString,
			nameSpace: eventAttsString.indexOf('.') !== -1 ? eventAttsString.split('.')[1] : null
		};
	},

	// Safely gets the active element
	safeActiveElement: function() {
		try {
			return document.activeElement;
		}
		catch ( err ) {
		}
	}
};



// ------   Event Handling   ---------------- /
// ------------------------------------------ /

var psjEvents = {};

function PSJEvent(elements, attsString, filterString, handler) {
	var self = this;

	this.elements = elements;

	// Assign type and namespace
	var eventAttsObject = psjHelpers.parseEventAttsString(attsString);
	this.type = eventAttsObject.type;
	this.nameSpace = eventAttsObject.nameSpace;

	this.filter = filterString ? PSJ(filterString) : null;
	this.handler = function(event) {

		// If delegation is enabled, start filter logic --- figure out better way to do this... maybe conditional handler functions?
		if (self.filter) {
			for (var i = 0; i < self.filter.elements.length; i++) {
				if (Array.prototype.slice.call(self.filter.elements[i].querySelector('*')).indexOf(event.target) !== -1) {
					return handler.apply(event.target, [event]);
				}
			}
		}
		else {
			handler.apply(event.currentTarget, [event]);
		}
	};
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

	switch (typeof selector) {
		case 'string':
			var nodeList = document.querySelectorAll(selector);
			this.elements = nodeList.length ? nodeList : [];
			break;
		default:
			this.elements = [selector];
	}
	this.name = name;
}

function PSJ(selector, name) {
	return new PSJObject(selector, name);
}

PSJObject.prototype = {

	constructor: PSJ,

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
					continue;
				}
				return true;
			}
		}
		return false;
	},

	// Adding classes if they don't exist
	addClass: function(classList) {
		function addTheClassIfNeeded(element, classToAdd) {
			var elementClass = psjHelpers.getClass(element);
			if (elementClass.indexOf(classToAdd) === -1) {
				element.setAttribute('class', elementClass + ' ' + classToAdd);
			}
		}
		if (!this.hasClass(classList)) {
			psjHelpers.each(this.elements, function(index, element) {
				psjHelpers.each(psjHelpers.stripAndCollapse(classList).split(' '), function(index, className) {
					addTheClassIfNeeded(element, className);
				});
			});
		}
		return this;
	},

	// Removing classes if they exist
	removeClass: function(classList) {
		function removeTheClassIfNeeded(element, classToRemove) {
			var elementClass = psjHelpers.getClass(element);
			if (psjHelpers.getClass(element).indexOf(classToRemove) !== -1) {
				element.setAttribute('class', elementClass.replace(classToRemove, ''));
			}
		}
		if (this.hasClass(classList)) {
			psjHelpers.each(this.elements, function(index, element) {
				psjHelpers.each(psjHelpers.stripAndCollapse(classList).split(' '), function(index, className) {
					removeTheClassIfNeeded(element, className);
				});
			});
		}
		return this;
	},

	// Attaches events
	listen: function(eventAttsString, filterString, handler) {
		new PSJEvent(this.elements, eventAttsString, filterString, handler).register();
		return this;
	},

	// Removes events
	ignore: function(eventAttsString) {
		var eventAttsObject = psjHelpers.parseEventAttsString(eventAttsString);
		psjHelpers.each(this.elements, function(elementIndex, element) {
			psjHelpers.each(psjEvents[element], function(eventIndex, eventObject) {
				if (eventObject.type === eventAttsObject.type && (eventObject.nameSpace === eventAttsObject.nameSpace || eventAttsObject.nameSpace === null)) {
					element.removeEventListener(eventAttsObject.type, eventObject.handler);
					psjEvents[element].splice(eventIndex, 1);
				}
			});
		});
		return this;
	},

	// Focuses first element in array
	focus: function() {
		var firstElement = this.elements[0];
		if (firstElement.focus && firstElement !== psjHelpers.safeActiveElement()) {
			firstElement.focus();
		}
		return self;
	}
};




// ================================================= /
// ======   #1 Accessibility Core   ================ /
// ================================================= /

var psjAccessibility = {

	allFocusOut: function(psjObject) {
		psjObject.listen('focusout', null, function(event) {
			var element = this;
			window.setTimeout(function() {
				var descendants = Array.prototype.slice.call(element.querySelectorAll('*'));
				if (descendants && descendants.indexOf(psjHelpers.safeActiveElement()) === -1) {
					return element.dispatchEvent(new Event('psjallfocusout'));
				}
			}, 0);
		});
	},

	tabbableElementSelectors: [
		'a[href]:not([tabindex^="-"])',
		'area[href]:not([tabindex^="-"])',
		'input:not([disabled]):not([tabindex^="-"]):not([type="hidden"])',
		'select:not([disabled]):not([tabindex^="-"])',
		'textarea:not([disabled]):not([tabindex^="-"])',
		'button:not([disabled]):not([tabindex^="-"])',
		'iframe:not([tabindex^="-"])',
		'[tabindex]:not([tabindex^="-"])',
		'[contentEditable=true]:not([tabindex^="-"])',
	],

	// Focus first tabbable child of first element in a set
	focusFirstTabbableElement: function(psjObject) {
		var tabbableElements = Array.prototype.slice.call(psjObject.elements[0].querySelectorAll(psjAccessibility.tabbableElementSelectors.join(','))).filter(psjHelpers.isVisible);
		if (tabbableElements.length) {
			tabbableElements[0].focus();
		}
		return psjObject;
	}
};




// ================================================= /
// ======   #2 Popover Modals Module   ============= /
// ================================================= /


function PSJPopoverModals(className, onLaunch, onClose) {

	var self = this;

	this.trigger = '';
    this.closer = '';

    this.currentModal = '';
    this.currentTrigger = '';
    this.isActive = false;

    this.className = className;
    this.modalObject = '';

    this.onlaunch = onLaunch;
    this.onClose = onClose;

    this.events = function() {

    	// Clicking on trigger
		self.trigger.listen('click', null, function(event) {
			self.launch(this);
		});

		// Clicking on destroyer
		PSJ('.modal__destroyer').listen('click', null, function(event) {
			console.log('Destroy');
			self.trigger.ignore('click');
		});

		// Clicking outside of box but inside of modal
        self.modalObject.listen('click', null, function(event) {
            //self.closeModal();
        });

        // Clicking on close button
        self.closer.listen('click', null, function(event) {
        	event.stopPropagation();
            self.closeModal();
        });

        // Prevent tabbing out of active modal
        psjAccessibility.allFocusOut(self.modalObject);
        self.modalObject.listen('psjallfocusout', null, function(event) {
        	if (self.isActive) {
        		psjAccessibility.focusFirstTabbableElement(self.currentModal);
        	}
        });
    };

    this.init = function() {

        // Define triggering element
        self.trigger = PSJ('.' + self.className + '__trigger');

        // Define closing element
        self.closer = PSJ('.' + self.className + '__closer');

        // Define PSJ modal object
        self.modalObject = PSJ('.' + self.className);

        self.events();
    };

    this.launch = function(trigger) {

        // Update vars
        self.currentModal = PSJ(trigger.dataset.target);
        self.currentTrigger = trigger;
        self.isActive = true;

        // Display modal on DOM
        self.currentModal.addClass(self.className + '--active');

        // Initialize ESC key listener
        PSJ(document).listen('keydown.modalESCKeydown', null, function(event) {
            if (event.keyCode &&  event.keyCode === 27) {
              self.closeModal();
            }
        });

        // Execute onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call();
        }

        // Focus first tabbable element in modal
        window.setTimeout(function() {
        	psjAccessibility.focusFirstTabbableElement(self.currentModal);
        }, 0);
    };

   this.closeModal = function() {

   		// Update vars
   		self.isActive = false;

   		// Hide modal on DOM
        self.currentModal.removeClass(self.className + '--active');

        // Remove ESC key listener
        PSJ(document).ignore('keydown.modalESCKeydown');

        // Execute onClose function
        if (self.onClose && typeof self.onClose === 'function') {
        	self.onClose.call();
        }

        // Return focus to current trigger
        window.setTimeout(function() {
        	self.currentTrigger.focus();
        }, 0);
    };
}

PSJ(window).listen('load', null, function(event) {
	var psjPopoverModals = new PSJPopoverModals('modal');
	psjPopoverModals.init();
});







