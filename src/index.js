const player = require('./player')
const query = require('./query')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const init = () => {
  if (process.argv[2] == undefined) {
    query.category().then((categorys) => {
      for (let i = 0; i < categorys.length; i++) {
        console.log(`${i+1}. ${categorys[i].displayName}`)
      }
      rl.question("Select a category. : ", (number) => {
        console.clear()
        select_stream(categorys[Number(number) - 1].name)
      })
    }).catch((err) => {
      console.log(err.message)
    })
  } else {
    player.twitch(process.argv[2])
  }
}

const select_stream = (category) => {
  query.streams(category).then((streams) => {
    for (let i = 0; i < streams.length; i++) {
      console.log(`${i+1}. ${streams[i].displayName} (${streams[i].login})`)
    }
    rl.question("Select stream for watching. : ", (number) => {
      console.clear()
      player.twitch(streams[Number(number) - 1].login)
      rl.close()
    })
  }).catch((err) => {
    console.log(err.message)
  })
}

init()