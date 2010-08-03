//= require "landmark_region"
/**
 *@namespace Represents an ellipse
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
	make_ellipse: function(){
		for(var i=0;i<this.points.length;i++){
			if(this.points[i]==Tool.Editor.obj){
				if(Tool.Ellipse.currentX == null && Tool.Ellipse.currentY == null){
					Tool.Ellipse.which_pt = i
					Tool.Ellipse.currentX = this.points[i].x
					Tool.Ellipse.currentY = this.points[i].y
				}
			}
			else{
				this.points[i].hidden = true
			}
		}
		if(Tool.Ellipse.which_pt == 0){
			console.log('moving 0')
			this.points[0].x = Tool.Ellipse.currentX
			this.points[1].y = this.centerY()
			this.points[3].y = this.centerY()
		}
		else if(Tool.Ellipse.which_pt == 1){
			console.log('moving 1')
			this.points[1].y = Tool.Ellipse.currentY
			this.points[0].x = this.centerX()
			this.points[2].x = this.centerX()
		}
		else if(Tool.Ellipse.which_pt == 2){
			console.log('moving 2')
			this.points[2].x = Tool.Ellipse.currentX
			this.points[1].y = this.centerY()
			this.points[3].y = this.centerY()
		}
		else if(Tool.Ellipse.which_pt == 3){
			console.log('moving 3')
			this.points[3].y = Tool.Ellipse.currentY
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
		if (Tool.Editor.over_point){
			if(Tool.active == 'Editor'){
				if(Tool.Editor.obj.parent_shape == this){	
					this.make_ellipse()
				}			
			}
			else if(Tool.active == 'Ellipse'){
				this.make_ellipse()
			}
			this.finished = false
		}
		else if ((Tool.active == 'Ellipse'||Tool.active == 'Editor')&&!Mouse.down){
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
			//$C.stroke_style('#000')
			$C.stroke_style(this.color)
			$C.fill_style(this.color)
			if (this.active) $C.line_width(2)
			else $C.line_width(2)
			$C.begin_path()
			if (this.points.length>0){
				$C.move_to(this.points[0].x, this.points[0].y)
				//$C.stroke_style('black')
				var width = this.width();
				var height = this.height();
				var centerX = this.centerX();
				var centerY = this.centerY();
				$C.translate(centerX, centerY)
				$C.ellipse(centerX, centerY, width/2, height/2, 0, Math.PI*2)	
			}
			$C.opacity(0.7)
			$C.stroke()
			$C.opacity(0.3)
			$C.fill()
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
