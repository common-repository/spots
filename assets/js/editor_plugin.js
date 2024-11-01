(function() {
	// Register plugin
	tinymce.PluginManager.add( 'addspotbutton', function( ed, url ) {
		// Register extrabutton button
		ed.addButton( 'addspotbutton', {
			icon: 'dashicon dashicons-image-filter',
			tooltip: 'Insert spot',
			onclick: function() {
				ed.windowManager.open(
					{
						file: ajaxurl + '?action=spots_mce_popup',
						title: 'Insert a spot',
						width: 500,
						height: 300
					}, {
						pluginUrl: url,
						editor: ed,
						shortcode: '[icitspot id="%VALUE1%" template=%VALUE2%]',
						name: 'addspotbutton'
					} );
			}
		} );
	} );
})();
