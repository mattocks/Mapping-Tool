//= require "region"
/**
 * An Ellipse landmark - subclass of Region
 */

Ellipse = Class.create(Region, {
	centerX: function(){
		return (this.points[3].x + this.points[1].x)/2;
	},
	centerY: function(){
		return (this.points[2].y + this.points[0].y)/2;
	},
	width: function(){
		return this.points[3].x - this.points[1].x;
	},
	height: function(){
		return this.points[2].y - this.points[0].y;
	},
	drag: function(){
		this.drag_started=true
		for (var i=0; i<this.points.length; i++){
			this.points[i].x=this.points[i].old_x + (Map.pointer_x()-this.first_click_x)
			this.points[i].y=this.points[i].old_y + (Map.pointer_y()-this.first_click_y)
		}	
	},
	/**
	 * Adjusts the points to the edges of the ellipse
	 */
	make_ellipse: function(){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i]==Landmark.obj){
				if(this.currentX == null && this.currentY == null){
					this.which_pt = i
					this.currentX = this.points[i].x
					this.currentY = this.points[i].y
					console.log(this.currentX)
				}
			}
			else{
				this.points[i].hidden = true
			}
		}
		if(this.which_pt == 0){
			console.log('moving 0')
			this.points[0].x = this.currentX
			this.points[1].y = this.centerY()
			this.points[3].y = this.centerY()
		}
		else if(this.which_pt == 1){
			console.log('moving 1')
			this.points[1].y = this.currentY
			this.points[0].x = this.centerX()
			this.points[2].x = this.centerX()
		}
		else if(this.which_pt == 2){
			console.log('moving 2')
			this.points[2].x = this.currentX
			this.points[1].y = this.centerY()
			this.points[3].y = this.centerY()
		}
		else if(this.which_pt == 3){
			console.log('moving 3')
			this.points[3].y = this.currentY
			this.points[0].x = this.centerX()
			this.points[2].x = this.centerX()
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
		if (Landmark.over_point){
			if(Tool.active == 'Warp'){
				if(Landmark.obj.parent_shape == this){	
					this.make_ellipse()
				}			
			}
			else if(Tool.active == 'Ellipse'){
				this.make_ellipse()
			}
			this.finished = false
		}
		else if ((Tool.active == 'Ellipse'||Tool.active == 'Warp')&&!Mouse.down){
			this.points.each(function(point){
				point.hidden = false
			})
		}
		// puts all the points in their proper places
		if(!this.finished && !Mouse.down){
			this.finished = true
			this.points[0].x = this.centerX()
			this.points[2].x = this.centerX()
			this.points[1].y = this.centerY()
			this.points[3].y = this.centerY()
		}
		$C.save()
		if (this.active) $C.line_width(2)
		else $C.line_width(2)
		$C.fill_style(this.color)
		$C.begin_path()
		if (this.points.length>0){
			$C.move_to(this.points[0].x, this.points[0].y)
			var width = this.width();
			var height = this.height();
			var centerX = this.centerX();
			var centerY = this.centerY();
			$C.translate(centerX, centerY)
			$C.ellipse(centerX, centerY, width/2, height/2, 0, Math.PI*2)	
		}
		$C.opacity(0.3)
		$C.fill()
		var stroke_opacity = 0.7
		if(this.highlighted){
			$C.stroke_style('#FF0')
			$C.line_width(12)
			stroke_opacity = 1
		}
		else{
			$C.stroke_style(this.color)
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
}),
