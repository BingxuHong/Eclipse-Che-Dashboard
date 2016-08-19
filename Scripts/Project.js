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

        if (data.config.projects.length > 0) {
            $("#tbProject").children("tbody").html("");
            $.each(data.config.projects, function (index, value) {

                var trHtml = "<tr>" +
                    "<td>###Name###</td>" +
                    "<td>###Type###</td>" +
                    "<td>###Description###</td>" +
                    "<td><input type='button' id='btnDelete_###Name###' data-name='###Name###' value='Delete' /></td>" +
                    "</tr>";
                trHtml = trHtml.replaceAll("###Name###", value.name)
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
}

function  fn_CreateProject() {
    var name = $.trim($("#txtProjectName").val());
    if(name && Project.CheckName(WORKSPACE_ID, name)){
        var type = $("input[name=rdoProjectType]:checked").val();
        var desc = $.trim($("#txtProjectDescription").val());
        Project.Create(WORKSPACE_ID,name,type,desc);
        $("#divCreateProjectArea").hide();
        $("#txtProjectName").val("");
        $("#txtProjectDescription").val("");
        fn_ProjectListRender();
    } else{
        alert("This workspace name is empty or already used.");
    }
}

function fn_DeleteProject(name) {
    
}

function fn_RegisterEventReceiver(){
    $("#btnCreateArea").click(function(){
        $("#divCreateProjectArea").show();
    });

    $("#btnCreate").click(function(){
        fn_CreateProject();
    });

}

