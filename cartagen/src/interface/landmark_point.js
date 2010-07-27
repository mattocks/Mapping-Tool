/**
 * @namespace Landmark stuff TODO revert to icon based image
 */

Point = Class.create(Landmark.Landmark, {
	initialize: function($super,x,y,label,desc,icon,id,timestamp) {
		//$super(label,desc,icon,id)
		this.x = x
		this.y = y
		this.label = label
		this.desc = desc
		//this.icon = icon
		this.img = new Image()
		this.img.src = icon
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
		$C.canvas.drawImage(imag, -imag.width/2, -imag.height/2)
		/*
		var c = $C.canvas
		c.strokeStyle = this.color;
		c.fillStyle = this.color;
		c.beginPath();
		c.lineTo(0,0);
		c.arc(0,-20,10,0,Math.PI,true)
		c.lineTo(0,0);
		c.stroke();
		c.fill();
		*/
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
	// temporarily sees if it is over the pushpin marker
	mouse_inside_text: function() {
		return false
	},
	mouse_inside: function() { // should be renamed or revised for clarity
		/*
		var left = this.x - 20
		var right = this.x + 20
		var top = this.y - 40
		var bottom = this.y
		*/
		var left = this.x - this.img.width/2
		var right = this.x + this.img.width/2
		var top = this.y - this.img.height/2
		var bottom = this.y + this.img.height/2
		var t = Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc()  && Tool.active != 'Measure' // && !this.expanded
		if(Landmark.mode == 'dragging'){
			return (t||(Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < this.r + 5)) && !Landmark.mouse_over_desc()
		}
		return t
		//return (Geometry.distance(this.x, this.y, Map.pointer_x(), Map.pointer_y()) < 5 + 5) && !Landmark.mouse_over_desc()
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
		document.body.style.cursor = 'default'
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
