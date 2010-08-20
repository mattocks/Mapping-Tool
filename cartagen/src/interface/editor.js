/**
 * @namespace Methods for editing landmarks
 */
LandmarkEditor = {
	idd: 0, // an internal id counter for landmarks that cannot be saved to the server
	/**
	 * Shows a Modalbox window to allow user to choose an image to represent a point landmark
	 */
	begin: function(){
		var icons = ["pushpin1.gif", "pushpin5.gif"]
		var tags = ''
		icons.each(function(i){
			tags+='<img src="'+i+'" onclick="LandmarkEditor.changeCursor(\''+i+'\')" /> '
		})
		Modalbox.show('<span>Select an icon for your landmark.<br />'+tags+'</span>', {title: 'Create a landmark'})
	},
	/**
	 * Instructions to draw an area. User must click OK (and not the X button) to begin.
	 */
	beginArea: function(){
		Modalbox.show('<span>Draw an area to outline your landmark. To finish outlining, click on the first point (a hand cursor will appear).</span><br /><input type="button" value="OK" onclick="Modalbox.hide();Tool.Pen.new_shape()" />', {title: 'Create a new area'})
	},
	/**
	 * Instructions to draw a path. User must click OK (and not the X button) to begin.
	 */
	beginPath: function(){
		Modalbox.show('<span>Draw a path to outline your landmark. To finish outlining, click on any point in your path.</span><br /><input type="button" value="OK" onclick="Modalbox.hide();Tool.Path.new_shape()" />', {title: 'Create a new path'})
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
	 * @param {type} Type of landmark (0=point, 1=area, 2=path)
	 */
	create: function(type){
		var action
		if (type == 2){ // path
			action = 'newArea(2)'
			delAction = 'Tool.Path.current_shape.deleted=true'
		}
		else if (type == 1){ // area
			action = 'newArea(1)'
			delAction = 'Tool.Pen.current_shape.deleted=true'
		}
		else { // point
			action = 'newPoint()'
			delAction = 'LandmarkEditor.resetCursor()'
		}
		Modalbox.show('Enter a label<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.'+action+';Modalbox.hide();LandmarkEditor.resetCursor();return false"><input type="text" id="landmarker" /><br /><br /><textarea id="desc" name="desc" style="height: 200px; width: 400px;"></textarea><br />Color: '+LandmarkEditor.colors(true)+'<input type="hidden" id="color" value="'+LandmarkEditor.colors(true,'0')+'" /><br /><input type="submit" value="Make" /><input type="button" value="Cancel" onclick="Modalbox.hide();'+delAction+';Tool.change(\'Pan\');Events.mouseup()" /></form>', {title: 'Create a landmark'})
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
			var color1 = $('color').value
			var cursorID = $('cursor').src.substring($('cursor').src.lastIndexOf('/')+1)
			new Ajax.Request('landmark.php', {
		 		method: 'get',
		  		parameters: {
					type: 0,
					points: Projection.x_to_lon(-1*Map.pointer_x())+','+Projection.y_to_lat(Map.pointer_y()),
					label: label1,
					desc: desc1,
					icon: cursorID,
					color: color1,
		  		},
		  		onSuccess: function(response) {
					var id = response.responseText
					Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, cursorID, id))
		  		},
				onFailure: function() {
					var id = LandmarkEditor.idd++ // local id created
					Landmark.landmarks.set(id, new Point(Map.pointer_x(), Map.pointer_y(), label1, desc1, cursorID, id))
				}
			})
		Tool.change('Pan')
	},
	/*
	 * Saves a polygon or path to the server
	 * @param {t} type of landmark: 1 is polygon; 2 is path
	 */
	newArea: function(t){
		var shape
		if (t == 1) {
			shape = Tool.Pen.current_shape
			Tool.Pen.mode = 'inactive'
		}
		else if (t == 2) {
			shape = Tool.Path.current_shape
			Tool.Path.mode = 'inactive'
		}
		var points = shape.points
		var label1 = $('landmarker').value
		var desc1 = $('desc').value
		var color1 = $('color').value
		var logger = ''
		shape.points.each(function(p){
			logger += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
		})
		new Ajax.Request('landmark.php', {
	 		method: 'get',
	  		parameters: {
				type: t,
				points: logger,
				label: label1,
				desc: desc1,
				color: color1,
	  		},
	  		onSuccess: function(response) {
				var id = response.responseText
				shape.setup(label1, desc1, 'blank.gif', id, color1)
				Landmark.landmarks.set(id, shape)
	  		},
			onFailure: function() {
				var id = LandmarkEditor.idd++
				shape.setup(label1, desc1, 'blank.gif', id, color1)
				Landmark.landmarks.set(id, shape)
			}
		})
		Tool.change('Pan')
		Events.mouseup()
	},
	/**
	 * This saves data about a moved point landmark to the server.
	 */
	move: function() {
		var lndmrk = Landmark.landmarks.get(Landmark.current)
		var pts = ''
		if(lndmrk instanceof Region.Shape || lndmrk instanceof Path.Shape){
			lndmrk.points.each(function(p){
				pts += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
			})
		}
		else if(Landmark.landmarks.get(Landmark.current) instanceof Point){
			pts = Projection.x_to_lon(-1*Landmark.landmarks.get(Landmark.current).x)+','+Projection.y_to_lat(Landmark.landmarks.get(Landmark.current).y)
		}
		new Ajax.Request('landmark.php', {
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
		Modalbox.show('Edit this landmark<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.editData();Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + Landmark.landmarks.get(Landmark.current).label + '"/><br /><br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + Landmark.landmarks.get(Landmark.current).desc + '</textarea><br />Color: '+LandmarkEditor.colors(false)+'<input type="hidden" id="color" value="'+Landmark.landmarks.get(Landmark.current).label+'" /><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="Delete" onclick="LandmarkEditor.remove();Modalbox.hide();Events.mouseup()" /></form>', {title: 'Edit this landmark'})
	},
	/**
	 * When called, takes the information from the editing window and sends it to the server
	 */
	editData : function() {
		var label1 = $('newName').value
		var desc1 = $('newDesc').value
		var color1 = $('color').value
		new Ajax.Request('landmark.php', {
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
	 		},
			onFailure: function(){
				var curLandmark = Landmark.landmarks.get(Landmark.current)
				curLandmark.label = label1
				curLandmark.desc = desc1
				curLandmark.color = color1
				curLandmark.descRendered = false
			}
		})
	},
	/**
	 * Deletes a landmark from the database and hides it from being displayed on the map
	 */
	remove: function() {
		if(confirm('Are you sure you want to delete this landmark entirely? Press OK to continue or Cancel to stop.')){
			new Ajax.Request('landmark.php', {
		 		method: 'get',
		  		parameters: {
					remove: Landmark.current,
		  		},
			})
			var lndmrk = Landmark.landmarks.get(Landmark.current)
			Glop.stopObserving('glop:postdraw', lndmrk.eventA)
			Glop.stopObserving('glop:descriptions', lndmrk.eventB)
			Glop.stopObserving('mousedown', lndmrk.eventC)
			Landmark.landmarks.unset(Landmark.current)
			Landmark.current = null
		}
	},
}

