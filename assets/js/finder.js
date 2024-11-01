(function( $ ) {
	$( document ).ready( function() {
		var $self    = $( '#insert_spot' ),
			recentre = function( panel, editor ) {
				var q = $( panel.getEl() ),
					c = $( panel.getContainerElm() ),
					x = 0,
					y = 0;

				// Not visible or is fixed dims
				if ( !panel.visible() || panel._fixed ) {
					return;
				}

				// Centre horizontally
				if ( c.width() > q.width() ) {
					x = Math.floor( ( c.width() - q.width() ) / 2 );
				}

				// Centre vertically
				if ( c.height() > q.height() ) {
					y = Math.floor( ( c.height() - q.height() ) / 2 );
				}

				// Finally move it
				panel.fixed( false ).moveTo( x, y );
			};

		// Seems if you're a little quick with the button we don't have access to the editor.
		if ( top.tinymce.activeEditor.windowManager.getWindows().length < 1 ) {
			top.tinymce.activeEditor.windowManager.alert( 'Failed to load spots interface.' );
			$self.hide();
			return;
		}

		// Make the window fit the content
		setTimeout( function() {
			var editor = top.tinymce.activeEditor,
				panels = editor.windowManager.getWindows(),
				panel, i, q, c;

			for ( i in panels ) {
				panel = panels[ i ];
				if ( panel.params.name !== 'addspotbutton' || !panel.visible() || panel._fixed ) {
					continue;
				}

				// Resize the window so the content fits.
				panel.resizeBy( 0, $self.parent().outerHeight() - (panel.settings.height - 5) );

				// Re-centring
				recentre( panel, editor );
			}
		}, 250 );

		$self.on( 'click', '.slow-close', function() {
			setTimeout( function() {
				top.tinymce.activeEditor.windowManager.close();
			}, 100 );
		} );

		$self.on( 'click', '#insert', function() {
			var ed   = top.tinymce.activeEditor,
				args = ed.windowManager.getParams(),
				st   = ed.selection.getContent( { format: 'html' } ) || '',
				sc   = args.shortcode,
				sv   = parseInt( document.getElementById( 'spot_id' ).value, 10 ),
				te   = document.getElementById( 'spot_template' ),
				tv   = te !== null ? te.value : '',
				op   = '';

			if ( sv > 0 ) {
				sc = sc.replace( ' template=%VALUE2%', typeof( tv ) !== 'undefined' && tv !== '' ? ' template="' + tv + '"' : '' );
				op = st + sc.replace( '%VALUE1%', sv );
				ed.execCommand( 'mceInsertContent', false, op );
			}

			// Exit back to tinyMCE.
			ed.execCommand( 'mceRepaint' );
			ed.windowManager.close();
		} );

		$self.on( 'click', '#spot_selector li:not(.no-click)', function() {
			var v = $( this ).attr( 'data-value' ),
				t = $( this ).text(),
				d = $( '#current_item_title' ),
				i = $( '#spot_id' );

			i.val( v );
			d.text( t );
			$( this ).addClass( 'current' ).siblings().removeClass( 'current' );
		} );

		$( '#spot_id_drop_search' ).autocomplete(
			{
				url: icitFinderL10,
				extraParams: { 'action': 'find-spot' },
				showResult: function( value, data ) {
					var l  = $( '#search_results' ),
						li = $( '<li data-value="' + data + '">' + value + '</li>' );

					if ( !l.has( 'li[data-value="' + data + '"]' ).length ) {
						li.hide().addClass( 'recent' ).prependTo( l ).slideDown( 500 );
					}

					l.find( 'li[data-value="' + data + '"]' ).prependTo( l ).addClass( 'recent' ).each( function() {
						var w = $( this ),
							q = setTimeout( function() {
								w.removeClass( 'recent' );
							}, 5000 );
					} );

					l.find( 'li' ).removeClass( 'alternate' ).end().find( 'li:even' ).addClass( 'alternate' );

					return '<span data-value="' + data + '">' + value + '</span>';
				},
				onItemSelect: function( item ) {
					var v = item.data,
						t = item.value,
						d = $( '#current_item_title' ),
						i = $( '#spot_id' );
					i.val( v );
					d.text( t );
					$( '#spot_selector li[data-value=' + v + ']' )
						.addClass( 'current' ).siblings()
						.removeClass( 'current' );
				},

				delay: 200,
				minChars: 2,
				maxCacheLength: 1
			} );
	} );
})( jQuery );
