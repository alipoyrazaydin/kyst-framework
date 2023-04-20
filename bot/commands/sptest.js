module.exports = {
    skipDeploy: true,
    structure: new CommandStructure()
      .setName("sptest")
      .setDescription("Test out Kyst Setting Persistency (Database).")
      .onlyDevelopers()
      .addStringOption(opt1 =>
        opt1
          .setName("value")
          .setDescription("New value to apply to the Test variable (Persistent)")
      ),
    async run(interaction){
        const messageRe = () => SystemEmbed().withDescription("Hey, i created the global setting `test` for you. It is currently set to `false`.").val;
        const messageRo = e => SystemEmbed().withDescription("Hey, you already have the `test` global setting. It is currently set to `"+e+"`.").val;
        const messageWa = e => SystemEmbed().withDescription("Your `test` global setting has been changed to `"+e+"` successfully!").val;

        if (isset(interaction.options.getString("value"))){
            Bot.database.global().user(interaction.member.id).setValue("test", interaction.options.getString("value"));
            interaction.reply(messageWa(interaction.command.options.getString("value")));
        }
        else {
            let settingTest = Bot.database.global().user(interaction.member.id).getValue("test");
            if (isnotset(settingTest)) {
                settingTest = false;
                Bot.database.global().user(interaction.member.id).setValue("test", false);
                interaction.reply(messageRe());
            } else {
                interaction.reply(messageRo(settingTest));
            }
        };
    }
}
