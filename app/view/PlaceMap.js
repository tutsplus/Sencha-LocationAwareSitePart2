Ext.define('Locator.view.PlaceMap', {
				extend: 'Ext.Container',
				xtype: 'placemappanel',
				config: {
								layout : 'fit',
								items : [{
												xtype : 'map',
												name : 'place_map',
												mapOptions : {
																zoom : 15
												}
								}, {
												xtype : 'titlebar',
												docked : 'top',
												name : 'place_map_tbar',
												items : [{
																xtype : 'button',
																ui : 'back',
																name : 'back_to_home',
																text : 'Home'
												}, {
																xtype : 'button',
																align : 'right',
																iconCls : 'list',
																iconMask : true,
																name : 'show_place_list',
																ui : 'dark'
												}]
								}]
				}
});
