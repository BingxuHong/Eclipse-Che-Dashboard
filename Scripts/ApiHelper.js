/**
 * Created by Bingxu on 2016-08-17.
 */
var Workspace = {
    //SiteUrl: 'http://localhost:8080'
    SiteUrl: 'http://52.78.114.109:8080'
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
        var retWorkspaceId = null;
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
                    retWorkspaceId = data.id;
                    console.log("Create the workspace " + name + " success. ");
                },
                async: false
            });
        } else {
            console.log("Can not find stack with id： " + type);
        }
        return retWorkspaceId;
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
        var url = Workspace.SiteUrl + "/api/workspace/" + id + "/runtime?environment=default&accountId=che";
        jQuery.ajax({
            url: url,
            method: "post",
            contentType: "application/json",
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
    Create: function (workspaceId, name, template, desc) {
        var machineInfo = Machine.GetMachineByWorkspaceId(workspaceId);
        if (machineInfo && machineInfo[0] && machineInfo[0].runtime.servers["4401/tcp"].url) {
            var agentUrl = machineInfo[0].runtime.servers["4401/tcp"].url;
            var url = agentUrl + "/project/import/" + name;

            var config;
            if(template=="blank") config = Template.blank;
            else if(template == "java") config = Template.java;
            else config = Template.nodejs;
            jQuery.ajax({
                url: url,
                data: JSON.stringify(config.source),
                method: "post",
                contentType: "application/json",
                success: function (data) {
                    url = agentUrl + "/project/" + name;
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
                    if (value.path.replace("/","") === $.trim(name)) {
                        bRet = false;
                        return false;
                    }
                });
            }
        }
        return bRet;
    }
    ,
    Delete: function (workspaceId, name) {
        var machineInfo = Machine.GetMachineByWorkspaceId(workspaceId);
        if (machineInfo && machineInfo[0] && machineInfo[0].runtime.servers["4401/tcp"].url) {
            var agentUrl = machineInfo[0].runtime.servers["4401/tcp"].url;
            var url = agentUrl + "/project/" + name;
            jQuery.ajax({
                url: url,
                method: "delete",
                success: function (data) {
                    console.log("Project: " + name + " successfully deleted.");
                },
                async: false
            });
        }
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

var Template = {
    GetAll: function () {
        var ret = null;
        var url = Workspace.SiteUrl + "/wsmaster/api/project-template/all";
        jQuery.ajax({
            url: url,
            success: function (data) {
                ret = data;
            },
            async: false
        });
        return ret;
    },
    blank : {
        "name": "111",
        "attributes": {},
        "links": [],
        "type": "blank",
        "source": {"location": "https://github.com/che-samples/blank", "type": "git", "parameters": {}},
        "path": "/111",
        "description": null,
        "problems": [],
        "mixins": []
    },
    java : {
        "name": "console-java-simple",
        "attributes": {},
        "links": [],
        "type": "maven",
        "source": {"location": "https://github.com/che-samples/console-java-simple.git", "type": "git", "parameters": {}},
        "path": "/console-java-simple",
        "description": null,
        "problems": [],
        "mixins": []
    },
    nodejs : {
        "name": "nodejs-hello-world",
        "attributes": {},
        "links": [],
        "type": "node-js",
        "source": {"location": "https://github.com/che-samples/web-nodejs-sample.git", "type": "git", "parameters": {}},
        "path": "/nodejs-hello-world",
        "description": null,
        "problems": [],
        "mixins": []
    }
};


Workspace.SiteUrl = "http://52.78.114.109:8080";