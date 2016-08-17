/**
 * Created by Bingxu on 2016-08-17.
 */
var Workspace = {
    SiteUrl: 'http://localhost:8080'
    ,
    GetAll: function (CallbackFunction){
        var url = Workspace.SiteUrl +  "/api/workspace";
        $.getJSON(url,null,function(data){
            CallbackFunction(data)
        });
    }
};