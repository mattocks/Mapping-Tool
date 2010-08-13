/**
 *@namespace represents an area of a landmark
 */

Path = Class.create(Landmark.Landmark, {
	initialize: function($super, type, pts, label, desc, id, color, tags, timestamp) {
		this.type = type // default is null (for a path); can also be 'Freeform' or 'Measure' for respective tools
		$super(label,desc,id,tags)
		this.timestamp = timestamp
		this.pts = pts != null ? pts : []
		this.points = []
		this.pts.each(function(node) {
			var r = this.type == 'Freeform' ? 0 : 10
			this.points.push(new ControlPoint(Projection.lon_to_x(node[0]), Projection.lat_to_y(node[1]), r, this))
		}, this)
		this.active = timestamp != null ? false : true
		this.expanded = false
		this.dragging = false
		this.color = color != null ? color : '#222'
		this.x = null
		this.y = null
		this.inside_point = false
		this.eventA = this.draw.bindAsEventListener(this)
		Glop.observe('glop:postdraw', this.eventA)
		this.eventB = this.drawDesc.bindAsEventListener(this)
		Glop.observe('glop:descriptions', this.eventB)
		this.eventC = this.mousedown.bindAsEventListener(this)
		Glop.observe('mousedown', this.eventC)
	},
	new_point: function(x,y) {
		if(this.type == 'Freeform'){
			this.points.push(new ControlPoint(x, y, 0, this))
		}
		else {
			this.points.push(new ControlPoint(x, y, 10, this))
		}
	},
	mouse_inside: function(){
		var a = false
		if(Landmark.mode == 'dragging'){
		this.points.each(function(p){
			if(p.mouse_inside()){
				a = true
				throw $break
			}
		})
		}
		return Geometry.is_point_in_line(this.points, Map.pointer_x(), Map.pointer_y()) && !Landmark.mouse_over_desc() && !a && Tool.active != 'Measure'
	},
	base: function(){
		//this.color="#222"
		//this.dragging=false
	},
	mousedown: function($super) {
		if (this.mouse_inside()) {
			this.first_click_x=Map.pointer_x()
			this.first_click_y=Map.pointer_y()
			this.points.each(function(point) {
				point.old_x = point.x
				point.old_y = point.y
			})
			if (this.active){
				if (!this.dragging){
					this.dragging=true
				}
			}
			if(!Landmark.mouse_over_point_landmark()){
				if(!this.inside_point){
					LandmarkEditor.setCurrent(this)
				}
			}
			Tool.Editor.over = true
			if(Tool.active !='Path'){
				Landmark.current = this.id
				if(Landmark.mode != 'dragging'){
					this.expanded = !this.expanded
				}
				if(this.expanded){
					this.x = Map.pointer_x()
					this.y = Map.pointer_y()
				}
				else{
					this.x = null
					this.y = null
				}
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
		console.log(''+this.inside_point)
		if(!this.inside_point){
		this.drag_started=true
		console.log('Trying to drag')
		Tool.Path.mode='drag'
		for (var i=0; i<this.points.length; i++){
			this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
			this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
		}
		}
	},
	draw: function() {
		//console.log('called draw in area '+this.id)
		if (this.mouse_inside()){
			if (this.dragging){
				this.drag()
				//this.color				Tool.Editor.over = true = '#f00'
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
			this.dragging = false
			this.inside_point = false
		}
		else{
			this.base()
		}
		$C.save()
		if (this.active) $C.line_width(3)
		else $C.line_width(3)
		var stroke_opacity = 0.5
		if(this.highlighted){
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
		}
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
