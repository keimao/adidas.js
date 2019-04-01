const request = require('request')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const prefix = config.prefix

function sizeExtract(adi) {
  variantobs = adi.variation_list
  return variantobs.map((element) => {
    return element.size
  })
};
function stockExtract(adi) {
  variantobs = adi.variation_list
  return variantobs.map((element) => {
    return element.availability
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
      if (body !== `{"message":"not found"}`) {
        let numStock = parseInt(stockExtract(body), 10);
        console.log(numStock)
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let totalStock = numStock.reduce(reducer)
        console.log(totalStock)
        try {
          message.channel.send({embed: {
            color: 3447003,
            description: 'Made by Kei',
            title: "Adidas Stock",
            fields: [{
                name: "Size \t Stock",
                value: `Size: ${sizeExtract(body).join('\n')} \t Stock: ${stockExtract(body).join('\n')}`,
                inline: true
              },
              {
                name: "Stock",
                value: `${totalStock}`,
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
          message.channel.send('Please send a valid SKU')
        }
      } else {
        message.channel.send('SKU not found.')
      };
    })
  }
})

client.login(config.token)
