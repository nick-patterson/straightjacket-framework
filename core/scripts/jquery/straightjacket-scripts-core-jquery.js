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
/- #0 Core Functions ------------------------------- /
/- #0 Accessibility -------------------------------- /
/-
/ ------------------------------------------------- */




// ================================================= /
// ======   #0 Core Functions   ==================== /
// ================================================= /

var PSJ = {
};


// ================================================= /
// ======   #1 Accessibility Core   ================ /
// ================================================= /


PSJ.accessibility = {

    childrenLoseFocus: function(elements) {
        elements.on('focusout', function(event) {
            event.preventDefault();
            event.stopPropagation();

            var element = $(this);

            window.setTimeout(function() {
                if (!element.has(document.activeElement).length) {
                    element.trigger('childrenLoseFocus');
                }
            }, 0);
        });
    },

    focusFirstElement: function(container) {
        $(container.find('*:tabbable')[0]).focus();
    }
};