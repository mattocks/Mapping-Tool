/**
 *@namespace represents an area of a landmark
 */

Path = {
	Shape: Class.create(Landmark.Landmark, {
		initialize: function() {
			
			this.points = []
			this.active = false
			this.expanded = false
			this.dragging = false
			this.color = '#222'
			this.x = null
			this.y = null
			
			this.eventA = this.draw.bindAsEventListener(this)
			Glop.observe('glop:postdraw', this.eventA)
			this.eventB = this.drawDesc.bindAsEventListener(this)
			Glop.observe('glop:descriptions', this.eventB)
			this.eventC = this.mousedown.bindAsEventListener(this)
			Glop.observe('mousedown', this.eventC)
		},
		setup: function(label,desc,icon,id,color){
			this.label = label
			this.desc = desc
			this.icon = icon
			this.id = id
			this.color = color
			//this.drawn = true
			//$super(label,desc,icon,id)
		},
		new_point: function(x,y) {
			this.points.push(new Path.ControlPoint(x, y, 5, this))
		},
		mouse_inside: function(){
			return Geometry.is_point_in_line(this.points, Map.pointer_x(), Map.pointer_y()) && !Landmark.mouse_over_desc()
		},
		mouse_inside_text: function() {
			//var imag = new Image()
			//imag.src = this.icon
			var left = this.x - 200
			var right = this.x
			var top = this.y - 200
			var bottom = this.y
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc() // && !this.expanded
		},
		base: function(){
			//this.color="#222"
			this.dragging=false
		},
		mousedown: function() {
			if (this.mouse_inside() && Tool.active !='Path') {
				//this.active = true
				//this.color='#f00'
				this.expanded = !this.expanded
				if(this.expanded){
					this.x = Map.pointer_x()
					this.y = Map.pointer_y()
				}
				else{
					this.x = null
					this.y = null
				}
				//console.log('Clicked shape')
				this.points.each(function(point) {
					point.old_x = point.x
					point.old_y = point.y
				})
				this.first_click_x=Map.pointer_x()
				this.first_click_y=Map.pointer_y()
				if (this.active){
					if (!this.dragging){
						this.dragging=true
						Tool.change('Warp')
					}
				}
			} 
			else if (this.mouse_over_edit()) {
				Landmark.current = this.id
				console.log('edit!')
				LandmarkEditor.edit()
			}
			else if (Tool.active!='Path') {
				this.active = false
				//this.color='#000'
			}
		},
		hover: function(){
			//this.color='#900'
			this.dragging=false
			//console.log('Hover')
		},	
		draw: function() {
			//console.log('called draw in area '+this.id)
			if (this.mouse_inside()){
				if (this.dragging){
					this.drag_started=true
					//console.log('Trying to drag')
					Tool.Path.mode='drag'
					for (var i=0; i<this.points.length; i++){
						this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
						this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
					}
					//this.color = '#f00'
				}
				else if (!Mouse.down){
					this.hover()
				}
			}
			if (this.drag_started && Mouse.down){
				for (var i=0; i<this.points.length; i++){
					this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
					this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
				}
				this.color = '#f00'
			}
			if (!Mouse.down){
				this.drag_started=false
			}
			else{
				this.base()
			}
			
				$C.save()
				$C.stroke_style(this.color)
				if (this.active) $C.line_width(3)
				else $C.line_width(3)
				$C.begin_path()
				if (this.points.length>0){
					$C.move_to(this.points[0].x, this.points[0].y)		
					this.points.each(function(point) {
						$C.line_to(point.x, point.y)
					})
					//if (this.drawn){			
						//$C.line_to(this.points[0].x, this.points[0].y) // counterintuitive to have a line from last to first point, until shape closes
					//}
				}
				$C.opacity(0.5)
				$C.stroke()
				//$C.fill() // this is the difference between an area and a path! perhaps a small flag (variable) could make some quick distinctions
				$C.restore()
		},
	}),
	ControlPoint: Class.create({
		initialize: function(x,y,r,parent) {
			this.x = x
			this.y = y
			this.r = r
			this.parent_shape = parent
			this.color = '#200'
			this.dragging = false
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.click.bindAsEventListener(this))
		},
		// this gets called every frame:
		draw: function() {
			if (this.parent_shape.active) {
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
			if (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r  && Tool.active!='Path') {
				this.color = '#f00'
				//console.log('clicked control point')
				this.parent_shape.active = true

			}
		},
		hover: function() {
			this.color = '#900'
			this.dragging = false
		},
		drag: function() {
			if (this.parent_shape.active  /*&& Geometry.distance(this.x, this.y, Map.pointer)*/) {
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
	}),
}
