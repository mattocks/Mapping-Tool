/**
 * @namespace Landmark stuff TODO revert to icon based image
 */

Point = Class.create(Landmark.Landmark, {
	initialize: function($super,x,y,label,desc,icon,id,timestamp) {
		this.x = x
		this.y = y
		this.label = label
		this.desc = desc
		this.img = new Image()
		this.img.src = 'icons/'+icon
		this.color = '#ddd'
		this.id = id
		this.r = 5
		this.dragging = false
		this.expanded = false
		this.timestamp = timestamp
		this.eventA = this.draw.bindAsEventListener(this)
		Glop.observe('glop:points', this.eventA)
		this.eventB = this.drawDesc.bindAsEventListener(this)
		Glop.observe('glop:descriptions', this.eventB)
		this.eventC = this.mousedown.bindAsEventListener(this)
		Glop.observe('mousedown', this.eventC)
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
			$C.stroke_circ(0, 0, 5)
		}
		var imag = this.img
		$C.scale(1/Config.zoom_in_limit,1/Config.zoom_in_limit) // picture appears full size at fully zoomed in level
		if(this.highlighted == true){
			var left = -this.img.width/2 - 2
			var right = this.img.width/2 + 2
			var upper = -this.img.height/2 - 2 
			var bottom = this.img.height/2 + 2
			$C.begin_path()
			$C.move_to(left, upper);
			$C.line_to(right, upper);
			$C.line_to(right, bottom);
			$C.line_to(left, bottom);
			$C.canvas.closePath()
			$C.line_width(12)
			$C.stroke_style('#FF0')
			$C.stroke();
		}
		$C.canvas.drawImage(imag, -imag.width/2, -imag.height/2)	
		$C.restore()
		if (this.dragging && Mouse.down) {
			this.drag()
			//console.log('dragging1')
		}
		else if (this.mouse_inside()) {
			if (Mouse.down) {
				//this.drag()
				//console.log('dragging2')
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
		var left = this.x - this.img.width/2
		var right = this.x + this.img.width/2
		var top = this.y - this.img.height/2
		var bottom = this.y + this.img.height/2
		var t = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc()  && Tool.active != 'Measure'
		if(Landmark.mode == 'dragging'){
			return (t||(Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)) && !Landmark.mouse_over_desc()
		}
		return t
	},
	mousedown: function($super) {
		if (this.mouse_inside()) {  //&& Tool.active!='Landmark') {
			Landmark.current = this.id
			Tool.Editor.over = true
			LandmarkEditor.setCurrent(this)
			this.oldx = this.x
			this.oldy = this.y
			if(Landmark.mode != 'dragging'){
				Landmark.current = this.id
				this.expanded = !this.expanded
			}
			//this.color = '#f00'
			//console.log('clicked my point with label ' + this.label)
		}
		else if (this.mouse_over_edit()) {
			Landmark.current = this.id
			LandmarkEditor.edit()
		}
		else {
			$super()
		}
	},
	base: function() {
		//this.color = '#200'
		this.dragging = false
		//document.body.style.cursor = 'default'
	},
	hover: function() {
		//this.color = '#900'
		this.dragging = false
	},
	drag: function() {
		this.expanded = false
		console.log('dragging!!!')
		if (!this.dragging) {
			this.dragging = true
			this.drag_offset_x = Map.pointer_x() - this.x
			this.drag_offset_y = Map.pointer_y() - this.y
		}
		//this.color = '#f00'
		this.x=Map.pointer_x() - this.drag_offset_x
		this.y=Map.pointer_y() - this.drag_offset_y
	},
	r: function() {
		//this.color = '#00f'
	},
	remove: function(){
		Glop.stopObserving('glop:points', this.eventA)
		Glop.stopObserving('glop:descriptions', this.eventB)
		Glop.stopObserving('mousedown', this.eventC)
	}
})
