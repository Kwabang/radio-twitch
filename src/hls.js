const fetch = require('node-fetch')
const config = require('../config/twitch_api.json')

const twitch = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`https://gql.twitch.tv/gql`, {
      "method": 'POST',
      "headers": {
        'Client-ID': config['Client-ID'],
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
      },
      "body": JSON.stringify({
        "operationName": "PlaybackAccessToken",
        "extensions": {
          "persistedQuery": {
            "version": 1,
            "sha256Hash": "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712"
          }
        },
        "variables": {
          "isLive": true,
          "login": id,
          "isVod": false,
          "vodID": "",
          "playerType": "embed"
        }
      })
    }).then(async (token) => {
      switch (token.status) {
        default: //Error with connect with Twitch API
          reject({
            'message': 'Error with connect with Twitch API'
          })
        case 200: //Request success
          raw = await token.json()
          if (raw.data.streamPlaybackAccessToken === null) { //Channel not found
            reject({
              'message': 'Channel not found'
            })
          } else {
            url = `http://usher.twitch.tv/api/channel/hls/${id}.m3u8?player=twitchweb&&token=${raw.data.streamPlaybackAccessToken.value}&sig=${raw.data.streamPlaybackAccessToken.signature}&allow_audio_only=true&allow_source=true&type=any&p=${parseInt(Math.random() * 999999)}`
            fetch(url, {
              "method": 'GET',
              "headers": {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36'
              }
            }).then(async (hls) => {
              switch (hls.status) {
                case 200: //m3u8 data exist
                  hls = await hls.text()
                  hls = hls.replace(/.*#.*\n?/gm, '')
                  resolve({
                    'code': 1,
                    'hls': hls.split('\n')
                  })
                default: //m3u8 data doesn't exsit
                  reject({
                    'code': 2,
                    'message': 'm3u8 data doesn\'t exsit'
                  })
              }
            }).catch((err) => {
              reject({
                'message': err
              })
            })
          }
      }
    }).catch((err) => {
      reject({
        'message': err
      })
    })
  })
}

exports.twitch = twitch