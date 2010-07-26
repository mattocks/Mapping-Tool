ControlPoint = Class.create({
	initialize: function(x,y,r,parent) {
		this.x = x
		this.y = y
		this.r = r
		this.parent_shape = parent
		this.color = '#200'
		this.dragging = false
		if(parent instanceof Region){
			this.tool = 'Region'
		}
		else if (parent instanceof Path){
			this.tool = 'Path'
		}
		else if (parent instanceof Ellipse){
			this.tool = 'Ellipse'
		}
		else if (parent instanceof Rectangle){
			this.tool = 'Rectangle'
		}
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
			$C.opacity(0.6)
			if (this.parent_shape.locked) {
				$C.begin_path()
				$C.move_to(-6/Map.zoom,-6/Map.zoom)
				$C.line_to(6/Map.zoom,6/Map.zoom)
				$C.move_to(-6/Map.zoom,6/Map.zoom)
				$C.line_to(6/Map.zoom,-6/Map.zoom)
				$C.stroke()
			} else {
				if (this.mouse_inside()) $C.circ(0, 0, this.r)
				$C.stroke_circ(0, 0, this.r)
			}
			$C.restore()
		}
		
		/* var nodestring = ''
		nodes.each(function(node) {
			nodestring += '(' + node[0] + ', ' + node[1] + ')\n'
		})*/
		
		if (this.dragging && Mouse.down) {
			//Tool.change('Warp')
			this.drag()
		} 
		else if (this.mouse_inside()) {
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
		return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r) && !Landmark.mouse_over_desc()
	},
	mouse_inside_text: function(){
	},
	base: function() {
		this.color = '#200'
		this.dragging = false
	},
	click: function() {
		if (this.mouse_inside()  && Tool.active!=this.tool) {
			this.color = '#f00'
			//console.log('clicked control point')
			this.parent_shape.active = true
			Landmark.current = this.parent_shape.id
			Tool.Warp.over_point = true
			if(Tool.Warp.obj == null){
				Tool.Warp.obj = this
			}
		}
	},
	hover: function() {
		this.color = '#900'
		this.dragging = false
	},
	drag: function() {
		//console.log(Tool.Warp.obj)
		if (this.parent_shape.active && Tool.Warp.obj == this /*&& Geometry.distance(this.x, this.y, Map.pointer)*/) {
			if (!this.dragging) {
				this.dragging = true
				this.drag_offset_x = Map.pointer_x() - this.x
				this.drag_offset_y = Map.pointer_y() - this.y
			}
			this.color = '#f00'
			this.x=Map.pointer_x()
			this.y=Map.pointer_y()
		}
	},
	r: function() {
		this.color = '#00f'
	}
})
