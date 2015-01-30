Ext.define('Locator.view.PlaceList', {
				extend: 'Ext.List',
				xtype: 'placelist',
				requires : ['Ext.plugin.PullRefresh'],
				config: {
								cls : 'default-bg placelist',
								store : 'Places',
								emptyText : Lang.placeList.emptyText,
								plugins: [
								{
												xclass: 'Ext.plugin.PullRefresh',
												pullRefreshText: Lang.placeList.pullToRefresh
								}
								],
								itemTpl : Ext.create('Ext.XTemplate', 
												document.getElementById('tpl_placelist_item').innerHTML, {																
																getImage : function(data){
																				// If there is any image available for the place, show the first one in list item
																				if(data.photos && data.photos.length > 0){
																								return '<div class="photo"><img src="' + data.photos[0].url + '" /></div>';
																				}
																				
																				// If there is no image available, then we will show the icon of the place
																				// which we get from the place data itself
																				return ['<div class="icon-wrapper">',
																				'<div class="icon" style="-webkit-mask-image:url(' + data.icon + ');" ></div>',
																				'</div>'].join('');
																},
                    
																getRating : function(rating){
																				return Locator.util.Util.getRating(rating);
																}
												}),
								items : [{
												xtype : 'titlebar',
												docked : 'top',
												name : 'place_list_tbar',
												items : [{
																xtype : 'button',
																ui : 'back',
																name : 'back_to_home',
																text : 'Home'
												}, {
																xtype : 'button',
																align : 'right',
																iconCls : 'locate4',
																iconMask : true,
																name : 'show_map',
																ui : 'dark'
												}]
								}]
				}
});
