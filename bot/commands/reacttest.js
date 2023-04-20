module.exports = {
    skipDeploy: true,
    structure: new CommandStructure()
      .setName("reacttest")
      .setDescription("Test out Kyst Reactions.")
      .onlyDevelopers(),
    async run(interaction){
        const messageRe = e => {return SystemEmbed().withDescription("```json\n"+JSON.stringify(e)+"\n```")};
        let status = {
            reaction1: false,
            reaction2: false
        }       
        let intrep = await interaction.reply(SystemEmbed().withDescription("Let's test the Reactions!"));
        intrep.react('👍').added((u) => { 
            if (u.id == interaction.member.id) {status.reaction1 = true; interaction.editReply(messageRe(status));};
        }).removed((u) => { 
            if (u.id == interaction.member.id) {status.reaction1 = false; interaction.editReply(messageRe(status));};
        }).react("👎").added((lx) => { 
            if (lx.id == interaction.member.id) {status.reaction2 = true; interaction.editReply(messageRe(status));};
        }).removed((lx) => { 
            if (lx.id == interaction.member.id) {status.reaction2 = false; interaction.editReply(messageRe(status));};
        }).ended(() => {status = "ended"; interaction.editReply(messageRe(status));});
    }
}
