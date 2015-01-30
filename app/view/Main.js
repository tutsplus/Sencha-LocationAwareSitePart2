/**
 * Main view - holder of all the views. 
	* Card layout by default in order to support multiple views as items
 */
Ext.define('Locator.view.Main', {
				extend: 'Ext.Container',
				xtype: 'main',
				config: {
								cls : 'default-bg',
								layout : 'card',
								items : [{
												xtype : 'categories'
								}]
				}
});
