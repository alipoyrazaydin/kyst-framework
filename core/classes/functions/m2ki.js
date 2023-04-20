module.exports = {
    name: "m2ki",
    main(bot, msg, cmd) {
        // Seperating message to command elements.
        const mContent = msg.content;
        const mArgs = (process.configuration["Kyst.Commands.Prefix.SpecialRegexParameterParserEnabled"] ? Array.from(mContent.matchAll(/[^\s"']+|"([^"]*)"|'([^']*)'/g), e => (e[1] || e[2] || e[0])) : mContent.split(" "));
        const mCommand = mArgs.shift().substring(process.botConfig.prefix.length);
        let commandOptionsObject = []

        let dummyAttachmentCounter = 0;

        mArgs.forEach((er,idx) => {
            if (isset(cmd.structure.options[idx])) {
                let cmdName = cmd.structure.options[idx].name;
                let cmdType = cmd.structure.options[idx].type;
                let cmdRawValue = er;
                let cmdValue = undefined;

                if (cmdType == 3) { commandOptionsObject.push({name: cmdName, type: cmdType, value: cmdRawValue}); }
                else if (cmdType == 4) { commandOptionsObject.push({name: cmdName, type: cmdType, value: parseInt(cmdRawValue)}); }
                else if (cmdType == 5) { commandOptionsObject.push({name: cmdName, type: cmdType, value: (cmdValue == "true" ? true : false)}); }
                else if (cmdType == 6) { commandOptionsObject.push({name: cmdName, type: cmdType, member: msg.mentions.members.get(cmdRawValue.slice(2,cmdRawValue.length - 1)), user: msg.mentions.members.get(cmdRawValue.slice(2,cmdRawValue.length - 1)).user}); }
                else if (cmdType == 7) { commandOptionsObject.push({name: cmdName, type: cmdType, channel: msg.mentions.channels.get(cmdRawValue.slice(2,cmdRawValue.length - 1))}); }
                else if (cmdType == 8) { commandOptionsObject.push({name: cmdName, type: cmdType, role: msg.mentions.roles.get(cmdRawValue.slice(2,cmdRawValue.length - 1))}); }
                else if (cmdType == 9) { 
                    let roler = msg.mentions.roles.get(cmdRawValue.slice(2,cmdRawValue.length - 1));
                    let memberer = msg.mentions.members.get(cmdRawValue.slice(2,cmdRawValue.length - 1));
                    if (isset(roler)) commandOptionsObject.push({name: cmdName, type: cmdType, role: roler}); 
                    if (isset(memberer)) commandOptionsObject.push({name: cmdName, type: cmdType, member: memberer, user: memberer.user}); 
                }
                else if (cmdType == 10) { commandOptionsObject.push({name: cmdName, type: cmdType, value: parseInt(cmdRawValue)}); }
                else if (cmdType == 11) { commandOptionsObject.push({name: cmdName, type: cmdType, attachment: msg.attachments.at(dummyAttachmentCounter)}); dummyAttachmentCounter++; }
            }
        });

        let optsResolv = new Kyst.Models.Discord.CommandInteractionOptionResolver(bot.base, commandOptionsObject, null);

        // https://discord.js.org/#/docs/discord.js/main/class/ApplicationCommand
        var commandObject = {
            applicationId: bot.application.id,
            client: msg.client,
            createdAt: msg.createdAt,
            createdTimestamp: msg.createdTimestamp,
            defaultMemberPermissions: msg.member.permissions,
            description: cmd.structure.description,
            descriptionLocalizations: cmd.structure.descriptionLocatizations,
            descriptionLocalized: cmd.structure.description,
            dmPermission: msg.member.permissions,
            guild: msg.guild,
            guildId: msg.guildId,
            id: -1,
            manager: null,
            name: mCommand,
            nameLocalications: cmd.structure.nameLocalications,
            nameLocalized: mCommand,
            nsfw: cmd.structure.nsfw,
            options: optsResolv,
            permissions: msg.member.permissions,
            type: 1,
            version: 0
        }

        // https://discord.js.org/#/docs/discord.js/stable/class/Interaction
        var interactionObject = {
            // Objects
            applicationId: bot.application.id,
            channel: msg.channel,
            channelId: msg.channelId,
            client: msg.client,
            command: commandObject,
            commandName: commandObject.name,
            commandGuildId: msg.guild.id,
            createdAt: msg.createdAt,
            createdTimestamp: msg.createdTimestamp,
            deferred: false,
            guild: msg.guild,
            guildId: msg.guildId,
            guildLocale: "en-US",
            id: msg.id,
            locale: "en-US",
            member: msg.member,
            memberPermissions: msg.member.permissions,
            base: msg,
            options: optsResolv,
            translated: true,
            repliedMessage: undefined,
            token: bot.token,
            type: 1,
            user: msg.member.user,
            version: 0,

            // Methods
            deferReply: async function() {this.repliedMessage = await this.base.reply(bot.base.user.username + " is thinking..."); this.deferred = true; return this.repliedMessage;},
            deleteReply: async function() {var _; if (this.repliedMessage !== undefined) _ = await this.repliedMessage.delete(); return _;},
            editReply: async function(opts) {return await this.repliedMessage.edit(opts.val || opts);},
            fetchReply: async function() {return this.repliedMessage},
            followUp: async function(opts) {return await this.repliedMessage.reply(opts.val || opts);},
            inCachedGuild: () => {return false},
            inGuild: () => {return true},
            inRawGuild: () => {return false},
            isApplicationCommand: () => {return true},
            isAutocomplete: () => {return false},
            isButton: () => {return false},
            isCommand: () => {return true},
            isChatInputCommand: () => {return true},
            isContextMenu: () => {return false},
            isMessageComponent: () => {return false},
            isMessageContentMenu: () => {return false},
            isModalSubmit: () => {return false},
            isRepliable: () => {return true},
            isStringSelectMenu: () => {return false},
            isUserContextMenu: () => {return false},
            reply: async function(opts){this.repliedMessage = await msg.reply(opts.val || opts); return this.repliedMessage;},
            showModal: async function(modal){/* [SOON] Trying different ways, will be replaced on next update. */ throw new Error("This is not supported on translated interactions")}
        }
        return interactionObject;
    }
}