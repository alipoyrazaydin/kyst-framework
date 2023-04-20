/*
    Kyst Framework.
    Made with <3 by Ali Poyraz AYDIN (KIGIPUX)
    Feel free to modify and redistribute.
*/

module.exports = () => {
    // Greeting.
    console.log("Loading KystFramework...");

    // Preparing
    Object.assign(global, {
        Bot: undefined,
        Kyst: {
            Functions: {},
            Models: {},
            Modules: {},
            Enums: {},
            Databases: {}
        }
    });
    Object.assign(process,{
        coreConfig: undefined,
        configuration: undefined,
        botConfig: undefined,
        coreVersion: require("./version"),
        startedAt: Date.now(),
        uptime(){ return Date.now() - this.startedAt; }
    });

    // Import all utilities.
    require("../utils/kyst_extended");
    let fs = require("fs");

    // Preload embedded
    let EmbeddedGlobal = require("./embedded");

    // Party Mode
    verbose([ansify.magenta(process.coreVersion.NAME), process.coreVersion.BASE, "(" + process.coreVersion.RUNNER + " " + process.coreVersion.DATE + ")"].join(" "));

    // Prepare Early Stage.
    log(`Preparing ${ansify.red("early")} stage...`).onto(e => {
        e.verboseNext(`Checking ${ansify.red("early")} modules...`).onto(f => {
            EmbeddedGlobal.modules.filter(v => v.loadAt == 0).forEach(x => {
                global.Kyst.Modules[x.name] = x;
                f.verboseNext(`Initializing ${ansify.green(x.name)} embedded module.`)
                global.Kyst.Modules[x.name].start();
            });
            if (!fs.existsSync(require.main.path + "/core_modules/")) return;
            let modulesFolder = fs.readdirSync(require.main.path + "/core_modules").filter(g => g.endsWith(".early.js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require(require.main.path + "/core_modules/" + moduleFile).with({loadAt: 0})
                global.Kyst.Modules[module.name] = module;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) module.`)
                global.Kyst.Modules[module.name].start();
            }; f.verboseEnd("Initialized all modules."); };
        });
        e.verboseNext(`Loading ${ansify.blue("Enums")}...`).onto(f => {
            let modulesFolder = fs.readdirSync(__dirname + "/../classes/enums/").filter(g => g.endsWith(".js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require("../classes/enums/" + moduleFile);
                global.Kyst.Enums[module.name] = module.model;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) Enum.`)
            }; f.verboseEnd(`${ansify.blue("Enums")} are cached successfully.`); };
        });
        e.verboseNext(`Loading ${ansify.cyan("Objects")}...`).onto(f => {
            let modulesFolder = fs.readdirSync(__dirname + "/../classes/objects/").filter(g => g.endsWith(".js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require("../classes/objects/" + moduleFile);
                global.Kyst.Models[module.name] = module.model;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) Object.`)
            }; f.verboseEnd(`${ansify.cyan("Objects")} are cached successfully.`); };
        });
        e.verboseNext(`Loading ${ansify.red("Functions")}...`).onto(f => {
            let modulesFolder = fs.readdirSync(__dirname + "/../classes/functions/").filter(g => g.endsWith(".js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require("../classes/functions/" + moduleFile);
                global.Kyst.Functions[module.name] = module.main;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) Object.`)
            }; f.verboseEnd(`${ansify.red("Functions")} are cached successfully.`); };
        });
        e.verboseEnd(`Prepared ${ansify.red("early")} stage successfully!`);
    });
    log(`Preparing ${ansify.red("initialization")} stage...`).onto(e => {
        e.verboseNext(`Checking ${ansify.red("initialization")} modules...`).onto(f => {
            EmbeddedGlobal.modules.filter(v => v.loadAt == 1).forEach(x => {
                global.Kyst.Modules[x.name] = x;
                f.verboseNext(`Initializing ${ansify.green(x.name)} embedded module.`)
                global.Kyst.Modules[x.name].start();
            });
            if (!fs.existsSync(require.main.path + "/core_modules/")) return;
            let modulesFolder = fs.readdirSync(require.main.path + "/core_modules").filter(g => g.endsWith(".init.js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require(require.main.path + "/core_modules/" + moduleFile).with({loadAt: 1});
                global.Kyst.Modules[module.name] = module;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) module.`);
                global.Kyst.Modules[module.name].start();
            }; f.verboseEnd("Initialized all modules."); };
        });
        e.verboseNext(`Loading ${ansify.blue("Database")}...`).onto(f => {
            global.Kyst.Enums.DatabaseType = {};
            let modulesFolder = fs.readdirSync(__dirname + "/database/").filter(g => g.endsWith(".js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require("./database/" + moduleFile);
                global.Kyst.Databases[module.name] = module;
                global.Kyst.Enums.DatabaseType[module.name] = module.name;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) Database.`);
            }; f.verboseEnd(`${ansify.cyan("Databases")} are prepared successfully.`); };
        }); 
        e.verboseEnd(`Prepared ${ansify.red("initialization")} stage successfully!`);
        
    });
    log(`Preparing ${ansify.red("lateload")} stage...`).onto(e => {
        e.verboseNext(`Checking ${ansify.red("lateload")} modules...`).onto(f => {
            EmbeddedGlobal.modules.filter(v => v.loadAt == 2).forEach(x => {
                global.Kyst.Modules[x.name] = x;
                f.verboseNext(`Initializing ${ansify.green(x.name)} embedded module.`)
                global.Kyst.Modules[x.name].start();
            });
            if (!fs.existsSync(require.main.path + "/core_modules/")) return;
            let modulesFolder = fs.readdirSync(require.main.path + "/core_modules").filter(g => g.endsWith(".lateload.js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require(require.main.path + "/core_modules/" + moduleFile).with({loadAt: 2});
                global.Kyst.Modules[module.name] = module;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) module.`);
                global.Kyst.Modules[module.name].start();
            }; f.verboseEnd("Initialized all modules."); };
        });
        e.verboseNext(`Loading ${ansify.cyan("Lateload Objects")}...`).onto(f => {
            let modulesFolder = fs.readdirSync(__dirname + "/../classes/objects_lateload/").filter(g => g.endsWith(".js"));
            if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                let module = require("../classes/objects_lateload/" + moduleFile);
                global.Kyst.Models[module.name] = module.model;
                f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) Object.`)
            }; f.verboseEnd(`${ansify.cyan("Lateload Objects")} are cached successfully.`); };
        });
        e.verboseEnd(`Prepared ${ansify.red("lateload")} stage successfully!`);
    });

    let kConfig = requireAbsolute("config.kyst.js");
    process.configuration = require("./config").with(kConfig.framework);
    process.botConfig = kConfig.discord;
    process.bot = {
        workingDirectory: process.configuration["Kyst.Bot.WorkingDirectory"]
    };
    process.coreConfig = {database: kConfig.database};

    // Proceed to Client Initialization.
    if (!process.botConfig.deployMode){
        log(`Everything is ready! Creating ${ansify.green("Bot")} Instance...`).onto(f => {
            f.verboseNext(`Loaded ${ansify.cyan("Configurations")}!`);
            let cLog = f.verboseNext("Setting up the Client.");
            global.Bot = new Kyst.Models.Client({
                intents: process.botConfig.intents,
                partials: process.botConfig.partials
            });
            // Prepare Event Handlers.
            var handlerLog = cLog.verboseNext("Setting up handlers");
            require('fs').readdirSync(require.main.path + "/" + process.bot.workingDirectory + "/events/").filter(el => el.endsWith(".js")).forEach((file, fIdx, fArr) => {
                handlerLog[(fIdx == fArr.length - 1 ? "verboseEnd" : "verboseNext")]("Initializing " + file + " Handler");
                var handler = require(require.main.path + "/" + kConfig.bot.workingDirectory + "events/" + file);
                global.Bot.caches.eventsCache.append(handler.name,handler);
                global.Bot.base[(handler.once === true ? "once" : "on")](handler.name, handler.run);
            });
    
            // Prepare Commands
            var commandLog = cLog.verboseEnd("Setting up commands");
            require('fs').readdirSync(require.main.path + "/" + process.bot.workingDirectory + "/commands/").filter(el => el.endsWith(".js")).forEach((file, fIdx, fArr) => {
                commandLog[(fIdx == fArr.length - 1 ? "verboseEnd" : "verboseNext")]("Initializing " + file + " Command");
                var handler = require(require.main.path + "/" + process.bot.workingDirectory + "/commands/" + file);
                global.Bot.addCommand(handler);
            });
            
            addKillHook(e => {
                global.Bot.erect("kystEnding", global.Bot);
                global.Bot.base.destroy();
                global.Bot.database.endInstance();
                global.Bot.caches.commandsCache.clear();
                global.Bot.caches.commandsCache.iterate((l,k) => {global.Bot.off(l,k.run)});
                for (const [mnm,mdl] of Object.entries(global.Kyst.Modules)) {if (isset(mdl.stop)) swallow(() => mdl.stop());};
            });
            f.verboseNext(`Creating ${ansify.cyan("Database")} Instance.`);
            global.Bot.database = global.Kyst.Databases[process.coreConfig.database.type].instance();
    
            f.verboseNext(`Checking ${ansify.green("bot")} modules...`).onto(f => {
                EmbeddedGlobal.modules.filter(v => v.loadAt == 3).forEach(x => {
                    global.Kyst.Modules[x.name] = x;
                    f.verboseNext(`Initializing ${ansify.green(x.name)} embedded module.`)
                    global.Kyst.Modules[x.name].start();
                });
                if (!fs.existsSync(require.main.path + "/core_modules/")) return;
                let modulesFolder = fs.readdirSync(require.main.path + "/core_modules").filter(g => g.endsWith(".bot.js"));
                if (modulesFolder.any()){ for (let moduleFile of modulesFolder){
                    let module = require(require.main.path + "/core_modules/" + moduleFile).with({loadAt: 3});
                    global.Kyst.Modules[module.name] = module;
                    f.verboseNext(`Initializing ${ansify.green(module.name)} (${ansify.yellow(moduleFile)}) module.`);
                    global.Kyst.Modules[module.name].start();
                }; f.verboseEnd("Initialized all modules."); };
            });
    
            f.verboseEnd("Bot is now ready to go, Logging in...");
            global.Bot.start();
        });
    } else {
        log(`Everything is ready! Starting deployment.`).onto(f => {
            f.verboseNext(`Loaded ${ansify.cyan("Configurations")}!`);
            let cLog = f.verboseNext("Setting up the Client.");
            global.Bot = new Kyst.Models.Discord.Client({
                intents: process.botConfig.intents,
                partials: process.botConfig.partials
            });

            global.Bot.on("ready", () => {
                verbose("Logged in to Discord, Gathering Application Information.");
                global.Bot.application.fetch().then(app => {
                    verbose("Gathered Application Information");                
                    let clientId = app.id;
                    let token = process.botConfig.token;
                    let commandsFolder = require.main.path + "/" + process.bot.workingDirectory + "/commands/";
                    let commandFiles = require('fs').readdirSync(commandsFolder).filter(el => el.endsWith(".js"));
                    let commands = [];
                    for (const file of commandFiles) {
                        const filePath = commandsFolder + file;
                        const command = require(filePath);
                        if (isset(command.structure) && isset(command.run)) {
                            if (!(command.skipDeploy || false)) commands.push(command.structure.toJSON());
                        } else {
                            log(`${ansify.red("[WARNING]")} The command at ${filePath} is missing a required "structure" or "run" property.`);
                        }
                    }
                    const rest = new Kyst.Models.Discord.REST().setToken(token);
                    (async () => {
                        try {
                            log(`Started refreshing ${commands.length} application (/) commands.`);
                            const data = await rest.put(
                                Kyst.Models.Discord.Routes.applicationCommands(clientId),
                                { body: commands },
                            );
                            log(`Successfully reloaded ${data.length} application (/) commands.`);
                            global.Bot.destroy();
                            process.botConfig.deployMode = false;
                            module.exports();
                        } catch (error) {
                            errorCat(error);
                            global.Bot.destroy();
                        }
                    })();
                });
            });  
            f.verboseEnd("Logging in to Discord.");
            global.Bot.login(process.botConfig.token);
        });
    }
};