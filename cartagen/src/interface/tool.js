/**
 * @namespace A class to contain tool definitions and associated tool methods for user interaction.
 */
var Tool = {		
	initialize: function() {
		// default tool on startup is the Pan tool:
		Glop.observe('mousemove', Tool.Pan.mousemove)
		Glop.observe('mousedown', Tool.Pan.mousedown)
		Glop.observe('mouseup', Tool.Pan.mouseup)
		Glop.observe('dblclick', Tool.Pan.dblclick)
		Glop.observe('mouseover',this.mouse_in_main.bindAsEventListener(this))
		Glop.observe('mouseout',this.mouse_out_main.bindAsEventListener(this))

		document.observe('mousemove', Tool.update_tooltip)
	},
	mouse_in_main: function() {
		Tool.hover = false
	},
	mouse_out_main: function() {
		Tool.hover = true
	},
	show_tooltip: function(tool_name) {
		console.log(tool_name)
		Tool.hide_tooltip()
		$$('body')[0].insert("<div id='tooltip' class='tooltip'></div>")
		$('tooltip').innerHTML = tool_name
		$('tooltip').absolutize()
		$('tooltip').style.zIndex = 999
	},
	hide_tooltip: function() {
		if ($('tooltip')) $('tooltip').remove()
	},
	update_tooltip: function() {
		if ($('tooltip')) {
			$('tooltip').style.top = (-Mouse.y)+'px'
			$('tooltip').style.left = (-Mouse.x)+'px'
		}
	},
	/**
	 * Whether the mouse is hovering over a tool button. Flag used to determine 
	 * whether user is clicking on a toolbar button and not trying to deselect
	 * an object. See example in Warper.mousedown()
	 */
	hover: true,
	/**
	 * The tool currently in use. Options include 'Pan', 'Pen', 'Select', 'Warp'
	 */
	active: 'Pan',
	/**
	 * Function to change the active tool 
	 */
	change: function(new_tool,force) {
		console.log('changing '+Tool.active+' to '+new_tool)
		if (new_tool != Tool.active || force == true) {
			old_tool = Tool.active
			
			tool_events = ['mousemove','mouseup','mousedown','dblclick']

			tool_events.each(function(tool_event) {
				Glop.stopObserving(tool_event,Tool[old_tool][tool_event])
				Glop.observe(tool_event,Tool[new_tool][tool_event])
				console.log(new_tool+', '+tool_event)
			})

			if (!Object.isUndefined(Tool[old_tool].deactivate)) {
				Tool[old_tool].deactivate()
			}
			if (!Object.isUndefined(Tool[new_tool].activate)) {
				Tool[new_tool].activate()
			}
			Tool.active = new_tool
		}
		Interface.setup_tooltips()
	},
	/**
	 * Pass drag call to the active tool:
	 */
	drag: function() {
		Tool[Tool.active].drag()
	},
}
