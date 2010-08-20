/*
 * Provides a basic outline for landmarks that are saved.
 */
Landmark.Landmark = Class.create({
	initialize: function(label,desc,id,tags) {
		this.id = id
		this.descRendered = false
		this.descView = ['','','','']
		this.label = label
		this.desc = desc
		this.tags = (!tags) ? [] : tags
	},
	/*
	 * Essentially an 'initialize' function for shapes
	 */
	setup: function(label,desc,id,color,tags,timestamp){
		this.color = color
		this.label = label
		this.desc = desc
		this.id = id
		this.color = color
		this.timestamp = timestamp
		this.active = false
		this.tags = (!tags) ? [] : tags
	},
	/*
	 * Returns a boolean value indicating if the mouse is over the "edit" button in the description window.
	 */
	mouse_over_edit: function() {
		var left = this.x + 204/Map.zoom
		var right = this.x + 235/Map.zoom
		var top = this.y - 255/Map.zoom
		var bottom = this.y - 240/Map.zoom
		var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
		return over
	},
	/*
	 * Returns a boolean value indicating if the mouse is over the "X" button in the description window.
	 */
	mouse_over_X: function() {
		var left = this.x + 242/Map.zoom
		var right = this.x + 253/Map.zoom
		var top = this.y - 255/Map.zoom
		var bottom = this.y - 240/Map.zoom
		var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
		return over
	},
	/*
	 * Returns a boolean value indicating if the mouse is over the description window.
	 */
	mouse_over_description: function() {
		if (this.x == null || this.y == null){
			return false
		}
		var left = this.x + 5/Map.zoom
		var right = this.x + 255/Map.zoom
		var top = this.y - 255/Map.zoom
		var bottom = this.y - 5/Map.zoom
		var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
		return over
	},
	/*
	 * Should be implemented by any subclass of Landmark.Landmark
	 */
	draw: function(){
	},
	/*
	 * Should be implemented by any subclass of Landmark.Landmark
	 */
	mousedown: function(){
		if (this.mouse_over_X()){
			this.expanded = false
			Landmark.action_performed = true
		}
	},
	/*
	 * Shows description if appropriate
	 */
	drawDesc: function() {
		if (Landmark.mode == 'dragging' || this.active){
			this.expanded = false
		}
		if (this.expanded) { // description
			$C.opacity(1)
			this.showDescription()
		}
	},
	/*
	 * Renders the description so it fits within the constraints of the description window.
	 */
	renderDesc: function(){
		if(!this.descRendered){
			var i = 1
			var line = 0
			var start = 0
			var indexOfLastSpace = this.desc.length
			this.descView = ['','','','']
			var reachedEnd = false
			// base case
			if(this.desc.length < 3){
				this.descView = [this.desc,'','','']
			}
			else{
				while (line < 4 && i < this.desc.length){
					//console.log(start+','+i) // 8915
					if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < 240){
						this.descView[line] = this.desc.substring(start, i+1)
						if (this.desc.charAt(i) == ' '){
							indexOfLastSpace = i
						}
					}
					else {
						//console.log('indexspace: '+indexOfLastSpace) // 8923
						//console.log(this.desc.substring(start)) // 8924
						this.descView[line] = this.desc.substring(start, indexOfLastSpace)
						//console.log(this.descView[line]) // 8926
						start = indexOfLastSpace + 1
						line++
					}
					i++
				}
			}
			this.descRendered = true
		}
	},
	/*
	 * Draws the description window on the canvas
	 */
	showDescription: function(){
		$C.save()
		$C.translate(this.x, this.y)
		$C.scale(1/Map.zoom, 1/Map.zoom)
		$C.canvas.fillStyle = 'rgb(255, 255, 255)'
		var left_bound = 5
		var right_bound = 255
		var upper_bound = -259
		var lower_bound = -6
		$C.rect(left_bound, upper_bound, right_bound - left_bound, lower_bound - upper_bound)
		// draw a border
		$C.stroke_style('rgb(100, 100, 100)')
		$C.begin_path()
		$C.move_to(left_bound, upper_bound)
		$C.line_to(right_bound, upper_bound)
		$C.line_to(right_bound, lower_bound)
		$C.line_to(left_bound, lower_bound)
		$C.canvas.closePath()
		$C.line_width(2)
		$C.stroke()
		// upper right text controls
		$C.draw_text('Arial', 18, 'black', 10, -236, this.label)
		$C.draw_text('Arial', 10, '#00D', 210, -246, 'Edit')
		$C.draw_text('Arial', 10, '#00D', 242, -246, 'X')
		// begin drawing the description
		this.renderDesc()
		$C.draw_text('Arial', 12, 'black', 10, -102, this.descView[0])
		$C.draw_text('Arial', 12, 'black', 10, -82, this.descView[1])
		$C.draw_text('Arial', 12, 'black', 10, -62, this.descView[2])
		$C.draw_text('Arial', 12, 'black', 10, -42, this.descView[3])
		if((this instanceof Region) && !(this instanceof Textnote) && !(this instanceof Ellipse)){
			$C.draw_text('Arial', 10, 'black', 10, -18, Tooltips.perimeter+': '+Geometry.line_length(this.points, false)+' '+Tooltips.meters)
		}
		else if (this instanceof Path && this.type != 'Freeform'){
			$C.draw_text('Arial', 10, 'black', 10, -18, Tooltips.lengthTxt+': '+Geometry.line_length(this.points, false)+' '+Tooltips.meters)
		}
		$C.restore()
	},
	/*
	 * Subclasses should provide a mechanism so that upon deletion, the landmark does not appear on the map at all.
	 */
	remove: function(){
		Glop.stopObserving('glop:postdraw', this.eventA)
		Glop.stopObserving('glop:descriptions', this.eventB)
		Glop.stopObserving('mousedown', this.eventC)
	},
})
