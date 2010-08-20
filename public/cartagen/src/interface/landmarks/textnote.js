//= require "region"
//= require "rectangle"

/**
 * Textnote landmark: displays description directly on map
 */

Textnote = Class.create(Rectangle, {
	initialize: function($super, pts, label, desc, id, color, tags, timestamp){
		$super(pts, label, desc, id, color, tags, timestamp)
		this.noteRendered = false
		this.noteView = ['','','','','','','','','','']
		this.noteLines = 1 // how many lines are in the note
		this.desc = desc != null ? desc : ''
	},
	/*
	 * Formats the description so it fits into the size of the textnote
	 */
	renderNote: function(){
		if(this.noteRendered == false){
			var i = 1 // which character we are on
			var line = 0 // line number
			var start = 0 // starting index of current line
			var indexOfLastSpace = this.desc.length // last seen space
			this.noteView = ['','','','','','','','','','']
			var reachedEnd = false
			// base case
			if(this.desc.length < 3){
				this.noteView[0] = this.desc
				this.noteLines = 1
				noteMaxWidth = $C.measure_text('Arial', 12, this.desc)
			}
			else{
				while (line < this.noteView.length && i < this.desc.length){
					if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < this.points[1].x - this.points[0].x){
						this.noteView[line] = this.desc.substring(start, i+1)
						if (this.desc.charAt(i) == ' ') {
							indexOfLastSpace = i
						}
					}
					else {
						//console.log('indexspace: '+indexOfLastSpace)
						//console.log(this.desc.substring(start))
						this.noteView[line] = this.desc.substring(start, indexOfLastSpace)
						//console.log(this.noteView[line])
						start = indexOfLastSpace + 1
						line++
					}
					i++
				}
				// figure out the widest line
				noteMaxWidth = 0
				for(var j=0;j<this.noteView.length;j++){
					if(this.noteView[j] == '') break;
					noteMaxWidth = Math.max($C.measure_text('Arial', 12, this.noteView[j]), noteMaxWidth)
				}
				this.noteLines = line + 1
			}
			// resize the note to fit the description
			if(!Mouse.down && this.desc != ''){
				this.points[2].y = this.points[1].y + 20*this.noteLines
				this.points[3].y = this.points[0].y + 20*this.noteLines
				var width = this.points[1].x - this.points[0].x
				this.points[1].x = this.points[0].x + Math.min(width, noteMaxWidth+5)
				this.points[2].x = this.points[3].x + Math.min(width, noteMaxWidth+5)
			}
			this.noteRendered = true
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
					this.noteRendered = false
					this.make_rectangle()
				}			
			}
			else if(Tool.active == 'Textnote'){
				this.make_rectangle()
			}
			this.finished = false
		}
		else if ((Tool.active == 'Textnote'||Tool.active == 'Warp')&&!Mouse.down){
			this.points.each(function(point){
				point.hidden = false
			})
		}
		if(!this.finished && !Mouse.down){
			this.finished = true
			this.make_rectangle()
			this.pt = null
		}
		$C.save()
		if (this.active) $C.line_width(2)
		else $C.line_width(2)
		var stroke_opacity = 1
		if(this.highlighted){
			$C.stroke_style('#00F')
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
			$C.canvas.closePath()
		}
		$C.opacity(0.9)
		$C.fill()
		$C.opacity(stroke_opacity)
		$C.stroke()
		this.renderNote()
		for(var i=0;i<this.noteView.length;i++){
			$C.draw_text('Arial', 12, 'black', this.points[0].x + 2, this.points[0].y + 15 + 20*i, this.noteView[i])
		}
		$C.restore()
	}
})
