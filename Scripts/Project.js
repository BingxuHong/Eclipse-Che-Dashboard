/**
 * Created by U on 2016-08-17.
 */

var WORKSPACE_ID = Fn_GetParameterByName("workspaceId");
$(document).ready(function () {
    fn_ProjectListRender();
    fn_RegisterEventReceiver();
});

function fn_ProjectListRender() {
    var data = Workspace.GetWorkspaceById(WORKSPACE_ID);

    if (data) {
        $("#spanWorkspaceName").html(data.config.name);
        $("#tbProject").children("tbody").html("");
        $.each(data.config.projects, function (index, value) {
            var trHtml = "<tr>" +
                "<td>###Name###</td>" +
                "<td>###Type###</td>" +
                "<td>###Description###</td>" +
                "<td><input type='button' id='btnDelete_###Name###' data-name='###Name###' value='Delete' /></td>" +
                "</tr>";
            trHtml = trHtml.replaceAll("###Name###", value.path.replace("/",""))
                .replace("###Type###", value.type)
                .replace("###Description###", value.description);
            $("#tbProject").children("tbody").append(trHtml);
        });

        $("input[id^='btnDelete']").on("click",function(){
            var name = $(this).data("name");
            fn_DeleteProject(name);
        });
    }
}

function fn_projectCreateType() {
    var type = $("input[name=rdoProjectType]:checked").val();
    var trHtml="";
    if(type=="blank"){
        trHtml = "<input type='radio' name='rdoProjectTemplate' value='blank' checked> blank <br />";

    } else if(type=="java"){
        trHtml = "<input type='radio' name='rdoProjectTemplate' value='blank' checked> blank <br />";
        trHtml = trHtml+"<input type='radio' name='rdoProjectTemplate' value='java'> console-java-simple <br />";
    } else if(type=="node"){
        trHtml = "<input type='radio' name='rdoProjectTemplate' value='blank' checked> blank <br />";
        trHtml = trHtml+"<input type='radio' name='rdoProjectTemplate' value='node'> nodejs-hello-world <br />";
    }
    $("#projectTemplate").html(trHtml);
    return;
}

function  fn_CreateProject() {
    var name = $.trim($("#txtProjectName").val());
    if(name && Project.CheckName(WORKSPACE_ID, name)){
        var template = $("input[name=rdoProjectTemplate]:checked").val();
        var desc = $.trim($("#txtProjectDescription").val());
        Project.Create(WORKSPACE_ID,name,template,desc);
        $("#divCreateProjectArea").hide();
        $("#txtProjectName").val("");
        $("#txtProjectDescription").val("");
        fn_ProjectListRender();
    } else{
        alert("This project name is empty or already used.");
    }
}

function fn_DeleteProject(name) {
    if(name && !Project.CheckName(WORKSPACE_ID, name)){
        Project.Delete(WORKSPACE_ID,name);
        fn_ProjectListRender();
    } else{
        alert("This project name is empty or already used.");
    }
}

function fn_RegisterEventReceiver(){
    $("#btnCreateArea").click(function(){
        $("#divCreateProjectArea").show();
    });

    $("#btnCreate").click(function(){
        fn_CreateProject();
    });

}

