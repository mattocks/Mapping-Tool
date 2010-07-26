var topSpace = 48; // how far from top zoombar should be
var leftSpace = 20; // how far left zoombar should be
var step = 6; // how many pixels the slider moves between distinct levels
var topBound = topSpace + 22;
var bottomBound = topBound + 270;
var pos = topBound;
var mouseDown = false;
var item = null;
function zoomLevel(i){
	return (bottomBound - i)/6;
}
function zoombarIsDown(e){
	mouseDown = true;
	if(e.pageY > bottomBound){
		//console.log('got zoom out');
		pos = Math.min(pos+step, bottomBound-step);
	}
	else if(e.pageY < topBound){
		//console.log('got zoom in');
		pos = Math.max(pos-step, topBound);
	}
	else{
		mouseDown = true;
		item = 'zoombar';
		pos = snapTo(e.pageY);
	}
}
function indicatorIsDown(){
	mouseDown = true;
	item = 'indicator';
}
function mouseIsUp(){
	if(mouseDown){
		mouseDown = false;
		item = null;
		//console.log(pos);
		pos = snapTo(pos);
		$('indicator').style.top = pos + 'px';
		console.log(zoomLevel(pos));
	}
}
function moveIndicator(e){
	//console.log('indicator dragged');
	if(e.pageY < topBound){
		pos = topBound;
	}
	else if (e.pageY > bottomBound-step){
		pos = bottomBound-step;
	}
	else{
		pos = e.pageY;
	}
	$('indicator').style.top = pos + 'px';
}
function snapTo(n){
	var offset = (n - topBound) % step;
	if(offset < step/2){
		return n - offset;
	}
	else{
		return n + (step - offset);
	}
}
function moveZoombar(e){
	pos = e.pageY;
}
function adjust(e){
	if (mouseDown && item == 'indicator'){
		moveIndicator(e);
	}
	else if (mouseDown && item == 'zoombar'){
		moveZoombar(e);
	}
}
document.observe("dom:loaded", function() {
	document.body.insert('<div id="zoombar" style="position:absolute;background-image:url(\'zoombarfull.png\');height:318px;width:20px;cursor:pointer;z-index:3" onmousemove="return false" onmousedown="return false" onmouseup="mouseIsUp();return false"></div><div id="indicator" style="position:absolute;background-image:url(\'indicator.png\');height:12px;width:17px;cursor:pointer;z-index:4" onmousemove="return false" onmousedown="return false" onmouseup="mouseIsUp();return false"></div>');
	$('zoombar').style.top = topSpace + 'px';
	$('zoombar').style.left = leftSpace + 'px';
	$('indicator').style.top = pos + 'px';
	$('indicator').style.left = (leftSpace + 1) + 'px';
	$('zoombar').observe('mousedown', zoombarIsDown);
	$('indicator').observe('mousedown', indicatorIsDown);
	document.body.observe('mousemove', adjust);
	document.body.observe('mouseup', mouseIsUp);

})
