//= require "landmark_image"
Textnote = Class.create(Img, {
	initialize: function($super,x,y,label,desc,icon,id){
		$super(x,y,label,desc,icon,id)
		this.noteRendered = false
		this.noteView = ['','','','']
	},
	renderNote: function(){
		if(!this.noteRendered){
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
					if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < 110){
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
		//console.log('called draw in point '+this.id)
		$C.save()
		$C.line_width(3/Map.zoom)
		$C.translate(this.x, this.y)
		$C.fill_style("#333")
		//$C.opacity(0.6)
		if(Landmark.mode == 'dragging'){
			$C.stroke_style(this.color)
			$C.stroke_circ(0, 0, this.r)
		}
		$C.scale(1/Map.max_zoom,1/Map.max_zoom)
		$C.canvas.drawImage(this.img, -this.img.width/2, -this.img.height/2)
		this.renderNote()
		for(var i=0;i<4;i++){
			$C.draw_text('Arial', 12, 'black', -this.img.width/2 + 2, -this.img.height/2 + 15 + 20*i, this.noteView[i])
		}
		/*
		$C.draw_text('Arial', 12, 'black', 10, -102, this.noteView[0])
		$C.draw_text('Arial', 12, 'black', 10, -82, this.noteView[1])
		$C.draw_text('Arial', 12, 'black', 10, -62, this.noteView[2])
		$C.draw_text('Arial', 12, 'black', 10, -42, this.noteView[3])
		*/
		//$C.draw_text('Arial', 12, 'black', -this.img.width/2 + 2, -this.img.height/2 + 15, this.desc)
		if(this.expanded){
			// description open
			//Landmark.landmarks.get(this.id).showDescription()
		}
		else{
			// stuff to do when description is closed
		}
		
		$C.restore()

		if (this.dragging && Mouse.down) {
			this.drag()
			//console.log('dragging1')
		}
	},
})
