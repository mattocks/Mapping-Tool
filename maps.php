<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd"> 
 
<html lang="en"> 
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" /> 
	<meta name="apple-mobile-web-app-capable" content="yes" /> 
	<title>Mapping Tool</title> 
	<link rel="stylesheet" href="cartagen/style.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
	<link rel="stylesheet" href="knitter.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
	<!--[if IE]><script type="text/javascript" src="cartagen/excanvas.js"></script><![endif]--> 
	<script type="text/javascript"> 
		cartagen_base_uri = '/cartagen'
	</script> 
	<script src="cartagen/cartagen.js" type="text/javascript" charset="utf-8"></script> 
		<link rel="stylesheet" href="modalbox/modalbox.css" type="text/css" media="screen" title="no title" charset="utf-8"> 
		<script type="text/javascript" src="modalbox/lib/scriptaculous.js?load=builder,effects"></script> 
		<script src="modalbox/modalbox.js" type="text/javascript" charset="utf-8"></script> 
	<meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/> 
	<script type="text/javascript" charset="utf-8"> 
		Cartagen.setup({
			stylesheet: "styles/rio.gss",
			static_map: false,
			padding_top: -46,
			lat: -22.986,
			lng: -43.19,
			zoom_level: 0.52,
			map_name: 'Test'
		})
		var Knitter = {
			save_new_location: function(lat,lon,zoom) {
				new Ajax.Request('map/update/'+61,{
					method: 'get',
					parameters: {
						lat: lat,
						lon: lon,
						zoom: zoom
					}
				})
			},
			save_current_location: function(callback) {
				Knitter.save_new_location(Map.lat,Map.lon,Map.zoom)
				if (!Object.isUndefined(callback)) callback()
			}
		}
		Cartagen.Builder = {
			name: 'port',
			gss: {},
			add_menus: function() {
				$l('adding knitter')
				Style.load_styles('knitter.gss')
			},
			add_style: function(feature) {
				Cartagen.Builder.editing = feature
				if (feature.__type__) $('editing').innerHTML = feature.__type__+'s'
				$('wysiwyg').show()
			}
		}
		document.observe('styles:loaded:/styles/main.gss',Cartagen.Builder.add_menus)
		function setup() {
			warpables = [
				
			]
			var first_new_image = true
			warpables.each(function(warpable,index) {
				if (warpable.nodes != 'none') {
					// nodes as [[lon,lat],[lon,lat]]
					Warper.load_image(warpable.img,warpable.nodes,warpable.id,warpable.locked);
				} else {
					if (first_new_image) Warper.new_image(warpable.img,warpable.id,false);
					else Warper.new_image(warpable.img,warpable.id,true)
					first_new_image = false
				}
			})
			Warper.sort_images()
			if (Config.fullscreen) {
				$('header').hide()
				Config.padding_top = 0
			}
			if (Config.locked == 'true') {
				Warper.locked = true
			}
		}
		document.observe('cartagen:init', setup)
		// load in the landmarks
		document.observe("dom:loaded", function() {
			new Ajax.Request('cartagen/php/tooltips.php', {
				method: 'get',
				parameters: {
					lang: 'en',
				}
			})
			/*
			if(location.search.toQueryParams().map){
				MapEditor.load(location.search.toQueryParams().map)
			}
			else{
				MapEditor.load(1, true)
			}
			*/
			$('main').observe('mousemove', Landmark.check) // hand pointer over landmarks
			$('zoombar').style.display = 'inline'	
		})

	</script> 
</head> 
<body> 

<div id="google" style="display:none;"></div> 
 
<div id="browsers" style="display:none;"> 
	<h3>WHOOPS</h3> 
	<p>Cartagen is built on standards-compliant HTML 5 and Canvas, but is in beta stage right now. It works best in Firefox, but IE8, Chrome, Safari, Mobile Safari, and Android are coming ASAP!</p> 
</div> 

