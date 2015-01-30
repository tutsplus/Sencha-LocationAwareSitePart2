Ext.define('Locator.store.Places', {
    extend : 'Ext.data.Store',
    config : {
        model : 'Locator.model.Place',
								proxy : {
												type : 'ajax',
												url : Locator.util.Util.api.nearestPlaces,
												reader : {
																type : 'json',
																rootProperty : 'results'
												}
								}
    }
});


