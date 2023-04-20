module.exports = {
    name: "Client",
    model: class {
      constructor(options = {}){
        this.base = new Kyst.Models.Discord.Client(options);
        this.application = undefined;
        this.caches = {
          commandsCache: new Kyst.Models.Cache(),
          eventsCache: new Kyst.Models.Cache(),
          hooksCache: new Kyst.Models.Cache(),
          cooldownsCache: new Kyst.Models.Discord.Collection()
        }
        
        this.on = this.base.on.bind(this.base);
        this.off = this.base.on.bind(this.off);
        this.erect = (eventName, ...args) => { this.base.emit(eventName,...args) };
        this.addEvent = (eventName, listener) => { this.base.on(eventName, listener); }
        this.removeEvent = (eventName, listener) => { this.base.off(eventName, listener) }
        this.addCommand = (cmd) => { this.caches.commandsCache.append(cmd.structure.name,cmd);if (cmd.structure.aliasNames !== undefined) cmd.structure.aliasNames.forEach(g => {this.caches.commandsCache.append(g,cmd);}); }
        this.getCommand = (cmdName) => { return this.caches.commandsCache.get(cmdName); }
        this.removeCommand = (cmdName) => { let cmd = this.caches.commandsCache.get(cmdName);if (cmd.structure.aliasNames) cmd.structure.aliasNames.forEach(e => this.caches.commandsCache.remove(e));this.caches.commandsCache.remove(cmdName); }
        
        this.base.on("ready", () => {
          log(ansify.green("Application is now online and running!"));
          verbose("Gathering Application Object");
          this.base.application.fetch().then(app => {
            this.application = app;verbose("Gathered Application Object!");
        });});

        let CommandHandling = (cmd,itr) => {
          if ((cmd.structure.onlyDevs && !(Bot.application.owner.members ? Bot.application.owner.members.hasAny([itr.member.id]) : Bot.application.owner.id == itr.member.id))) {
            return msg.reply(SystemEmbed().withTitle("Sorry!").withDescription("You are not allowed to execute this command.").toObject());
          }
          if ((cmd.structure.onlyAdmins && !itr.member.permissionsIn(itr.channel).has(8))) {
            return msg.reply(SystemEmbed().withTitle("Sorry!").withDescription("You are not allowed to execute this command.").toObject());
          }
          if (cmd.structure.cooldown){
            if (!Bot.caches.cooldownsCache.has(cmd.structure.name)) Bot.caches.cooldownsCache.set(cmd.structure.name, new Kyst.Models.Discord.Collection());
            const now = Date.now();
            const cooldownAmount = (cmd.structure.cooldown || 0);
            const timestamps = Bot.caches.cooldownsCache.get(cmd.structure.name);
            if (timestamps.has(itr.member.id)) {
              const expirationTime = timestamps.get(itr.member.id) + cooldownAmount;
              if (now < expirationTime) {
                return (itr.base ? itr.base.react("⏲") : itr.reply(SystemEmbed().withTitle("Hey!").withDescription("You are on a cooldown, Please wait for a while before executing this command.").setEphemeral().toObject()));
              }
            }
            timestamps.set(itr.member.id, now);
            setTimeout(() => timestamps.delete(itr.member.id), cooldownAmount);
          }
          if (cmd !== undefined){
            this.erect("kystCommand", itr, cmd);
          };
        }

        this.base.on("kystCommand", (itr, cmd) => {
          let errorCallback = (e) => {errorCat(e[(process.verbose ? "stack" : "message")]);return itr[(itr.deferred ? "editReply" : "reply")](SystemEmbed().withTitle("Whoops!").withDescription("An error has occurred! There is a problem with the command you are trying to run, Here's some details: \n```dsconfig\n" + e.toString() + "```").setEphemeral().toObject())}
            try{
              cmd.run(itr).then(() => {}, errorCallback)
            } catch {
              let k = swallowCatch(() => cmd.run(itr))
              if (typeof k == Error) errorCallback(k);
            }
        })

        this.base.on("messageCreate", msg => swallow(() => {
          this.erect("kystMessage", msg);
          if (
            (process.configuration["Kyst.Commands.PrefixSupport"] && isset(msg.member.user)) &&
            (!msg.member.user.bot) &&
            (msg.content.toLowerCase().startsWith(process.botConfig.prefix)) &&
            (typeof msg.content === "string")
          ) {
            if (isnotset(this.application)){
              debug("CLIENT", "[ERROR] Application is not fetched yet, Skipping command execution.");
              return;
            }
            let cmd = Bot.getCommand(msg.content.split(" ").shift().substring(process.botConfig.prefix.length));
            if (isset(cmd)){
              let itr = Kyst.Functions.m2ki(this, msg, cmd);
              this.erect("interactionCreate", itr);
            }           
          };
        }));

        this.base.on("interactionCreate", irc => {
          if (irc.isCommand()) {
            CommandHandling(Bot.getCommand(irc.commandName), irc);
          }
        });

        if (process.verbose) this.base.on("debug", e => {if (!(process.configuration["Kyst.Database.DisableHeartbeatVerbose"] && e.toString().toLowerCase().includes("heartbeat"))) global.debug("CLIENT",e.toString().replaceAll("    ",""))});
        
        this.start = () => {
          this.base.login(process.botConfig.token);
        }
      }
    }
  }