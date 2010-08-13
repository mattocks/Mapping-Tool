Zoombar = {}
Zoombar.topSpace = 110; // how far from top zoombar should be
Zoombar.leftSpace = 19; // how far left zoombar should be
Zoombar.step = 11; // how many pixels the slider moves between distinct levels
Zoombar.buttonHeight = 18; // height of zoom in/out buttons
Zoombar.height = 264; // height of zoombar itself
Zoombar.sliderHeight = 9;
Zoombar.topBound = Zoombar.topSpace + Zoombar.buttonHeight + 1;
Zoombar.bottomBound = Zoombar.topBound + Zoombar.height + Zoombar.step;
Zoombar.pos = Zoombar.topBound;
Zoombar.mouseDown = false;
Zoombar.item = null;
Zoombar.increment = 0.1;
Zoombar.zoomLevel = function(i){
	return ((Zoombar.bottomBound-i)/Zoombar.step - 2)*Zoombar.increment + Config.zoom_out_limit;
}
Zoombar.setPosition = function(){
	Zoombar.pos = Zoombar.bottomBound - ((Map.zoom - Config.zoom_out_limit)/Zoombar.increment + 2) * Zoombar.step;
	$('indicator').style.top = Zoombar.pos + 'px';
}
Zoombar.zoombarIsDown = function(e){
	Zoombar.mouseDown = true;
	if(e.pageY > Zoombar.bottomBound){
		console.log('got zoom out');
		Zoombar.pos = Math.min(Zoombar.pos+Zoombar.step, Zoombar.bottomBound-2*Zoombar.step);
	}
	else if(e.pageY < Zoombar.topBound){
		console.log('got zoom in');
		Zoombar.pos = Math.max(Zoombar.pos-Zoombar.step, Zoombar.topBound);
	}
	else{
		Zoombar.mouseDown = true;
		Zoombar.item = 'zoombar';
		Zoombar.pos = Zoombar.snapTo(e.pageY);
	}
}
Zoombar.indicatorIsDown = function(){
	Zoombar.mouseDown = true;
	Zoombar.item = 'indicator';
}
Zoombar.mouseIsUp = function(){
	if(Zoombar.mouseDown){
		Zoombar.mouseDown = false;
		Zoombar.item = null;
		console.log(Zoombar.pos);
		Zoombar.pos = Math.min(Zoombar.snapTo(Zoombar.pos), Zoombar.bottomBound-2*Zoombar.step);
		$('indicator').style.top = Zoombar.pos + 'px';
		Map.zoom = Zoombar.zoomLevel(Zoombar.pos);
		Map.zoom = Math.round(Map.zoom*100)/100
		//console.log('pos='+((Zoombar.bottomBound-Zoombar.pos)/Zoombar.step - 1))
		console.log(Map.zoom);
		Glop.trigger_draw();
	}
}
Zoombar.moveIndicator = function(e,offset){
	//console.log('indicator dragged');
	if(e.pageY < Zoombar.topBound + Zoombar.sliderHeight/2){
		Zoombar.pos = Zoombar.topBound;
	}
	else if (e.pageY > Zoombar.bottomBound-2*Zoombar.step){
		Zoombar.pos = Zoombar.bottomBound-2*Zoombar.step;
		//console.log('got here')
	}
	else{
		Zoombar.pos = e.pageY - Zoombar.sliderHeight/2;
	}
	$('indicator').style.top = Zoombar.pos + 'px';
}
Zoombar.snapTo = function(n){
	var offset = (n - Zoombar.topBound) % Zoombar.step;
	if(offset < Zoombar.step/2 || Zoombar.item == 'zoombar'){
		return n - offset;
	}
	else{
		return n + (Zoombar.step - offset);
	}
}
Zoombar.moveZoombar = function(e){
	Zoombar.pos = e.pageY;
}
Zoombar.adjust = function(e){
	if (Zoombar.mouseDown && Zoombar.item == 'indicator'){
		Zoombar.moveIndicator(e);
	}
	else if (Zoombar.mouseDown && Zoombar.item == 'zoombar'){
		Zoombar.moveZoombar(e);
	}
}
Zoombar.zoomIn = function(){
	if(Zoombar.item == null){
	Map.zoom += Zoombar.increment
	Map.zoom = Math.min(Config.zoom_in_limit, Math.round(Map.zoom*100)/100)
	Zoombar.setPosition()
	console.log(Map.zoom)
	Glop.trigger_draw()
	}
}
Zoombar.zoomOut = function(){
	if(Zoombar.item == null){
	Map.zoom -= Zoombar.increment
	Map.zoom = Math.max(Config.zoom_out_limit, Math.round(Map.zoom*100)/100)
	Zoombar.setPosition()
	console.log(Map.zoom)
	Glop.trigger_draw()
	}
}
Zoombar.pan = function(dir){
	switch(dir){
		case 'left': Map.x -= 100/Map.zoom;break;
		case 'right': Map.x += 100/Map.zoom;break;
		case 'up': Map.y -= 100/Map.zoom;break;
		case 'down': Map.y += 100/Map.zoom; break;
	}
	Glop.trigger_draw()
}
Zoombar.reset = function(){
	if(Landmark.mapX && Landmark.mapY && Landmark.mapZoom){
		Map.x = Landmark.mapX
		Map.y = Landmark.mapY
		Map.zoom = Landmark.mapZoom
		Zoombar.setPosition()
		Glop.trigger_draw()
	}
}
document.observe("dom:loaded", function() {
	document.body.insert('<div id="north" style="position:absolute;background-image:url(\'zoom/north-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.pan(\'up\');return false"></div><div id="east" style="position:absolute;background-image:url(\'zoom/east-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.pan(\'right\');return false"></div><div id="south" style="position:absolute;background-image:url(\'zoom/south-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.pan(\'down\');return false"></div><div id="west" style="position:absolute;background-image:url(\'zoom/west-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.pan(\'left\');return false"></div><div id="zreset" style="position:absolute;background-image:url(\'zoom/reset.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.reset();return false"></div>');
	var pan_left = 1;
	var pan_top = 50;
	$('north').style.top = pan_top + 'px'
	$('north').style.left = (pan_left+18)+'px'
	$('east').style.top = (pan_top+18)+'px'
	$('east').style.left = (pan_left+36)+'px'
	$('south').style.top = (pan_top+36)+'px'
	$('south').style.left = (pan_left+18)+'px'
	$('west').style.top = (pan_top+18)+'px'
	$('west').style.left = pan_left+'px'
	$('zreset').style.top = (pan_top+18)+'px'
	$('zreset').style.left = (pan_left+18)+'px'

	document.body.insert('<div id="zoomin" style="position:absolute;background-image:url(\'zoom/zoom-plus-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.zoomIn();return false"></div><div id="zoombar" style="position:absolute;background-image:url(\'zoom/zoombar.png\');height:264px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.mouseIsUp();return false"></div><div id="zoomout" style="position:absolute;background-image:url(\'zoom/zoom-minus-mini.png\');height:18px;width:18px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.zoomOut();return false"></div><div id="indicator" style="position:absolute;background-image:url(\'zoom/slider.png\');height:9px;width:20px;cursor:pointer;z-index:4" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.mouseIsUp();return false"></div>');
	$('zoomin').style.top = Zoombar.topSpace + 'px';
	$('zoomin').style.left = Zoombar.leftSpace + 'px';
	$('zoombar').style.top = (Zoombar.topBound-1) + 'px';
	$('zoombar').style.left = Zoombar.leftSpace + 'px';
	$('zoomout').style.top = (Zoombar.bottomBound-Zoombar.step-1) + 'px';
	$('zoomout').style.left = Zoombar.leftSpace + 'px';
	$('indicator').style.top = Zoombar.pos + 'px';
	$('indicator').style.left = (Zoombar.leftSpace-1) + 'px';
	$('zoombar').observe('mousedown', Zoombar.zoombarIsDown);
	$('indicator').observe('mousedown', Zoombar.indicatorIsDown);
	document.body.observe('mousemove', Zoombar.adjust);
	document.body.observe('mouseup', Zoombar.mouseIsUp);
	Map.zoom = 0.52;
	Zoombar.setPosition();
})
