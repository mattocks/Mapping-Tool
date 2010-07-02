//= require "editor"
/**
 * @namespace Stores data about landmarks, which can be represented as points or areas
 */

Landmark = {
	mode: 'default',
	landmarks: new Hash(),
	current: null,
	// makes the cursor turn into a pointer over the text of a landmark
	check: function(e){
		var over = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_inside_text() || l.value.mouse_inside() || l.value.mouse_over_edit() || l.value.mouse_over_X()) {
				over = true
				throw $break
			}
		})
		if (over) {
			$('main').style.cursor = 'pointer'
		}
		else{
			$('main').style.cursor = 'default'
		}
	},
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
	mouse_over_anything: function(){
		var t = false
		Landmark.landmarks.each(function(l){
			if (l.value.mouse_inside()){
				t = true
				throw $break
			}
			if(l.value instanceof Region.Shape || l.value instanceof Path.Shape){
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
	toggleMove: function(){
		if (Landmark.mode == 'default') {
			Tool.change('Warp')
			Landmark.mode = 'dragging'
		}
		else if (Landmark.mode == 'dragging') {
			Tool.change('Pan')
			Landmark.mode = 'default'
		}
		Glop.trigger_draw()
	},
	Landmark: Class.create({
		initialize: function(label,desc,icon,id) {
			this.id = id
			// this.dragging = false
			// this.expanded = false
			this.descRendered = false
			this.descView = ['','','','']
			this.label = label
			this.desc = desc
			this.icon = icon			
		},
		mouse_over_edit: function() {
			/*
			var left = this.x + 104/Map.zoom
			var right = this.x + 255/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 150/Map.zoom
			*/
			var left = this.x + 204/Map.zoom
			var right = this.x + 235/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 240/Map.zoom
			var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
			if (over) {
				console.log('over')
			}
			return over
		},
		mouse_over_X: function() {
			var left = this.x + 242/Map.zoom
			var right = this.x + 253/Map.zoom
			var top = this.y - 255/Map.zoom
			var bottom = this.y - 240/Map.zoom
			var over = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && this.expanded
			if (over) {
				console.log('over X')
			}
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
			}
		},
		drawDesc: function() {
			if (Landmark.mode == 'dragging'){
				this.expanded = false
			}
				if (this.expanded) { // description open
					$C.opacity(1)
					//$C.translate(this.x, this.y)
					this.showDescription()
				}
				else { // stuff to do when description is closed
				}
		},
		showDescription: function(){
				if(this.mouse_over_description()){
				}
				$C.save()
				$C.translate(this.x, this.y)
				//console.log('drawing desc for ' + this.id)
				$C.scale(1/Map.zoom, 1/Map.zoom)
				$C.canvas.fillStyle = 'white'
				$C.rect(5, -259, 250, 253)
				$C.draw_text('Arial', 18, 'black', 10, -236, this.label)
				$C.draw_text('Arial', 10, '#00D', 210, -246, 'Edit')
				$C.draw_text('Arial', 10, '#00D', 242, -246, 'X') // currently a dummy zone: would be used to collapse landmark description
				// begin drawing the description
				
				if(!this.descRendered){
					var i = 1
					var line = 0
					var start = 0
					var indexOfLastSpace = this.desc.length
					this.descView = ['','','','']
					var reachedEnd = false
						while (line < 4 && i < this.desc.length){
							//console.log(start+','+i)
							if ($C.measure_text('Arial', 12, this.desc.substring(start, i)) < 240){
								this.descView[line] = this.desc.substring(start, i+1)
								if (this.desc.charAt(i) == ' '){
									indexOfLastSpace = i
								}
							}
							else {
								//console.log('indexspace: '+indexOfLastSpace)
								//console.log(this.desc.substring(start))
								this.descView[line] = this.desc.substring(start, indexOfLastSpace)
								//console.log(this.descView[line])
								start = indexOfLastSpace + 1
								line++
							}
							i++
						}
					this.descRendered = true
				}
				$C.draw_text('Arial', 12, 'black', 10, -102, this.descView[0])
				$C.draw_text('Arial', 12, 'black', 10, -82, this.descView[1])
				$C.draw_text('Arial', 12, 'black', 10, -62, this.descView[2])
				$C.draw_text('Arial', 12, 'black', 10, -42, this.descView[3])
				var imag = new Image()
				imag.src = 'pic.jpg'
				$C.canvas.drawImage(imag, 10,-200)
				$C.restore()
		},
	}),
	ControlPoint: Class.create({
		initialize: function(x,y,r,parent) {
			this.x = x
			this.y = y
			this.r = r
			this.parent_shape = parent
			this.color = '#200'
			this.dragging = false
			if(parent instanceof Region.Shape){
				this.tool = 'Pen'
			}
			else if (parent instanceof Path.Shape){
				this.tool = 'Path'
			}
			Glop.observe('glop:postdraw', this.draw.bindAsEventListener(this))
			Glop.observe('mousedown', this.click.bindAsEventListener(this))
		},
		// this gets called every frame:
		draw: function() {
			if (this.parent_shape.active) {
				$C.save()
					$C.line_width(3/Map.zoom)
					// go to the object's location:
					$C.translate(this.x,this.y)
					// draw the object:
					$C.fill_style("#333")
					$C.opacity(0.6)
					if (this.parent_shape.locked) {
						$C.begin_path()
						$C.move_to(-6/Map.zoom,-6/Map.zoom)
						$C.line_to(6/Map.zoom,6/Map.zoom)
						$C.move_to(-6/Map.zoom,6/Map.zoom)
						$C.line_to(6/Map.zoom,-6/Map.zoom)
						$C.stroke()
					} else {
						if (this.mouse_inside()) $C.circ(0, 0, this.r)
						$C.stroke_circ(0, 0, this.r)
					}

				$C.restore()

			}
			
			/* var nodestring = ''
			nodes.each(function(node) {
				nodestring += '(' + node[0] + ', ' + node[1] + ')\n'
			})*/
			
			if (this.dragging && Mouse.down) {
				//Tool.change('Warp')
				this.drag()
			} 
			else if (this.mouse_inside()) {
				if (Mouse.down) {
					this.drag()
				}
				else {
					this.hover()
				}
			}
			else {
				this.base()
			}
		},
		mouse_inside: function() {
			return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r) && !Landmark.mouse_over_desc()
		},
		mouse_inside_text: function(){
		},
		base: function() {
			this.color = '#200'
			this.dragging = false
		},
		click: function() {
			if (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r  && Tool.active!=this.tool) {
				this.color = '#f00'
				//console.log('clicked control point')
				this.parent_shape.active = true
				Landmark.current = this.parent_shape.id

			}
		},
		hover: function() {
			this.color = '#900'
			this.dragging = false
		},
		drag: function() {
			if (this.parent_shape.active  /*&& Geometry.distance(this.x, this.y, Map.pointer)*/) {
				if (!this.dragging) {
					this.dragging = true
					this.drag_offset_x = Map.pointer_x() - this.x
					this.drag_offset_y = Map.pointer_y() - this.y
				}
				this.color = '#f00'
				this.x=Map.pointer_x()
				this.y=Map.pointer_y()
			}
		},
		r: function() {
			this.color = '#00f'
		}
	}),
}
