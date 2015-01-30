Ext.define('Locator.view.details.Info', {
				extend: 'Ext.Container',
				xtype: 'info',
				config: {
								cls : 'transparent details-info',
								iconCls : 'info',
								title : Lang.info,
								scrollable : true,
								tpl : Ext.create('Ext.XTemplate', 
												document.getElementById('tpl_place_details_info').innerHTML, {
																getRating : function(rating){
																				return Locator.util.Util.getRating(rating);
																}
												})
				}
});
