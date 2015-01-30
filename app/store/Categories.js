Ext.define('Locator.store.Categories', {
				extend : 'Ext.data.Store',
				config : {
								model : 'Locator.model.Category',
								autoLoad : true,
								sorters: 'name',
								grouper: {
												groupFn: function(record) {
																return record.get('name')[0];
												}
								},
								proxy : {
												type : 'ajax',
												url : Locator.util.Util.api.categories,
												reader : {
																type : 'json',
																rootProperty : 'categories'
												}
								}
				}
});


