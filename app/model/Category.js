Ext.define('Locator.model.Category', {
				extend : 'Ext.data.Model',
				config : {
								fields : [
								"type",
								{
												name : "name",
												type : "string",
												convert : function(v, record){
																return	Locator.util.Util.toTitleCase(record.get('type').split('_').join(' '));
												}
								}, {
												name: "favorite",
												type: 'boolean',
												defaultValue : false
								},
								"size"
								]
				}
});

