// ================================================= /
// ======   PHANTASM STRAIGHTJACKET   ============== /
// ================================================= /
// ------   SCRIPTS CORE   ------------------------- /
// ================================================= /



/* DESCRIPTION: -------------------------------------/

   A lightweight and powerful scripts library
   to support StraightJacket UI elements.

   These functions aim for great performance and
   accessibility and integrate perfectly with
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
/- #0 Core Functions ------------------------------- /
/- #0 Accessibility -------------------------------- /
/-
/ ------------------------------------------------- */




// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /

$.psj = {

	helpers: {

		// Returns whether or not an element is displayed (e.g. takes up space on the screen)
		isDisplayed: function(index, element) {
			return element.offsetWidth > 0 || element.offsetHeight > 0;
		},

		// Returns whether or not an element is visible (visible defined as CSS visibility)
		isVisible: function(index, element) {
			element = $(element);
			var visibility = element.css( "visibility" );
			while (visibility === "inherit") {
				element = element.parent();
				visibility = element.css("visibility");
			}
			return visibility !== "hidden";
		}
	}
};


// ================================================= /
// ======   #1 Accessibility Core   ================ /
// ================================================= /


$.psj.accessibility = {

    allFocusOut: function(elements) {
        elements.on('focusout', function(event) {
            var element = $(this);
            window.setTimeout(function() {
                if (!element.has(document.activeElement).length) {
                    element.trigger('psjallfocusout');
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

    // Focus first tabbable child of first element in a set FIX THIS IT ISNT WORKING
	focusFirstTabbableElement: function(container) {
		var tabbableElements = container.find($.psj.accessibility.tabbableElementSelectors.join(',')).filter(':visible').filter($.psj.helpers.isVisible);
		if (tabbableElements.length) {
			tabbableElements[0].focus();
		}
		return container;
	}
};
