const Discord = require(`discord.js`)
const client = new Discord.Client()
const snekfetch = require("snekfetch")
const base64ToImage = require('base64-to-image')
const fs = require('fs')
client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    client.user.setActivity("with some diamonds")

    client.guilds.forEach((guild) => {
        console.log(guild.name)
        guild.channels.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)

            
        })
    })
    //General = 460269953312882699
    //devChannel = 610684935509901336
    let devChannel = client.channels.get("610684935509901336")
    const attachment = new Discord.Attachment(`https://cdn.discordapp.com/attachments/585533377797685288/610682428322742293/unknown.png`)
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
    
    devChannel.send("Came online at " + time + ".")

})  


client.on(`message`, (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    //receivedMessage.channel.send("Message received, " + receivedMessage.author.toString() +": " + receivedMessage.content)

    //receivedMessage.react("👍")
    //receivedMessage.guild.emojis.forEach(customEmoji => {
    //    console.log(`${customEmoji.name} ${customEmoji.id}`)
    //    receivedMessage.react(customEmoji)
    //})

    if (receivedMessage.content.startsWith("-")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)
    let splitCommand = fullCommand.split(" ")
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "skin") {
        skinCommand(arguments, receivedMessage)
    } else if (primaryCommand == "server") {
        serverCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("Unknown command. Try `!help`.")
    }  
    
    function serverCommand(arguments, receivedMessage) {
        if(arguments.length == 0) {
            receivedMessage.channel.send("Please provide a Minecraft Java sevrer IP")
        } else if (arguments.length > 1) {
            receivedMessage.channel.send("Too many IPs! Please only give one.")
        } else {
            snekfetch.get(`https://mcapi.us/server/status?ip=${arguments}`).then(r => {
                console.log(r.body)
                let serverEmbed = new Discord.RichEmbed()
                    .setTitle("Status of " + arguments)
                    if(r.body.online == true) {
                        serverEmbed.setColor('#00FF00')
                        serverEmbed.addField('Server status:', 'Online', true)
                    } else {
                        serverEmbed.setColor('#FF0000')
                        console.log(r.body.online)
                        serverEmbed.addField('Server status:', 'Offline', true)
                    }
                    serverEmbed.addField('Players Online: ', r.body.players.now + "/" + r.body.players.max + " players.", true)
                    let clippedString = r.body.motd.replace(/(\§.)/g, "")
                    serverEmbed.addField('Information', clippedString)
                    
                    serverEmbed.setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${arguments}`)

                    receivedMessage.channel.send(serverEmbed)
                    
                    //fs.unlink('./faviconstest', (err) => {
                    //    if (err) throw err;
                    //    console.log('successfully deleted /tmp/hello');
                    //  });

                    
            })
            
        }
    }
   
    function skinCommand(arguments, receivedMessage) {
        if(arguments.length == 0) {
            receivedMessage.channel.send("Please specify a username. Try `-skin jeb_`")
            return
        } else if (arguments.length > 1) {
            receivedMessage.channel.send("Too many usernames! Please give only one!")
            return
        }
        let username = arguments[0]
        let link = "https://mc-heads.net/body/" + username + "/600.png"
        receivedMessage.channel.send("Here is " + username + "'s skin!")
        const skin = new Discord.Attachment(link)
        receivedMessage.channel.send(skin)
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough arguments. Try `!multiply 1 2`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product* parseFloat(value)
    })
    receivedMessage.channel.send("The product if " + arguments + " is " + product.toString())
}

function helpCommand(arguments, receivedMessage) {
    if(arguments.length == 0) {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `-help [command]`")
    } else {
        receivedMessage.channel.send("It looks like you need help with " + arguments)
    } 
}




client.login("")
