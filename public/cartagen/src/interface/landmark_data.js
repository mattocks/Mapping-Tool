//= require "landmark_editor"
/**
 * @namespace Stores data about landmarks, which can be represented as points or areas
 */

Landmark = {
	landmarks: new Hash(),
	current: null,
	Data: Class.create({
		initialize: function(x,y,r,label,desc,id) {
			this.x = x
			this.y = y
			this.r = r
			this.label = label
			this.desc = desc
			this.descView = ['','','','']
			this.color = '#200'
			this.id = id
			this.dragging = false
			this.expanded = false
			this.deleted = false
			this.descRendered = false
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.click.bindAsEventListener(this))
		},
		draw: function() {
			if(!this.deleted){
			$C.save()
			$C.line_width(3/Map.zoom)
			$C.translate(this.x, this.y)
			$C.fill_style("#333")
			//$C.opacity(0.6)
			$C.stroke_style(this.color)
			$C.stroke_circ(0, 0, this.r)
			//$C.fill_style('white')
			var width
			if(this.expanded){
				width = $C.measure_text('Arial', 18, this.label1)
				$C.canvas.fillStyle = 'white'
				$C.rect(5, -259, 250, 253)
				$C.draw_text('Arial', 18, 'black', 10, -236, this.label)
				// begin drawing the description
				
				if(!this.descRendered){
					var i = 1
					var line = 0
					var start = 0
					var indexOfLastSpace = this.desc.length
					this.descView = ['','','','']
					var reachedEnd = false
						while (line < 4 && i < this.desc.length){
							console.log(start+','+i)
							if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < 240){
								this.descView[line] = this.desc.substring(start, i+1)
								if (this.desc.charAt(i) == ' '){
									indexOfLastSpace = i
								}
								
							}
							else {
								console.log('indexspace: '+indexOfLastSpace)
								console.log(this.desc.substring(start))
								this.descView[line] = this.desc.substring(start, indexOfLastSpace)
								console.log(this.descView[line])
								start = indexOfLastSpace + 1
								line++
							}
							i++
						}
					this.descRendered = true
				}
				$C.draw_text('Arial', 12, 'black', 10, -102, this.descView[0])
				$C.draw_text('Arial', 12, 'black', 10, -82, this.descView[1])
				$C.draw_text('Arial', 12, 'black', 10, -62, this.descView[2])
				$C.draw_text('Arial', 12, 'black', 10, -42, this.descView[3])
				var imag = new Image()
				imag.src = 'pic.jpg'
				//imag.onload = function(){
					$C.canvas.drawImage(imag, 10,-200)
				//	alert('yay')
				//}
			}
			else{
				width = $C.measure_text('Arial', 18, this.label)
				$C.canvas.fillStyle = 'white'
				$C.rect(5, -33, width+10, 28)
				$C.draw_text('Arial', 18, 'black', 10, -10, this.label)
			}
			
			$C.restore()

			if (this.dragging && Mouse.down) {
				this.drag()
				//console.log('dragging1')
			}
			else if (this.mouse_inside()) {
				Landmark.current = this.id
				if (Mouse.down) {
					this.drag()
					//console.log('dragging2')
				}
				else {
					this.hover()
				}
			}
			else if (this.mouse_inside_text()){
				Landmark.current = this.id
			}
			else if (this.mouse_over_edit()){
				Landmark.current = this.id
			}
			else {
				this.base()
			}
			}
		},
		mouse_inside: function() { // should be renamed or revised for clarity
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)
		},
		mouse_inside_text: function() {
			var left = this.x + 5
			var right = this.x + 10 + $C.measure_text('Arial', 18, this.label)
			var top = this.y - 33
			var bottom = this.y - 5
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom // && !this.expanded
		},
		mouse_over_edit: function() {
			var left = this.x + 104
			var right = this.x + 255
			var top = this.y - 255
			var bottom = this.y - 150
			var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
			if (over) {
				console.log('over')
			}
			return over
		},
		base: function() {
			this.color = '#200'
			this.dragging = false
			document.body.style.cursor = 'default'
		},
		
		click: function() { // seems to be a "mousedown" event rather than "click"
			Landmark.current = this.id
			if (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5) {  //&& Tool.active!='Landmark') {
				this.oldx = this.x
				this.oldy = this.y
				this.color = '#f00'
				console.log('clicked my point with label ' + this.label)
			}
			else if (this.mouse_inside_text()){
				//console.log('mouse is inside text')
				this.expanded = !this.expanded
				console.log(this.desc)

				//Modalbox.show('Edit this landmark<br /><form id="lndmrkfrm" onsubmit="Tool.Landmark.editPoint($(\'newName\').value, $(\'newDesc\').value, ' + this.id + ');Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + this.label + '"/><br /><br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + this.desc + '</textarea><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="Delete" onclick="Tool.Landmark.deletePoint('+this.id+');Modalbox.hide();Events.mouseup()"</form>', {title: 'Edit this landmark'})
			}
			else if (this.mouse_over_edit()) {
				LandmarkEditor.edit()
				//Modalbox.show('Edit this landmark<br /><form id="lndmrkfrm" onsubmit="Tool.Landmark.editPoint($(\'newName\').value, $(\'newDesc\').value, ' + this.id + ');Modalbox.hide();Events.mouseup();return false"><input type="text" id="newName" value="' + this.label + '"/><br /><br /><textarea id="newDesc" name="newDesc" style="height: 200px; width: 400px;">' + this.desc + '</textarea><br /><input type="submit" value="Edit" /><input type="button" value="Cancel" onclick="Modalbox.hide();Events.mouseup()" /><input type="button" value="Delete" onclick="Tool.Landmark.deletePoint('+this.id+');Modalbox.hide();Events.mouseup()"</form>', {title: 'Edit this landmark'})
			}
		},
		hover: function() {
			this.color = '#900'
			this.dragging = false
		},
		drag: function() {
			//console.log('dragging!!!')
			if (!this.dragging) {
				this.dragging = true
				this.drag_offset_x = Map.pointer_x() - this.x
				this.drag_offset_y = Map.pointer_y() - this.y
			}
			this.color = '#f00'
			this.x=Map.pointer_x()
			this.y=Map.pointer_y()
		},
		r: function() {
			this.color = '#00f'
		},
	})
}

