/**
 * @namespace Landmark stuff
 */

Point = Class.create(Landmark.Landmark, {
		initialize: function($super,x,y,label,desc,icon,id) {
			$super(label,desc,icon,id)
			this.x = x
			this.y = y
			this.r = 5
			this.color = '#200'
			this.dragging = false
			this.expanded = false
			this.eventA = this.draw.bindAsEventListener(this)
			Glop.observe('glop:postdraw', this.eventA)
			this.eventB = this.drawDesc.bindAsEventListener(this)
			Glop.observe('glop:descriptions', this.eventB)
			this.eventC = this.mousedown.bindAsEventListener(this)
			Glop.observe('mousedown', this.eventC)
		},
		draw: function() {
			//console.log('called draw in point '+this.id)
			$C.save()
			$C.line_width(3/Map.zoom)
			$C.translate(this.x, this.y)
			$C.fill_style("#333")
			//$C.opacity(0.6)
			if(Landmark.mode == 'dragging'){
			$C.stroke_style(this.color)
			$C.stroke_circ(0, 0, this.r)
			}
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
		},
		mouse_inside: function() { // should be renamed or revised for clarity
			if(Landmark.mode == 'dragging'){
				return (this.mouse_inside_text()||(Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)) && !Landmark.mouse_over_desc()
			}
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5) && !Landmark.mouse_over_desc()
		},
		// temporarily sees if it is over the pushpin marker
		mouse_inside_text: function() {
			//var imag = new Image()
			//imag.src = this.icon
			var left = this.x - 160
			var right = this.x
			var top = this.y - 160
			var bottom = this.y
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc() // && !this.expanded
		},
		mousedown: function($super) {
			Landmark.current = this.id
			if (this.mouse_inside()) {  //&& Tool.active!='Landmark') {
				this.oldx = this.x
				this.oldy = this.y
				this.color = '#f00'
				//console.log('clicked my point with label ' + this.label)
			}
			else if (this.mouse_inside_text() && Landmark.mode != 'dragging'){
				this.expanded = !this.expanded
				//console.log(this.desc)
			}
			else if (Landmark.mode == 'dragging'){
				//Tool.change('Landmark')
			}
			else if (this.mouse_over_edit()) {
				LandmarkEditor.edit()
			}
			else {
				$super()
			}
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
			this.expanded = false
			//console.log('dragging!!!')
			if (!this.dragging) {
				this.dragging = true
				this.drag_offset_x = Map.pointer_x() - this.x
				this.drag_offset_y = Map.pointer_y() - this.y
			}
			this.color = '#f00'
			this.x=Map.pointer_x() - this.drag_offset_x
			this.y=Map.pointer_y() - this.drag_offset_y
		},
		r: function() {
			this.color = '#00f'
		},
	})
