ControlPoint = Class.create({
	initialize: function(x,y,r,parent) {
		this.x = x
		this.y = y
		this.r = r
		this.parent_shape = parent
		this.color = '#200'
		this.dragging = false
		this.eventA = this.draw.bindAsEventListener(this)
		this.eventB = this.click.bindAsEventListener(this)
		Glop.observe('glop:postdraw', this.eventA)
		Glop.observe('mousedown', this.eventB)
	},
	// this gets called every frame:
	draw: function() {
		if ((this.parent_shape.active || Landmark.mode == 'dragging' || this.parent_shape.type == 'Measure') && !this.hidden) {
			$C.save()
			$C.line_width(3/Map.zoom)
			// go to the object's location:
			$C.translate(this.x,this.y)
			// draw the object:
			$C.fill_style("#333")
			$C.stroke_style(this.color)
			$C.opacity(0.6)
			if (this.parent_shape.locked) {
				$C.begin_path()
				$C.move_to(-6/Map.zoom,-6/Map.zoom)
				$C.line_to(6/Map.zoom,6/Map.zoom)
				$C.move_to(-6/Map.zoom,6/Map.zoom)
				$C.line_to(6/Map.zoom,-6/Map.zoom)
				$C.stroke()
			} else {
				if (this.mouse_inside()) $C.circ(0, 0, this.r/Map.zoom)
				$C.stroke_circ(0, 0, this.r/Map.zoom)
			}
			$C.restore()
		}
		if (this.dragging && Mouse.down) {
			//console.log(this.color)
			//Tool.change('Warp')
			this.drag()
		} 
		else if (this.mouse_inside()) {
			//console.log(this.color)
			if (Mouse.down) {
				this.drag()
			}
			else {
				this.hover()
			}
		}
		else {
			this.base()
		}
	},
	mouse_inside: function() {
		return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r/Map.zoom) && !Landmark.mouse_over_desc() &&
		(Landmark.dragging == true || this.parent_shape.active)
	},
	base: function() {
		this.color = '#200'
		this.dragging = false
	},
	click: function() {
		if (this.mouse_inside()) {
			this.color = '#f00'
			this.parent_shape.active = true
			Landmark.current = this.parent_shape.id
			Landmark.over_point = true
			this.parent_shape.inside_point = true
			//LandmarkEditor.setCurrent(this)
			Landmark.obj = this
		}
	},
	hover: function() {
		this.color = '#900'
		this.dragging = false
	},
	drag: function() {
		if (this.parent_shape.active && Landmark.obj == this) {
			if (!this.dragging) {
				this.dragging = true
				this.drag_offset_x = Map.pointer_x() - this.x
				this.drag_offset_y = Map.pointer_y() - this.y
			}
			this.color = '#f00'
			this.x=Map.pointer_x()
			this.y=Map.pointer_y()
		}
	}
})
