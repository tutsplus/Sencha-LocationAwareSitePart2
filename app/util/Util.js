Ext.define('Locator.util.Util', {
				singleton: true,
				enablePageAnimations : true,
				defaultUserImage : "resources/images/user.jpg",
				userLocation : null,
				API_KEY : 'AIzaSyBmbmtQnXfq22RJhJfitKao60wDgqrC5gA',
				
				defaultSearchRadius : 500,
				defaultLocation : '-33.8670522,151.1957362',
				amimationDuration : 100,
				
				listImageMaxWidth : 300,
				listImageMaxHeight : 300,
				
				api : (function(){
								//var baseUrl = 'https://maps.googleapis.com/maps/api/place/';
								var baseUrl = 'php/action.php';
								return {
												baseUrl : baseUrl,
												categories : 'resources/data/categories.json',
												nearestPlaces : baseUrl + '',
												nearBySearch : 'nearbysearch',
												photo : 'photo',
												details : 'details'
								}
				})(),  
				
				destroyCmp : function(child, parent){
								parent = parent || Ext.Viewport;
								
								if(child){
												Ext.defer(function(){
																parent.remove(child);
												}, Locator.util.Util.animDuration);
								}
				},
    
				
				showMsg : function(msg, title, cb, scope){
								if(msg){
												Ext.Msg.alert(title || 'Error', msg.toString(), cb || function(){}, scope || window);
								}
        
								return this;
				},
    
				showActiveItem : function(parentPanel, childPanel, animation){
								animation = Ext.apply({
												type : 'fade',
												duration : this.amimationDuration
								}, animation || {});
								
								if(parentPanel && childPanel){
												if(this.enablePageAnimations && animation && animation.type){
																parentPanel.animateActiveItem(childPanel, animation);
												}else{
																parentPanel.setActiveItem(childPanel);
												}
								}
        
								return this;
				},
    
				showLoading: function(panel, doShow, message){
								if(panel){
												if(doShow){
																panel.setMasked({
																				xtype : 'loadmask',
																				message : message || 'Loading...'
																});
												}else{
																panel.setMasked(false);
												}
								}
        
								return this;
				},
				
				destroyContainer : function(container,duration){
								Ext.Function.defer(Ext.destroy,(duration||250),this,[container]);
				},
				
				showAlertBox : function(msg){
								var alertBox = Ext.create('Ext.Container',{
												cls : 'alert-box-container',
												centered : true,
												showAnimation : 'fadeIn',
												hideAnimation : 'fadeOut',
												html : msg
								})
								Ext.defer(function(){
												Ext.Viewport.add(alertBox);
								},300)
        
								Ext.defer(function(){
												alertBox.destroy()
								},1500)
				},
    
				getRating : function(rating, max, hideRatingValue){
								if(rating !== undefined){
												var str = '<div class="ratings">';
												rating = parseFloat(rating);
												max = max || 5;

												for(var i=1; i<=max; i++){
																if(i <= rating){
																				str += '<div class="star full-star"></div>';
																}
                
																if(i > rating){
																				if(rating % 1 !== 0 && (i - rating) < 1 ){
																								str += '<div class="star half-star"></div>';
																				}else{
																								str += '<div class="star no-star"></div>';
																				}
																}
												}
            
												if(!hideRatingValue){
																str += '<div class="value">' + rating + '</div>';
												}
												
												str += '</div>';
             
												return str;
								}
         
								return Lang.noRating;
				},
				
				toTitleCase : function (str){				
								if(!str){
												return '';
								}
								
								return str.replace(/\w\S*/g, function(txt){
												return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
								});
				},
				
    /**
     * Give the date a format like 2 hours ago, 5 mins ago
     */
				prettyDate : (function() { 
								var ints = {
												second: 1,
												minute: 60,
												hour: 3600,
												day: 86400,
												week: 604800,
												month: 2592000,
												year: 31536000
								};
 
								return function(time) {
 
												time = +new Date(time);
 
												var gap = ((+new Date()) - time) / 1000,
												amount, measure;
 
												for (var i in ints) {
																if (gap > ints[i]) {
																				measure = i;
																}
												}
 
												amount = gap / ints[measure];
												amount = gap > ints.day ? (Math.round(amount * 100) / 100) : Math.round(amount);
												amount = Math.ceil(amount);
												amount += ' ' + measure + (amount > 1 ? 's' : '') + ' ago';
 
												return amount;
								};
 
				})(),
				
				onBrokenProfileImage : function(image){
								image.onerror = "";
								image.src = Locator.util.Util.defaultUserImage;
								return true;
				}
});