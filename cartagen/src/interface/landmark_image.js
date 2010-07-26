/**
 * @namespace Landmark stuff
 */

Img = Class.create(Landmark.Landmark, {
	initialize: function($super,x,y,label,desc,icon,id) {
		//$super(label,desc,icon,id)
		this.x = x
		this.y = y
		this.label = label
		this.desc = desc
		this.icon = icon
		this.id = id
		this.color = '#200'
		this.dragging = false
		this.expanded = false
		this.img = new Image()
		this.img.src = this.icon
		this.tab = 'img' // for tab view
		this.eventA = this.draw.bindAsEventListener(this)
		Glop.observe('glop:points', this.eventA)
		this.eventB = this.drawDesc.bindAsEventListener(this)
		Glop.observe('glop:descriptions', this.eventB)
		this.eventC = this.mousedown.bindAsEventListener(this)
		Glop.observe('mousedown', this.eventC)
	},
	mouse_over_edit: function() {
		return false
	},
	mouse_over_X: function() {
		return false
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
		//var imag = new Image()
		//imag.src = this.icon
		$C.scale(1/Map.max_zoom,1/Map.max_zoom) // picture appears full size at fully zoomed in level
		$C.canvas.drawImage(this.img, -this.img.width/2, -this.img.height/2)
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
		else if (this.mouse_inside()) {
			//Landmark.current = this.id
			if (Mouse.down) {
				//this.drag()
				//console.log('dragging2')
			}
			else {
				this.hover()
			}
		}
		else if (this.mouse_inside_text()){
			//Landmark.current = this.id
		}
		else if (this.mouse_over_edit()){
			//Landmark.current = this.id
		}
		else {
			this.base()
		}
	},
	/*
	showDescription: function($super){
		$C.save()
		$C.translate(this.x, this.y)
		$C.scale(1/Map.zoom, 1/Map.zoom)
		$C.canvas.fillStyle = 'rgb(255, 255, 255)'
		$C.rect(5, -259, 250, 253)
		$C.draw_text('Arial', 12, 'black', 5, -240, 'Image')
		$C.draw_text('Arial', 12, 'black', 120, -240, 'Info')
		if(this.tab == 'img'){
			$C.canvas.drawImage(this.img, 10,-200)
		}
		else if (this.tab == 'info'){
			$C.draw_text('Arial', 18, 'black', 10, -236, this.label)
			$C.draw_text('Arial', 10, '#00D', 210, -246, 'Edit')
			$C.draw_text('Arial', 10, '#00D', 242, -246, 'X')
			// begin drawing the description
			this.renderDesc()
			$C.draw_text('Arial', 12, 'black', 10, -102, this.descView[0])
			$C.draw_text('Arial', 12, 'black', 10, -82, this.descView[1])
			$C.draw_text('Arial', 12, 'black', 10, -62, this.descView[2])
			$C.draw_text('Arial', 12, 'black', 10, -42, this.descView[3])
		}
		$C.restore()
	},
	*/
	// temporarily sees if it is over the pushpin marker
	mouse_inside_text: function() {
		var imag = this.img
		var left = this.x - imag.width/2/Map.max_zoom
		var right = this.x + imag.width/2/Map.max_zoom
		var top = this.y - imag.height/2/Map.max_zoom
		var bottom = this.y + imag.height/2/Map.max_zoom
		return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc()  && Tool.active != 'Measure' // && !this.expanded
	},
	mouse_inside: function() { // should be renamed or revised for clarity
		return this.mouse_inside_text()
		if(Landmark.mode == 'dragging'){
			return (this.mouse_inside_text()||(Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)) && !Landmark.mouse_over_desc()
		}
		return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5) && !Landmark.mouse_over_desc()
	},
	mousedown: function($super) {
		if (this.mouse_inside()) {  //&& Tool.active!='Landmark') {
			Landmark.current = this.id
			Tool.Warp.over = true
			if(Tool.Warp.obj == null){
				Tool.Warp.obj = this
			}
			this.oldx = this.x
			this.oldy = this.y
			this.color = '#f00'
			//console.log('clicked my point with label ' + this.label)
		}
		if (this.mouse_inside_text() && Landmark.mode != 'dragging'){
			Landmark.current = this.id
			this.expanded = !this.expanded
			//console.log(this.desc)
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
		this.color = '#200'
		this.dragging = false
		document.body.style.cursor = 'default'
	},
	hover: function() {
		this.color = '#900'
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
		this.color = '#f00'
		this.x=Map.pointer_x() - this.drag_offset_x
		this.y=Map.pointer_y() - this.drag_offset_y
	},
	r: function() {
		this.color = '#00f'
	},
	remove: function(){
		Glop.stopObserving('glop:points', this.eventA)
		Glop.stopObserving('glop:descriptions', this.eventB)
		Glop.stopObserving('mousedown', this.eventC)
	}
})
