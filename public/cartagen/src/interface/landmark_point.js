//= require "landmark_data"

/**
 * @namespace Landmark stuff
 */

Landmark.Point =  Class.create({
		initialize: function(data) {
			this.x = data.x
			this.y = data.y
			//this.x = x
			//this.y = y
			this.r = 5
			this.label = data.label
			this.desc = data.desc
			this.icon = data.icon
			//this.descView = ['','','','']
			this.color = '#200'
			this.id = data.id
			this.dragging = false
			this.expanded = false
			//this.deleted = false
			this.descRendered = false
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('glop:descriptions', this.drawDesc.bindAsEventListener(this))
			//Glop.observe('mousedown', this.click.bindAsEventListener(this)) /*moved to landmark_data*/
		},
		draw: function() {
			//console.log('called draw in point '+this.id)
			if(!this.deleted){
			$C.save()
			$C.line_width(3/Map.zoom)
			$C.translate(this.x, this.y)
			$C.fill_style("#333")
			//$C.opacity(0.6)
			$C.stroke_style(this.color)
			$C.stroke_circ(0, 0, this.r)
			var width
			var imag = new Image()
			imag.src = this.icon
			$C.canvas.drawImage(imag, -imag.width, -imag.height)
			if(this.expanded){
				// description open
				//Landmark.landmarks.get(this.id).showDescription()
			}
			else{
				// stuff to do when description is closed
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
		drawDesc: function(){
				//$C.save()
				if(this.expanded){
				// description open
					$C.opacity(1)
					//$C.translate(this.x, this.y)
				Landmark.landmarks.get(this.id).showDescription()
				}
				else{
				// stuff to do when description is closed
				}
				//$C.restore()
		},
		mouse_inside: function() { // should be renamed or revised for clarity
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)
		},
		/*
		mouse_inside_text: function() {
			var left = this.x + 5/Map.zoom
			var right = this.x + (10 + $C.measure_text('Arial', 18, this.label))/Map.zoom
			var top = this.y - 33/Map.zoom
			var bottom = this.y - 5/Map.zoom
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom // && !this.expanded
		},
		*/
		// temporarily sees if it is over the pushpin marker
		mouse_inside_text: function() {
			//var imag = new Image()
			//imag.src = this.icon
			var left = this.x - 200
			var right = this.x
			var top = this.y - 200
			var bottom = this.y
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom // && !this.expanded
		},
		mouse_over_edit: function() {
			var left = this.x + 104/Map.zoom
			var right = this.x + 255/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 150/Map.zoom
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
