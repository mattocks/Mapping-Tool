/**
 *@namespace represents an area of a landmark
 */

Region = {
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
		},
		new_point: function(x,y) {
			this.points.push(new Landmark.ControlPoint(x, y, 5, this))
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
			return Geometry.is_point_in_poly(this.points, Map.pointer_x(), Map.pointer_y()) && !Landmark.mouse_over_desc() && !a
		},
		mouse_inside_text: function() {
			//var imag = new Image()
			//imag.src = this.icon
			var left = this.x - 200
			var right = this.x
			var top = this.y - 200
			var bottom = this.y
			return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom // && !this.expanded
		},
		base: function(){
			//this.color="#222"
			this.dragging=false
		},
		mousedown: function($super) {
			if (this.mouse_inside() && Tool.active !='Pen') {
				Landmark.current = this.id
				//this.active = true
				//this.color='#f00'
				if(Landmark.mode != 'dragging'){
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
			} 
			else if (this.mouse_over_edit()) {
				Landmark.current = this.id
				LandmarkEditor.edit()
			}
			else if (Tool.active!='Pen') {
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
		draw: function() {
			if(Landmark.mode == 'dragging'){
				this.active = true
			}
			else{
				this.active = false
			}
			//console.log('called draw in area '+this.id)
			if (this.mouse_inside()){
				if (this.dragging){
					this.drag_started=true
					//console.log('Trying to drag')
					Tool.Pen.mode='drag'
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
				//this.color = '#f00'
			}
			if (!Mouse.down){
				this.drag_started=false
			}
			else{
				this.base()
			}
			
				$C.save()
				//$C.stroke_style('#000')
				$C.stroke_style(this.color)
				$C.fill_style(this.color)
				if (this.active) $C.line_width(2)
				else $C.line_width(2)
				$C.begin_path()
				if (this.points.length>0){
					$C.move_to(this.points[0].x, this.points[0].y)		
					this.points.each(function(point) {
						$C.line_to(point.x, point.y)
					})			
					$C.line_to(this.points[0].x, this.points[0].y)

				}
				$C.opacity(0.7)
				$C.stroke()
				$C.opacity(0.3)
				$C.fill()
				$C.restore()
		},
	}),
}
