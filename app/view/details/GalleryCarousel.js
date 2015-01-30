Ext.define('Locator.view.details.GalleryCarousel', {
				extend : 'Ext.carousel.Carousel',
				xtype : 'gallerycarousel',
				config : {
								fullscreen : true,
								modal : true,
								images : [],
								html : '<div class="close-gallery" data-action="close_carousel"></div>',
								cls : 'gallery-carousel',
								showAnimation : 'popIn',
								hideAnimation : 'popOut',
								indicator : false,
								listeners : {
												initialize : 'changeImageCount',
												
												// Call image count checker for each image change
												activeitemchange : 'changeImageCount'
								}
				},
				
				initialize : function(){
								var me = this,
								images = me.getImages();
								
								// Create a bottom bar which will show the image count
								me.bottomBar = Ext.create('Ext.TitleBar', {
												xtype : 'titlebar',
												name : 'info_bar',
												title : '',
												docked : 'bottom',
												cls : 'gallery-bottombar',
												items : [{
																xtype : 'button',
																align : 'left',
																iconCls : 'nav gallery-left',
																ui : 'plain',
																handler : function(){
																				me.previous();
																}
												}, {
																xtype : 'button',
																align : 'right',
																iconCls : 'nav gallery-right',
																ui : 'plain',
																handler : function(){
																				me.next();
																}
												}]
								});
								
								// Add the images as separate containers in the carousel
								for(var i=0; i<images.length; i++){
												me.add({
																xtype : 'container',
																html : '<img class="gallery-item" src="' + images[i].src + '" />',
																index : i + 1
												});
								}			
								
								me.add(me.bottomBar);								
								me.callParent(arguments);
				},
				
				/**
				 * Change image count at bottom bar
				 */
				changeImageCount : function(){
								var me = this;								
								me.bottomBar.setTitle((me.getActiveIndex() + 1) + ' of ' + me.getImages().length);
				}
});

