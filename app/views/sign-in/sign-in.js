require([
    "dojo/_base/declare", "dojo/parser", "dojo/ready",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin"
], function (declare, parser, ready, _WidgetBase, _TemplatedMixin) {

    declare("SignInPanel", [_WidgetBase, _TemplatedMixin], {
        templateString: 
            '<div id="signInPrompt" class="sign-in-container">'
            + '<div class="sign-in-prompt">'
            + '<h4>Sign-in Request</h4>'
            + '<img src="https://cfcdn.streetfightmag.com/wp-content/uploads/ESRI_Globe.png" class="img-fluid sign-in-logo" />'
            +'<div class="sign-in-text">'
            + 'The following page is requesting you to sign-in to your ArcGIS account.<br /><br />'
            +'Please click below to continue.'
            + ' </div>'
            +        '<button id="signIn" class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> ArcGIS Sign In</button>'
            + ' </div>'
            + ' </div>'
    });

    ready(function () {
        // Call the parser manually so it runs after our widget is defined, and page has finished loading
        parser.parse();
    });
});