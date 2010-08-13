/**
 *@namespace represents an area of a landmark
 */
Region = Class.create(Landmark.Landmark, {
	initialize: function($super, pts, label, desc, id, color, tags, timestamp) {
		$super(label,desc,id,tags)
		this.timestamp = timestamp
		this.pts = pts != null ? pts : []
		this.points = []
		this.pts.each(function(node) {
			this.points.push(new ControlPoint(Projection.lon_to_x(node[0]), Projection.lat_to_y(node[1]), 10, this))
		}, this)
		this.active = timestamp != null ? false : true
		this.expanded = false
		this.dragging = false
		this.color = color != null ? color : '#222'
		this.x = null
		this.y = null
		this.pt = null
		this.eventA = this.draw.bindAsEventListener(this)
		Glop.observe('glop:postdraw', this.eventA)
		this.eventB = this.drawDesc.bindAsEventListener(this)
		Glop.observe('glop:descriptions', this.eventB)
		this.eventC = this.mousedown.bindAsEventListener(this)
		Glop.observe('mousedown', this.eventC)
	},
	new_point: function(x,y) {
		this.points.push(new ControlPoint(x, y, 10, this))
	},
	mouse_inside: function(){
		var a = false
		if(Landmark.mode == 'dragging' || this.active){
			this.points.each(function(p){
				if(p.mouse_inside() /*&& this.active*/){
					a = true
					throw $break
				}
			})
		}
		return Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y()) && !Landmark.mouse_over_desc() && !a && Tool.active != 'Measure' && !Landmark.action_performed && !Landmark.mouse_over_point_landmark()
	},
	base: function(){
		//this.color="#222"
		this.dragging=false
	},
	mousedown: function($super) {
		if (this.mouse_inside() && Tool.active !='Region') {
			Landmark.current = this.id
			Tool.Editor.over = true
			//this.color='#f00'
			if(Landmark.mode != 'dragging' && Tool.active == 'Pan'){
				this.expanded = !this.expanded
			}
			if(this.expanded && this.x==null & this.y==null){
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
				}
			}
			var over_point = false
			this.points.each(function(point){
				if (point.mouse_inside()) {
					over_point = true
					throw $break
				}
			
			})
			if(!Landmark.mouse_over_point_landmark()){
				LandmarkEditor.setCurrent(this)
			}
		} 
		else if (this.mouse_over_edit()) {
			Landmark.current = this.id
			LandmarkEditor.edit()
		}
		$super()
	},
	hover: function(){
		//this.color='#900'
		this.dragging=false
		//console.log('Hover')
	},
	drag: function(){
		if(Tool.Editor.obj == this){
			this.drag_started=true
			Tool.Region.mode='drag'
			for (var i=0; i<this.points.length; i++){
				this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
				this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
			}
		}
	},
	draw: function() {
		if (this.mouse_inside()){
			if (this.dragging){
				this.drag()
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
		}
		if (!Mouse.down){
			this.drag_started=false
		}
		else{
			this.base()
		}
		$C.save()
		$C.fill_style(this.color)
		if (this.active) $C.line_width(2)
		else $C.line_width(2)
		var stroke_opacity = 0.7
		if(this.highlighted){
			//255,174,0
			$C.stroke_style('rgb(255,255,0)')
			$C.line_width(12)
			stroke_opacity = 1
		}
		else{
			$C.stroke_style(this.color)
		}
		$C.begin_path()
		if (this.points.length>0){
			$C.move_to(this.points[0].x, this.points[0].y)		
			this.points.each(function(point) {
				$C.line_to(point.x, point.y)
			})			
			//$C.line_to(this.points[0].x, this.points[0].y)
			$C.canvas.closePath()
		}
		$C.opacity(0.3)
		$C.fill()
		$C.opacity(stroke_opacity)
		$C.stroke()
		$C.restore()
	},
	remove: function($super){
		$super()
		this.points.each(function(p){
			Glop.stopObserving('glop:postdraw', p.eventA)
			Glop.stopObserving('mousedown', p.eventB)
		})
	}
})
