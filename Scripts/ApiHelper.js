/**
 * Created by Bingxu on 2016-08-17.
 */
var Workspace = {
    SiteUrl: 'http://localhost:8080'
    ,
    GetAll: function (CallbackFunction) {
        var url = Workspace.SiteUrl + "/api/workspace";
        $.getJSON(url, null, function (data) {
            CallbackFunction(data)
        });
    }
    ,
    GetWorkspaceById: function (id) {
        var ret = null;
        var url = Workspace.SiteUrl + "/api/workspace/" + id;
        jQuery.ajax({
            url: url,
            success: function (data) {
                ret = data;
            },
            async: false
        });
        return ret;
    }
    ,
    CheckName: function (name) {
        var bRet = false;
        var url = Workspace.SiteUrl + "/api/workspace";
        jQuery.ajax({
            url: url,
            success: function (data) {
                bRet = true;
                if (data && data.length > 0) {
                    $.each(data, function (index, value) {
                        if (value.config.name === $.trim(name)) {
                            bRet = false;
                            return false;
                        }
                    });
                }
            },
            async: false
        });
        return bRet;
    }
    ,
    Create: function (name, type, ram) {
        type = Constants.STACKS[type].id;
        var stackData = Stack.GetStackById(type);

        if (stackData) {
            var config = {};
            config.name = name;
            config.environments = stackData.workspaceConfig.environments;
            if (config.environments[0].machineConfigs[0].source.location) {
                delete config.environments[0].machineConfigs[0].source.location;
            }
            config.environments[0].machineConfigs[0].source.content = "FROM " + stackData.source.origin;
            config.environments[0].machineConfigs[0].limits.ram = Number(ram);
            config.projects = stackData.workspaceConfig.projects;
            config.commands = stackData.workspaceConfig.commands;
            config.defaultEnv = stackData.workspaceConfig.defaultEnv;
            config.links = [];
            config.description = null;

            var url = Workspace.SiteUrl + "/api/workspace?attribute=stackId:" + type;
            jQuery.ajax({
                url: url,
                data: JSON.stringify(config),
                method: "post",
                contentType: "application/json",
                success: function (data) {
                    console.log("Create the workspace " + name + " success. ");
                },
                async: false
            });
        } else {
            console.log("Can not find stack with id： " + type);
        }
    }
    ,
    Delete: function (id) {
        var url = Workspace.SiteUrl + "/api/workspace/" + id;
        jQuery.ajax({
            url: url,
            method: "delete",
            success: function (data) {
                console.log("Delete the workspace " + id + " success. ");
            },
            async: false
        });
    }
    ,
    Start: function (id) {
        var url = Workspace.SiteUrl + "/api/workspace/" + id + "/runtime?accountId=che";
        jQuery.ajax({
            url: url,
            method: "post",
            success: function (data) {
                console.log("Start the workspace " + id + " success. ");
            },
            async: false
        });
    }
    ,
    Stop: function (id) {
        var url = Workspace.SiteUrl + "/api/workspace/" + id + "/runtime";
        jQuery.ajax({
            url: url,
            method: "delete",
            success: function (data) {
                console.log("Stop the workspace " + id + " success. ");
            },
            async: false
        });
    }
};


var Project = {
    Create: function (workspaceId, name, type, desc) {
        var machineInfo = Machine.GetMachineByWorkspaceId(workspaceId);
        if (machineInfo && machineInfo[0] && machineInfo[0].runtime.servers["4401/tcp"].url) {
            var agentUrl = machineInfo[0].runtime.servers["4401/tcp"].url;
            var url = agentUrl + "/project/import/" + name;

            var config = {"location": "https://github.com/che-samples/blank", "parameters": {}, "type": "git"};
            jQuery.ajax({
                url: url,
                data: JSON.stringify(config),
                method: "post",
                contentType: "application/json",
                success: function (data) {
                    url = agentUrl + "/project/" + name;
                    config = {
                        "name": "111",
                        "attributes": {},
                        "links": [],
                        "type": "blank",
                        "source": {"location": "https://github.com/che-samples/blank", "type": "git", "parameters": {}},
                        "path": "/111",
                        "description": null,
                        "problems": [],
                        "mixins": []
                    };
                    config.name = name;
                    config.path = "/" + name;
                    config.description = desc;
                    jQuery.ajax({
                        url: url,
                        data: JSON.stringify(config),
                        method: "put",
                        contentType: "application/json",
                        success: function (data) {
                            console.log("Create the project " + name + " success. ");
                        },
                        async: false
                    });
                },
                async: false
            });
        }
    }
    ,
    CheckName: function (workspaceId, name) {
        var bRet = false;
        var data = Workspace.GetWorkspaceById(workspaceId);

        if (data) {
            bRet = true;
            if (data.config.projects.length > 0) {
                $.each(data.config.projects, function (index, value) {
                    if (value.name === $.trim(name)) {
                        bRet = false;
                        return false;
                    }
                });
            }
        }
        return bRet;
    }
    ,
    Delete: function (name) {
        var url = Workspace.SiteUrl + "/api/workspace/" + id;
        jQuery.ajax({
            url: url,
            method: "delete",
            success: function (data) {
                console.log("Delete the workspace " + id + " success. ");
            },
            async: false
        });
    }
};

var Machine = {
    GetMachineByWorkspaceId: function (workspaceId) {
        var ret = null;
        var url = Workspace.SiteUrl + "/api/machine?workspace=" + workspaceId;
        jQuery.ajax({
            url: url,
            success: function (data) {
                ret = data;
            },
            async: false
        });
        return ret;
    }
};

var Stack = {
    GetStackById: function (id) {
        var ret = null;
        var url = Workspace.SiteUrl + "/api/stack/" + id;
        jQuery.ajax({
            url: url,
            success: function (data) {
                ret = data;
            },
            async: false
        });
        return ret;
    }
};