const request = require('request')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix

function variantExtract(adi) {
  variantobs = adi.variation_list
  return variantobs.map((element) => {
    return {
      Size: element.size,
      Stock: element.availability
    }
  })
  }

client.on("message", (message) => {

  if (message.content.startsWith(prefix)){
    const args = message.content.slice(prefix.length).trim().split(/ + /g);
    const command = args.shift().toUpperCase();
    let pid = command;
    request({
    url: `https://www.adidas.com/api/products/${pid}/availability`,
    json: true,
    headers: {
    Connection: "keep-alive",
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:65.0) Gecko/20100101 Firefox/65.0"
    }}, function(error, response, body) {
      if (body !== {"message":"not found"}) {
        try {
          console.log(variantExtract(body))
          let success = (variantExtract(body));
          let array = [];
          const sting = () => {
            for (i=0; i<success.length;i++) {
              array.push(`Size: ${JSON.stringify(success[i].Size)} \n Stock:${JSON.stringify(success[i].Stock)}`)
          } };
          sting()
          message.channel.send(({embed: {
            color: 3447003,
            description: 'Made by Kei',
            fields: [{
              name: "Result",
              value: `${JSON.stringify(array)}`,
              inline: true
            }]
          }}))
        }
        catch(error) {
          message.channel.send('Please send a valid SKU')
        }
      } else {
        message.channel.send('SKU not found.')
      };
    })
  }
})

client.login(config.token)
