//= require "landmark_region"

Rectangle = Class.create(Region, {
	initialize: function($super, pts, label, desc, id, color, tags, timestamp){
		$super(pts, label, desc, id, color, tags, timestamp)
		this.eventD = this.mouseup.bindAsEventListener(this)
		Glop.observe('mouseup', this.eventD)
	},
	make_rectangle: function(){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i] == Tool.Editor.obj){
				if(this.pt == null){
					this.pt = i // keep track here for now
				}
			}
			else{
				this.points[i].hidden = true
			}
		}
		if(this.pt == 0){
			//console.log('moving 0')
			this.points[3].x = this.points[0].x
			this.points[1].y = this.points[0].y
		}
		else if(this.pt == 1){
			//console.log('moving 1')
			this.points[2].x = this.points[1].x
			this.points[0].y = this.points[1].y
		}
		else if(this.pt == 2){
			//console.log('moving 2')
			this.points[1].x = this.points[2].x
			this.points[3].y = this.points[2].y
		}
		else if(this.pt == 3){
			//console.log('moving 3')
			this.points[0].x = this.points[3].x
			this.points[2].y = this.points[3].y
		}	
	},
	mouseup: function(){
		this.make_rectangle()
		console.log(this.pt)
		this.pt = null
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
		if (Tool.Editor.over_point){
			if(Tool.active == 'Editor'){
				if(Tool.Editor.obj.parent_shape == this){	
					this.make_rectangle()
				}			
			}
			else if(Tool.active == 'Rectangle'){
				this.make_rectangle()
			}
		}
		else if ((Tool.active == 'Rectangle'||Tool.active == 'Editor')&&!Mouse.down){
			this.points.each(function(point){
				point.hidden = false
			})
		}
		if(!this.finished && !Mouse.down){
			//console.log('finishing')
			this.finished = true
			this.make_rectangle()
			this.pt = null
		}
		$C.save()
		if (this.active) $C.line_width(2)
		else $C.line_width(2)
		var stroke_opacity = 1
		if(this.highlighted){
			$C.stroke_style('#FF0')
			$C.line_width(12)
			stroke_opacity = 1
		}
		else{
			$C.stroke_style(this.color)
		}
		$C.fill_style(this.color)
		$C.begin_path()
		if (this.points.length>0){
			$C.move_to(this.points[0].x, this.points[0].y)		
			this.points.each(function(point) {
				$C.line_to(point.x, point.y)
			})
			$C.line_to(this.points[0].x, this.points[0].y)
		}
		$C.opacity(0.3)
		$C.fill()
		$C.opacity(stroke_opacity)
		$C.stroke()
		$C.restore()
	},
	remove: function($super){
		$super()
		Glop.stopObserving('mouseup', this.eventD)
		this.points.each(function(p){
			Glop.stopObserving('glop:postdraw', p.eventA)
			Glop.stopObserving('mousedown', p.eventB)
		})
	}
})