<div id="header"> 
	<!--
	<div id="toolbars" style="position: relative; left: 200px">
	<a name="Upload media" href="javascript:void(0);"><img src="images/icons/upload_media.gif" width="29" height="35" /></a>
	<a name="Select a landmark" href="javascript:void(0);"><img src="images/icons/select_kindofinfodisplayed.gif" width="35" height="42" /></a>
	</div>
	-->
	<a style="float:left;" href="./"><img src="images/cartagen-dark.png"/></a> 
	<script type="text/javascript" charset="utf-8"> 
		function find(q) {
			q = q.replace(' ','-')
			document.location = "/find/"+q
		}
	</script> 
	<div id="toolbars"> 
	<!-- Currently loaded by tooltips.php
		<div class="toolbar"> 
            <a name='Download image' class='first silk' href="javascript:void(0);" onClick="Cartagen.redirect_to_image()"><img src="images/silk-grey/disk.png" /></a> 
            <a name='Embed this map on your site' class='silk' href="javascript:void(0);" onClick="Interface.display_knitter_iframe()"><img src="images/silk-grey/page_white_code.png" /></a> 
            <a name='Edit GSS' class='silk' href="javascript:void(0);" onClick="$('styles').toggle()"><img src="images/silk-grey/page_edit.png" /></a>
            <a name='Upload an image' class='last silk' href="/warper/new_iframe" onClick="Modalbox.show('<iframe src =\'/warper/new/61\' width=\'100%\' height=\'300\' style=\'border:0;\'></iframe>', {title: 'Select an image to upload', width: 600});Tool.change('Warp');return false;"><img src="images/silk-grey/photo_add.png" /></a> 
    	</div> 
    	<div class="toolbar"> 
            <a name='Pan the map' id="pan" class='first' href="javascript:void(0);" onClick="Tool.change('Pan');"><img src="images/tools/stock-tool-move-22.png" /></a> 
            <a name='Create a rectangle' id="rectangle" class='silk' href="javascript:void(0);" onClick="LandmarkEditor.beginShape('Rectangle')"><img src="images/tools/stock-tool-rect-select-22.png" /></a>
            <a name='Create an ellipse' id="ellipse" class='silk' href="javascript:void(0);" onClick="LandmarkEditor.beginShape('Ellipse')"><img src="images/tools/stock-tool-ellipse-select-22.png" /></a>
            <a name='Create a region' class='silk' href="javascript:void(0);" onClick="Tool.change('Region');LandmarkEditor.beginArea()"><img src="images/silk-grey/shape_handles.png" /></a>
            <a name='Create a path' class='silk' href="javascript:void(0);" onClick="Tool.change('Path');LandmarkEditor.beginPath()"><img src="images/tools/stock-tool-pencil-22.png" /></a>
            <a name='Freeform region' class='silk' href="javascript:void(0);" onClick="Tool.change('Freeform');Tooltips.beginFreeform()"><img src="images/tools/stock-tool-paintbrush-22.png" /></a>	
            <a name='Create a landmark' class='silk' href="javascript:void(0);" onClick="Tool.change('Landmark');LandmarkEditor.begin()"><img src="images/tools/stock-tool-smudge-22.png" /></a> 
            <a name='Move a landmark' class='silk' href="javascript:void(0);" onClick="Landmark.toggleMove()" id="mover"><img src="images/tools/stock-tool-align-22.png" /></a> 
            <a name='Measure' class='last silk' href="javascript:void(0);" onClick="Tool.Measure.new_shape()"><img src="images/silk-grey/calculator.png" /></a> 
    	</div> 
    	<div class="toolbar"> 
            <a name='Save current location' class='first silk' href="javascript:void(0);" onClick="Knitter.save_current_location()"><img src="images/silk-grey/map.png" /></a> 
            <a name='Geolocate your current position' class='silk' id="geolocate"  href="javascript:void(0);" onClick="if (User.geolocate()) {Cartagen.go_to(User.lat,User.lon,2)}"><img src="images/silk-grey/house.png" /></a> 
            <script type="text/javascript" charset="utf-8">if (!User.geolocate()) $('geolocate').hide()</script> 
            <a name='Search for a new location' class="last silk" href="javascript:void(0);" onClick="Landmark.search()"><img src="images/silk-grey/magnifier.png" /></a> 
    	</div> 
	<div class="toolbar"> 
            <a name='Load a map' class='first silk' href="javascript:void(0);" onClick="Landmark.showLoad()"><img src="images/silk-grey/drive.png" /></a>
	    <a name="Create a new map" class="silk" href="javascript:void(0);" onclick="MapEditor.create()"><img src="images/silk-grey/drive_add.png" /></a>
	    <a name="Edit this map" class="silk" href="javascript:void(0);" onclick="MapEditor.edit()"><img src="images/silk-grey/drive_edit.png" /></a>
	    <a name="Set this view to default map location" class="silk last" href="javascript:void(0);" onclick="MapEditor.center()"><img src="images/silk-grey/drive_user.png" /></a>
	</div>
	-->
	</div> 
 
	<!-- <span style='margin-right:6px;' class='right'><a target="_blank" href="http://wiki.cartagen.org/wiki/show/GssUsage">GSS Docs</a></span> -->
	
</div> 


