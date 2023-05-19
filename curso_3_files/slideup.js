/* global jQuery */
/* global document */

(function($) {

	'use strict';

	$(document).ready(function(){
		slideUp();
	});

	var slideUp = function() {
		var
	 	$slideUpSlotWrap = $('.adace-slideup-slot-wrap'),
		$slideUpCloserBtn = $slideUpSlotWrap.find('.adace-slideup-slot-closer');
		$slideUpCloserBtn.on('click', function(e) {
			e.preventDefault();
			$slideUpSlotWrap.addClass('hidden');
		});
	};

})(jQuery);
