/**
 * @namespace The 'Pen' tool and associated methods.
 */
Tool.Pen = {
	/**
	 * The tool mode can be 'drawing' when the user is in the process of adding 
	 * points to the polygon, or 'inactive' when a polygon has not yet begun.
	 */
	mode: 'inactive', //'draw','inactive','drag'
	/**
	 * The polygon currently being drawn. 
	 */
	current_poly: null,
	shapes: [],
	drag: function() {
		$l('Pen dragging')
	},
	activate: function() {
		$l('Pen activated')
	},
	deactivate: function() {
		$l('Pen deactivated')
	},
	mousedown: function() {
		console.log('mousedown in pen')
		if (Tool.Pen.mode == 'inactive') {
		} 
		else if (Tool.Pen.mode == 'draw') {
			var over_point = false
			Tool.Pen.shapes.last().points.each(function(point){
				if (point.mouse_inside()) over_point = true
				console.log(point.mouse_inside())
			})
			if (!over_point) { // if you didn't click on an existing node
				Tool.Pen.shapes.last().new_point(Map.pointer_x(), Map.pointer_y())
				Tool.Pen.shapes.last().active = true
			}
		}
		else if (Tool.Pen.mode == 'drag'){
			Tool.Pen.shapes.last().active=true
		}
		
	}.bindAsEventListener(Tool.Pen),
	mouseup: function() {
		$l('Pen mouseup')
	}.bindAsEventListener(Tool.Pen),
	mousemove: function() {
		$l('Pen mousemove')
	}.bindAsEventListener(Tool.Pen),
	dblclick: function() {
		alert('closed')
		$l('Pen dblclick')
		// Tool.Pen.mode = 'inactive'
		// Did we end inside the first control point of the polygon?
		if (true) {
			// close the poly
			Tool.Pen.mode = 'inactive'
			Tool.change('Pan') //Hi!!
		}
		/*
		var logger = ''
		Tool.Pen.shapes.last().points.each(function(p){
			logger += p.y + ','
		})
		console.log(logger)
		*/
		// complete and store polygon
		Tool.Pen.save(Tool.Pen.shapes.last())
	}.bindAsEventListener(Tool.Pen),
	new_shape: function() {
		Tool.change("Pen")
		Tool.Pen.mode='draw'
		Tool.Pen.shapes.push(new Tool.Pen.Shape([]))	
	},
	/*
	 * Saves a shape to the server
	 */
	save: function(shape){
		var points = shape.points
		var logger = ''
		shape.points.each(function(p){
			logger += Projection.x_to_lon(-1*p.x) + ',' + Projection.y_to_lat(p.y) + ' '
		})
		
		new Ajax.Request('landmark.php', {
	 		method: 'get',
	  		parameters: {
				points: logger,
				/*
				lon: Projection.x_to_lon(-1*Map.pointer_x()),
				lat: Projection.y_to_lat(Map.pointer_y()),
				label: label1,
				desc: desc1,
				icon: $('cursor').src.substring($('cursor').src.lastIndexOf('/')+1),
				*/
				
	  		},
	  		onSuccess: function(response) {
				var id = response.responseText
				//Tool.Landmark.points.push(new Tool.Landmark.MyPoint(Map.pointer_x(), Map.pointer_y(), 5, labelName, id))
	  		},
			onFailure: function() {
				alert('No connection to central server')
			}
		})
	},
	Shape: Class.create({
		initialize: function(nodes) {
			this.active = false
			this.points = []//$A(
			this.dragging=false
			this.color='#222'
			
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.mousedown.bindAsEventListener(this))
		},
		new_point: function(x,y) {
			this.points.push(new Tool.Pen.ControlPoint(x, y, 5, this))
		},
		mouse_inside: function(){
			if (Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y())){
				console.log('Mouse in point')
			}
			return Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y())
		},
		base: function(){
			this.color="#222"
			this.dragging=false
		},
		mousedown: function() {
			if (Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y()) && Tool.active !='Pen') {
				this.active = true
				this.color='#f00'
				console.log('Clicked shape')
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
			else if (Tool.active!='Pen') {
				this.active = false
				this.color='#000'
			}
		},
		hover: function(){
			this.color='#900'
			this.dragging=false
			console.log('Hover')
		},	
		draw: function() {
			if (this.mouse_inside()){
				if (this.dragging){
					this.drag_started=true
					console.log('Trying to drag')
					Tool.Pen.mode='drag'
					for (var i=0; i<this.points.length; i++){
						this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
						this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
					}
					this.color = '#f00'
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
				$C.stroke_style('#000')
				$C.fill_style(this.color)
				if (this.active) $C.line_width(2)
				else $C.line_width(0)
				$C.begin_path()
				if (this.points.length>0){
					$C.move_to(this.points[0].x, this.points[0].y)		
					this.points.each(function(point) {
						$C.line_to(point.x, point.y)
					})			
					$C.line_to(this.points[0].x, this.points[0].y)

				}
				$C.opacity(0.4)
				$C.stroke()
				$C.opacity(0.2)
				$C.fill()
				$C.restore()
		}
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
			// transform to 1:1 scale pixelwise (the map is not at this scale by default)
			// first, save the transformation matrix:
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
			
			/*var nodestring = ''
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
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r)
		},
		base: function() {
			this.color = '#200'
			this.dragging = false
		},
		click: function() {
			if (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r  && Tool.active!='Pen') {
				this.color = '#f00'
				console.log('clicked control point')
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
