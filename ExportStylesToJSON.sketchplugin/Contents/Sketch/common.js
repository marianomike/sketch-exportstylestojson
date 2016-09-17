
function alert(title, message){
	var app = [NSApplication sharedApplication];
	[app displayDialog:message withTitle:title];
}

function removeFileExtension(layerName){
	if([layerName containsString:@"."]){
		var nameArray = [layerName componentsSeparatedByString:@"."];
		var name = nameArray[0];
		return name;
	}else{
		return layerName;
	}
}
