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

/ ------------------------------------------------- */




// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /



// ------   Helper Functions   -------------- /
// ------------------------------------------ /

var psjHelpers = {

	isDisplayed: function(element) {
		return element.offsetWidth > 0 || element.offsetHeight > 0;
	},

	isVisible: function(element) {
		var style = window.getComputedStyle(element);
		return style.getPropertyValue('visibility') !== 'hidden' && psjHelpers.isDisplayed(element);
	},

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

	parseEventTypeString: function(eventTypeString) {
		return {
			type: eventTypeString.indexOf('.') !== -1 ? eventTypeString.split('.')[0] : eventTypeString,
			nameSpace: eventTypeString.indexOf('.') !== -1 ? eventTypeString.split('.')[1] : null
		};
	},

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

function PSJEvent(elements, typeString, filterString, handler) {
	var self = this;

	this.elements = elements;

	// Assign type and namespace
	var eventTypeObject = psjHelpers.parseEventTypeString(typeString);
	this.type = eventTypeObject.type;
	this.nameSpace = eventTypeObject.nameSpace;

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
			if (psjHelpers.getClass(element).indexOf(classToAdd) === -1) {
				element.className += ' ' + classToAdd;
			}
		}
		if (!this.hasClass(classList)) {
			psjHelpers.each(this.elements, function(index, element) {
				psjHelpers.each(classList.split(' '), function(index, className) {
					addTheClassIfNeeded(element, className);
				});
			});
		}
		return this;
	},

	// Removing classes if they exist
	removeClass: function(classList) {
		function removeTheClassIfNeeded(element, classToRemove) {
			if (psjHelpers.getClass(element).indexOf(classToRemove) !== -1) {
				element.className = psjHelpers.stripAndCollapse(element.className.replace(classToRemove, ''));
			}
		}
		if (this.hasClass(classList)) {
			psjHelpers.each(this.elements, function(index, element) {
				psjHelpers.each(classList.split(' '), function(index, className) {
					removeTheClassIfNeeded(element, className);
				});
			});
		}
		return this;
	},

	// Attaches events
	listen: function(eventTypeString, filterString, handler) {
		new PSJEvent(this.elements, eventTypeString, filterString, handler).register();
		return this;
	},

	// TODO: Add support for multiple types by way of space separated typeString
	// Removes events
	ignore: function(eventTypeString) {
		var eventTypeObject = psjHelpers.parseEventTypeString(eventTypeString);
		psjHelpers.each(this.elements, function(elementIndex, element) {
			psjHelpers.each(psjEvents[element], function(eventIndex, eventObject) {
				if (eventObject.type === eventTypeObject.type && (eventObject.nameSpace === eventTypeObject.nameSpace || eventTypeObject.nameSpace === null)) {
					element.removeEventListener(eventTypeObject.type, eventObject.handler);
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

	// TODO: condiitonal for last focusable element
	allFocusOut: function(psjObject) {
		psjObject.listen('focusout', null, function(event) {
			var element = this;
			event.stopPropagation();
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

	this.initializingElement = '';
    this.closingElement = '';

    this.currentModal = '';
    this.currentInitializer = '';
    this.isActive = false;

    this.className = className;
    this.modalObject = '';

    this.onlaunch = onLaunch;
    this.onClose = onClose;

    this.events = function() {

    	// Clicking on initializer
		self.initializingElement.listen('click', null, function(event) {
			self.launch(this);
		});

		// Clicking on destroyer
		PSJ('.modal__destroyer').listen('click', null, function(event) {
			console.log('Destroy');
			self.initializingElement.ignore('click');
		});

		// TODO: Narrow this down to only events that stem from NOT the box or close button
		// Clicking outside of box but inside of modal
        self.modalObject.listen('click', null, function(event) {
            //self.closeModal();
        });

        // Clicking on close button
        self.closingElement.listen('click', null, function(event) {
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

        // Define initializing element
        self.initializingElement = PSJ('.' + self.className + '__initializer');

        // Define closing element
        self.closingElement = PSJ('.' + self.className + '__closer');

        // Define PSJ modal object
        self.modalObject = PSJ('.' + self.className);

        self.events();
    };

    this.launch = function(initializer) {

        // Update vars
        self.currentModal = PSJ(initializer.dataset.target);
        self.currentInitializer = initializer;
        self.isActive = true;

        // Display modal on DOM
        self.currentModal.addClass(self.className + '--is-staged ' + self.className + '--is-visible');

        // Wire up ESC key listener
        PSJ(document).listen('keydown.modalESCKeydown', null, function(event) {
            if (event.keyCode &&  event.keyCode === 27) {
              self.closeModal();
            }
        });

        // Execute onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call();
        }

        // Focus first tabbable element
        window.setTimeout(function() {
        	psjAccessibility.focusFirstTabbableElement(self.currentModal);
        }, 0);
    };

   this.closeModal = function() {

   		// Update vars
   		self.isActive = false;

   		// Hide modal on DOM
        self.currentModal.removeClass(self.className + '--is-staged ' + self.className + '--is-visible');

        // Remove ESC key listener
        PSJ(document).ignore('keydown.modalESCKeydown');

        // Execute onClose function
        if (self.onClose && typeof self.onClose === 'function') {
        	self.onClose.call();
        }

        // Return focus to initializing element
        window.setTimeout(function() {
        	self.currentInitializer.focus();
        }, 0);
    };
}

PSJ(window).listen('load', null, function(event) {
	var psjPopoverModals = new PSJPopoverModals('modal');
	psjPopoverModals.init();
});







