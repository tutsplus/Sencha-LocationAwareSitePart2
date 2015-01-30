Ext.define('Locator.view.details.Main', {
				extend: 'Ext.tab.Panel',
				xtype: 'detailspanel',
				config: {
								cls : 'details-tabpanel default-bg',
								tabBar : {
												docked : 'bottom'
								},
								items : [{
												xtype : 'info'
								}, {
												xtype : 'gallery'
								}, {
												xtype : 'review'
								}, {
												xtype : 'titlebar',
												docked : 'top',
												title : 'Details',
												items : [{
																text : 'Places',
																ui : 'back',
																name : 'back_to_placelist'
												}]
								}]
				}
});
