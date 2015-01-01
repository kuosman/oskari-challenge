/**
* @class Oskari.challenge.bundle.oskari.OskariExamplesBundle
* 
*/
Oskari.clazz.define("Oskari.challenge.bundle.oskari.OskariExamplesBundle", function() {
	
}, {
	"create" : function() {
		return Oskari.clazz.create("Oskari.challenge.bundle.oskari.OskariExamplesBundleInstance");
	},
	"start" : function() {
	},
	"stop" : function() {
	},
	"update" : function(manager, bundle, bi, info) {
		
	}
}, {
	"protocol" : ["Oskari.bundle.Bundle", "Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
	"source" : {
		
		"scripts" : [
		    {
                "type" : "text/javascript",
                "src" : "../../../../libraries/knockout/knockout-3.2.0.js"
            },
		    {
                "type" : "text/javascript",
                "src" : "../../../../libraries/fancybox/2.1.5-0/jquery.fancybox.pack.js"
            },
            {
                "type" : "text/css",
                "src" : "../../../../libraries/fancybox/2.1.5-0/jquery.fancybox.css"
            },
			{
				"type" : "text/javascript",
				"src" : "../../../../bundles/challenge/bundle/oskari-examples/instance.js"
			},
			{
				"type" : "text/css",
				"src" : "../../../../resources/challenge/bundle/oskari-examples/css/style.css"
			}, 
			{
				"language" : "fi",
				"type" : "text/javascript",
				"src" : "../../../../bundles/challenge/bundle/oskari-examples/locale/fi.js"
			},{
				"language" : "en",
				"type" : "text/javascript",
				"src" : "../../../../bundles/challenge/bundle/oskari-examples/locale/en.js"
			},{
				"language" : "sv",
				"type" : "text/javascript",
				"src" : "../../../../bundles/challenge/bundle/oskari-examples/locale/sv.js"
			}],
		"resources" : []
	},
	"bundle" : {
		"manifest" : {
			"Bundle-Identifier" : "oskari-examples",
			"Bundle-Name" : "oskari-examples",
			"Bundle-Author" : [{
				"Name" : "Marko Kuosmanen",
				"Organisation" : "",
				"Temporal" : {
					"Start" : "2014",
					"End" : "2014"
				},
				"Copyleft" : {
					"License" : {
						"License-Name" : "EUPL",
						"License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
					}
				}
			}],         
			"Bundle-Version" : "1.0.0",
			"Import-Namespace" : ["Oskari"],
			"Import-Bundle" : {}
		}
	}
});

Oskari.bundle_manager.installBundleClass("oskari-examples", "Oskari.challenge.bundle.oskari.OskariExamplesBundle");