const config = require('../config/twitch_api.json')
const fetch = require('node-fetch')

const category = () => {
  return new Promise(async (resolve, reject) => {
    try {
      res = await fetch("https://gql.twitch.tv/gql", {
        method: "POST",
        headers: {
          "client-id": config['Client-ID']
        },
        body: JSON.stringify([{
          "operationName": "BrowsePage_AllDirectories",
          "variables": {
            "limit": 30,
            "options": {
              "tags": ["2610cff9-10ae-4cb3-8500-778e6722fbb5"]
            }
          },
          "extensions": {
            "persistedQuery": {
              "version": 1,
              "sha256Hash": "78957de9388098820e222c88ec14e85aaf6cf844adf44c8319c545c75fd63203"
            }
          }
        }])
      })
    } catch (err) {
      reject({
        'message': 'Error with connect with Twitch API'
      })
    }
    res = (await res.json())[0].data.directoriesWithTags.edges
    list = []
    res.forEach(data => {
      list.push({
        'displayName': data.node.displayName,
        'name': data.node.name
      })
    })
    resolve(list)
  })
}

const streams = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      res = await fetch("https://gql.twitch.tv/gql", {
        method: "POST",
        headers: {
          "client-id": config['Client-ID'],
        },
        body: JSON.stringify([{
          "operationName": "CategoryChannels_InternationalSection",
          "variables": {
            "limit": 15,
            "name": name,
            "options": {
              "recommendationsContext": {
                "platform": "web"
              },
              "sort": "VIEWER_COUNT",
              "tags": ["ab2975e3-b9ca-4b1a-a93e-fb61a5d5c3a4"]
            },
            "sortTypeIsRecency": false
          },
          "extensions": {
            "persistedQuery": {
              "version": 1,
              "sha256Hash": "a522334951931f9a97025dff3eda1403aadf4f49404e11c781e33bb0e5366989"
            }
          }
        }])
      })
    } catch (err) {
      reject({
        'message': 'Error with connect with Twitch API'
      })
    }
    res = (await res.json())[0].data.game.streams.edges
    list = []
    res.forEach(data => {
      list.push({
        'displayName': data.node.broadcaster.displayName,
        'login': data.node.broadcaster.login
      })
    })
    resolve(list)
  })
}

exports.streams = streams
exports.category = category