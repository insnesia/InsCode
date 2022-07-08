function f1ply(){
  const video = document.querySelector("video");
  const source = video.getElementsByTagName("source")[0].src;
  const controls = ['play','current-time','mute','volume','settings','fullscreen'];
  const defaultOptions = {controls};

  if (!Hls.isSupported()) {
		video.src = source;
		var player = new Plyr(video, defaultOptions);
	} else {
 
    const hls = new Hls();
		hls.loadSource(source);

		// From the m3u8 playlist, hls parses the manifest and returns
                // all available video qualities. This is important, in this approach,
    	        // we will have one source on the Plyr player.
    	       hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

	      	     // Transform available levels into an array of integers (height values).
	      	    const availableQualities = hls.levels.map((l) => l.height)
	      	availableQualities.unshift(0) //prepend 0 to quality array

	      	    // Add new qualities to option
		    defaultOptions.quality = {
		    	default: 0, //Default - AUTO
		        options: availableQualities,
		        forced: true,        
		        onChange: (e) => updateQuality(e),
		    }
		    // Add Auto Label 
		    defaultOptions.i18n = {
		    	qualityLabel: {
		    		0: 'Auto',
		    	},
		    }

		    hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
	          var span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
	          if (hls.autoLevelEnabled) {
	            span.innerHTML = `Auto (${hls.levels[data.level].height}p)`
	          } else {
	            span.innerHTML = `Auto`
	          }
	        })
    
             // Initialize new Plyr player with quality options
		     var player = new Plyr(video, defaultOptions);
         });	

	hls.attachMedia(video);
    	window.hls = hls;		 
    }

    function updateQuality(newQuality) {
      if (newQuality === 0) {
        window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
      } else {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }
    }
function f1srv() {
  fetch(`https://api.telegra.ph/getPage/F1-Live-07-04?return_content=true`,{method: 'GET'})
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    document.getElementById("vid").src = data.result.content[0].children[0].attrs.href;
   f1ply();
  })
  .catch((err) => {
    // Do something for an error here
  })
 
}
  
function f22() {

  fetch(`https://ipapi.co/country_code`)
  .then((response) => {
    return response.text()
  })
  .then((txt) => {
    if (txt != "AFA"){f1srv()}
    else {
      document.getElementById("vid").src= "";
    }
  })
  .catch((err) => {
    // Do something for an error here
  })
   }
  window.addEventListener('DOMContentLoaded', (event) => {
     f22();
});
