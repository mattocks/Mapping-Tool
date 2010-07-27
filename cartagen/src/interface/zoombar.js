Zoombar = {}
Zoombar.topSpace = 50; // how far from top zoombar should be
Zoombar.leftSpace = 10; // how far left zoombar should be
Zoombar.step = 6; // how many pixels the slider moves between distinct levels
Zoombar.topBound = Zoombar.topSpace + 22;
Zoombar.bottomBound = Zoombar.topBound + 275;
Zoombar.pos = Zoombar.topBound;
Zoombar.mouseDown = false;
Zoombar.item = null;
Zoombar.increment = 0.05;
Zoombar.zoomLevel = function(i){
	return (Zoombar.bottomBound - 5 - i)/Zoombar.step;
}
Zoombar.setPosition = function(){
	Zoombar.pos = Zoombar.bottomBound - (Zoombar.step*Map.zoom)/Zoombar.increment;
	$('indicator').style.top = Zoombar.pos + 'px';
}
Zoombar.zoombarIsDown = function(e){
	Zoombar.mouseDown = true;
	if(e.pageY > Zoombar.bottomBound){
		console.log('got zoom out');
		Zoombar.pos = Math.min(Zoombar.pos+Zoombar.step, Zoombar.bottomBound-2*Zoombar.step);
	}
	else if(e.pageY < Zoombar.topBound){
		//console.log('got zoom in');
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
		//console.log(pos);
		Zoombar.pos = Math.min(Zoombar.snapTo(Zoombar.pos), Zoombar.bottomBound-2*Zoombar.step + 2);
		$('indicator').style.top = Zoombar.pos + 'px';
		Map.zoom = Zoombar.zoomLevel(Zoombar.pos)*Zoombar.increment;
		console.log(Map.zoom);
		Glop.trigger_draw();
	}
}
Zoombar.moveIndicator = function(e){
	//console.log('indicator dragged');
	if(e.pageY < Zoombar.topBound){
		Zoombar.pos = Zoombar.topBound;
	}
	else if (e.pageY > Zoombar.bottomBound-2*Zoombar.step){
		Zoombar.pos = Zoombar.bottomBound-2*Zoombar.step;
		//console.log('got here')
	}
	else{
		Zoombar.pos = e.pageY;
	}
	$('indicator').style.top = Zoombar.pos + 'px';
}
Zoombar.snapTo = function(n){
	var offset = (n - Zoombar.topBound) % Zoombar.step;
	if(offset < Zoombar.step/2){
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
document.observe("dom:loaded", function() {
	document.body.insert('<div id="zoombar" style="position:absolute;background-image:url(\'zoombarfull.png\');height:318px;width:20px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.mouseIsUp();return false"></div><div id="indicator" style="position:absolute;background-image:url(\'indicator.png\');height:12px;width:17px;cursor:pointer;z-index:4" onmousemove="return false" onmousedown="return false" onmouseup="Zoombar.mouseIsUp();return false"></div>');
	$('zoombar').style.top = Zoombar.topSpace + 'px';
	$('zoombar').style.left = Zoombar.leftSpace + 'px';
	$('indicator').style.top = Zoombar.pos + 'px';
	$('indicator').style.left = (Zoombar.leftSpace + 1) + 'px';
	$('zoombar').observe('mousedown', Zoombar.zoombarIsDown);
	$('indicator').observe('mousedown', Zoombar.indicatorIsDown);
	document.body.observe('mousemove', Zoombar.adjust);
	document.body.observe('mouseup', Zoombar.mouseIsUp);
	Zoombar.setPosition();
})
