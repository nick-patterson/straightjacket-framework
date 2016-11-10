// ------   Popover Modals Module   --------- /
// ------------------------------------------ /


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
            PSJ.accessibility.focusFirstElement(modal.current);
        });

        // Wire up synthetic focusout event
        PSJ.accessibility.childrenLoseFocus(modal.Current);
    };

    this.init = function() {

        // Define initializing element
        self.initializingElement = PSJ(self.classSelector + '__initializer');

        // Define closing element
        self.closingElement = PSJ(self.classSelector + '__closer');

        self.events();
    };

    this.launch = function(initializer) {

        // Update vars
        self.current = $(initializer.data('target'));
        self.currentInitializer = initializer;


        // Display modal
        self.current.addClass(self.className + '--is-staged ' + self.className + '--is-visible');

        // Wire up ESC key listener
        $(document).on('keydown.modalCloseKeydown', function(event) {
            if ( event.keyCode &&  event.keyCode === 27 ) {
                event.preventDefault();
                modal.closeModal();
            }
        });

        // Focus first element
        PSJ.accessibility.focusFirstElement(modal.current);

        // Execute specified onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call();
        }
    };

   this.closeModal = function() {

   		// Hide modal
        modal.current.removeClass(self.className + '--is-staged ' + self.className + '--is-visible');

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