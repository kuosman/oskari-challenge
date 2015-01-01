/**
* @class Oskari.challenge.bundle.oskari.OskariExamplesBundleInstance
*
* Oskari.challenge.bundle.oskari.OskariExamplesBundleInstance.
*/
Oskari.clazz.define("Oskari.challenge.bundle.oskari.OskariExamplesBundleInstance",
	
	/**
	* @method create called automatically on construction
	* @static
	*/
	function() {
    	this.sandbox = null;
    	this.started = false;
    	this._localization = null;
    	this.requestHandlers = {};
    	this.viewModel = {
            query: ko.observable('')
        };
    	
    	this.examples = [];
    	this.timers = {
    	    windowResized: null,
    	    viewRow: null
    	};
    	
    	this.fancyboxSizes = {
    	    width: 1000,
    	    height: 800
    	};
    	
    	this.templateSearch = jQuery('<div class="oskari__challenge__examples__search_container">'+
    	    '<div class="oskari__challenge__examples__search__container__title"></div>'+
    	    '<div class="oskari__challenge__examples__search__container__inputs">'+
	        '<input class="oskari__challenge__examples__search__container__inputs__input" type="search" name="q" data-bind="value: query, valueUpdate: \'keyup\'" autocomplete="off"></input>'+
	        '<input class="oskari__challenge__examples__search__container__inputs_reset" value="" type="reset" data-bind="click: clearSearch"/>'+	        
    	    '</div>'+
    	    '</div>');
    	this.templateSearchResults = jQuery('<div class="oskari__challenge__examples__results">'+
	        '<!-- ko if: examples().length>0 -->' + 
	        '<div data-bind="template: {name:\'example\', foreach:examples}"></div>' +
	        '<!-- /ko -->'+
	        '<!-- ko ifnot: examples().length>0 -->'+
	        '<div class="oskari__challenge__examples__noresults"></div>'+
	        '<!-- /ko -->'+
	        '</div>');
    	this.knockOutViewTemplate = jQuery('<script type="text/html" id="example">' +
	        '<!--<pre data-bind="text: ko.toJSON($data, null, 2)"></pre>-->' +
	        '<div class="oskari__challenge__examples__view" data-bind="click: $parent.openDemo">' +
	        '<img class="oskari__challenge__examples__view__image" width="200px" height="120px" data-bind="attr:{src: $parent.getImageURL($data) }" />' +
            '<div class="oskari__challenge__examples__view__title" data-bind="text: $parent.getTitle($data)"></div>' +
            '<div class="oskari__challenge__examples__view__description oskari__examples_margintop oskari__examples_paddingleft oskari__examples_paddingright" data-bind="text: $parent.getShortDescription($data)"></div>' +
            '<div class="oskari__challenge__examples__view__keywords__title oskari__examples_margintop oskari__examples_paddingleft oskari__examples_paddingright">'+this.getLocalization('display').keywords+':' + 
                '<span class="oskari__challenge__examples__view__keywords" data-bind="text: $parent.getKeywords($data)"></span>' +
            '</div>' +
            '<div class="oskari__challenge__examples__view__demo__site oskari__examples_margintop oskari__examples_paddingleft oskari__examples_paddingright">' +
                '<a class="iframe oskari__challenge__examples__view__demo__site__url" data-bind="click: $parent.openDemo">' +this.getLocalization('display').open_url_link_text +'</a>' +
            '</div>' +
            '</div>' +
    	    '</script>');
	}, {
		/**
		* @static
		* @property __name
		*/
		__name : 'OskariExamplesBundle',
		
		/**
		* @method getName
		* @return {String} the name for the component 
		*/
		getName : function() {
			return this.__name;
		},
		/**
		* @method getLocalization
		* Returns JSON presentation of bundles localization data for
		* current language.
		* If key-parameter is not given, returns the whole localization
		* data.
		*
		* @param {String} key (optional) if given, returns the value for
		*	key
		* @return {String/Object} returns single localization string or
		*	JSON object for complete data depending on localization
		*	structure and if parameter key is given
		*/
		getLocalization : function(key) {
			if(!this._localization) {
				this._localization = Oskari.getLocalization(this.getName());
			}
			if(key) {
				return this._localization[key];
			}
			return this._localization;
		},
		/**
		* @method setSandbox
		* @param {Oskari.mapframework.sandbox.Sandbox} sandbox
		* Sets the sandbox reference to this component
		*/
		setSandbox : function(sbx) {
			this.sandbox = sbx;
		},
		/**
		* @method getSandbox
		* @return {Oskari.mapframework.sandbox.Sandbox}
		*/
		getSandbox : function() {
			return this.sandbox;
		},
		/**
		* @method start
		* BundleInstance protocol method
		*/
		start : function() {
			var me = this;
			if(me.started){
				return;
			}
			var conf = me.conf;
			
			me.started = true;
			
			var conf = this.conf;
			var locale = this.getLocalization('display');
			
			jQuery.ajax({
			    type: 'GET',
                dataType: 'json',
                url: 'oskari_examples.json',
                success: function (data) {
                    me.examples =  data.examples;
                    jQuery('.oskari__challenge__examples__noresults').show();
                    me._addKnockoutJS();
                },
                error: function (xhr, status, error) {
                }
            });
						
			var search = me.templateSearch.clone();
			var searchResults = me.templateSearchResults.clone();
			
			
			var bindTo = jQuery('.oskari__challenge__examples');
			if(bindTo.length==0){
			    jQuery('body').append('<div class="oskari__challenge__examples"></div>');
			    var bindTo = jQuery('.oskari__challenge__examples');
			}
			
			search.find('.oskari__challenge__examples__search__container__title').html(locale.title);
			search.find('.oskari__challenge__examples__search__container__inputs__input').attr('placeholder', locale.input_placeholder);
			search.find('.oskari__challenge__examples__search__container__inputs_reset').attr('title', locale.input_clear);
			searchResults.find('.oskari__challenge__examples__noresults').html(locale.no_results);
			
			bindTo.append(search);
			bindTo.append(searchResults);
		},
		/**
		 * Add KnockoutJS.
		 * @method
		 * @private
		 */
		_addKnockoutJS: function(){
		    var me = this;
		    var knockoutView = me.knockOutViewTemplate.clone();
		    jQuery('body').append(knockoutView);
		    
		    var oskariLang = Oskari.getLang();
		    
		    // All examples. Filtered by query.
		    me.viewModel.examples = ko.dependentObservable(function() {
                var search = this.query().toLowerCase();
                me._calculateRowHeightsWithTimer(true);
                return ko.utils.arrayFilter(me.examples, function(example) {
                    if(example[oskariLang] && example[oskariLang].keywords){
                        return example[oskariLang].keywords.join(', ').toLowerCase().indexOf(search) >= 0;
                    } 
                    else if(example.defaultLanguage){
                        var defaultLang = example.defaultLanguage;
                        return example[defaultLang].keywords.join(', ').toLowerCase().indexOf(search) >= 0;
                    } else {
                         return example.keywords.join(', ').toLowerCase().indexOf(search) >= 0;
                    }                    
                });
            }, me.viewModel);
            
		    // Clear search click.
            me.viewModel.clearSearch = function(){
                me.viewModel.query('');
                me._calculateRowHeightsWithTimer();
                return false;
            };
            
            // Open demo page click.
            me.viewModel.openDemo= function(example){
                var demoUrl = '';
                
                if(example[oskariLang] && example[oskariLang].demoURL){
                    demoUrl = example[oskariLang].demoURL;
                } 
                else if(example.defaultLanguage){
                    var defaultLang = example.defaultLanguage;
                    demoUrl = example[defaultLang].demoURL;
                } else {
                     demoUrl = example.demoURL;
                }
                
                
                jQuery.fancybox.open({
                    href: demoUrl,
                    hideOnContentClick: true,
                    type: 'iframe',
                    width: me.fancyboxSizes.width,
                    height: me.fancyboxSizes.height,
                    autoSize: false
                });
                return false;
            };
            
            // Get image URL.
            me.viewModel.getImageURL = function(example){
                if(example[oskariLang] && example[oskariLang].imageURL){
                    return example[oskariLang].imageURL;
                } 
                else if(example.defaultLanguage){
                    var defaultLang = example.defaultLanguage;
                    return example[defaultLang].imageURL;
                } else {
                     return example.imageURL;
                }
            };
            
            // Get title.
            me.viewModel.getTitle = function(example){
                if(example[oskariLang] && example[oskariLang].title){
                    return example[oskariLang].title;
                } 
                else if(example.defaultLanguage){
                    var defaultLang = example.defaultLanguage;
                    return example[defaultLang].title;
                } else {
                     return example.title;
                }
            };
            
            // Get short description.
            me.viewModel.getShortDescription = function(example){
                if(example[oskariLang] && example[oskariLang].shortDescription){
                    return example[oskariLang].shortDescription;
                } 
                else if(example.defaultLanguage){
                    var defaultLang = example.defaultLanguage;
                    return example[defaultLang].shortDescription;
                } else {
                     return example.shortDescription;
                }
            };
            
            // Get keywords.
            me.viewModel.getKeywords = function(example){
                if(example[oskariLang] && example[oskariLang].keywords){
                    return example[oskariLang].keywords.join(', ');
                } 
                else if(example.defaultLanguage){
                    var defaultLang = example.defaultLanguage;
                    return example[defaultLang].keywords.join(', ');
                } else {
                     return example.keywords.join(', ');
                }
            };
            
            ko.applyBindings(me.viewModel);
            
            jQuery(window).resize(function () {
                me._calculateRowHeightsWithTimer();
            });
            
            me._calculateRowHeightsWithTimer();
		},
		/**
		 * Calculate row heights with timer.
		 * @method
		 * @private
		 */
		_calculateRowHeightsWithTimer: function(){
		    var me = this;
		    window.clearTimeout(me.timers.windowResized);
            me.timers.windowResized = window.setTimeout(function () {
                me._calculateRowHeights();
            }, 200);
		},
		/**
		 * Calculate row heights.
		 * @method
		 * @private
		 */
		_calculateRowHeights:  function () {
		    var me = this;            
            clearTimeout(me.timers.viewRow);
            
            var fixedHeight = jQuery('.oskari__challenge__examples__view__demo__site').height() + 10; 
            
            me.timers.viewRow = setTimeout(function () {
                jQuery('.oskari__challenge__examples__view').css({'height':'300px'});                
                
                var startPosition = jQuery('.oskari__challenge__examples__view:visible:first').position(),
                    rowView = [],
                    rowHeight = 0,
                    positions = [];

                var visibleViews = jQuery('.oskari__challenge__examples__view:visible');
                jQuery.each(visibleViews, function (index) {
                    positions.push(jQuery(this).position());
                });

                jQuery.each(visibleViews, function (index) {
                    // hide viev when calculate
                    jQuery(this).css({ height: 'auto', visibility: 'hidden' });

                    // get view height and position
                    var height = jQuery(this).height()+fixedHeight,
                        position = positions[index];
                    
                    // if view is first in the row
                    if (position.left === startPosition.left) {
                        // handle posible previous row
                        if (rowView.length > 0) {
                            jQuery(rowView).height(rowHeight).css({ visibility: 'visible' });
                        }

                        // start new row
                        rowView = [this];
                        rowHeight = height;
                    } else {
                        // add view to row
                        rowView.push(this);
                        rowHeight = height > rowHeight ? height : rowHeight;
                        
                    }
                });
                // handle last row 
                if (rowView.length > 0) {
                    jQuery(rowView).height(rowHeight).css({ visibility: 'visible' });
                }
            }, 0);
        },
		/**
		* @method stop
		* BundleInstance protocol method
		*/
		stop : function() {
			var sandbox = this.sandbox();
			for(p in this.eventHandlers) {
				sandbox.unregisterFromEventByName(this, p);
			}
			
			this.sandbox.unregister(this);
			this.started = false;
		},
		/**
		* @method init
		* implements Module protocol init method - initializes request handlers
		*/
		init : function() {
			
		},
		/**
		* @method update
		* BundleInstance protocol method
		*/
		update : function() {
		}
	}, {
	/**
	* @property {String[]} protocol
	* @static 
	*/
	protocol : ['Oskari.bundle.BundleInstance']
});