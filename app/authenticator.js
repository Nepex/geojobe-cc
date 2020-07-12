require([
  "esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
  "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array",
  "dojo/domReady!"
], function (arcgisPortal, OAuthInfo, esriId,
  domStyle, domAttr, dom, on, arrayUtils) {
  var info = new OAuthInfo({
    appId: clientId,
    portalUrl: apiBaseUrl,
    popup: false
  });
  esriId.registerOAuthInfos([info]);

  esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
    function () {
      displayItems();
    }
  ).otherwise(
    function () {
      // Anonymous view
      domStyle.set("signInPrompt", "display", "inline-flex");
      domStyle.set("authedLinks", "display", "none");
    }
  );

  on(dom.byId("signIn"), "click", function () {
    console.log("click", arguments);
    // user will be shown the OAuth Sign In page
    esriId.getCredential(info.portalUrl + "/sharing", {
      oAuthPopupConfirmation: false
    }
    ).then(function () {
      displayItems();
    });
  });

  on(dom.byId("sign-out"), "click", function () {
    esriId.destroyCredentials();
    window.location.reload();
  });

  function displayItems() {
    new arcgisPortal.Portal(info.portalUrl).signIn().then(
      function (portalUser) {
        console.log("Signed in to the portal: ", portalUser);

        domAttr.set("userId", "innerHTML", portalUser.fullName);
        domStyle.set("signInPrompt", "display", "none");
        domStyle.set("authedLinks", "display", "block");

        queryPortal(portalUser);
      }
    ).otherwise(
      function (error) {
        console.log("Error occurred while signing in: ", error);
      }
    );
  }

  function queryPortal(portalUser) {
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

  function createGallery(items) {
    console.log(items);

    var htmlFragment = "";

    arrayUtils.forEach(items.results, function (item) {
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
            "<div class=\"esri-title esri-null-title\">Title not available</div><br />"
        ) +
        (
          item.tags ?
            "Tags :<div class=\"esri-title\">" + (item.tags || "") + "</div>" :
            "<div class=\"esri-title esri-null-title\">No tags available</div><br />"
        ) +
        "<br /><input type=\"text\" class=\"form-control\" />" +
        "</div>"
      );
    });

    dom.byId("itemGallery").innerHTML = htmlFragment;
  }
});