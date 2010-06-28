//= require "landmark_editor"
/**
 * @namespace Stores data about landmarks, which can be represented as points or areas
 */

Landmark = {
	landmarks: new Hash(),
	current: null,
	Data: Class.create({
		initialize: function(pts,label,desc,icon,id) {
			//this.x = x
			//this.y = y
			this.id = id
			this.r = 5
			this.descView = ['','','','']
			this.color = '#200'
			// this.dragging = false
			// this.expanded = false
			this.deleted = false
			this.descRendered = false
			this.label = label
			this.desc = desc
			this.icon = icon
			if(pts instanceof Landmark.Area.Shape){
				this.obj = pts
				this.obj.id = id
			}
			else{
				this.x = pts.x
				this.y = pts.y
				this.obj = new Landmark.Point(this)
			}
			//Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.click.bindAsEventListener(this))
		},
		showDescription: function(){
				$C.save()
				$C.translate(this.x, this.y)
				//console.log('drawing desc for ' + this.id)
				$C.scale(1/Map.zoom, 1/Map.zoom)
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
				$C.restore()
		},
		click: function() {
			Landmark.current = this.id
			if (this.obj.mouse_inside()) {  //&& Tool.active!='Landmark') {
				this.oldx = this.x
				this.oldy = this.y
				this.color = '#f00'
				console.log('clicked my point with label ' + this.label)
			}
			else if (this.obj.mouse_inside_text()){
				this.obj.expanded = !this.obj.expanded
				console.log(this.desc)
			}
			else if (this.obj.mouse_over_edit()) {
				LandmarkEditor.edit()
			}
		},
	}),
}

