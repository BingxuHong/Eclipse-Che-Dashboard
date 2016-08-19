/**
 * Created by Bingxu on 2016-08-17.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};





var Constants = {
    STACKS:{
        "blank":{ "id": "blank-default"},
        "java":{ "id": "java-default"},
        "node":{ "id": "node-default"}
    }
};