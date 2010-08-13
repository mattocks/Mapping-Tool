<html>
    <head>
	<style>
	#nanogong {
	position: absolute;
	left:0px;
	top:0px;
	}
	</style>
        <title>NanoGong Example</title>
    </head>
    <body>
	<applet id="nanogong" archive="nanogong.jar" code="gong.NanoGong" width="160" height="40">
	    <param name="Start" value="true" />
	    <param name="ShowRecordButton" value="false" />
	    <param name="SoundFileURL" value="audio/<?php echo $_GET['id']; ?>.wav"/>
	</applet>
	<script>
	//var applet = document.getElementById('nanogong')
	/*
	document.body.onload = load
	load = function(){
		if(!document.getElementById('nanogong').isActive()){
			console.log('loading')
			load.delay(5)
		}
	}
	*/
	/*
	var applet = document.getElementById('nanogong')
	document.body.onload = load
	function load(){
	if(applet.isActive()){
		applet.sendGongRequest('PlayMedia', 'audio')
	}
	else{
		setTimeout("load()", 5000)//console.log('not ready yet!')
	}
	}
	*/
	</script>
    </body>
</html>
