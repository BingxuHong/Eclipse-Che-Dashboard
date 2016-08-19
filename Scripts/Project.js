/**
 * Created by U on 2016-08-17.
 */

$(document).ready(function () {
    fn_ProjectListRender();
});

function fn_ProjectListRender() {
    var id = Fn_GetParameterByName("workspaceId");
    var data = Workspace.GetWorkspaceById(id);

    if (data && data.config.projects.length > 0) {
        $.each(data.config.projects, function (index, value) {

            var trHtml = "<tr>" +
                "<td>###Name###</td>" +
                "<td>###Type###</td>" +
                "<td>###Description###</td>" +
                "</tr>";
            trHtml = trHtml.replace("###Name###", value.name)
                .replace("###Type###", value.type)
                .replace("###Description###", value.description);
            $("#tbProject").children("tbody").append(trHtml);
        });
    }
}



