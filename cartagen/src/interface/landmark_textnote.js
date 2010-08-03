//= require "landmark_region"
//= require "rectangle"

Textnote = Class.create(Rectangle, {
	initialize: function($super,x,y,label,desc,icon,id,timestamp){
		$super(x,y,label,desc,icon,id,timestamp)
		this.noteRendered = false
		this.noteView = ['','','','']
		this.desc=''
	},
	renderNote: function(){
		if(this.noteRendered == false){
			var i = 1
			var line = 0
			var start = 0
			var indexOfLastSpace = this.desc.length
			this.noteView = ['','','','']
			var reachedEnd = false
			// base case
			if(this.desc.length < 3){
				this.noteView = [this.desc,'','','']
			}
			else{
				while (line < 4 && i < this.desc.length){
					if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < this.points[1].x - this.points[0].x){
						this.noteView[line] = this.desc.substring(start, i+1)
						if (this.desc.charAt(i) == ' '){
							indexOfLastSpace = i
						}
					}
					else {
						//console.log('indexspace: '+indexOfLastSpace) // 8923
						//console.log(this.desc.substring(start)) // 8924
						this.noteView[line] = this.desc.substring(start, indexOfLastSpace)
						//console.log(this.noteView[line]) // 8926
						start = indexOfLastSpace + 1
						line++
					}
					i++
				}
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
		if (Tool.Editor.over_point){
			if(Tool.active == 'Editor'){
				if(Tool.Editor.obj.parent_shape == this){	
					this.make_rectangle()
				}			
			}
			else if(Tool.active == 'Textnote'){
				this.make_rectangle()
			}
			this.finished = false
		}
		else if ((Tool.active == 'Textnote'||Tool.active == 'Editor')&&!Mouse.down){
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
			this.renderNote()
			for(var i=0;i<4;i++){
				$C.draw_text('Arial', 12, 'black', this.points[0].x + 2, this.points[0].y + 15 + 20*i, this.noteView[i])
			}
			$C.restore()
	}
})
