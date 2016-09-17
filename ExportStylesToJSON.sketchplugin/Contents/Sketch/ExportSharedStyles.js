@import 'common.js'

var onRun = function(context) {
  var doc = context.document;
  var documentName = removeFileExtension(doc.displayName());

  //get the document's shared styles
  var sharedStyles = doc.documentData().layerStyles();
  var numberOfSharedStyles = Number(sharedStyles.numberOfSharedStyles());
  var sharedStylesName = "_SharedStyles";

  if(numberOfSharedStyles > 0){

    //allow xml to be written to the folder
    var fileTypes = [NSArray arrayWithObjects:@"json", nil];

    //create select folder window
    var panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:true];
    [panel setCanCreateDirectories:true];
    [panel setAllowedFileTypes:fileTypes];

    var clicked = [panel runModal];
    //check if Ok has been clicked
  	if (clicked == NSFileHandlingPanelOKButton) {

  		var isDirectory = true;
      //get the folder path
  		var firstURL = [[panel URLs] objectAtIndex:0];
      //format it to a string
  		var file_path = [NSString stringWithFormat:@"%@", firstURL];

      //remove the file:// path from string
      if (0 === file_path.indexOf("file://")) {
        file_path = file_path.substring(7);
      }
    }

    exportSharedStyles(sharedStyles, file_path, documentName, sharedStylesName);
  }else{
    doc.showMessage("This document does not have any Shared Styles.");
  }

};

function exportSharedStyles(sharedStyles, file_path, documentName, sharedStylesName){

  var documentStylesArray = [];

  for (var i = 0; i < sharedStyles.numberOfSharedStyles(); i++){
    var styleArray = [];

    layerStyle = sharedStyles.objects().objectAtIndex(i);
    var styleName = String(layerStyle.name());

    if(layerStyle.valueGeneric().hasEnabledFill()){
      var fillArray = layerStyle.valueGeneric().fills();

      var styleFillsArray = [];

      for(var z = 0; z < fillArray.count(); z++){
          var styleFillColor = String(fillArray[z].color());
          styleFillsArray.push({
            fill: styleFillColor,
          })
      }

      styleArray.push({
          name: styleName,
          fills: styleFillsArray,
      });

      documentStylesArray.push({
        style: styleArray,
      });
    }

    if(layerStyle.valueGeneric().hasEnabledBorder()){
      //log(layerStyle.valueGeneric().borderGeneric().color());
    }
  }

  // Create the JSON object from the layer array
  var jsonObj = { "Shared Styles": documentStylesArray };
  // Convert the object to a json string
  var file = NSString.stringWithString(JSON.stringify(jsonObj, null, "\t"));
  // Save the file
  [file writeToFile:file_path+documentName+sharedStylesName+".json" atomically:true encoding:NSUTF8StringEncoding error:null];

  var alertMessage = documentName+sharedStylesName+".json saved to: " + file_path;
  alert("Shared Style JSON Exported!", alertMessage);
}
