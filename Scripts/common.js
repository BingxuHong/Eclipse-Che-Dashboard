/**
 * Created by Bingxu on 2016-08-17.
 */
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};