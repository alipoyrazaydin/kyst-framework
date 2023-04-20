![image](https://user-images.githubusercontent.com/58888959/233439632-d31cdb9e-9cbe-40d4-a67f-5e60c1ef64a4.png) ![](https://img.shields.io/badge/Made_By-kigipux%230001-ff2b63?logo=discord&logoColor=ff2b63&labelColor=151515&style=flat-square) ![](https://img.shields.io/github/license/alipoyrazaydin/kyst-framework?color=ff2b63&label=License&logo=unlicense&labelColor=151515&logoColor=ff2b63&style=flat-square) ![](https://img.shields.io/github/repo-size/alipoyrazaydin/kyst-framework?label=Repository%20Size&logoColor=ff2b63&labelColor=151515&style=flat-square) ![](https://img.shields.io/github/stars/alipoyrazaydin/kyst-framework?label=Stars&logoColor=ff2b63&labelColor=151515&style=flat-square)
# Kyst Framework
Kyst Framework is a wrapper around [Discord.js](https://discord.js.org/) that makes your coding more easier and serves you a better OOP infrastructure. With this framework, you don't need to hard-code your interactions, message reactions and more! It comes with a pre-made Database adapter made with SQLite3 (better-sqlite3 package)
### How does it work?
It wraps around Discord.JS's code through prototypes! It currently wraps around those functions and methods:
 1. `Message.react()`
 2. `Message.reply()`
 3. `CommandInteraction.reply()`
 4. `CommandInteraction.editReply()`
 5. `CommandInteraction.showModal()`
### How to start?
1. Clone this repository to your work environment.
2. Check the template commands.
3. Change the configuration to your likings.
4. Change `bot.kyst.js`'s process settings.
5. Run `npm install` to install necessary libraries.
6. Run it with `node .` and it's ready!
### Examples:
Reactions Example:
```js
async run(interaction){
  let message = await interaction.reply("Bleh! >_<");
  message.react("😛")
     .added(e => { if (e.id === interaction.member.id) interaction.editReply("Bluuh! >v<") })
     .removed(e => { if (e.id === interaction.member.id) interaction.editReply("Bleh! >_<") });
}
```
Components Example:
```js
async run(interaction){
  let comps = new ActionRow().addComponents(
    new Button()
        .setCustomId('mybutton')
        .setLabel('Hey!')
        .setStyle(ButtonStyle.Secondary)
        .onClick(buttonInteraction => {
          if (buttonInteraction.member.id  !==  interaction.member.id) return;
          int.update({content:"Hoo!", components:[]})
        })
  );
  interaction.reply({content:"Hey!", components:[comps]});
}
```
Modal Example:
```js
async run(interaction){
  let modal = new Modal()
      .setCustomId('mymodal')
      .setTitle("Ooh!")
      .addComponents(
        new ActionRow().addComponents(
          new TextInput()
              .setCustomId('mytextbox')
              .setLabel('What is your name?')
              .setStyle(TextInputStyle.Short)
        )
      )
      .onSubmit(modalInteraction => {
        modalInteraction.reply(`Hello, ${modalInteraction.getTextInputValue("mytextbox")}!`);
      })
  ;
  interaction.showModal(modal);
}
```
### Default Configuration File
```js
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
```
#### Default Configuration File (with all optional areas)
```js
module.exports = {
    deployMode: false,
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
    },
    framework: {
        "Kyst.Bot.WorkingDirectory": "bot",
        "Kyst.Commands.PrefixSupport": true,
        "Kyst.Commands.Prefix.SpecialRegexParameterParserEnabled": true,
        "Kyst.ReactionManagement.IdleTimeout": 30_000,
        "Kyst.ComponentManagement.IdleTimeout": 30_000,
        "Kyst.ComponentManagement.ModalTimeout": 30_000,
        "Kyst.Database.WALOptimizationEnabled": true,
        "Kyst.Database.DisableHeartbeatVerbose": true
    }
}
```
### Command Example
```js
module.exports = {
    structure: new CommandStructure()
      .setName("hello")
      .setDescription("An example command"),
    async run(interaction){
      interaction.reply("Hi! ^v^");
    }
}
```
#### Command Example (with optional structure fields)
Quick note for `CommandStructure`: it's literally just `SlashCommandBuilder()` with some extras
```js
module.exports = {
    skipDeploy: false,
    structure: new CommandStructure()
      .setName("hello")
      .setDescription("An example command")
      .setCategory("Entertainment")
      .setCooldown(5000)
      .onlyDevelopers(true)
      .onlyAdministrators(true),
    async run(interaction){
      interaction.reply("Hi! ^v^");
    }
}
```

## Want to develop a module for Kyst Framework?
Kyst Framework also has a built-in module system which allows you to customise your framework and create more possible advancements for your bot
### Module File Structure:
```js
module.exports = {
  name: "MyModule",
  start(){},
  stop(){}
}
```
### Available Methods for the bot (`global.Bot`)
```d
Bot.application // Application Element, fetched after login
Bot.addEvent(<eventName>, <function>) // equivalent of bot.on()
Bot.removeEvent(<eventName>, <function>) // equivalent of bot.off()
Bot.caches // List of caches that bot uses.
bot.addCommand(<command>) // adds a command (see Command Example)
bot.removeCommand(<commandName>) // removes a command
```
### Available Methods for utilities (`global`)
```d
requireAbsolute(<path:string>) // requires by absolute path (from script startup path)

// Error checking
swallow(<function/lambda()>) // Swallows errors. If error, returns undefined, otherwise function's return.
swallowCatch(<function/lambda()>) // same as swallow() but on error it returns an error object.
await bullet(<function/lambda()>) // same as swallow() but it's for multi-threaded methods.
await bulletCatch(<function/lambda()>) // same as swallowCatch() but it's for multi-threaded methods.

// Definition checks and sets
isset(<object>) // Checks if the object is set, If set, returns true, otherwise false.
isnotset(<object>) // Checks if the object is not set, If set, returns false, otherwise true.
unset(<object>) // same as object.dispose() but it's for procedural use.

// Queues (promises)
await tasking.delay(<milliSeconds:integer>) // Delays the promise for given time.
await tasking.desync(<function/lambda()>) // Queues a function.

// Object Utilities
MyObject.with(<object>) // Appends an object to the caller object and returns it
MyObject.withClone(<object>) // Same as .with() but it leaves original object untouched.
MyObject.onto(<function/lambda(obj)>) // Calls a function by the object.
MyObject.ontoClone(<function/lambda(obj)>) // Same as .onto() but it leaves original object untouched.
MyObject.dispose() // Disposes the object.
MyArray.any() // Checks for any element, if has any, returns true, otherwise false.
MyString.toUpperCaseFirstLetter() // Makes first letter uppercase while makes others lowercase

// Misc
setIntervalACR(<function/lambda()>, <milliSeconds:integer>) // High-accuracy setInterval()
addKillHook(<function/lambda()>) // Adds a function to be executed when program closes.
removeKillHook(<function/lambda()>) // Removes the function for execution when program closes.
catArray(<array>, <function(element)/lambda(element)>) // Executes function as array elements

// Colors
ansify.black(<string>) // Makes string color black for ANSI
ansify.red(<string>) // Makes string color red for ANSI
ansify.green(<string>) // Makes string color green for ANSI
ansify.yellow(<string>) // Makes string color yellow for ANSI
ansify.blue(<string>) // Makes string color bluefor ANSI
ansify.magenta(<string>) // Makes string color magentafor ANSI
ansify.cyan(<string>) // Makes string color cyan for ANSI
ansify.white(<string>) // Makes string color white for ANSI
ansify.reset(<string>) // Resets string color for ANSI

// Log
log(<...args>) // Same as console.log() but fancy
verbose(<...args>) // Same as log() but available only on Verbose mode (process.verbose = true)
error(<...args>) // Same as console.error() but fancy
errorCat(<string>) // Logs each line with error()
debug(<name:string>, <description:string>) // Writes a debug line
```
## I hope you liked this project, but...
Sadly, i made this project for fun and it is not going to be maintained by me, but in my free time i will check any merge and push requests so this  project can be kept updated.
