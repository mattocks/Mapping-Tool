/**
 * Methods for editing, creating, and deleting landmarks
 */
LandmarkEditor = {
	event: null, // temp holder if dragging an image with the cursor
	img: null, // temp image holder for handling cursor images and rendering point icons
	idd: 0, // an internal id counter for landmarks that cannot be saved to the server
	color_choices: ['rgb(0, 0, 0)','rgb(255, 255, 255)','rgb(255, 0, 0)','rgb(255, 162, 0)',
	'rgb(255, 237, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)','rgb(199, 0, 199)'], // color choices for path/shapes
	icon_choices: [], //moved to loadmap.php for automatic icon loading based on files in directory alphabetically
	/*
	 * Shows a warning in the bottom of the window if data was not sent to server properly
	*/
	showConnectionWarning: function(){
		if(!$('connection_warning')){
			document.body.insert('<div id="connection_warning" style="position:absolute;z-index:4;background-color: #FFF;bottom:0px;top:auto;height:1.5em;width:600px;padding-left:3px;"><span style="color: #F00">Warning: The item you just created was not saved to the server. Please check your internet connection.</span></div>')
		}
	},
	/**
	 * Removes the connection warning
	 */
	removeConnectionWarning: function(){
		if($('connection_warning'))
			$('connection_warning').remove()
	},
	/**
	 * Allows an image to be dragged on the canvas with the mouse.
	 * img: url of image
	 */
	changeImg: function(img){
		LandmarkEditor.img = new Image()
		LandmarkEditor.img.src = img
		LandmarkEditor.event = LandmarkEditor.drawImg.bindAsEventListener(LandmarkEditor)
		Glop.observe('glop:dragging', LandmarkEditor.event)
	},
	/**
	 * Called by glop:dragging event to draw image on canvas
	 */
	drawImg: function(){
		$C.save()
		$C.translate(Map.pointer_x(), Map.pointer_y())
		$C.scale(1/Config.zoom_in_limit,1/Config.zoom_in_limit)
		$C.canvas.drawImage(LandmarkEditor.img, -LandmarkEditor.img.width/2, -LandmarkEditor.img.height/2) // puts mouse at center of image
		$C.restore()
	},
	/**
	 * Clears the image being dragged with the mouse set by changeimg
	 */
	resetImg: function(){
		Glop.stopObserving('glop:dragging', LandmarkEditor.event)
		LandmarkEditor.img = null
		LandmarkEditor.event = null
	},
	/**
	 * Buttons used to finish or cancel the creation of drawn landmarks
	 * div: id of the div
	 * action: creation action for the 'Done' button
	 */
	showButtons: function(div, action){
		if(!$(div)){
			$('toolbars').insert('<div id="'+div+'"><input type="button" value="'+Tooltips.done+'" onclick="'+action+';$(\''+div+'\').remove()" /> <input type="button" value="'+Tooltips.cancel+'" onclick="Tool.change(\'Pan\');$(\''+div+'\').remove()" /></div>');
		}
	},
	/**
	 * Shows the image upload window
	 */
	showImgUpload: function(){
		Modalbox.show('<form id="lndmrkfrm" method="post" action="cartagen/php/upload.php"  target="submitframe" enctype="multipart/form-data" onsubmit="$(\'uploader\').update(\'Uploading, please wait...\')"><input type="file" name="image" /><br /><input type="hidden" name="mapid" value="'+Landmark.map+'" /><input type="submit" value="Upload" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /></form><div id="uploader">&nbsp;</div><iframe name="submitframe" style="display:none"></iframe>', {title: 'Upload an image'});
	},
	/**
	 * Shows the creation window for a landmark. Called after the landmark is set on the map.
	 * @param {type} Type of landmark - see php/loadmap.php for details on the numbers
	 */
	create: function(type){
		var action = 'LandmarkEditor.newArea('+type+')' // default
		Landmark.shape_created = false
		var colorstr = Tooltips.color+' '+LandmarkEditor.colors(true)+'<input type="hidden" id="color" value="'+LandmarkEditor.color_choices[0]+'" />'
		var options = colorstr // anything that should appear under the description box specific to a type of landmark; default is the color choice array
		var r = 'false' // return r upon form submission
		var target = 'submitframe'
		var title = 'Create a landmark' // default title for creation window
		switch(type){
			case 1: // region
				title = 'Creating a polygon'
				break
			case 2: // path
				title = 'Creating a path'
				break
			case 3: // point
				title = 'Creating a point'
				options = LandmarkEditor.icons()
				action = 'LandmarkEditor.newPoint()'
				Landmark.shape_created = null
				break
			case 4: // freeform
				title = 'Creating a freeform shape'
				break
			case 5: // rectangle
				title = 'Creating a rectangle'
				break
			case 6: // ellipse
				title = 'Creating an ellipse'
				break
			/*
			case 7: // image
				title = 'Uploading an image'
				options = '<input type="file" name="image" /><br />'
				r = 'true'
				action = ''
				Landmark.shape_created = null
				break
			*/
			case 8: // text note
				title = 'Creating a text note'
				options = ''
				break
			case 9: // audio
				title = 'Creating an audio recording'
				options = '<iframe src="nanogong-recorder.html" name="nanogong_recorder" style="border:0px;width:180px;height:40px"></iframe>'
				action = 'LandmarkEditor.newAudio()'
				target = 'nanogong_recorder'
				Landmark.shape_created = null
				break
		}
		if(action!='') action += ';'
		var pts = Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y());
		Modalbox.show(Tooltips.label+'<br /><form id="lndmrkfrm" method="post" action="cartagen/php/upload.php" onsubmit="'+action+'Modalbox.hide();return '+r+'" target="'+target+'" enctype="multipart/form-data"><input type="text" name="label" id="landmarker" value="'+Tooltips.untitled+'" style="width: 400px;" /><br />'+Tooltips.description+'<br /><textarea id="desc" name="desc" style="height: 200px; width: 400px;" onfocus="if(!this.cleared){this.value=\'\';this.cleared=true}">'+Tooltips.enter_description+'</textarea><br />'+options+'<br /><input type="hidden" name="mapid" value="'+Landmark.map+'" /><input type="hidden" name="points" value="'+pts+'" /><input type="submit" value="'+Tooltips.make+'" /><input type="button" value="'+Tooltips.cancel+'" onclick="Modalbox.hide();Events.mouseup()" /></form><iframe name="submitframe" style="display:none"></iframe>', {title: title, width: 424, beforeHide: function(){Landmark.remove_temp_shape(); Tool.change('Pan')} })
	},
	/*
	 * Returns an HTML string of icons for the point landmark option. All files should be placed in icons/ directory.
	 */
	icons: function() {
		var icons = LandmarkEditor.icon_choices
		LandmarkEditor.temp_icon = icons[0].substring(icons[0].lastIndexOf('/')+1)
		var iconstring = ''
		var cid = 0
		icons.each(function(i) {
			LandmarkEditor.img = new Image()
			LandmarkEditor.img.src = 'icons/'+i
			var s = 'border: 2px solid rgba(0, 0, 0, 0)'
			if (cid == 0) {
				s = "border: 2px inset rgb(0, 0, 255)"
			}
			iconstring += '<img id="i'+cid+'" style="padding: 1px; '+s+'" src="icons/'+i+'" onclick="LandmarkEditor.setIcon('+cid+')" onload="LandmarkEditor.resizeIcon(this)" />'
			cid++
		})
		LandmarkEditor.img = null
		return iconstring
	},
	/**
	 * Chooses the icon for the point landmark option
	 * id: index of the chosen icon
	 */
	setIcon: function(id) {
		for (var i = 0; i < LandmarkEditor.icon_choices.length; i++) {
			if (i == id) {
				$('i'+i).style.border = '2px inset rgb(0, 0, 255)'
				LandmarkEditor.temp_icon = $('i'+i).src.substring($('i'+i).src.lastIndexOf('/')+1)
			}
			else {
				$('i'+i).style.border = '2px solid rgba(0, 0, 0, 0)'
			}
		}
		//console.log(LandmarkEditor.temp_icon)
	},
	/**
	 * Adjusts the icons in the point landmark creation window to be no larger than 64 x 64.
	 * Also readjusts the window to fit the content.
	 * img: HTML image element tag
	 */
	resizeIcon: function(img){
		var width = img.width
		var height = img.height
		if(img.width >= img.height){
			width = 64;
			height = 64 * img.height/img.width;
		}
		else{
			height = 64;
			width = 64 * img.width/img.height;
		}
		img.width = width
		img.height = height
		console.log('height:'+img.height)
		console.log('width:'+img.width)
		Modalbox.resizeToContent()
	},
	/**
	 * Allows colors of landmarks to be edited.
	 * @param {initial} Set to true when a landmark is being created; false if landmark exists
	 * @return table of color choices
	 */
	colors: function(initial) {
		var colors = LandmarkEditor.color_choices
		var colorstring = '<table><tr>'
		var cid = 0
		colors.each(function(c) {
			border = 'border: 2px solid rgba(0, 0, 0, 0)'
			if ((cid == 0 && initial) || (!initial && c == Landmark.landmarks.get(Landmark.current).color)) {
				border = "border: 2px inset blue"
			}
			colorstring += '<td class="colorbox" id="c'+cid+'" style="width: 20px; height: 20px; padding: 1px; background-color: '+c+'; '+border+'" onclick="LandmarkEditor.setColor('+cid+')"> </td>'
			cid++
		})
		colorstring += '</tr></table>'
		return colorstring
	},
	/**
	 * Helper function for above. Used to select the color for the landmark.
	 * id: index of chosen color in color array
	 */
	setColor: function(id) {
		for (var i = 0; i < LandmarkEditor.color_choices.length; i++) {
			if (i == id) {
				$('c'+i).style.border = '2px inset blue'
				$('color').value = $('c'+i).style.backgroundColor
			}
			else {
				$('c'+i).style.border = '2px solid rgba(0, 0, 0, 0)'
			}
		}
		console.log($('color').value)
	},
	/*
	 * Sends a recorded audio file to the server
	 */
	newAudio: function(){
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		var pts = Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y())
		var qs = '?points='+pts+'&label='+label1+'&desc='+desc1+'&mapid='+Landmark.map;
		var ret = window.nanogong_recorder.document.getElementById('nanogong').sendGongRequest("PostToForm", "cartagen/php/uploadaudio.php"+qs, "voicefile", "", "temp");
		if (ret == null){
                	alert("Failed to submit the voice recording");
		}
		else if (ret == ""){
			alert("Empty response text");
		}
		else{
			console.log(ret);
			var r = ret.trim().split(",");
			var id = r[0];
			var timestamp = r[1];
			Landmark.landmarks.set(id, new Audio(Map.pointer_x(), Map.pointer_y(), label1, desc1, id, timestamp))
		}
	},
	/**
	 * Sets a new point landmark in the database. Also draws it on the map.
	 */
	newPoint: function(){
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		new Ajax.Request('cartagen/php/createlandmark.php', {
	 		method: 'post',
	  		parameters: {
				type: 3,
				points: Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y()),
				label: label1,
				desc: desc1,
				icon: LandmarkEditor.temp_icon,
				color: '',
				mapid: Landmark.map,
	  		},
	  		onSuccess: function(response) {
				if(response.responseText.trim() == ''){
					LandmarkEditor.showConnectionWarning()
				}
				else{
					var r = response.responseText.trim().split(",");
					var id = r[0];
					var timestamp = r[1];
					Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, LandmarkEditor.temp_icon, id, timestamp))
					LandmarkEditor.removeConnectionWarning()
				}
	  		},
			onFailure: function() {
				console.log('did not connect')
				LandmarkEditor.showConnectionWarning()
				var id = LandmarkEditor.idd++ // local id created
				Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, color1, id))
			}
		})
	},
	/*
	 * Saves a polygon or path to the server
	 * @param {t} type of landmark: see documentation
	 */
	newArea: function(t){
		var shape = Landmark.temp_shape
		Landmark.shape_created = true
		shape.dragging = false
		var points = shape.points
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		var color1
		if(t==8){
			color1 = shape.color
			shape.noteRendered = false
		}
		else
			color1 = $('color').value
		var logger = ''
		shape.points.each(function(p){
			logger += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
		})
		new Ajax.Request('cartagen/php/createlandmark.php', {
	 		method: 'post',
	  		parameters: {
				type: t,
				points: logger,
				label: label1,
				desc: desc1,
				color: color1,
				mapid: Landmark.map,
	  		},
	  		onSuccess: function(response) {
				if(response.responseText.trim() == ''){
					LandmarkEditor.showConnectionWarning()
				}
				else{
					LandmarkEditor.removeConnectionWarning()
					var r = response.responseText.trim().split(",");
					var id = r[0];
					var timestamp = r[1];
					shape.setup(label1, desc1, id, color1, [], timestamp)
					if(shape instanceof Textnote) shape.noteRendered = false
					Landmark.landmarks.set(id, shape)
				}
	  		},
			onFailure: function() {
				LandmarkEditor.showConnectionWarning()
				var id = LandmarkEditor.idd++
				shape.setup(label1, desc1, id, color1)
				Landmark.landmarks.set(id, shape)
			}
		})
		Landmark.shape_created = null
		Events.mouseup()
	},
	/**
	 * This saves data about a moved landmark to the server.
	 */
	move: function() {
		var lndmrk = Landmark.landmarks.get(Landmark.current)
		var pts = ''
		console.log(''+Landmark.current)
		if(lndmrk instanceof Textnote){
			lndmrk.noteRendered = false
			lndmrk.renderNote()
		}
		if(lndmrk instanceof Region || lndmrk instanceof Path){
			lndmrk.points.each(function(p){
				pts += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
			})
		}
		else {
			pts = Projection.x_to_lon(-1*Landmark.landmarks.get(Landmark.current).x)+','+Projection.y_to_lat(Landmark.landmarks.get(Landmark.current).y)
		}
		new Ajax.Request('cartagen/php/editlandmark.php', {
			method: 'post',
	 		parameters: {
				id: Landmark.current,
				points: pts,
	 		},
			onSuccess: function(response) {
				if(response.responseText.trim() == ''){
					LandmarkEditor.showConnectionWarning()
				}
				else{
					LandmarkEditor.removeConnectionWarning()
				}
				console.log(response.responseText)
			},
			onFailure: function(){
				LandmarkEditor.showConnectionWarning()
			}
		})
	},
	/*
	 * Sets the current object on mousedown if a landmark is clicked
	 */
	setCurrent: function(o){
		if(Landmark.obj == null){
			Landmark.obj = o
		}
	},
	/**
	 * Opens a Modalbox window for editing the contents of the landmark itself.
	 */
	edit: function(){
		var colorstr = Tooltips.color+' '+LandmarkEditor.colors(false)+'<input type="hidden" id="color" value="'+Landmark.landmarks.get(Landmark.current).color+'" />'
		var options = colorstr
		var lndmrk = Landmark.landmarks.get(Landmark.current)
		if(!(lndmrk instanceof Region || lndmrk instanceof Path) || lndmrk instanceof Textnote){
			options = '' // no color choices for these landmarks
		}
		Modalbox.show(Tooltips.label+'<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.editData();Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + lndmrk.label + '" style="width:400px;" /><br />'+Tooltips.description+'<br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + lndmrk.desc + '</textarea><br />'+options+'<br /><input type="submit" value="'+Tooltips.edit+'" /><input type="button" value="'+Tooltips.cancel+'" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="'+Tooltips.deleteBtn+'" onclick="LandmarkEditor.remove();Modalbox.hide();Events.mouseup()" /></form>', {title: 'Edit this landmark', width: 424})
	},
	/**
	 * When called, takes the information from the editing window and sends it to the server
	 */
	editData : function() {
		var label1 = $('newName').value
		var desc1 = $('newDesc').value
		var color1 = $('color') != null ? $('color').value : ''
		if (Landmark.landmarks.get(Landmark.current) instanceof Textnote){
			color1 = Landmark.landmarks.get(Landmark.current).color
		}
		//console.log(color1)
		console.log(desc1)
		new Ajax.Request('cartagen/php/editlandmark.php', {
			method: 'post',
			parameters: {
				id: Landmark.current,
				label: label1,
				desc: desc1,
				color: color1,
		 		},
			onSuccess: function(response) {
				if(response.responseText.trim() == ''){
					LandmarkEditor.showConnectionWarning()
				}
				else{
					var curLandmark = Landmark.landmarks.get(Landmark.current)
					curLandmark.label = label1
					curLandmark.desc = desc1
					curLandmark.color = color1
					curLandmark.descRendered = false
					curLandmark.noteRendered = false
					LandmarkEditor.removeConnectionWarning()
				}
				console.log(response.responseText)
	 		},
			onFailure: function(){
				LandmarkEditor.showConnectionWarning()
				var curLandmark = Landmark.landmarks.get(Landmark.current)
				curLandmark.label = label1
				curLandmark.desc = desc1
				curLandmark.color = color1
				curLandmark.descRendered = false
			}
		})
		if(Landmark.landmarks.get(Landmark.current) instanceof Textnote){
			Landmark.landmarks.get(Landmark.current).noteRendered = false
		}
	},
	/**
	 * Sends an undo request to the server
	 */
	undo: function(){
		new Ajax.Request('cartagen/php/undo.php?undo=true', {
			onSuccess: function(r){
				console.log(r.responseText);
			},
			onFailure: function(){
				LandmarkEditor.showConnectionWarning()
			}
		});
	},
	/**
	 * Deletes a landmark from the database and hides it from being displayed on the map
	 */
	remove: function() {
		if(confirm('Are you sure you want to delete this landmark entirely? Press OK to continue or Cancel to stop.')){
			new Ajax.Request('cartagen/php/editlandmark.php', {
		 		method: 'post',
		  		parameters: {
					remove: Landmark.current,
		  		},
				onFailure: function(){
					LandmarkEditor.showConnectionWarning()
				}
			})
			Landmark.landmarks.get(Landmark.current).remove()
			Landmark.landmarks.unset(Landmark.current)
			Landmark.current = null
		}
	}
}
