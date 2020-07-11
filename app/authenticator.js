require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/dom",
  ], function (
    Portal, OAuthInfo, identityManager, Map, MapView, MapImageLayer,
    domStyle, domAttr, on, dom) {
  
    const info = new OAuthInfo({
      appId: clientId,
      popup: false // inline redirects don't require any additional app configuration
    });
  
    identityManager.registerOAuthInfos([info]);
  
    // send users to arcgis.com to login
    on(dom.byId("sign-in"), "click", function () {
      identityManager.getCredential(apiBaseUrl);
    });
  
    // log out and reload
    on(dom.byId("sign-out"), "click", function () {
      identityManager.destroyCredentials();
      window.location.reload();
    });
  
    identityManager.checkSignInStatus(apiBaseUrl).then(function () {
      dom.byId('anonymousPanel').style.display = 'none';
      dom.byId('personalizedPanel').style.display = 'block';
      dom.byId('userId').innerText = identityManager.credentials[0].userId;
    });
  });