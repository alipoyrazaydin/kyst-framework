/*
    Kyst Framework Embedded
    Made with <3 by Ali Poyraz AYDIN (KIGIPUX)
    Feel free to modify and redistribute.
*/
module.exports = {
    modules:[
        {
            name: "GlobalHelperClassesModule",
            loadAt: 1,
            start() {
                let glb = typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis);
                glb.CommandStructure = Kyst.Models.Discord.SlashCommandBuilder.onto(scb => {
                    scb.prototype.onto(scbProto => {
                        // Functions
                        scbProto.setCooldown = function(e) { this.cooldown = e; return this; };
                        scbProto.onlyDevelopers = function(e = true) { this.onlyDevs = e; return this; };
                        scbProto.onlyAdministrators = function(e = true) { this.onlyAdmins = e; return this; };
                        scbProto.setCategory = function(e) { this.category = e; return this; };
                    });
                });
                glb.SystemEmbed = function(){
                    let opts = this.embedOpts || {color: process.botConfig.color};
                    let comps = this.embedComps || null;
                    let ephemeral = this.ephemeral || null;
                    return {
                        withTitle: e => { return glb.SystemEmbed.call({embedOpts: opts.with({title: e}), embedComps: comps, ephemeral}) },
                        withURL: e => { return glb.SystemEmbed.call({embedOpts: opts.with({url: e}), embedComps: comps, ephemeral}) },
                        withDescription: e => { return glb.SystemEmbed.call({embedOpts: opts.with({description: e}), embedComps: comps, ephemeral}) },
                        withComponents: (...e) => { return glb.SystemEmbed.call({embedOpts: opts, embedComps: e, ephemeral}) },
                        withColor: e => { return glb.SystemEmbed.call({embedOpts: opts.with({color: e}), embedComps: comps, ephemeral}) },
                        withAuthor: (aN, aA = undefined, aL = undefined) => { return glb.SystemEmbed.call({embedOpts: opts.with({author: {name: aN, url: aL, icon_url: aA}}), embedComps: comps, ephemeral}) },
                        withFooter: (fT,fI = undefined) => { return glb.SystemEmbed.call({embedOpts: opts.with({footer: {text: fT, icon_url: fI}}), embedComps: comps, ephemeral}) },
                        addField: (fT, fD ,fI = false) => {return glb.SystemEmbed.call({embedOpts: opts.onto(field => {if (isnotset(field.fields)) field.fields = [];field.fields.push({name: fT, value: fD, inline: fI});}), embedComps: comps, ephemeral})},
                        setImage: (img) => {return glb.SystemEmbed.call({embedOpts: opts.with({image: {url: img}}), embedComps: comps, ephemeral})},
                        setEphemeral: (eph = true) => {return glb.SystemEmbed.call({embedOpts: opts, embedComps: comps, ephemeral: eph})},
                        toObject: () => { return {content: "", embeds:[opts], components: comps, ephemeral}; },
                        toJSON: () => { return {content: "", embeds:[opts], components: comps, ephemeral}; },
                        toString: () => { return JSON.stringify({content: "", embeds:[opts], components: comps, ephemeral}); },
                        val: {content: "", embeds:[opts], components: comps, ephemeral}
                    }
                }
            },
            stop() {}
        },
        {
            name: "BetterReactionManagement",
            loadAt: 1,
            start() {
                if (Kyst.Models.Discord.Message.prototype.baseReact == undefined) Kyst.Models.Discord.Message.prototype.baseReact = Kyst.Models.Discord.Message.prototype.react;
                Kyst.Models.Discord.Message.prototype.react = function ReactHandler(emoji) {
                    // Let's create some stuff before doing anything.
                    if (isnotset(this.collector)) this.collector = null;
                    if (isnotset(this.reactionManagement)) this.reactionManagement = {
                        collector: null,
                        handlers: {
                            added: {},
                            removed:{},
                            ended:[]
                        },
                        filter: (r,u) => {return (isset(this.reactionManagement.handlers.added[r.emoji.id || r.emoji.name]) || isset(this.reactionManagement.handlers.removed[r.emoji.id || r.emoji.name])) && !u.bot;}
                    }
        
                    const startManager = () => {
                        let that = this;
                        if (isnotset(this.reactionManagement.collector)){
                            this.reactionManagement.collector = this.createReactionCollector({
                                filter: that.reactionManagement.filter,
                                idle: 30_000
                            });
                            this.reactionManagement.collector.on('collect', (r,u) => {
                                const reactionIdentifier = r.emoji.id || r.emoji.name;
                                if (isset(this.reactionManagement.handlers.added[reactionIdentifier])) this.reactionManagement.handlers.added[reactionIdentifier](u,r);
                            });
                            this.reactionManagement.collector.on('remove', (r,u) => {
                                const reactionIdentifier = r.emoji.id || r.emoji.name;
                                if (isset(this.reactionManagement.handlers.removed[reactionIdentifier])) this.reactionManagement.handlers.removed[reactionIdentifier](u,r);
                            });
                            this.reactionManagement.collector.on('end', () => {
                                this.reactionManagement.handlers.ended.forEach(d => d());
                            });
                        }
                    }
        
                    // Perform reaction, and then do management.
                    let bReactOutput = this.baseReact(emoji);
                    emoji = Kyst.Models.Discord.parseEmoji(emoji).id || emoji;
                    let that = this;
                    let bReactNew = bReactOutput.with({
                      added(erg){startManager(); that.reactionManagement.handlers.added[emoji] = erg; return bReactNew;},
                      removed(erg){startManager(); that.reactionManagement.handlers.removed[emoji] = erg; return bReactNew;},
                      ended(erg){startManager(); that.reactionManagement.handlers.ended.push(erg); return bReactNew;},
                      react(r){return ReactHandler.call(that,r)}
                    });
                    return bReactNew;
                }
            },
            stop() {
                Kyst.Models.Discord.Message.prototype.react = Kyst.Models.Discord.Message.prototype.baseReact;
            }
        },
        {
            name: "BetterComponentManagement",
            loadAt: 1,
            start() {
                let glb = typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis);
                
                glb.ActionRow = Kyst.Models.Discord.ActionRowBuilder.onto(e=>{e.prototype.onFulfill = function(ev){this.endEvent = ev; return this;}});
                glb.Button = Kyst.Models.Discord.ButtonBuilder.onto(e=>{ e.prototype.onClick = function(ev){this.event = ev; return this};});
                glb.ButtonStyle = Kyst.Models.Discord.ButtonStyle;
                glb.StringSelectMenu = Kyst.Models.Discord.StringSelectMenuBuilder.onto(e=>{ e.prototype.onSelect = function(ev){this.event = ev; return this};});
                glb.TextInput = Kyst.Models.Discord.TextInputBuilder;
                glb.TextInputStyle = Kyst.Models.Discord.TextInputStyle;
                glb.StringSelectMenuOption = Kyst.Models.Discord.StringSelectMenuOptionBuilder;
                glb.UserSelectMenu = Kyst.Models.Discord.UserSelectMenuBuilder.onto(e=>{ e.prototype.onSelect = function(ev){this.event = ev; return this};});
                glb.RoleSelectMenu = Kyst.Models.Discord.RoleSelectMenuBuilder.onto(e=>{ e.prototype.onSelect = function(ev){this.event = ev; return this};});
                glb.MentionableSelectMenu = Kyst.Models.Discord.MentionableSelectMenuBuilder.onto(e=>{ e.prototype.onSelect = function(ev){this.event = ev; return this};});
                glb.ChannelSelectMenu = Kyst.Models.Discord.ChannelSelectMenuBuilder.onto(e=>{ e.prototype.onSelect = function(ev){this.event = ev; return this};});
                glb.Modal = Kyst.Models.Discord.ModalBuilder.onto(e=>{e.prototype.onSubmit=function(ev){this.event = ev;return this;}});

                glb.ComponentManagementSystem = {};
                glb.ComponentManagementSystem.InjectMessage = (mClass) => {
                    if (isnotset(mClass.baseReply)) mClass.baseReply = mClass.reply;
                    if (isnotset(mClass.baseEdit)) mClass.baseEdit = mClass.edit;
                    mClass.reply = async function(opts){
                        let bMsg = await this.baseReply(opts.val || opts);
                        if (isset(opts.components) && opts.components.length > 0){
                            let eventHandlers = {}
                            let filter = itr => isset(eventHandlers[itr.customId]);
                            bMsg.componentManagement = bMsg.createMessageComponentCollector({ filter, idle: process.configuration["Kyst.ComponentManagement.IdleTimeout"], dispose: false });
                            bMsg.componentManagement.on('collect', i => eventHandlers[i.customId](i));
                            opts.components.forEach(c => {
                                if (isset(c.components)){
                                    c.components.forEach(p => {if (!p.disabled) eventHandlers[p.data.custom_id] = p.event})
                                } else if (!c.disabled)  eventHandlers[c.data.custom_id] = c.event;
                                if (isset(c.endEvent)){bMsg.componentManagementEnding = c.endEvent;bMsg.componentManagement.on('end', () => {if (isset(bMsg.componentManagementEnding)) bMsg.componentManagementEnding({disable(...dArgs){
                                    let newComp = [];
                                    opts.components.forEach(ex => {
                                        let newComps = [];
                                        ex.components.forEach(kj => { newComps.push(kj.onto(ekj => {ekj.data.disabled = (dArgs.any() ? (dArgs.includes(ekj.data.custom_id) ? true : false) : true);})) })
                                        ex.endEvent = undefined;
                                        newComp.push({components: newComps});
                                    });
                                    bMsg.baseEdit({components: newComp});
                                }})})}
                            });         
                        }
                        return bMsg;
                    }
                    mClass.edit = async function(opts){
                        if (isset(this.componentManagement)) {this.componentManagement.off('end', this.componentManagementEnding);this.componentManagementEnding = void 0;this.componentManagement.stop();}
                        if (isset(opts.components) && opts.components.length > 0){
                            let eventHandlers = {}
                            let filter = itr => isset(eventHandlers[itr.customId]);
                            this.componentManagement = this.createMessageComponentCollector({ filter, idle: process.configuration["Kyst.ComponentManagement.IdleTimeout"], dispose: false });
                            this.componentManagement.on('collect', i => eventHandlers[i.customId](i));
                            opts.components.forEach(c => {
                                if (isset(c.components)){
                                    c.components.forEach(p => {if (!p.disabled) eventHandlers[p.data.custom_id] = p.event})
                                } else if (!c.disabled) eventHandlers[c.data.custom_id] = c.event
                                if (isset(c.endEvent)){this.componentManagementEnding = c.endEvent;this.componentManagement.on('end', () => {if (isset(this.componentManagementEnding)) this.componentManagementEnding({disable: (...dArgs) => {
                                    let newComp = [];
                                    opts.components.forEach(ex => {
                                        let newComps = [];
                                        ex.components.forEach(kj => { newComps.push(kj.onto(ekj => {ekj.data.disabled = (dArgs.any() ? (dArgs.includes(ekj.data.custom_id) ? true : false) : true);})) })
                                        ex.endEvent = undefined;
                                        newComp.push({components: newComps});
                                    });
                                    
                                    this.baseEdit({components: newComp});
                                }})})}
                            });
                        }
                        return (await this.baseEdit(opts.val || opts)).onto(e => {if (isset(this.componentManagement)) e.componentManagement = this.componentManagement;});
                    }
                }
                
                glb.ComponentManagementSystem.InjectInteraction = (iClass) => {
                    if (isnotset(iClass.baseReply)) iClass.baseReply = iClass.reply;
                    if (isnotset(iClass.baseEdit)) iClass.baseEdit = iClass.editReply;
                    if (isnotset(iClass.baseShowModal)) iClass.baseShowModal = iClass.showModal;
                    iClass.showModal = async function(optsx){
                        let opts = optsx.val || optsx
                        if (isset(opts.event)){
                            this.awaitModalSubmit({filter: (int) => int.customId === opts.data.custom_id, time: process.configuration["Kyst.ComponentManagement.ModalTimeout"]}).then(opts.event).catch(errorCat);
                        }
                        return await this.baseShowModal(optsx);
                    }
                    iClass.reply = async function(optsx){
                        let opts = optsx.val || optsx;
                        let bMsg = await this.baseReply((opts.val || opts).with({fetchReply: true}));
                        if (isset(opts.components) && opts.components.length > 0){
                            let eventHandlers = {}
                            let filter = itr => isset(eventHandlers[itr.customId]);
                            bMsg.componentManagement = bMsg.createMessageComponentCollector({ filter, idle: process.configuration["Kyst.ComponentManagement.IdleTimeout"], dispose: false});
                            bMsg.componentManagement.on('collect', i => eventHandlers[i.customId](i));
                            opts.components.forEach(c => {
                                if (isset(c.components)){
                                    c.components.forEach(p => {if (!p.disabled) eventHandlers[p.data.custom_id] = p.event})
                                } else if (!c.disabled)  eventHandlers[c.data.custom_id] = c.event
                                if (isset(c.endEvent)){bMsg.componentManagementEnding = c.endEvent;bMsg.componentManagement.on('end', () => {if (isset(bMsg.componentManagementEnding)) bMsg.componentManagementEnding({disable(...dArgs){
                                    let newComp = [];
                                    opts.components.forEach(ex => {
                                        let newComps = [];
                                        ex.components.forEach(kj => { newComps.push(kj.onto(ekj => {ekj.data.disabled = (dArgs.any() ? (dArgs.includes(ekj.data.custom_id) ? true : false) : true);})) })
                                        ex.endEvent = undefined;
                                        newComp.push({components: newComps});
                                    })
                                    bMsg.baseEdit({components: newComp});
                                }})})}
                            });
                        }
                        return bMsg;
                    }
                    iClass.editReply = async function(optsx){
                        let opts = optsx.val || optsx;
                        let bInt = (await this.baseEdit(opts).with({fetchReply: true}));
                        if (isset(this.componentManagement)) {
                            this.componentManagement.off('end', this.componentManagementEnding);
                            this.componentManagementEnding = void 0;
                            this.componentManagement.stop();
                        };
                        if (isset(opts.components) && opts.components.length > 0){
                            let eventHandlers = {}
                            let filter = itr => isset(eventHandlers[itr.customId]);
                            this.componentManagement = bInt.createMessageComponentCollector({ filter, idle: process.configuration["Kyst.ComponentManagement.IdleTimeout"] });
                            this.componentManagement.on('collect', i => eventHandlers[i.customId](i));
                            opts.components.forEach(c => {
                                if (isset(c.components)){
                                    c.components.forEach(p => {if (!p.disabled) eventHandlers[p.data.custom_id] = p.event})
                                } else if (!c.disabled) eventHandlers[c.data.custom_id] = c.event
                                if (isset(c.endEvent)){this.componentManagementEnding = c.endEvent;this.componentManagement.on('end', () => {if (isset(this.componentManagementEnding)) this.componentManagementEnding({disable: (...dArgs) => {
                                    let newComp = [];
                                    opts.components.forEach(ex => {
                                        let newComps = [];
                                        ex.components.forEach(kj => { newComps.push(kj.onto(ekj => {ekj.data.disabled = (dArgs.any() ? (dArgs.includes(ekj.data.custom_id) ? true : false) : true);})) })
                                        ex.endEvent = undefined;
                                        newComp.push({components: newComps});
                                    })
                                    this.baseEdit({components: newComp});
                                }})})}
                            });
                        }
                        return bInt;
                    }
                }
                glb.ComponentManagementSystem.InjectMessage(Kyst.Models.Discord.Message.prototype);
                glb.ComponentManagementSystem.InjectInteraction(Kyst.Models.Discord.CommandInteraction.prototype);
            },
            stop() {}
        } 
    ]
}