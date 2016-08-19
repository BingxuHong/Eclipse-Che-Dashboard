/**
 * Created by U on 2016-08-17.
 */
var workspaceid="workspacex8uagung4y5zjmw3";
var Project = {
    SiteUrl: 'http://localhost:8080'
    ,
    GetAll: function (CallbackFunction){
        var url = Project.SiteUrl +  "/api/workspace/" + workspaceid;
        $.getJSON(url,null,function(data){
            CallbackFunction(data.config.projects)
        });
    }
};

$(document).ready(function () {
    fn_ProjectListRender();
});

function fn_ProjectListRender() {
    Project.GetAll(function (data) {

        if(data && data.length > 0){
            $.each(data, function(index,value){

                var trHtml = "<tr>" +
                    "<td>###Name###</td>"+
                    "<td>###Type###</td>"+
                    "<td>###Description###</td>"+
                    "</tr>";
                trHtml = trHtml.replace("###Name###", value.name)
                    .replace("###Type###", value.type )
                    .replace("###Description###", value.description);
                $("#tbProject").children("tbody").append(trHtml);
            });
        }
    });
}



