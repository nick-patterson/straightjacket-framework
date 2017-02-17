// ------   Popover Modals Module   --------- /
// ------------------------------------------ /


function PSJPopoverModals(className, onLaunch, onClose) {

	var self = this;

	this.trigger = '';
    this.closer = '';

    this.currentModal = '';
    this.currentTrigger = '';
    this.isActive = false;

    this.className = className;
    this.modalObject = '';

    this.onLaunch = onLaunch;
    this.onClose = onClose;

    this.events = function() {

    	// Clicking on trigger
		self.trigger.on('click', function(event) {
			self.launch($(this));
		});

		// Clicking outside of box but inside of modal
        self.modalObject.on('click', function(event) {
        	if (!$('.' + self.className + '__box').has(event.target)) {
        		self.closeModal();
        	}
        });

        // Clicking on close button
        self.closer.on('click', function(event) {
        	event.stopPropagation();
            self.closeModal();
        });

        // Prevent tabbing out of active modal
        $.psj.accessibility.allFocusOut(self.modalObject);
        self.modalObject.on('psjallfocusout', function(event) {
        	if (self.isActive) {
        		$.psj.accessibility.focusFirstTabbableElement(self.currentModal);
        	}
        });
    };

    this.init = function() {

        // Define triggering element
        self.trigger = $('.' + self.className + '__trigger');

        // Define closing element
        self.closer = $('.' + self.className + '__closer');

        // Define PSJ modal object
        self.modalObject = $('.' + self.className);

        self.events();
    };

    this.launch = function(trigger) {

        // Update vars
        self.currentModal = $(trigger.data('target'));
        self.currentTrigger = trigger;
        self.isActive = true;

        // Display modal on DOM
        self.currentModal.addClass(self.className + '--active');

        // Initialize ESC key listener
        $(document).on('keydown.modalESCKeydown', function(event) {
            if (event.keyCode &&  event.keyCode === 27) {
              self.closeModal();
            }
        });

        // Focus first tabbable element in modal
        window.setTimeout(function() {
        	$.psj.accessibility.focusFirstTabbableElement(self.currentModal);
        }, 0);

        // Execute onLaunch function
        if (self.onLaunch && typeof self.onLaunch === 'function') {
        	self.onLaunch.call(self.currentModal, self.currentModal);
        }
    };

   this.closeModal = function() {

   		// Update vars
   		self.isActive = false;

   		// Hide modal on DOM
        self.currentModal.removeClass(self.className + '--active');

        // Remove ESC key listener
        $(document).off('keydown.modalESCKeydown');

        // Return focus to current trigger
        window.setTimeout(function() {
        	self.currentTrigger.focus();
        }, 0);

        // Execute onClose function
        if (self.onClose && typeof self.onClose === 'function') {
        	self.onClose.call(self.currentModal, self.currentModal);
        }
    };
}

$(window).on('load', function(event) {
	var modal = new PSJPopoverModals('modal');
	modal.init();
});
