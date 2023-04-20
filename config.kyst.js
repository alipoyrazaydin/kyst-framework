module.exports = {
    discord: {
        token: undefined,
        prefix: "k.",
        color: 0xFF2B63,
        intents: [
            Kyst.Models.Discord.GatewayIntentBits.Guilds,
            Kyst.Models.Discord.GatewayIntentBits.GuildMessages,
            Kyst.Models.Discord.GatewayIntentBits.MessageContent,
            Kyst.Models.Discord.GatewayIntentBits.GuildMessageReactions,
            Kyst.Models.Discord.GatewayIntentBits.GuildMembers
        ],
        partials: [
            Kyst.Models.Discord.Partials.Channel,
            Kyst.Models.Discord.Partials.GuildMember,
            Kyst.Models.Discord.Partials.Message,
            Kyst.Models.Discord.Partials.User,
        ]
    },
    database: {
        type: "SQLite",
        database_name: "kystbot"
    }
}