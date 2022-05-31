function InsLive(){
  const video = document.querySelector("video");
  const source = video.getElementsByTagName("source")[0].src;
  const controls = ['play','current-time','progress','mute','volume','airplay','settings','fullscreen'];
  const defaultOptions = {controls};

  if (Hls.isSupported()) {
   
    const hls = new Hls();
    hls.loadSource(source);
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

      // Ubah level yang tersedia menjadi array bilangan bulat (nilai tinggi).
      const availableQualities = hls.levels.map((l) => l.height)

      // Tambahkan kualitas baru ke opsi
      defaultOptions.quality = {
        default: availableQualities[0],
        options: availableQualities,
        // ini memastikan Plyr menggunakan Hls untuk memperbarui tingkat kualitas
        forced: true,        
        onChange: (e) => updateQuality(e),
      }

      // Inisialisasi di sini
      const player = new Plyr(video, defaultOptions);
    });
    hls.attachMedia(video);
    window.hls = hls;
  } else {
 
    const player = new Plyr(video, defaultOptions);
  }
      
      

  function updateQuality(newQuality) {
    window.hls.levels.forEach((level, levelIndex) => {
      if (level.height === newQuality) {
        console.log("Found quality match with " + newQuality);
        window.hls.currentLevel = levelIndex;
      }
    });
  }
    }

function tele() {
  fetch(`https://api.telegra.ph/getPage/InsGP-05-15?return_content=true`,{method: 'GET'})
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    document.getElementById("vid").src = data.result.content[0].children[0].attrs.href;
	document.getElementById("info").innerHTML = "Bantu klik iklan, agar kami bisa selalu memberikan hiburan terkini.";
   InsLive();  
  })
  .catch((err) => {
    // Do something for an error here
  })
 
}
  
function gp() {
  fetch(`https://ipapi.co/country_code`)
  .then((response) => {
    return response.text()
  })
  .then((txt) => {
    if (txt != "AF"){tele()}
    else {
      document.getElementById("vid").src= ""
      document.getElementById("info").innerHTML = "This stream not available in your country.";
    }
  })
  .catch((err) => {
    // Do something for an error here
  })
   }
  window.addEventListener('DOMContentLoaded', (event) => {
     gp();
    
   //nama();
});
