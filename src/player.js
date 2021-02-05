const exec = require('child_process').exec
const fetch = require('node-fetch')
const hls = require('./hls')

const twitch = (login) => {
	hls.twitch(login).then(async (m3u8) => {
		m3u8 = m3u8.hls[m3u8.hls.length - 1]
		console.log('Waiting for skip ad')
		await adreq(m3u8)
		console.log(`Playing ${login}'s stream.`)
		vlc(m3u8)
	}).catch((err) => {
		console.log(err.message)
	})
}

const vlc = (hls) => {
	exec(`vlc -q ${hls}`, (err, stdout, stderr) => {
		if (err) {
			console.error(err)
		}
	})
}

const adreq = async (m3u8) => {
	while (true) {
		let res
		try {
			res = await fetch(m3u8, {
				"method": 'GET'
			})
		} catch (error) {
			console.log('An error occurred while waiting for skip ad.')
			process.exit()
		}
		if ((await res.text()).includes('Amazon') == false) break
		await sleep(5000)
	}
}

const sleep = (ms) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

exports.twitch = twitch