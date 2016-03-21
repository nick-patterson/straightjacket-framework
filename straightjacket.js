$(document).ready(function() {

	// ARROW BUTTONS /////////////////
	
	$('.button-arrow').each(function(){

		var buttonText = $(this).children(':first');

		var width = buttonText.width();
		var height = buttonText.innerHeight();
		var color = buttonText.css("color");

		var arrowHeadHeight = 10;
		var arrowHeadLength = 18;
		var arrowPadding = 15;

		var arrowVerticalOffset = (height / 2);

		var arrowToButtonRatio = 4;
		var totalArrowLength = width / arrowToButtonRatio + arrowHeadLength;

		$(this).append('<div class="arrowcontainer"><svg class="arrow" width="' + totalArrowLength + '" height="100%"><line x1="0" y1="' + arrowVerticalOffset + '" x2="' + width / arrowToButtonRatio + '" y2="' + arrowVerticalOffset + '"/><polygon points="' + width / arrowToButtonRatio + ',' + ((arrowVerticalOffset) - (arrowHeadHeight / 2)) + ' ' + width / arrowToButtonRatio + ',' + ((arrowVerticalOffset) + (arrowHeadHeight / 2)) + ' ' + totalArrowLength + ',' + (arrowVerticalOffset) + '"/></svg></div>');

		var arrowContainer = $(this).find('.arrowcontainer');

		var arrow = arrowContainer.find('.arrow');

		buttonText.css({
			display: "inline-block",
			margin: 0,
			padding: 0,
		});

		//TweenMax.set(buttonText, {margin: 0});

		TweenMax.set(arrowContainer, {width: 0, marginLeft: 0, height: height, y: 0});

		TweenMax.set(arrow, {x: ((totalArrowLength + arrowPadding) * -1), width: totalArrowLength});

		$(this).hover(
			function() {
				TweenMax.to(arrowContainer, .65, {width: totalArrowLength * 1.035, marginLeft: arrowPadding, ease: Back.easeOut.config(1.4)});
				TweenMax.to(arrow, .65, {x: 0, ease: Back.easeOut.config(1.4), delay: .1});

			},

			function() {
				TweenMax.to(arrowContainer, .85, {width: 0, ease: Back.easeOut.config(1.4)});
				TweenMax.to(arrowContainer, .85, {marginLeft: 0});
				TweenMax.to(arrow, .85, {x: ((totalArrowLength + arrowPadding) * -1), ease: Back.easeOut.config(1.4)});
			}

		);

	});

	// WORM BUTTONS /////////////////

	$('.button-worm').each(function(){

		var paddingBottom = parseInt($(this).css("paddingBottom"));
		var paddingTop = parseInt($(this).css("paddingTop"));
		var paddingLeft = parseInt($(this).css("paddingLeft"));
		var paddingRight = parseInt($(this).css("paddingRight"));

		var buttonText = $(this).children(':first');
		var width = $(this).innerWidth();
		var height = $(this).innerHeight();	
		var offset = $(this).offset();

		//$(this).append('<svg class="wormbuttonpath" width="' + width + '" height="' + height + '"><rect width="' + width + '" height="' + height + '"/></svg>');

		$(this).append('<svg class="wormbuttonpath"><rect width="100%" height="100%"/></svg>');


		var wormButtonPath = $(this).find('.wormbuttonpath');

		var rect = wormButtonPath.find('rect');

		var wormButtonWidth = rect.innerWidth();
		var wormButtonHeight = rect.innerHeight();
		var perimeter = wormButtonWidth * 2 + wormButtonHeight * 2;

		/*buttonText.css({
			display: "inline-block",
			margin: 0,
			padding: 0,
		});*/

		wormButtonPath.css({
			top: 0,
			left: 0
		});

		TweenMax.set(rect, {strokeDasharray: perimeter, strokeDashoffset: perimeter});

		$(this).hover(
			function() {
				TweenMax.to(rect, 1.5, {strokeDashoffset: 0});

			},

			function() {
				TweenMax.to(rect, 1.7, {strokeDashoffset: perimeter});
			}

		);

	});

	// SLIDE BUTTONS

	$('.button-slide').each(function() {

		var buttonText = $(this).children(':first');

		var width = $(this).innerWidth();
		var height = $(this).innerHeight();
		var rotatorWidth = width * 2;
		var rotatorXOffset = (rotatorWidth - width) / -2;
		var rotatorYOffset = (rotatorWidth - height) / -2;

		$(this).prepend('<div class = "rotate"><div class = "slide"></div></div>');

		var rotate = $(this).find('.rotate');
		var slide = $(this).find('.slide');

		var slideDirection = $(this).data('direction');

		var rotation = "";

		switch(slideDirection) {
			case "top":
				rotation = 0;
				break;
			case "topright":
				rotation = 45;
				break;
			case "right":
				rotation = 90;
				break;
			case "bottomright":
				rotation = 135;
				break;
			case "bottom":
				rotation = 180;
				break;
			case "bottomleft":
				rotation = 225;
				break;
			case "left":
				rotation = 270;
				break;
			case "topleft":
				rotation = 315;
				break;
			default:
				rotation = 45;
		}

		/*buttonText.css({
			display: "inline-block",
			margin: 0,
			padding: 0
		})*/

		rotate.css({
			width: rotatorWidth,
			height: rotatorWidth,
			position: "absolute",
			left: rotatorXOffset,
			top: rotatorYOffset
		});


		TweenMax.set(rotate, {rotation: rotation});
		TweenMax.set(slide, {y: rotatorWidth * -1});

		$(this).hover(
			function() {
				TweenMax.to(slide, .65, {y: 0, ease: Power1.easeOut,});
				console.log(rotation);
			},

			function() {
				TweenMax.to(slide, .65, {y: rotatorWidth * -1, ease: Power1.easeOut,});
			}

		);



	});


	$(window).resize(function(){

		$('.arrowbutton').each(function(){

			var buttonText = $(this).children(':first');
			var arrowContainer = $(this).find('.arrowcontainer');

			arrowContainer.html("");

			var width = buttonText.width();
			var height = buttonText.height();
			var color = buttonText.css("color");

			var arrowHeadHeight = 10;
			var arrowHeadLength = 18;
			var arrowPadding = 15;

			var arrowToButtonRatio = 4;
			var totalArrowLength = width / arrowToButtonRatio + arrowHeadLength;

			var arrowVerticalOffset = (height / 2);

			arrowContainer.html('<svg class="arrow" width="' + totalArrowLength + '" height="' + height / 1.25 + '"><line stroke="' + color + '" x1="0" y1="' + arrowVerticalOffset + '" x2="' + width / arrowToButtonRatio + '" y2="' + arrowVerticalOffset + '"/><polygon fill="' + color + '" points="' + width / arrowToButtonRatio + ',' + ((arrowVerticalOffset) - (arrowHeadHeight / 2)) + ' ' + width / arrowToButtonRatio + ',' + ((arrowVerticalOffset) + (arrowHeadHeight / 2)) + ' ' + totalArrowLength + ',' + (arrowVerticalOffset) + '"/></svg>');

			var arrow = arrowContainer.find('.arrow');

			//TweenMax.set(buttonText, {margin: 0});

			TweenMax.set(arrowContainer, {width: 0, marginLeft: 0, height: height, y: 0});

			TweenMax.set(arrow, {x: ((totalArrowLength + arrowPadding) * -1), width: totalArrowLength});

			$(this).hover(
				function() {
					TweenMax.to(arrowContainer, .65, {width: totalArrowLength * 1.035, marginLeft: arrowPadding, ease: Back.easeOut.config(1.4)});
					TweenMax.to(arrow, .65, {x: 0, ease: Back.easeOut.config(1.4), delay: .1});

				},

				function() {
					TweenMax.to(arrowContainer, .85, {width: 0, ease: Back.easeOut.config(1.4)});
					TweenMax.to(arrowContainer, .85, {marginLeft: 0});
					TweenMax.to(arrow, .85, {x: ((totalArrowLength + arrowPadding) * -1), ease: Back.easeOut.config(1.4)});
				}

			);

		});

	});

});