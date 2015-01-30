Ext.define('Locator.controller.App', {
				extend : 'Ext.app.Controller',
				requires : ['Ext.device.Geolocation', 'Ext.Map'],
				util : Locator.util.Util,
				activeCategoryType : null,
				config : {
								before : {
								//												'getPlaces' : 'checkCategories'
								},

								routes: {
												'' : 'showHome',
												'categories/:type' : 'getPlaces'
								},

								refs : {
												categoriesList : 'categories',
												main : 'main',
												placesContainer : 'places',
												placeList : 'placelist',
												placeMapPanel : 'placemappanel',
												placeMap : 'map[name="place_map"]',

												// Buttons  
												showMapBtn : 'button[name="show_map"]',
												showPlaceListBtn : 'button[name="show_place_list"]',
												backToHomeBtn : 'button[name="back_to_home"]',												
												backToPlaceListBtn : 'button[name="back_to_placelist"]'
								},

								control : {
												categoriesList : {
																itemtap : function(list, index, target, record){
																				this.redirectTo('categories/' + record.get('type'));
																}
												},

												placeList : {
																itemtap : function(list, index, target, record){
																				if(this.activeCategoryType){
																								this.redirectTo('categories/' + this.activeCategoryType + '/' + record.get('reference'));
																				}
																}
												},

												placeMap : {
																maprender : 'showPlacesMarkers'
												},

												showMapBtn : {
																tap : 'showPlacesMap'
												},

												showPlaceListBtn : {
																tap : 'showPlaceList'
												},

												backToHomeBtn : {
																tap : function(){
																				this.redirectTo('');

																				// Destroy the mappanel completely which helps us by not 
																				// saving and removing existing markers
																				if(this.getPlaceMapPanel()){
																								this.getPlacesContainer().remove(this.getPlaceMapPanel());
																				}
																}
												},

												backToPlaceListBtn : {
																tap : function(){
																				this.redirectTo('categories/' + this.activeCategoryType);
																}
												}
								}
				},


				launch : function(){
								var me = this;

								me.getApplication().on({
												categorychange : {
																fn : function(newCategory){
																				me.activeCategoryType = newCategory;
																}
												},

												placechange : {
																fn : function(newPlaceReference){
																				me.activePlaceReference = newPlaceReference;
																}
												}
								});
				},

				/**
				 * Retrieve all the places for a particlur category
				 */
				getPlaces : function(type){
								var me = this;

								// Show the place list page
								me.showPlacesContainer(type);
								
								// Disable the show map button until the list gets loaded
								me.getShowMapBtn().disable();
								
								// Keep a reference of the active category type in this controller
								me.getApplication().fireEvent('categorychange', type);

								var store = Ext.getStore('Places'),
								loadPlaces = function(){
												
												me.util.showLoading(me.getPlaceList(), true);	
												
												// Set parameters to load placelist for this 'type'
												store.getProxy().setExtraParams({
																location : me.util.userLocation,
																action : me.util.api.nearBySearch,
																radius : me.util.defaultSearchRadius,
																sensor : false,
																key : me.util.API_KEY,
																types : type
												});
												
												// Fetch the places
												store.load(function(){
																me.util.showLoading(me.getPlaceList(), false);	

																// Enable show map button
																me.getShowMapBtn().enable();
												});
								}

								// If user's location is already not set, fetch it. 
								// Else load the places for the saved user's location
								if(!me.util.userLocation){
												Ext.device.Geolocation.getCurrentPosition({
																success: function(position) {
																				me.util.userLocation = position.coords.latitude + ',' + position.coords.longitude;
																				loadPlaces();
																},
																failure: function() {
																				me.util.showMsg(Lang.locationRetrievalError);
																}
												});
								}else{
												// Clean the store if there is any previous data
												store.removeAll();
												loadPlaces();
								}
				},

				/**
					* Show Home Panel
					**/
				showHome : function(){
								var me = this;

								if(me.getMain().getActiveItem() !== me.getCategoriesList()){
												me.util.showActiveItem(me.getMain(), me.getCategoriesList());
								}
				},

				/**
				 * Show places container
				 */
				showPlacesContainer : function(type){
								var me = this,
								name = me.util.toTitleCase(type.split('_').join(' '));

								if(!me.getPlacesContainer()){
												this.getMain().add({
																xtype : 'places'
												});	
								}								

								// Set the placelist title to Category name
								Ext.each(me.getPlacesContainer().query('titlebar'), function(titleBar){
												titleBar.setTitle(name);
								}, me);
								
								me.getPlacesContainer().setActiveItem(0);
								me.util.showActiveItem(me.getMain(), me.getPlacesContainer());		
				},

				/**
				 * Show place list
				 */
				showPlaceList : function(){
								var me = this;

								me.util.showActiveItem(me.getPlacesContainer(), me.getPlaceList(), {
												type : 'flip',
												reverse : true
								});
				},

				/**
				 * Show places map
				 */
				showPlacesMap : function(){
								var me = this;

								if(!me.getPlaceMapPanel()){
												me.getPlacesContainer().add({
																xtype : 'placemappanel'
												});
								}
								
								// Get the active category type and set it to title after changing to titlecase
								me.getPlaceMapPanel().down('titlebar').setTitle(me.util.toTitleCase(me.activeCategoryType.split('_').join(' ')));

								me.util.showActiveItem(me.getPlacesContainer(), me.getPlaceMapPanel(), {
												type : 'flip'
								});
				},

				/**
				 * Create markers for user's location and all the 
					* places. On clicking a marker, show Infobubble with details
					*/
				showPlacesMarkers : function(extMap, gMap){
								var me = this,
								location, data, marker,
								userLocation = me.util.userLocation.split(','),
								currentPosition = new google.maps.LatLng(userLocation[0], userLocation[1]),

								image = new google.maps.MarkerImage('resources/images/marker.png',
												new google.maps.Size(32, 32),
												new google.maps.Point(0,0)
												),

								// Create an InfoBubble instance				
								ib = new InfoBubble({
												shadowStyle: 1,
												padding: 0,
												backgroundColor: 'rgb(0,0,0)',
												borderRadius: 4,
												arrowSize: 15,
												borderWidth: 1,
												borderColor: '#000',
												disableAutoPan: true,
												hideCloseButton: true,
												arrowPosition: 30,
												backgroundClassName: 'infobubble',
												arrowStyle: 2
								}),
								/*
								 * Showing InfoBubble
								 **/ 
								setupInfoBubble = function (data, _marker) {
												google.maps.event.addListener(_marker, 'mousedown', function (event) {
																// Close existing info bubble if any
																if(ib){
																				ib.close();
																}
																
																// Kepp an instance of the active place's id in 
																// the infobubble instance for accessing it later
																ib.placeReference = data.reference;

																// Set teh content of infobubble
																ib.setContent([
																				'<div class="infobubble-content">',
																				data.name,
																				'</div>'
																				].join(''));

																ib.open(gMap, this);
												});
								};

								/**
								* Tap on InfoBubble handled here
								*/
								google.maps.event.addDomListener(ib.bubble_, 'click', function () {
												if(me.activeCategoryType){
																me.redirectTo('categories/' + me.activeCategoryType + '/' + ib.placeReference);
												}
								});

								// For all the places create separate markers
								me.getPlaceList().getStore().each(function(record){
												data = record.getData(),
												location = data.geometry.location,
												marker = new google.maps.Marker({
																position: new google.maps.LatLng(location.lat, location.lng), 
																map: gMap, 
																icon : image
												});

												setupInfoBubble(data, marker);												
								}, me);
								
								
								// Create a different marker for user's current location
								new google.maps.Marker({
												position: currentPosition, 
												map: gMap, 
												icon : new google.maps.MarkerImage('resources/images/currentlocation.png',
																new google.maps.Size(32, 32),
																new google.maps.Point(0,0)
																)
								});
								
								// Center the map at user's location. A delay is given because from 
								// second time onward it doesn't center the map at user's position
								Ext.defer(function(){
												gMap.setCenter(currentPosition);
								}, 100);
				},

				/**
				 * The categories need to be 
				 */
				checkCategories : function(action){
								var categoryStore = Ext.getStore('Categories');

								// If the categories aren't loaded yet, then wait and 
								// call the getPlaces method only while its fully loaded. 
								// This comes handy while user opens url directly like this: locator/#categories/atm
								if(categoryStore.getCount() === 0){
												categoryStore.on('load', function(){
																action.resume();
												});
								}else{
												action.resume();
								}
				}
});