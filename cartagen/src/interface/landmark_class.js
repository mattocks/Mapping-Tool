//= require "landmark_editor"
//= require "map_editor"
/**
 * @namespace Stores data about landmarks, which can be represented as points or areas
 */

Landmark = {
	mode: 'default',
	landmarks: new Hash(),
	current: null,
	map: null,
	mapTitle: null,
	mapDesc: null,
	mapX: null,
	mapY: null,
	mapZoom: null,
	temp_shape: null,
	obj: null,
	action_performed: false, // for clicking
	highlighted: null, // which id is currently highlighted
	shape_created: null,
	remove_temp_shape: function(){
		console.log(Landmark.temp_shape)
		console.log(''+Landmark.shape_created)
		if(Landmark.temp_shape != null){
			if(Landmark.shape_created == false){
				Landmark.temp_shape.remove()
				Landmark.shape_created = null
				Events.mouseup()
				Glop.trigger_draw(2)
			}
			Landmark.temp_shape = null
		}
		//console.log('removing temp shape')
	},
	highlight: function(id){
		Landmark.landmarks.get(id).highlighted = true
		Landmark.highlighted = id
	},
	unhighlight: function(){
		if(Landmark.highlighted != null){
			Landmark.landmarks.get(Landmark.highlighted).highlighted = false
		}
		Landmark.highlighted = null
	},
	goTo: function(id){
		var lndmrk = Landmark.landmarks.get(id)
		if(lndmrk.x == null || lndmrk.y == null){
			var x = lndmrk.points[0].x
			var y = lndmrk.points[0].y
			Map.x = x
			Map.y = y
			lndmrk.x = x
			lndmrk.y = y
		}
		else{
			Map.x = lndmrk.x
			Map.y = lndmrk.y
		}
		lndmrk.expanded = true
		Landmark.unhighlight()
		Landmark.highlight(id)
		Glop.trigger_draw(2)
	},
	/**
	 * makes the cursor turn into a pointer over a landmark
	 */
	check: function(e){
		var over = false
		Landmark.landmarks.each(function(l){
			if ((l.value.mouse_inside() || l.value.mouse_over_edit() || l.value.mouse_over_X())
			&& (Tool.active == 'Pan' || Tool.active == 'Editor')) {
				over = true
				throw $break
			}
		})
		$('main').style.cursor = over ? 'pointer' : 'default'
	},
	/**
	 * checks if the mouse is over any description
	 */
	mouse_over_desc: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_over_description()){
				t = true
				throw $break
			}
		})
		return t
	},
	/**
	 * Checks if the mouse is over anything but a point of a shape
	 */
	mouse_over_anything: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_inside()){
				t = true
				throw $break
			}
		})
		return t
	},
	/**
	 * Is the mouse over the point of a shape
	 */
	mouse_over_point: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if(l.value instanceof Region || l.value instanceof Path){
				l.value.points.each(function(p){
					if (p.mouse_inside()){
						t = true
						throw $break
					}
				})
			}
		})
		return t
	},
	/**
	 * is the mouse over a point landmark? these have higher priority and float above regions, paths, etc
	 */
	mouse_over_point_landmark: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if(!(l.value instanceof Region || l.value instanceof Path)){
				if(l.value.mouse_inside()){
					t = true
					throw $break
				}
			}
		})
		return t
	},
	toggleMove: function(){
		if (Landmark.mode == 'default') {
			//Tool.change('Editor')
			Tool.change('Warp')
			Landmark.mode = 'dragging'
			Landmark.landmarks.each(function(l){
				l.value.active = true
			})
			$('move').style.background = '#888'
			$('move').style.background = '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#222), to(#555))'
			$('move').name = Tooltips.moving
		}
		else if (Landmark.mode == 'dragging') {
			Landmark.stopMoving()
			Tool.change('Pan')
		}
		Glop.trigger_draw()
	},
	stopMoving: function(){
			Landmark.mode = 'default'
			Landmark.landmarks.each(function(l){
				l.value.active = false
			})
			$('move').style.background = ''
			$('move').name = Tooltips.move
	},
	Landmark: Class.create({
		initialize: function(label,desc,id,tags) {
			this.id = id
			// this.dragging = false
			// this.expanded = false
			this.descRendered = false
			this.descView = ['','','','']
			this.label = label
			this.desc = desc
			this.tags = (!tags) ? [] : tags
			//$('holder').insert('<div onclick="Landmark.goTo('+this.id+')" id="goto'+this.id+'">'+this.label+'</div>')		
		},
		setup: function(label,desc,id,color,tags,timestamp){
			this.color = color
			this.label = label
			this.desc = desc
			this.id = id
			this.color = color
			this.timestamp = timestamp
			this.active = false
			this.tags = (!tags) ? [] : tags
			//$('holder').insert('<div onclick="Landmark.goTo('+this.id+')" id="goto'+this.id+'">'+this.label+'</div>')
		},
		mouse_over_edit: function() {
			var left = this.x + 204/Map.zoom
			var right = this.x + 235/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 240/Map.zoom
			var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
			return over
		},
		mouse_over_X: function() {
			var left = this.x + 242/Map.zoom
			var right = this.x + 253/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 240/Map.zoom
			var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
			return over
		},
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
		draw: function(){
		},
		mousedown: function(){
			if (this.mouse_over_X()){
				this.expanded = false
				Landmark.action_performed = true
			}
		},
		drawDesc: function() {
			if (Landmark.mode == 'dragging' || this.active){
				this.expanded = false
			}
			if (this.expanded) { // description oRegion
				$C.opacity(1)
				//$C.translate(this.x, this.y)
				this.showDescription()
			}
			else { // stuff to do when description is closed
			}
		},
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
		showDescription: function(){
			$C.save()
			$C.translate(this.x, this.y)
			//console.log('drawing desc for ' + this.id)
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
				$C.draw_text('Arial', 10, 'black', 10, -18, 'Perimeter: '+Geometry.line_length(this.points, false)+' meters')
			}
			else if (this instanceof Path && this.type != 'Freeform'){
				$C.draw_text('Arial', 10, 'black', 10, -18, 'Length: '+Geometry.line_length(this.points, false)+' meters')
			}
			$C.restore()
		},
		remove: function(){
			Glop.stopObserving('glop:postdraw', this.eventA)
			Glop.stopObserving('glop:descriptions', this.eventB)
			Glop.stopObserving('mousedown', this.eventC)
		},
	}),
}
