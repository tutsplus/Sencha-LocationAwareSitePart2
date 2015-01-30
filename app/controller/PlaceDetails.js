Ext.define('Locator.controller.PlaceDetails', {
				extend : 'Ext.app.Controller',
				util : Locator.util.Util,
				config : {
								routes: {
												'categories/:type/:reference' : 'showDetails'
								},
								
								refs : {
												main : 'main',
												placeDetailsPanel : 'detailspanel'	,
												
												placeDetailsInfo : 'info',
												placeDetailsGallery : 'gallery',
												placeDetailsReview : 'review'
								},
				
								control : {
												placeDetailsReview : {
																initialize : 'handleReviewExpansion'
												}
								}
				},
				
				/**
					* Maintain details panel routes and show the details panel
					*/
				showDetails : function(categoryType, placeReference){
								var me = this;
																
								if(!me.getPlaceDetailsPanel()){
												me.getMain().add({
																xtype : 'detailspanel'
												});
								}
								
								me.util.showActiveItem(me.getMain(), me.getPlaceDetailsPanel());
								
								// Load place data
								me.loadPlaceDetails(placeReference);
								
								// Fire the category change and place change events 
								// so that the category id and place reference can be kept
								// which is needed if users press back button
								me.getApplication().fireEvent('categorychange', categoryType);
								me.getApplication().fireEvent('placechange', placeReference);
				},
				
				/**
					* Load the complete details of the place 
					* and apply the details to all the panels' template in the tabpanel
					*/
				loadPlaceDetails : function(placeReference){
								var me = this;
								
								me.util.showLoading(me.getPlaceDetailsPanel(), true);
								
								Ext.Ajax.request({
												url : me.util.api.baseUrl,
												method : 'GET',
												params : {
																action : me.util.api.details,
																reference : placeReference,
																key : me.util.API_KEY,
																sensor : true
												},
												success : function(response){
																me.util.showLoading(me.getPlaceDetailsPanel(), false);
																var json = me.currentLocation = Ext.decode(response.responseText);
																
																// Apply the data in panel templates
																me.getPlaceDetailsInfo().setData(json.result);
																me.getPlaceDetailsGallery().setData(json.result);
																me.getPlaceDetailsReview().setData(json.result);
																
																// CShow the location of the place as a marker
																me.showPlaceLocation();
												},
												failure : function(){
																me.util.showMsg(Lang.serverConnectionError);
												}
								});
				},

				/**
					* Create the map and show a marker for that position in the map
					*/
				showPlaceLocation : function(){
								var me = this,
								showMarker = function(){
												var location = me.currentLocation.result.geometry.location,
												latLng = new google.maps.LatLng(location.lat,location.lng),
												image = new google.maps.MarkerImage('resources/images/marker.png',
																new google.maps.Size(32, 32),
																new google.maps.Point(0,0)
																);
																				
												// Create the marker for that place								
												me.singleMapMarker = new google.maps.Marker({
																position: latLng, 
																map: me.gmap,
																icon : image
												});
												
												// Set the marker to center. A timeout is needed in order to 
												// bring the marker at center. Else, it will be shown at top-left corner
												Ext.defer(function(){
																me.gmap.setCenter(latLng);
												}, 100);
												
								};
								
								if(me.singleMap){
												me.singleMap.destroy();
								}
								
								// Create a map and render it to certain element
								me.singleMap = Ext.create('Ext.Map', {
												renderTo : 	me.getPlaceDetailsInfo().element.down('.map'),
												height : 140,
												mapOptions : {
																zoom : 15
												},
												listeners : {
																maprender : function(mapCmp, gMap){
																				me.gmap = gMap;
																				showMarker();
																}
												}
								});
				},
				
				/**
				 * Handle text expansion of long reviews. 
				 */
				handleReviewExpansion : function(panel){
								panel.element.on('singletap', function(e, el){
												el = Ext.get(el),
												textEl = el.parent('.text');
																								
												// If "more" is pressed, get the complete text from hidden element and a "less" button 
												if(el.getAttribute('data-action') === 'more'){
																textEl.setHtml(textEl.next('.full-review').getHtml() + ' <span data-action="less" class="resize-action">less</span>');
												}
																								
												// If "less" is pressed, ellipsis the text and show												
												if(el.getAttribute('data-action') === 'less'){
																textEl.setHtml(Ext.String.ellipsis(textEl.getHtml(), 120) + ' <span data-action="more" class="resize-action">more</span>');
												}
								}, this, {
												delegate: '.resize-action'
								});
				}
});