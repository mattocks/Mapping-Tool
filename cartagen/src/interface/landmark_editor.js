/**
 * @namespace Methods for editing landmarks
 */
LandmarkEditor = {
	event: null,
	img: null,
	idd: 0, // an internal id counter for landmarks that cannot be saved to the server
	beginCustomImg: function(){
		/*
		var pts = Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y())
		Modalbox.show('<iframe src="uploadimg.php?points='+pts+'&mapid='+Landmark.map+'" style="height:370px;width:490px;border:0px"></iframe>', {title: 'Create a landmark', beforeHide: Landmark.remove_temp_shape})
		*/
		LandmarkEditor.create(7)
	},
	changeImg: function(img){
		LandmarkEditor.img = new Image()
		LandmarkEditor.img.src = img
		LandmarkEditor.event = LandmarkEditor.drawImg.bindAsEventListener(LandmarkEditor)
		Glop.observe('glop:dragging', LandmarkEditor.event)
	},
	drawImg: function(){
		$C.save()
		$C.translate(Map.pointer_x(), Map.pointer_y())
		$C.scale(1/Map.max_zoom,1/Map.max_zoom)
		$C.canvas.drawImage(LandmarkEditor.img, -LandmarkEditor.img.width/2, -LandmarkEditor.img.height/2) // puts mouse at center of image
		$C.restore()
	},
	resetImg: function(){
		Glop.stopObserving('glop:dragging', LandmarkEditor.event)
		LandmarkEditor.img = null
		LandmarkEditor.event = null
	},
	/**
	 * Sets the cursor to a certain image. This does not actually change the cursor; it causes an image to drag with the mouse.
	 * @param {img} source of image
	 */
	changeCursor: function(img){
		$('cursor').src = img
		$('main').observe('mousemove', LandmarkEditor.moveCursor)
		$('cursorbox').observe('mousemove', LandmarkEditor.moveCursor)
		Modalbox.hide()
	},
	/**
	 * Upon mousemove event, makes the cursor image appear to the upper left of the cursor.
	 */
	moveCursor: function(e){
		var x = Event.pointerX(e)
		var y = Event.pointerY(e)
		$('cursorbox').style.display = 'inline'
		$('cursorbox').style.left = (x-$('cursor').width)+'px'
		$('cursorbox').style.top = (y-$('cursor').height)+'px'
	},
	/**
	 * Eliminates the cursor for a point landmark.
	 */
	resetCursor: function(){
		$('cursorbox').style.display = 'none'
		$('main').stopObserving('mousemove', LandmarkEditor.moveCursor)
		$('cursorbox').stopObserving('mousemove', LandmarkEditor.moveCursor)
	},
	/**
	 * Shows the creation window for a landmark. Called after the landmark is set on the map.
	 * @param {type} Type of landmark (1=area, 2=path, 3=point, 4=freeform)
	 */
	create: function(type){
		var action = 'LandmarkEditor.newArea('+type+')' // default
		Landmark.shape_created = false
		var colorstr = 'Color: '+LandmarkEditor.colors(true)+'<input type="hidden" id="color" value="'+LandmarkEditor.colors(true,'0')+'" />'
		var options = colorstr // default
		var r = 'false' // return r upon form submission
		switch(type){
			case 1: // region
				break
			case 2: // path
				break
			case 3: // point
				var icons = ['pushpin1.gif', 'pushpin5.gif'];
				options = '';
				icons.each(function(i){
					options += '<img src=\"'+i+'\" onclick=\"LandmarkEditor.temp_icon=\''+i+'\';\" style=\"cursor:pointer;\"/> '
				});
				action = 'LandmarkEditor.newPoint()'
				break
			case 4: // freeform
				break
			case 5: // rectangle
				break
			case 6: // ellipse
				break
			case 7: // image
				options = '<input type="file" name="image" /><br />'
				r = 'true'
				action = ''
				break
			// no 7 custom image not created here
			case 8: // text note
				options = ''
				action = 'LandmarkEditor.newTextnote()'
				break
		}
		if(action!='') action += ';'
		var pts = Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y());
		Modalbox.show(Tooltips.enter_label+'<br /><form id="lndmrkfrm" method="post" action="cartagen/php/upload.php" onsubmit="'+action+'Modalbox.hide();return '+r+'" target="submitframe" enctype="multipart/form-data"><input type="text" id="landmarker" /><br /><br /><textarea id="desc" name="desc" style="height: 200px; width: 400px;"></textarea><br />'+options+'<br /><input type="hidden" name="mapid" value="'+Landmark.map+'" /><input type="hidden" name="points" value="'+pts+'" /><input type="submit" value="Make" /><input type="button" value="Cancel" onclick="Modalbox.hide();Landmark.temp_shape.remove();Tool.change(\'Pan\');Events.mouseup()" /></form><iframe name="submitframe" style="display:none"></iframe>', {title: 'Create a landmark', beforeHide: Landmark.remove_temp_shape})
	},
	/**
	 * Allows colors of landmarks to be edited.
	 * @param {initial} Set to true when a landmark is being created; false if landmark exists
	 * @param {index} Retrieves a certain color out of the list of colors
	 * @return table of color choices
	 */
	colors: function(initial, index) {
		var colors = ['rgb(0, 0, 0)','rgb(255, 255, 255)','rgb(255, 0, 0)','rgb(0, 255, 0)','rgb(0, 0, 255)']
		if (index) {
			return colors[index]
		}
		var colorstring = '<table><tr>'
		cid = 0
		colors.each(function(c) {
			if ((cid == 0 && initial) || (!initial && c == Landmark.landmarks.get(Landmark.current).color)) {
				c += "; border: 2px inset blue"
			}
			colorstring += '<td class="colorbox" id="c'+cid+'" style="width: 20px; height: 20px; padding: 1px; background-color: '+c+'" onclick="LandmarkEditor.setColor('+cid+')"> </td>'
			cid++
		})
		colorstring += '</tr></table>'
		return colorstring
	},
	/**
	 * Helper function for above. Used to select the color for the landmark.
	 */
	setColor: function(id) {
		for (var i = 0; i < 5; i++) {
			if (i == id) {
				$('c'+i).style.border = '2px inset blue'
				$('color').value = $('c'+i).style.backgroundColor
			}
			else {
				$('c'+i).style.border = '0px solid blue'
			}
		}
		console.log($('color').value)
	},
	/**
	 * Sets a new point landmark in the database. Also draws it on the map.
	 */
	newPoint: function(){
		// stores the landmark in the database
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		//var color1 = $('color').value
		//var 
		//var cursorID = LandmarkEditor.img.substring(LandmarkEditor.img.lastIndexOf('/')+1)
		//var cursorID = $('cursor').src.substring($('cursor').src.lastIndexOf('/')+1)
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
				var id = response.responseText.trim();
				Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, LandmarkEditor.temp_icon, id))
				console.log(LandmarkEditor.temp_icon)
				//Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, color1, id))
				//LandmarkEditor.resetImg()
	  		},
			onFailure: function() {
				var id = LandmarkEditor.idd++ // local id created
				Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, color1, id))
				//LandmarkEditor.resetImg()
			}
		})
		//Tool.change('Pan')
	},
	newTextnote: function(){
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		var color1 = $('color').value
		var cursorID = 'stickynotecrop-small.jpg'
		//console.log(cursorID)
		//var cursorID = $('cursor').src.substring($('cursor').src.lastIndexOf('/')+1)
		new Ajax.Request('cartagen/php/createlandmark.php', {
	 		method: 'post',
	  		parameters: {
				type: 8,
				points: Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y()),
				label: label1,
				desc: desc1,
				icon: 'stickynotecrop-small.jpg',
				color: color1,
				mapid: Landmark.map,
	  		},
	  		onSuccess: function(response) {
				var id = response.responseText.trim();
				Landmark.landmarks.set(id, new Textnote(Map.pointer_x(), Map.pointer_y(), label1, desc1, cursorID, id))
				LandmarkEditor.resetImg()
	  		},
			onFailure: function() {
				var id = LandmarkEditor.idd++ // local id created
				Landmark.landmarks.set(id, new Textnote(Map.pointer_x(), Map.pointer_y(), label1, desc1, cursorID, id))
				LandmarkEditor.resetImg()
			}
		})
		//Tool.change('Pan')
	},
	/*
	 * Saves a polygon or path to the server
	 * @param {t} type of landmark: 1 is polygon; 2 is path; 4 is freeform
	 */
	newArea: function(t){
		var shape = Landmark.temp_shape
		Landmark.shape_created = true
		/*
		switch(t){
		case 1:
			shape = Tool.Region.current_shape
			Tool.Region.mode = 'inactive'
			break
		case 2:
			shape = Tool.Path.current_shape
			Tool.Path.mode = 'inactive'
			break
		case 4:
			shape = Tool.Freeform.current_shape
			Tool.Freeform.mode = 'inactive'
			break
		case 5:
			shape = Tool.Rectangle.current_shape
			Tool.Rectangle.mode = 'inactive'
			break
		case 6:
			shape = Tool.Ellipse.current_shape
			Tool.Ellipse.mode = 'inactive'
			break
		}
		*/
		shape.dragging = false
		var points = shape.points
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		var color1 = $('color').value
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
				var id = response.responseText.trim()
				shape.setup(label1, desc1, id, color1)
				Landmark.landmarks.set(id, shape)
	  		},
			onFailure: function() {
				var id = LandmarkEditor.idd++
				shape.setup(label1, desc1, id, color1)
				Landmark.landmarks.set(id, shape)
			}
		})
		Tool.change('Pan')
		Landmark.shape_created = null
		Events.mouseup()
	},
	/**
	 * This saves data about a moved point landmark to the server.
	 */
	move: function() {
		var lndmrk = Landmark.landmarks.get(Landmark.current)
		var pts = ''
		console.log(''+Landmark.current)
		if(lndmrk instanceof Region || lndmrk instanceof Path){
			lndmrk.points.each(function(p){
				pts += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
			})
		}
		else if(Landmark.landmarks.get(Landmark.current) instanceof Point || Landmark.landmarks.get(Landmark.current) instanceof Img){
			pts = Projection.x_to_lon(-1*Landmark.landmarks.get(Landmark.current).x)+','+Projection.y_to_lat(Landmark.landmarks.get(Landmark.current).y)
		}
		new Ajax.Request('cartagen/php/editlandmark.php', {
				method: 'get',
		 		parameters: {
				id: Landmark.current,
				points: pts,
		 		},
			onSuccess: function(response) {
			}
		})
		//Tool.change('Pan')
		//Landmark.mode = 'create'
		//Landmark.landmarks.get(Landmark.current).dragEnabled = false
	},
	moveit: function(){
		Tool.change('Landmark')
		Landmark.mode = 'dragging'
		//Landmark.landmarks.get(Landmark.current).dragEnabled = true
	},
	/**
	 * Opens a Modalbox window for editing the contents of the landmark itself.
	 */
	edit: function(){
		Modalbox.show('Edit this landmark<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.editData();Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + Landmark.landmarks.get(Landmark.current).label + '"/><br /><br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + Landmark.landmarks.get(Landmark.current).desc + '</textarea><br />Color: '+LandmarkEditor.colors(false)+'<input type="hidden" id="color" value="'+Landmark.landmarks.get(Landmark.current).color+'" /><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="Delete" onclick="LandmarkEditor.remove();Modalbox.hide();Events.mouseup()" /></form>', {title: 'Edit this landmark'})
	},
	/**
	 * When called, takes the information from the editing window and sends it to the server
	 */
	editData : function() {
		var label1 = $('newName').value
		var desc1 = $('newDesc').value
		var color1 = $('color').value
		//console.log(color1)
		console.log(desc1)
		new Ajax.Request('cartagen/php/editlandmark.php', {
			method: 'get',
			parameters: {
				id: Landmark.current,
				label: label1,
				desc: desc1,
				color: color1,
		 		},
			onSuccess: function(response) {
				var curLandmark = Landmark.landmarks.get(Landmark.current)
				curLandmark.label = label1
				curLandmark.desc = desc1
				curLandmark.color = color1
				curLandmark.descRendered = false
				console.log(response.responseText)
	 		},
			onFailure: function(){
				var curLandmark = Landmark.landmarks.get(Landmark.current)
				curLandmark.label = label1
				curLandmark.desc = desc1
				curLandmark.color = color1
				curLandmark.descRendered = false
			}
		})
		if(Landmark.landmarks.get(Landmark.current) instanceof Img){
			Landmark.landmarks.get(Landmark.current).noteRendered = false
		}
	},
	/**
	 * Deletes a landmark from the database and hides it from being displayed on the map
	 */
	remove: function() {
		if(confirm('Are you sure you want to delete this landmark entirely? Press OK to continue or Cancel to stop.')){
			new Ajax.Request('cartagen/php/editlandmark.php', {
		 		method: 'get',
		  		parameters: {
					remove: Landmark.current,
		  		},
			})
			/*
			var lndmrk = Landmark.landmarks.get(Landmark.current)
			if(lndmrk instanceof Point){
				Glop.stopObserving('glop:points', lndmrk.eventA)
			}
			else{
				Glop.stopObserving('glop:postdraw', lndmrk.eventA)
			}
			Glop.stopObserving('glop:descriptions', lndmrk.eventB)
			Glop.stopObserving('mousedown', lndmrk.eventC)
			if(lndmrk instanceof Region||lndmrk instanceof Path){
				lndmrk.points.each(function(p){
					Glop.stopObserving('glop:postdraw', p.eventA)
					Glop.stopObserving('mousedown', p.eventB)
				})
			}
			*/
			Landmark.landmarks.get(Landmark.current).remove()
			Landmark.landmarks.unset(Landmark.current)
			//$('goto'+Landmark.current).remove()
			Landmark.current = null
		}
	}
}
