chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.local.get('bounds', function(o){
    var bounds = {width: 300, height: 400, top: 20, left: 20};
    if(typeof o.bounds !== 'undefined') {
      if(typeof o.bounds.width  === 'number' &&
         typeof o.bounds.height === 'number' &&
         typeof o.bounds.top    === 'number' &&
         typeof o.bounds.left   === 'number') {
        // assign values directly to avoid injection
        bounds = {width  : o.bounds.width, 
                  height : o.bounds.height, 
                  top    : o.bounds.top, 
                  left   : o.bounds.left};
      }
    }
    chrome.app.window.create('index.html', {
      bounds: bounds,
      minWidth: 300,
      minHeight: 250
    }, function(w){
      w.onClosed.addListener(function(){
        chrome.storage.local.set({'bounds': w.getBounds()});
      });
    });
  });

});