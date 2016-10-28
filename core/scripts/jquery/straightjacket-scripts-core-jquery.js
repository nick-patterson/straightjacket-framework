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
   (suck it, IE8), and integrate perfectly with
   the mighty jQuery library.   

/ ------------------------------------------------- */


/* VERSION: 1.0 ------------------------------------ /
/- RELEASE: OCTOBER 27, 2016 ----------------------- /
/- AUTHOR: NICK PATTERSON AT FIFTEEN FOUR ---------- /

/- PHANTASM: Phantasmcs.net ------------------------ /
/- 15FOUR: fifteenfour.com ------------------------- /
/ ------------------------------------------------- */


/* TABLE OF CONTENTS ------------------------------- /
/-
/- #0 Accessibility Core --------------------------- /
/- #1 Popover Modals Module ------------------------ /
/-
/ ------------------------------------------------- */





// ================================================= /
// ======   #0 Accessibility Core   ================ /
// ================================================= /





// ================================================= /
// ======   #1 Popover Modals Module   ============= /
// ================================================= /


function PSJPopoverModals(className, onLaunch, onClose) {

	var self = this;

    this.current = '';
    this.initializingElement = '';
    this.closingElement = '';
    this.currentInitializer = '';

    this.classSelector = '.' + className;
    this.onlaunch = onLaunch;
    this.onClose = onClose;

    this.events = function() {

    	// Clicking on initializer
		self.initializingElement.on('click.psjModalInitialize', function(event) {
			event.preventDefult();
			self.launch($(this));
		});

		// Clicking outside of modal box
        $(self.classSelector).on('click.psjModalOutsideClick', function(event) {
            if (!$(event.target).is('.modal__box *')) {
                self.closeModal();
            }
        });

        // Clicking on close button
        self.closingElement.on('click.psjModalClose', null, function(event) {
        	event.preventDefault();
            self.closeModal();
        });

        // Prevent tab focus from leaving modal
        $(self.classSelector).on('childrenLoseFocus.psjModalChildrenLoseFocus', function(event) {
            $.accessibility.focusFirstElement(modal.current);
        });
    };

    this.init = function() {

        // Define initializing element
        self.initializingElement = PSJ(self.classSelector + '__initializer');

        // Define closing element
        self.closingElement = PSJ(self.classSelector + '__closer');

        // Wire up synthetic focusout event
        //$.accessibility.childrenLoseFocus($('.modal'));

        self.events();
    };

    this.launch = function(initializer) {

        // Update vars
        self.current = $(initializer.data('target'));
        self.currentInitializer = initializer;


        // Display modal
        self.current.addClass('modal--is-staged modal--is-visible');

        // Wire up ESC key listener
        $(document).on('keydown.modalCloseKeydown', function(event) {
            if ( event.keyCode &&  event.keyCode === 27 ) {
                event.preventDefault();
                modal.closeModal();
            }
        });

        // Focus first element
        //$.accessibility.focusFirstElement(modal.current);

        // Execute specified onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call();
        }
    };

   this.closeModal = function() {

   		// Hide modal
        modal.current.removeClass('modal--is-staged modal--is-visible');

        // Remove ESC key listener
        $(document).off('keydown.modalCloseKeydown');

        // Restore focus to initializing element
        modal.currentInitializer.focus();

        // Execute specified onClose function
        if (self.onClose && typeof self.onClose === 'function') {
        	self.onClose.call();
        }
    };
}

var psjPopoverModals = new PSJPopoverModals('modal');
psjPopoverModals.init();