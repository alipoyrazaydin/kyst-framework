module.exports = {
    structure: new CommandStructure()
      .setName("ping")
      .setDescription("See the bot's ping!"),
    async run(interaction){
      const ping = Math.abs(interaction.createdTimestamp - Date.now());
      interaction.reply(
        SystemEmbed()
          .withTitle("Pong!")
          .withDescription("Ping between Discord's servers and our application is " + (ping).toString() + "ms!")
      );
    }
}
