// Used for asynchronously loading Google Maps APIs.
define(
function () {
  'use strict';

  function load(callback) {
    var gmaps = new GoogleMaps();
    gmaps.load(callback);
  }

  function GoogleMaps() {

    // The classlist object of the page's <html> element.
    var _htmlClassList;

    // The external callback function to call when the maps scripts have loaded.
    var _callback;

    // The global callback function name to call internally when the maps
    // scripts have loaded.
    var _globalCallbackName;

    function load(callback) {
      _callback = callback;

      _htmlClassList = document.documentElement.classList;

      if (_htmlClassList.contains('google-maps-loaded') ||
          _htmlClassList.contains('google-maps-loading')) {
        callback.call();
      }
      else {
        document.documentElement.classList.add('google-maps-loading');
        // Add global callback.
        _globalCallbackName = 'googlemaps'+(new Date()).getTime();
        window[_globalCallbackName] = _mapAPIsLoaded;

        // Load Google Maps APIs asynchronously.
        var scriptElm = document.createElement('script');
        scriptElm.type = 'text/javascript';
        scriptElm.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=window.' + _globalCallbackName;
        document.body.appendChild(scriptElm);
      }
    }

    function _mapAPIsLoaded() {
      // Nullify global callback reference.
      // 'delete window[_globalCallbackName]' could be used here as well,
      // but IE8 doesn't like that.
      window[_globalCallbackName] = undefined;

      _htmlClassList.remove('google-maps-loading');
      _htmlClassList.add('google-maps-loaded');

      // Call external callback function.
      _callback.call();
    }

    return {
      load:load
    };
  }

  return {
    load:load
  };
});