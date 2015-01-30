Ext.define('Locator.view.Places', {
				extend: 'Ext.Container',
				xtype: 'places',
				config: {
								layout : 'card',
								items : [{
												xtype : 'placelist'
								}]
				}
});
