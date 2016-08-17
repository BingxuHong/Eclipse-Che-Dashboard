/**
 * Created by Bingxu on 2016-08-17.
 */
$(document).ready(function () {
    fn_WorkspaceListRender();
});

function fn_WorkspaceListRender() {
    Workspace.GetAll(function (data) {

        if(data && data.length > 0){
            $.each(data, function(index,value){

                var trHtml = "<tr id='trWorkspace_###ID###'>" +
                    "<td>###ID###</td>" +
                    "<td>###Name###</td>" +
                    "<td>###Status###</td>" +
                    "<td>###Type###</td>" +
                    "<td>###Created###</td>" +
                    "<td>###Updated###</td>" +
                    "<td>###Projects###</td>" +
                    "</tr>";
                trHtml = trHtml.replaceAll("###ID###", value.id)
                    .replace("###Name###", value.config.name)
                    .replace("###Status###", value.status )
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
        }
    });
}