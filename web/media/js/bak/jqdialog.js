/**
	Kailash Nadh,	http://kailashnadh.name
	April 2011
	Smooth popup dialog for jQuery

	License:	GNU Public License: http://www.fsf.org/copyleft/gpl.html
	
	v1.3.1	April 4 2011	-	Fixed an IE compatibility issue. Thanks to Filip Vojtisek.
	v1.3	February 6 2011	-	Rewrote the whole plugin to comply with jQuery's plugin standards
	v1.2	September 2 2009
**/

;(function($) {
	
	$.jqDialog = {
		//________button / control labels
		labels: {
			ok: 'Ok',
			yes: 'Yes',
			no: 'No',
			cancel: 'Cancel',
			x: 'X'
		},

		//________element ids
		ids: {
			div_box:	'jqDialog_box',
			div_content:	'jqDialog_content',
			div_options: 'jqDialog_options',
			bt_close: 'jqDialog_close',
			bt_yes: 'jqDialog_yes',
			bt_no: 'jqDialog_no',
			bt_ok: 'jqDialog_ok',
			bt_ancel: 'jqDialog_ok',
			input: 'jqDialog_input',

            overlay: 'jqDialog_overlay'
		},
		
		//________confirm dialog
		confirm: function(message, callback_yes, callback_no) {
			var t = this;
			
			t.create(message);
			
			t.parts.bt_ok.hide();
			t.parts.bt_cancel.hide();
			
			t.parts.bt_yes.show();
			t.parts.bt_no.show();
			t.parts.bt_yes.focus();
			
			// just redo this everytime in case a new callback is presented
			t.parts.bt_yes.unbind().click( function() {
				t.close();
				if(callback_yes) callback_yes();
			});

			t.parts.bt_no.unbind().click( function() {
				t.close();
				if(callback_no) callback_no();
			});
		},
		
		//________prompt dialog
		prompt: function(message, content, callback_ok, callback_cancel) {
			var t = this;

			t.create(
				$("<div>").
					append($('<span>').html(message))
					.append( $("<div>").append( t.parts.input.val(content) ) )
			);
			
			// activate appropriate controls
			t.parts.bt_yes.hide();
			t.parts.bt_no.hide();

			t.parts.bt_ok.show();
			t.parts.bt_cancel.show(); 

            var event_ok = function () {
				t.close();
				if(callback_ok) callback_ok( t.parts.input.val() );
            }
            var event_cancel = function () {
				t.close();
				if(callback_cancel) callback_cancel();
            }
			
			t.parts.input.keydown(function (e) {
                if (e.keyCode == 13) {
                    event_ok();
                }
            }).focus();
			
			// just redo t everytime in case a new callback is presented
			t.parts.bt_ok.unbind().click( function() {
                event_ok();
			});

			t.parts.bt_cancel.unbind().click( function() {
                event_cancel();
			});
		},
		
		//________alert dialog
		alert: function(content, callback_ok) {
			var t = this;
			
			t.create(content);

			// activate appropriate controls
			t.parts.bt_cancel.hide();
			t.parts.bt_yes.hide();
			t.parts.bt_no.hide();
			
			t.parts.bt_ok.show();
			
			t.parts.bt_ok.focus();
			
			// just redo this everytime in case a new callback is presented
			t.parts.bt_ok.unbind().click( function() {
				t.close();
				if(callback_ok)
					callback_ok();
			});
		},

		//________content
		content: function(content, close_seconds) {
			var t = this;
			
			t.create(content);
			t.parts.div_options.hide();
		},

		//________auto-hiding notification
		notify: function(content, close_seconds) {
			var t = this;
			
			t.content(content);
			t.parts.bt_close.focus();
			if(close_seconds)
				t.close_timer = setTimeout(function() { t.close(); }, close_seconds*1000 );
		},

		//________create a dialog box
		create: function(content) {
			var t = this;
			
			t.check();
			
			t.maintainPosition( t.parts.div_box );
			
			clearTimeout(t.close_timer);

            t.parts.overlay.show();
			t.parts.div_content.html(content);
			t.parts.div_options.show();
			t.parts.div_box.fadeIn('fast');
		},
		//________close the dialog box
		close: function() {
			var t = this;
			t.parts.div_box.fadeOut('fast');
			//t.clearPosition();
            t.parts.overlay.hide();
		},

		//________position control
        /*
		clearPosition: function() {
			$(window).unbind('scroll.jqDialog');
		},
        */
		makeCenter: function(object) {
			object.css({
				//top: ( (($(window).height() / 2) - ( object.height() / 2 ) )) + ($(document).scrollTop()) + 'px',
				top:  ($(window).height() / 3) + 'px',
				left: ( (($(window).width() / 2) - ( object.width() / 2 ) )) + ($(document).scrollLeft()) + 'px'
			});
		},
		maintainPosition: function(object) {
			var t = this;

			t.makeCenter(object);
			
            /* use css:fixed instead
			$(window).bind('scroll.jqDialog', function() {
				t.makeCenter(object);
			} );
            */
		},

		//________
		init_done: false,
		check: function() {
			var t = this;
			if(t.init_done)
				return;
			else {
				t.init_done = true;
			}
			
			$('body').append( t.parts.div_box );
            t.parts.div_box.after(t.parts.overlay);
		},
		init: function() {
			var t = this;
		
			t.parts = {};
			
			// create the dialog components
			t.parts.div_box = $("<div>").attr({ id: t.ids.div_box });
			t.parts.div_content = $("<div>").attr({ id: t.ids.div_content });
			t.parts.div_options = $("<div>").attr({ id: t.ids.div_options });

			t.parts.bt_yes = $("<button>").attr({ id: t.ids.bt_yes }).append( t.labels.yes );
			t.parts.bt_no = $("<button>").attr({ id: t.ids.bt_no }).append( t.labels.no );
			t.parts.bt_ok = $("<button>").attr({ id: t.ids.bt_ok }).append( t.labels.ok );
			t.parts.bt_cancel = $("<button>").attr({ id: t.ids.bt_cancel }).append( t.labels.cancel );

			t.parts.input = $("<input>").attr({ id: t.ids.input, class: 'input' });
			t.parts.bt_close = $("<button>").attr({ id: t.ids.bt_close })
										   .append( t.labels.x ).click(
												function() {
													t.close();
												}
											);

			// assemble the parts
			t.parts.div_box.append( t.parts.bt_close )
					.append( t.parts.div_content )
					.append(
						t.parts.div_options.append(t.parts.bt_yes)
										   .append(t.parts.bt_no)
										   .append(t.parts.bt_ok)
										   .append(t.parts.bt_cancel)
					);
            t.parts.overlay = $('<div>').attr({ id: t.ids.overlay }
                              ).click(function () {
                                  t.close();
                              });

			// add to body
			t.parts.div_box.hide();
		}
	};
	$.jqDialog.init();
})(jQuery);
