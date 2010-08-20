/**
 * Represents an audio recording on the map
 */

Audio = Class.create(Landmark.Landmark, {
	initialize: function(x,y,label,desc,id,timestamp) {
		//$super(label,desc,icon,id)
		this.x = x
		this.y = y
		this.label = label
		this.desc = desc
		this.id = id
		this.color = '#200'
		this.dragging = false
		this.expanded = false
		this.timestamp = timestamp
		this.img = new Image()
		this.img.src = 'sound.png' // icon to use for audio items
		this.eventA = this.draw.bindAsEventListener(this)
		Glop.observe('glop:points', this.eventA)
		this.eventB = this.drawDesc.bindAsEventListener(this)
		Glop.observe('glop:descriptions', this.eventB)
		this.eventC = this.mousedown.bindAsEventListener(this)
		Glop.observe('mousedown', this.eventC)
	},
	show_audio_player: function(){
		Modalbox.show('<iframe src="nanogong-player.php?id='+this.id+'" style="border:0px;width:180px;height:40px;"></iframe>', {title: 'Listening to audio for this landmark'})
		Events.mouseup()
	},
	draw: function() {
		$C.save()
		$C.line_width(3/Map.zoom)
		$C.translate(this.x, this.y)
		$C.fill_style("#333")
		//$C.opacity(0.6)
		if(Landmark.mode == 'dragging'){
			$C.stroke_style(this.color)
			$C.stroke_circ(0, 0, this.r)
		}
		$C.scale(1/Config.zoom_in_limit,1/Config.zoom_in_limit) // picture appears full size at fully zoomed in level
		$C.canvas.drawImage(this.img, -this.img.width/2, -this.img.height/2)
		if(this.highlighted==true){
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
		$C.restore()
		if(this.mouse_over_audio()){
			console.log('over audio')
		}
		if (this.dragging && Mouse.down) {
			this.drag()
		}
		else if (this.mouse_inside() && !Mouse.down) {
			this.hover()
		}
		else {
			this.base()
		}
	},
	mouse_inside: function() {
		var imag = this.img
		var left = this.x - imag.width/2/Config.zoom_in_limit
		var right = this.x + imag.width/2/Config.zoom_in_limit
		var top = this.y - imag.height/2/Config.zoom_in_limit
		var bottom = this.y + imag.height/2/Config.zoom_in_limit
		return Map.pointer_x() > left && Map.pointer_x() < right && Map.pointer_y() > top && Map.pointer_y() < bottom && !Landmark.mouse_over_desc() && Tool.active != 'Measure'
	},
	mousedown: function($super) {
		if (this.mouse_inside()) {
			Landmark.current = this.id
			Landmark.over = true
			LandmarkEditor.setCurrent(this)
			this.oldx = this.x
			this.oldy = this.y
			this.color = '#f00'
			if(Landmark.mode != 'dragging'){
				this.show_audio_player()
			}
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
		if (!this.dragging) {
			this.dragging = true
			this.drag_offset_x = Map.pointer_x() - this.x
			this.drag_offset_y = Map.pointer_y() - this.y
		}
		this.color = '#f00'
		this.x=Map.pointer_x() - this.drag_offset_x
		this.y=Map.pointer_y() - this.drag_offset_y
	},
	/*
	r: function() {
		this.color = '#00f'
	},
	*/
	remove: function(){
		Glop.stopObserving('glop:points', this.eventA)
		Glop.stopObserving('glop:descriptions', this.eventB)
		Glop.stopObserving('mousedown', this.eventC)
	}
})
