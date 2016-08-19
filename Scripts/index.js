/**
 * Created by Bingxu on 2016-08-17.
 */
$(document).ready(function () {
    fn_WorkspaceListRender();
    fn_RegisterEventReceiver();
});

function fn_WorkspaceListRender() {
    Workspace.GetAll(function (data) {

        if(data && data.length > 0){
            $("#tbWorkspace").children("tbody").html("");
            $.each(data, function(index,value){

                var trHtml = "<tr id='trWorkspace_###ID###'>" +
                    "<td>###ID###</td>" +
                    "<td>###Name###</td>" +
                    "<td>###Status###</td>" +
                    "<td>###Type###</td>" +
                    "<td>###Created###</td>" +
                    "<td>###Updated###</td>" +
                    "<td>###Projects###</td>" +
                    "<td><input type='button' id='btnDelete_###ID###' data-id='###ID###' value='Delete' />" +
                        "<input type='button' id='btnStart_###ID###' data-id='###ID###' data-status='###Status###' value='Start' />" +
                        "<input type='button' id='btnStop_###ID###' data-id='###ID###' data-status='###Status###' value='Stop' />" +
                    "</td>" +
                    "</tr>";

                trHtml = trHtml.replaceAll("###ID###", value.id)
                    .replace("###Name###", value.config.name)
                    .replaceAll("###Status###", value.status )
                    .replace("###Type###", value.attributes.stackId)
                    .replace("###Created###", new Date(Number(value.attributes.created)))
                    .replace("###Updated###", new Date(Number(value.attributes.updated)));

                var tdProjectsHtml = "";
                var arrProjects = value.config.projects;
                if(arrProjects && arrProjects.length > 0){
                    tdProjectsHtml = "<h5>Total <b>" + arrProjects.length + "</b> projects</h5><br />";
                    $.each(arrProjects,function(index2, value2){
                        tdProjectsHtml += value2.name + "; ";
                    });
                }
                trHtml = trHtml.replace("###Projects###", tdProjectsHtml);
                $("#tbWorkspace").children("tbody").append(trHtml);
            });


            $("input[id^='btnDelete']").on("click",function(){
                var id = $(this).data("id");
                fn_DeleteWorkspace(id);
            });

            $("input[id^='btnStart']").on("click",function(){
                var id = $(this).data("id");
                var status = $(this).data("status");
                if(status === "STOPPED"){
                    Workspace.Start(id);
                    fn_WorkspaceListRender();
                }
            });

            $("input[id^='btnStop']").on("click",function(){
                var id = $(this).data("id");
                var status = $(this).data("status");
                if(status === "RUNNING"){
                    Workspace.Stop(id);
                    fn_WorkspaceListRender();
                }
            });
        }
    });
}

function fn_CreateWorkspace(){
    var name = $.trim($("#txtWorkspaceName").val());
    if(name && Workspace.CheckName(name)){
        var type = $("input[name=rdoWorkspaceType]:checked").val();
        var ram = $("input[name=rdoWorkspaceRam]:checked").val();
        Workspace.Create(name,type,ram);
        $("#divCreateWorkspaceArea").hide();
        $("#txtWorkspaceName").val("");
        fn_WorkspaceListRender();
    } else{
        alert("This workspace name is empty or already used.");
    }
}

function fn_DeleteWorkspace(id){
    if(confirm("Do you want to delete this workspace?")){
        Workspace.Delete(id);
        fn_WorkspaceListRender();
    }
}

function fn_RegisterEventReceiver(){
    $("#btnCreateArea").click(function(){
        $("#divCreateWorkspaceArea").show();
    });

    $("#btnCreate").click(function(){
        fn_CreateWorkspace();
    });

}

