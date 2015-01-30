Ext.define('Locator.view.details.Gallery', {
				extend: 'Ext.Container',
				xtype: 'gallery',
				config: {
								title : Lang.gallery,
								iconCls : 'photos2',
								cls : 'transparent gallery',
								scrollable : true,
								// Template to show the thumbnail images
								tpl : Ext.create('Ext.XTemplate', 
												'<tpl if="this.isEmpty(values)">',
												'<div class="empty-text empty-gallery">', Lang.placeDetails.emptyGallery, '</div>',
												'</tpl>',
												'<div class="gallery body" id="photos">',
												'<tpl for="photos">',
												'<img src="{url}" class="thumbnail" />',
												'</tpl>',
												'</div>', {
																isEmpty : function(result){
																				if(!result.photos || result.photos.length === 0){
																								return true;
																				}
																				
																				return false;
																}
												})
				},
				
				initialize : function(){
								var me = this;
								
								// Add tap event on the images to open the carousel
								me.element.on('tap', function(e, el){
												me.showGalleryCarousel(el);												
								}, me, {
												delegate : 'img.thumbnail'
								});
								
								me.callParent(arguments);
				},
				
				/**
				 * Show the gallery carousel with all the images
				 */
				showGalleryCarousel : function(clickedImage){
								var me = this,
								clickedImgIndex = 0;
								
								// Query all the images and save in an array
								me.images = me.element.query('img.thumbnail');
								
								// Create the Gallery Carousel
								var galleryCarousel = Ext.Viewport.add({
												xtype : 'gallerycarousel',
												images : me.images
								});
								
								// On clicking close icon, hide the carousel 
								// and destroy it after a certain perdiod
								galleryCarousel.element.on('tap', function(e, el){
												galleryCarousel.hide(true);
												
												Ext.defer(function(){
																Ext.Viewport.remove(galleryCarousel);
												}, 300);
								}, this, {
												delegate : 'div[data-action="close_carousel"]'
								});
								
								// Get the image index which is clicked
								while( (clickedImage = clickedImage.previousSibling) != null ) {
												clickedImgIndex++;
								}								
								
								// Set the clicked image container as the active item of the carousel
								galleryCarousel.setActiveItem(clickedImgIndex);
								
								// Show the carousel
								galleryCarousel.show();
				}
});
