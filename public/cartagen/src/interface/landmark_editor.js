/**
 * @namespace Methods for editing landmarks
 */
LandmarkEditor = {
	begin: function(){
		Modalbox.show('<span>Select an icon for your landmark.<br /><img src="pushpin1.gif" onclick="LandmarkEditor.changeCursor(this.src)" /> <img src="pushpin5.gif" onclick="LandmarkEditor.changeCursor(this.src)" /></span>', {title: 'Create a landmark'})
	},
	changeCursor: function(img){
		$('cursor').src = img
		$('main').observe('mousemove', LandmarkEditor.moveCursor)
		$('cursorbox').observe('mousemove', LandmarkEditor.moveCursor)
		Modalbox.hide()
	},

	moveCursor: function(e){
		var x = Event.pointerX(e)
		var y = Event.pointerY(e)
		$('cursorbox').style.display = 'inline'
		$('cursorbox').style.left = (x+1)+'px'
		$('cursorbox').style.top = (y-$('cursor').height)+'px'
	},

	resetCursor: function(){
		$('cursorbox').style.display = 'none'
		$('main').stopObserving('mousemove', LandmarkEditor.moveCursor)
		$('cursorbox').stopObserving('mousemove', LandmarkEditor.moveCursor)
	},
	create: function(){
		Modalbox.show('Enter a label<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.newPoint();Modalbox.hide();LandmarkEditor.resetCursor();return false"><input type="text" id="landmarker" /><br /><br /><textarea id="desc" name="desc" style="height: 200px; width: 400px;"></textarea><br /><input type="submit" value="Make" /><input type="button" value="Cancel" onclick="Modalbox.hide()" /></form>', {title: 'Create a landmark'})
	},
	newPoint : function(){
			// stores the landmark in the database
			var label1 = $('landmarker').value
			var desc1 = $('desc').value
			new Ajax.Request('landmark.php', {
		 		method: 'get',
		  		parameters: {
					lon: Projection.x_to_lon(-1*Map.pointer_x()),
					lat: Projection.y_to_lat(Map.pointer_y()),
					label: label1,
					desc: desc1,
					icon: $('cursor').src.substring($('cursor').src.lastIndexOf('/')+1),
		  		},
		  		onSuccess: function(response) {
					var id = response.responseText
					//Tool.Landmark.points.push(new Tool.Landmark.MyPoint(Map.pointer_x(), Map.pointer_y(), 5, labelName, id))
					Landmark.landmarks.set(id, new Landmark.Data(Map.pointer_x(), Map.pointer_y(), 5, label1, desc1, id))
		  		},
				onFailure: function() {
					alert('No connection to central server')
				}
			})
		Tool.change('Pan')
	},
	move: function() {
		new Ajax.Request('landmark.php', {
				method: 'get',
		 		parameters: {
				id: Landmark.current,
				lon: Projection.x_to_lon(-1*Landmark.landmarks.get(Landmark.current).x),
				lat: Projection.y_to_lat(Landmark.landmarks.get(Landmark.current).y)
		 		},
			onSuccess: function(response) {
			}
		})
	},
	edit: function(){
		Modalbox.show('Edit this landmark<br /><form id="lndmrkfrm" onsubmit="LandmarkEditor.editData();Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + Landmark.landmarks.get(Landmark.current).label + '"/><br /><br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + Landmark.landmarks.get(Landmark.current).desc + '</textarea><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="Delete" onclick="LandmarkEditor.remove();Modalbox.hide();Events.mouseup()"</form>', {title: 'Edit this landmark'})
	},
	editData : function(){
		// updates landmark name in the database
		label1 = $('newName').value
		desc1 = $('newDesc').value
		new Ajax.Request('landmark.php', {
			method: 'get',
			parameters: {
				id: Landmark.current,
				label: label1,
				desc: desc1,
		 		},
			onSuccess: function(response) {
				var curLandmark = Landmark.landmarks.get(Landmark.current)
				curLandmark.label = label1
				curLandmark.desc = desc1
				curLandmark.descRendered = false
	 		}
		})
	},
	remove: function() {
		if(confirm('Are you sure you want to delete this landmark entirely? Press OK to continue or Cancel to stop.')){
			new Ajax.Request('landmark.php', {
		 		method: 'get',
		  		parameters: {
					remove: Landmark.current,
		  		},
			})
			Landmark.landmarks.get(Landmark.current).deleted = true
			Landmark.landmarks.unset(Landmark.current)
		}
	},
}

