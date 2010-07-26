/**
 *@namespace represents an area of a landmark
 */

Path = Class.create(Landmark.Landmark, {
	initialize: function(type) {
		this.type = type // default is null (for a path); can also be 'Freeform' or 'Measure' for respective tools
		this.points = []
		this.active = true
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
	new_point: function(x,y) {
		if(this.type == 'Freeform'){
			this.points.push(new ControlPoint(x, y, 0, this))
		}
		else {
			this.points.push(new ControlPoint(x, y, 6, this))
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
	mouse_inside_text: function() {
		return false
	},
	base: function(){
		//this.color="#222"
		this.dragging=false
	},
	mousedown: function($super) {
		if (this.mouse_inside() && Tool.active !='Path') {
			Landmark.current = this.id
			Tool.Warp.over = true
			//this.active = true
			//this.color='#f00'
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
			if(Tool.Warp.obj == null){
				Tool.Warp.obj = this
			}
		} 
		else if (this.mouse_over_edit()) {
			Landmark.current = this.id
			LandmarkEditor.edit()
		}
		else if (Tool.active!='Path') {
			this.active = false
			//this.color='#000'
		}
		$super()
	},
	hover: function(){
		//this.color='#900'
		this.dragging=false
		//console.log('Hover')
	},	
	drag: function(){
				this.drag_started=true
				//console.log('Trying to drag')
				Tool.Path.mode='drag'
				for (var i=0; i<this.points.length; i++){
					this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
					this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
				}
	},
	draw: function() {
		//console.log('called draw in area '+this.id)
		if (this.mouse_inside()){
			if (this.dragging){
				this.drag()
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
			}
			$C.opacity(0.5)
			$C.stroke()
			//$C.fill()
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
