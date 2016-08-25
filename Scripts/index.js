/**
 * Created by Bingxu on 2016-08-17.
 */
$(document).ready(function () {
    fn_WorkspaceListRender();
    fn_RegisterEventReceiver();
    fn_WorkspaceWebsocketConnect();
});

function fn_WorkspaceListRender() {
    Workspace.GetAll(function (data) {

        if(data && data.length > 0){
            $("#tbWorkspace").children("tbody").html("");
            $.each(data, function(index,value){

                var trHtml = "<tr id='trWorkspace_###ID###'>" +
                    "<td><a href='project.html?workspaceId=###ID###'>###ID###</a></td>" +
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
                var status = $(this).data("status");
                if(status === "STOPPED") {
                    fn_DeleteWorkspace(id);
                }
            });

            $("input[id^='btnStart']").on("click",function(){
                var id = $(this).data("id");
                var status = $(this).data("status");
                if(status === "STOPPED"){
                    Workspace.Start(id);
                }
            });

            $("input[id^='btnStop']").on("click",function(){
                var id = $(this).data("id");
                var status = $(this).data("status");
                if(status === "RUNNING"){
                    Workspace.Stop(id);
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
        var workspaceId = Workspace.Create(name,type,ram);
        $("#divCreateWorkspaceArea").hide();
        $("#txtWorkspaceName").val("");
        fn_WorkspaceListRender();
        fn_WorkspaceStatusSetting(workspaceId);
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

function fn_WorkspaceWebsocketConnect(){
    Workspace.GetAll(function (data) {
        if(data && data.length > 0){
            $.each(data, function(index,value) {
                fn_WorkspaceStatusSetting(value.id);
            });
        }
    });
}
function fn_WorkspaceStatusSetting(workspaceId)
{
    if ("WebSocket" in window)
    {
        // Let us open a web socket
        var url = Workspace.SiteUrl.replace("http://","ws://") + "/api/ws/" + workspaceId;
        var ws = new WebSocket(url);

        ws.onopen = function()
        {
            // Web Socket is connected, send data using send()
            var postData = {
                                "uuid":Fn_BuildUUID(),
                                "method":"POST",
                                "path":null,
                                "headers":[
                                        {"name":"x-everrest-websocket-message-type","value":"subscribe-channel"}],
                                "body":"{\"channel\":\"workspace:"+workspaceId+"\"}"
                            };
            ws.send(JSON.stringify(postData));
        };

        ws.onmessage = function (evt)
        {
            var received_msg = JSON.parse(evt.data);
            if(received_msg && received_msg.responseCode === 0){
                var statusMsg = JSON.parse(received_msg.body).eventType;
                $("#trWorkspace_"+ workspaceId).children()[2].innerText = statusMsg;
                $("#trWorkspace_"+ workspaceId).children().last().children().data("status",statusMsg);
            }
        };

        ws.onclose = function()
        {
            // websocket is closed.
            console.log(workspaceId + " Connection is closed...");
        };
    }

    else
    {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    }
}

