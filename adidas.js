const request = require('request')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix

function stockExtract(adi) {
  variantobs = adi.variation_list
  return variantobs.map((element) => {
    return `Size: ${element.size} ------- Stock: ${element.availability}`
  })
}
//this function extracts all stock number and put it in a nice array to extract for all the stock later
const stockArr = (adi) => {
  variantobs = adi.variation_list
  return variantobs.map((element) => {
    return parseInt(element.availability, 10);
  })
}
function reducer(accumulator, sum) {
  return accumulator + sum
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
      if (body !== `{"message":"not found"}`) {
        try {
          message.channel.send({embed: {
            color: 3447003,
            description: 'Made by Kei',
            title: "Adidas Stock",
            fields: [{
                name: "Size \t \t \t  Stock",
                value: `${stockExtract(body).join('\n')}`,
                inline: true
              },
              {
                name: "Total Stock",
                value: `${stockArr(body).reduce(reducer)}`,
                inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "© NeXuS rEtOR"
          }
          }})
        }
        catch(error) {
          message.channel.send('Please send a valid SKU' + error + stockArr(body))
        }
      } else {
        message.channel.send('SKU not found.')
      };
    })
  }
})

client.login(config.token)
