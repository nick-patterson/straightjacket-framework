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





// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /

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

var PSJObject = function(selector, name) {
	var self = this;
	this.selector = selector;
	this.elements = document.querySelectorAll(selector);
	this.name = name;
};

var PSJ = function(selector, name) {
	var newObject = new PSJObject(selector, name);
	return newObject;
};

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

	addClass: function(classToAdd) {
		if (!this.hasClass(classToAdd)) {
			psjHelpers.each(this.elements, function(index, element) {
				element.className += ' ' + classToAdd;
			});
		}
		return this;
	},

	removeClass: function(element, classToAdd) {

	},

	// Event Handling

};


PSJ('.modal__initializer', 'Bitch').sayHello();

window.setTimeout(function() {
	PSJ('#example-modal').addClass('modal--is-staged modal--is-visible');
}, 3000);

/*function Modals() {

	var self = this;

    this.current = '';
    this.initializingElement = '';
    this.currentInitializer = '';

    this.events = function() {

		modal.initializingElement.on('click', function(event) {

            event.preventDefault();
            modal.launch($(this));

			$('html').css('overflow-y', 'hidden');

        });


        $('.modal').on('click', function(event) {
            if (!$(event.target).is('.modal__box *')) {
                modal.closeModal();
            }
        });

        $('.js-close-modal').on('click', function(event) {
              event.preventDefault();
              modal.closeModal();
        });

        $('.modal').on('childrenLoseFocus', function(event) {
            $.accessibility.focusFirstElement(modal.current);
        });
    };

    this.init = function() {

        // Define initializing element
        modal.initializingElement = $('.js-modal');

        // Wire up synthetic focusout event
        $.accessibility.childrenLoseFocus($('.modal'));

        modal.events();
    };

    this.launch = function(initializer) {

        initializer = $(initializer);

        // Update vars
        modal.current = $(initializer.data('target'));
        modal.currentInitializer = initializer;

        // Display Modal & wire up ESC button
        modal.current.addClass('is-staged is-visible');
        $(document).on('keydown.modalCloseKeydown', function(event) {
            if ( event.keyCode &&  event.keyCode === 27 ) {
              console.log('Running');
                event.preventDefault();
                modal.closeModal();
            }
        });

        // Focus first element
        $.accessibility.focusFirstElement(modal.current);
    };

    this.closeModal = function() {
        modal.current.removeClass('is-visible');
		$('html').css('overflow-y', '');
        $(document).off('keydown.modalCloseKeydown');
        modal.currentInitializer.focus();

        window.setTimeout(function(){
            modal.current.removeClass('is-staged');
        }, 250);
    };
}*/