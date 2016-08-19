/**
 * Created by Bingxu on 2016-08-17.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function Fn_GetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



var Constants = {
    STACKS:{
        "blank":{ "id": "blank-default"},
        "java":{ "id": "java-default"},
        "node":{ "id": "node-default"}
    }
};