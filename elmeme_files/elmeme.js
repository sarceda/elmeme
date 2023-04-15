		$('.image-slider').each(function () {
			$(this).owlCarousel($.extend({
				stopOnHover: true,
				navigation:  true,
				pagination:  true,
				autoPlay:    false,
				singleItem:  true,
				items:       15,
				navigationText: [
					'<span class="arrows arrows-arrows-slim-left"></span>',
					'<span class="arrows arrows-arrows-slim-right"></span>'
				],
			}, $(this).data('carousel-options')));
		});
		
		//var $landingForm = $('#landing');
		$landingForm.submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: '//formsubmit.co/hola@elmeme.me',
				method: 'POST',
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function() {
					$landingForm.append('<div class="alert alert-warning m-b-0 m-t-10 col-md-12">Enviando…</div>');
				},
				success: function(data) {
					$landingForm.find('.alert-warning').hide();
					$landingForm.append('<div class="alert alert-success m-b-0 m-t-10 col-md-12">¡Te contactaremos!</div>');
				},
				error: function(err) {
					$landingForm.find('.alert-warning').hide();
					$landingForm.append('<div class="alert alert-error m-b-0 m-t-10 col-md-12">Ups, algo salió mal.</div>');
				}
			});
		});
		
		//var $contactForm1 = $('#pricing-1');
		$contactForm1.submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: '//formsubmit.co/hola@elmeme.me',
				method: 'POST',
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function() {
					$contactForm1.append('<div class="alert alert-warning m-b-0 m-t-10">Enviando…</div>');
				},
				success: function(data) {
					$contactForm1.find('.alert-warning').hide();
					$contactForm1.append('<div class="alert alert-success m-b-0 m-t-10">¡Te contactaremos!</div>');
				},
				error: function(err) {
					$contactForm1.find('.alert-warning').hide();
					$contactForm1.append('<div class="alert alert-error m-b-0 m-t-10">Ups, algo salió mal.</div>');
				}
			});
		});
		
		//var $contactForm2 = $('#pricing-2');
		$contactForm2.submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: '//formsubmit.co/hola@elmeme.me',
				method: 'POST',
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function() {
					$contactForm2.append('<div class="alert alert-warning m-b-0 m-t-10">Enviando…</div>');
				},
				success: function(data) {
					$contactForm2.find('.alert-warning').hide();
					$contactForm2.append('<div class="alert alert-success m-b-0 m-t-10">¡Te contactaremos!</div>');
				},
				error: function(err) {
					$contactForm2.find('.alert-warning').hide();
					$contactForm2.append('<div class="alert alert-error m-b-0 m-t-10">Ups, algo salió mal.</div>');
				}
			});
		});
		
		//var $contactForm3 = $('#pricing-3');
		$contactForm3.submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: '//formsubmit.co/hola@elmeme.me',
				method: 'POST',
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function() {
					$contactForm3.append('<div class="alert alert-warning m-b-0 m-t-10">Enviando…</div>');
				},
				success: function(data) {
					$contactForm3.find('.alert-warning').hide();
					$contactForm3.append('<div class="alert alert-success m-b-0 m-t-10">¡Te contactaremos!</div>');
				},
				error: function(err) {
					$contactForm3.find('.alert-warning').hide();
					$contactForm3.append('<div class="alert alert-error m-b-0 m-t-10">Ups, algo salió mal.</div>');
				}
			});
		});
		
		//var $contactForm = $('#contacto');
		$contactForm.submit(function(e) {
			e.preventDefault();
			$.ajax({
				url: '//formsubmit.co/hola@elmeme.me',
				method: 'POST',
				data: $(this).serialize(),
				dataType: 'json',
				beforeSend: function() {
					$contactForm.append('<div class="alert alert-warning m-b-0 m-t-10">Enviando…</div>');
				},
				success: function(data) {
					$contactForm.find('.alert-warning').hide();
					$contactForm.append('<div class="alert alert-success m-b-0 m-t-10">¡Gracias por escribirnos! Te estaremos respondiendo pronto…</div>');
				},
				error: function(err) {
					$contactForm.find('.alert-warning').hide();
					$contactForm.append('<div class="alert alert-error m-b-0 m-t-10">Ups, algo salió mal.</div>');
				}
			});
		});