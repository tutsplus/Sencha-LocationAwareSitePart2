Ext.define('Locator.view.Categories', {
				extend: 'Ext.List',
				xtype: 'categories',
				requires : ['Ext.TitleBar'],
				config: {
								cls : 'default-bg category-list',
								itemTpl : '{name}',
								store : 'Categories',
								grouped : true,
								indexBar : true,
								items : [{
												xtype : 'titlebar',
												docked : 'top',
												title : Lang.home
								}]
				}
});
