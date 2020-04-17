	var hasGP = false;
	var repGP;

       function direction(message){
	   var mssg = message >>> 4;
	   if (mssg.toString(2) == '1100') return "moving North-East";
	   if (mssg.toString(2) == '1000') return "moving East";
	   if (mssg.toString(2) == '1001') return "moving South-East";
	   if (mssg.toString(2) == '1010') return "Rotate Right";
	   if (mssg.toString(2) == '101') return "Rotate  Left";
	   if (mssg.toString(2) == '100') return "moving North";
	   if (mssg.toString(2) == '110') return "moving North-West";
	   if (mssg.toString(2) == '10') return "moving West";
	   if (mssg.toString(2) == '11') return "moving South-West";
	   if (mssg.toString(2) == '1') return "moving South";
	   if (mssg.toString(2) == '0') return "Stagnant";
       }

       function speedometer(speed){
    	   //speedometer
	   var percent = speed/15*100
	   var meter_value = semi_cf - ((percent * semi_cf) / 100);
	   mask.setAttribute('stroke-dasharray', meter_value + ',' + cf);                                                              
           meter_needle.style.transform = 'rotate(' + (270 + ((percent * 180) / 100)) + 'deg)';                                        
	   lbl.textContent = percent + '%';
       }

	function canGame() {
		return "getGamepads" in navigator;
	}

	function reportOnGamepad() {
		var gp = navigator.getGamepads()[0];
	        // replace this with message to call
	    var html = "";
	    //			html += "id: "+gp.id+"<br/>";
	    x = Math.ceil(gp.axes[0]*15);
	    y = Math.ceil(gp.axes[1]*15);
	    var message = '00000000'
	    if (x!=0 && y!=0){
		message = (x>0) ? 1<<3:1<<1; 
		message = message | ((y<0) ? 1<<2:1);
		speed =  Math.ceil((Math.abs(x)+Math.abs(y))/2);
		message = message<<4;
		message = message | speed;                                                      
	    }
	    else {
		if (x!=0){
		    message = (x>0) ? 1<<3:1<<1;
		    speed = Math.abs(x);
		    message = message<<4;
		    message = message | speed;
		}
		if (y!=0){
		    message = (y<0) ? 1<<2:1;
		    speed = Math.abs(y);
		    message = message<<4;
		    message = message | speed;
	
		}
		if (x==0 && y==0){
		    r = Math.ceil(gp.axes[5]*15);
		    if (r!=0){
			message =  (r>0)? 10 << 4:5<<4;  //turn right 1010 or turn left 0101 
			message = message | Math.abs(r);
		    }
		    else {
			message = 0;
			speed=0;
		    }
		}
		
	    }
	    speedometer(speed);
	    console.log(message.toString(2))
	    html += "Navigation Message: " + message + " Going: " + direction(message);
//		for(var i=0;i<gp.buttons.length;i++) {
//			html+= "Button "+(i+1)+": ";
//			if(gp.buttons[i].pressed) html+= " pressed";
//			html+= "<br/>";
//		}
		
//		for(var i=0;i<gp.axes.length; i+=2) {
//			html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
//		}
		
		$("#gamepadDisplay").html(html);
	}
		
	$(document).ready(function() {

		if(canGame()) {

			var prompt = "To begin using your gamepad, connect it and press any button!";
			$("#gamepadPrompt").text(prompt);
			
			$(window).on("gamepadconnected", function() {
				hasGP = true;
				$("#gamepadPrompt").html("Gamepad connected!");
				console.log("connection event");
				repGP = window.setInterval(reportOnGamepad,100);
			});

			$(window).on("gamepaddisconnected", function() {
				console.log("disconnection event");
				$("#gamepadPrompt").text(prompt);
				window.clearInterval(repGP);
			});

			//setup an interval for Chrome
			var checkGP = window.setInterval(function() {
				console.log('checkGP');
				if(navigator.getGamepads()[0]) {
					if(!hasGP) $(window).trigger("gamepadconnected");
					window.clearInterval(checkGP);
				}
			}, 200);
		}
		
	});