<div class='modal' id="styles" style="display:none;"> 
	<div> 
		<h3>Viewing all styles</h3> 
		<textarea rows="20" cols="70">body: {
	fillStyle: "white",
	lineWidth: 0,
	pattern: "images/brown-paper.jpg",
	menu: {
		"Edit GSS": Cartagen.show_gss_editor,
		"Download Image": Cartagen.redirect_to_image,
		"Download Data": Interface.download_bbox
	}
},
node: {
	fillStyle: "#ddd",
	strokeStyle: "#090",
	lineWidth: 0,
	radius: 1
},
way: {
	strokeStyle: "#ccc",
	lineWidth: 3,
	menu: {
		"Toggle Transparency": function() {
			if (this._transparency_active) {
				this.opacity = 1
				this._transparency_active = false
			}
			else {
				this.opacity = 0.2
				this._transparency_active = true
			}
		}
	}
},
island: {
	strokeStyle: "#24a",
	lineWidth: 4,
	pattern: "images/brown-paper.jpg"
},
relation: {
	fillStyle: "#57d",
	strokeStyle: "#24a",
	lineWidth: 4,
	pattern: "images/pattern-water.gif"
},
administrative: {
	lineWidth: 50,
	strokeStyle: "#D45023",
	fillStyle: "rgba(0,0,0,0)",
},
leisure: {
	fillStyle: "#2a2",
	lineWidth: 3,
	strokeStyle: "#181"
},
area: {
	lineWidth: 8,
	strokeStyle: "#4C6ACB",
	fillStyle: "rgba(0,0,0,0)",
	opacity: 0.4,
	fontColor: "#444",
},
park: {
	fillStyle: "#2a2",
	lineWidth: 3,
	strokeStyle: "#181",
	fontSize: 12,
	text: function() { return this.tags.get("name") },
	fontRotation: "fixed",
	opacity: 1
},
waterway: {
	fillStyle: "#57d",
	strokeStyle: "#24a",
	lineWidth: 4,
	pattern: "images/pattern-water.gif"
},
water: {
	strokeStyle: "#24a",
	lineWidth: 4,
	pattern: "images/pattern-water.gif"
},
highway: {
	strokeStyle: "white",
	lineWidth: 6,
	outlineWidth: 3,
	outlineColor: "white",
	fontColor: "#333",
	fontBackground: "white",
	fontScale: "fixed",
	text: function() { return this.tags.get("name") }
},
primary: {
	strokeStyle: "#d44",
	lineWidth: function() {
		if (this.tags.get("width")) return parseInt(this.tags.get("width"))*0.8
		else return 10
	}
},
secondary: {
	strokeStyle: "#d44",
	lineWidth: function() {
		if (this.tags.get("width")) return parseInt(this.tags.get("width"))*0.8
		else return 7
	}
},
footway: {
	strokeStyle: "#842",
	lineWidth: function() {
		if (this.tags.get("width")) return parseInt(this.tags.get("width"))*0.8
		else return 3
	}
},
pedestrian: {
	strokeStyle: "#842",
	fontBackground: "rgba(1,1,1,0)",
	fontColor: "#444",
	lineWidth: function() {
		if (this.tags.get("width")) return parseInt(this.tags.get("width"))*0.8
		else return 3
	}
},
parkchange: {
	glow: "yellow"
},
building: {
	opacity: 1,
	lineWidth: 0.001,
	fillStyle: "#444",
	text: function() { return this.tags.get("name") },
	hover: {
		fillStyle: "#222"
	},
	mouseDown: {
		lineWidth: 18,
		strokeStyle: "red"
	},
	menu: {
		"Search on Google": function() {
			if (this.tags.get("name")) {
				window.open("http://google.com/search?q=" + this.tags.get("name"), "_blank")
			}
			else {
				alert("Sorry! The name of this building is unknown.")
			}
		},
		"Search on Wikipedia": function() {
			if (this.tags.get("name")) {
				window.open("http://en.wikipedia.org/wiki/Special:Search?go=Go&search=" + this.tags.get("name"), "_blank")
			}
			else {
				alert("Sorry! The name of this building is unknown.")
			}
		}
	}
},
landuse: {
	fillStyle: "#ddd"
},
rail: {
	lineWidth: 4,
	strokeStyle: "purple"
},
debug: {
	way: {
		menu: {
			"Inspect": function() {$l(this)}
		}
	}
}</textarea> 
		<a href="javascript:$('styles').hide()">save</a> | 
		<a href="javascript:$('styles').hide()">cancel</a> 
	</div> 
</div> 
 
<div class='modal' id="wysiwyg" style="display:none;"> 
	<div> 
		<h3>Edit styles for <span id='editing'></span></h3> 
		
		<form action="show_submit" method="get" accept-charset="utf-8"> 
			
			<label for="fill_color">Fill color</label> <input type="text" name="fill_color" value="" id="fill_color"><br /> 
			<label for="stroke_color">Stroke color</label> <input type="text" name="stroke_color" value="" id="stroke_color"><br /> 
			<label for="line_width">Line width</label> <input type="text" name="line_width" value="" id="line_width"><br /> 
			<label for="image">Image (url)</label> <input type="text" name="image" value="" id="image"><br /> 
			<label for="pattern">Pattern (url)</label> <input type="text" name="pattern" value="" id="pattern"><br /> 
			<label for="text">Label</label> <input type="text" name="text" value="" id="text"><br /> 
 
		</form> 
		
		<p class="footer"> 
			<a href="javascript:$('wysiwyg').hide()">save</a> | 
			<a href="javascript:$('wysiwyg').hide()">cancel</a> 
		</p> 
	</div> 
</div> 
<div id="canvas"></div> 

<!--
<div id="cursorbox" style="position: absolute; display: none; z-index: 2"><img id="cursor" src="blank.gif" /></div>
-->
<!--
<script type="text/javascript"> 
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script> 
<script type="text/javascript"> 
try {
var pageTracker = _gat._getTracker("UA-180781-29");
pageTracker._trackPageview();
} catch(err) {}</script> 
-->
</body> 
</html> 
