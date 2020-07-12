require([
  "esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
  "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array",
  "dojo/domReady!"
], function (arcgisPortal, OAuthInfo, esriId,
  domStyle, domAttr, dom, on, arrayUtils){
  var info = new OAuthInfo({
    appId: clientId,
    // Uncomment the next line and update if using your own portal
    portalUrl: apiBaseUrl,
    // Uncomment the next line to prevent the user's signed in state from being shared
    // with other apps on the same domain with the same authNamespace value.
    //authNamespace: "portal_oauth_popup",
    popup: false
  });
  esriId.registerOAuthInfos([info]);

  esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
    function (){
      displayItems();
    }
  ).otherwise(
    function (){
      // Anonymous view
      domStyle.set("anonymousPanel", "display", "block");
      domStyle.set("personalizedPanel", "display", "none");
    }
  );

  on(dom.byId("sign-in"), "click", function (){
    console.log("click", arguments);
    // user will be shown the OAuth Sign In page
    esriId.getCredential(info.portalUrl + "/sharing", {
        oAuthPopupConfirmation: false
      }
    ).then(function (){
        displayItems();
      });
  });

  on(dom.byId("sign-out"), "click", function (){
    esriId.destroyCredentials();
    window.location.reload();
  });

  function displayItems(){
    new arcgisPortal.Portal(info.portalUrl).signIn().then(
      function (portalUser){
        console.log("Signed in to the portal: ", portalUser);

        domAttr.set("userId", "innerHTML", portalUser.fullName);
        domStyle.set("anonymousPanel", "display", "none");
        domStyle.set("personalizedPanel", "display", "block");

        queryPortal(portalUser);
      }
    ).otherwise(
      function (error){
        console.log("Error occurred while signing in: ", error);
      }
    );
  }

  function queryPortal(portalUser){
    var portal = portalUser.portal;

    //See list of valid item types here:  http://www.arcgis.com/apidocs/rest/index.html?itemtypes.html
    //See search reference here:  http://www.arcgis.com/apidocs/rest/index.html?searchreference.html
    var queryParams = {
      q: "owner:" + portalUser.username,
      sortField: "numViews",
      sortOrder: "desc",
      num: 20
    };

    portal.queryItems(queryParams).then(createGallery);
  }

  function createGallery(items){
    var htmlFragment = "";

    arrayUtils.forEach(items.results, function (item){
      htmlFragment += (
      "<div class=\"esri-item-container\">" +
      (
        item.thumbnailUrl ?
        "<div class=\"esri-image\" style=\"background-image:url(" + item.thumbnailUrl + ");\"></div>" :
          "<div class=\"esri-image esri-null-image\">Thumbnail not available</div>"
      ) +
      (
        item.title ?
        "<div class=\"esri-title\">" + (item.title || "") + "</div>" :
          "<div class=\"esri-title esri-null-title\">Title not available</div>"
      ) +
      "</div>"
      );
    });

    dom.byId("itemGallery").innerHTML = htmlFragment;
  }
});