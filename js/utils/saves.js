const VER = 0.0404
const EX_COMMIT = 11.08
const TB_VER = 1.074
const TB_SAVE = "rgci_tb_test"

function getPlayerData() {
	let s = {
		version: VER,
		tb_ver: TB_VER,

		upgs: {},
		autoUpg: {},

		time: 0,
		lastTick: Date.now(),

		map_notify: {},
		options: {},
		pins: [],

		//RESOURCES
		grass: E(0),
		level: 0,
		xp: E(0),

		maxPerk: 0,
		spentPerk: 0,

		//PRESTIGE
		pp: E(0),
		pTimes: 0,
		pTime: 0,

		tier: 0,
		tp: E(0),

		plat: E(0),

		//CRYSTALIZE
		crystal: E(0),
		cTimes: 0,
		cTime: 0,

		chal: {
			progress: {},
			comp: [],
			max: [],
		},

		//GRASSHOP
		grasshop: 0,
		ghMult: false,

		steel: E(0),
		sTimes: 0,
		sTime: 0,

		chargeRate: E(0),
		bestCharge: E(0),

		decel: 0,
		rocket: {
			total_fp: E(0),
			amount: E(0),
			part: 0,
			momentum: E(0),
		},

		time: 0,
		map_notify: {},
		version: VER,
	}
	return s
}

function newPlayer() {
	player = getPlayerData()
}

function safecheckSave(data) {
	if (findNaN(data, true)) {
		alert("Your save fails to load, because it got NaNed!")
		return false
	}

	const ver_check = data.tb_ver || data.ver || 0
	if (ver_check < 1.02 && (data.decel ? data.level : data.aRes.level) >= 300) {
		alert("Your save fails to load, because it got inflated!")
		return false
	}
	return true
}

function loadPlayer(data) {
	let preTB = data.tb_ver == undefined
	player = deepUndefinedAndDecimal(data, getPlayerData())
	convertStringToDecimal()

	//Vanilla
	if (!player.version) player.version = 0
	if (player.version < 0.0306 && player.rocket.total_fp > 0) {
		player.rocket.total_fp = 0
		player.rocket.amount = 0
		resetUpgrades('rocket')

		player.steel = E(0)
		player.chargeRate = E(0)
		resetAntiRealm()
	}
	player.version = VER

	//Thunderized Balancing
	for (var [i, d] of Object.entries(player.upgs)) {
		let canDelete = true
		for (var l of d) if (l) canDelete = false
		if (canDelete) delete player.upgs[i]
	}

	if (preTB) {
		player.tb_ver = 1
		player.tp = E(0)
		player.tier = 0
		delete player.upgs.pp[2]
		delete player.ver
	}
	if (player.tb_ver < 1.02) {
		player.chal.progress = {}

		resetAntiRealm()
		player.aRes.aTimes = player.aTimes
		player.aRes.lTimes = player.lTimes
		delete player.aGrass
		delete player.aBestGrass
		delete player.ap
		delete player.bestAP
		delete player.aTime
		delete player.aTimes
		delete player.oil
		delete player.bestOil
		delete player.lTime
		delete player.lTimes

		player.rocket.momentum = player.momentum
		delete player.rocket.momentum
	}
	if (player.tb_ver < 1.04) {
		if (galUnlocked() && player.gal.neg > 3) {
			player.gal.neg = 3
			player.gal.stars = E(1e5)
			resetTemp()
			RESET.sac.doReset(true)

			alert("You are forced to do a Sacrifice due to exploit reasons! You will get 100 K Stars in comprehension.")
		}
	}
	if (player.tb_ver < 1.05) player.decel = whatRealm()
	if (player.tb_ver < 1.06) {
		if (!player.sTimes) delete player.aRes
		delete player.bestGrass
		delete player.bestPP
		delete player.bestCrystal
		delete player.chalUnl
		delete player.aRes?.bestGrass
		delete player.unRes?.bestGrass
	}
	if (player.tb_ver < 1.073 && MAIN.sac.did()) {
		player.gal.dm = E(10)
		resetUpgrades("dm")
		resetUpgrades("unGrass")
		resetUpgrades("np")
		resetUpgrades("ring")
		resetUpgrades("res")
	}
	if (player.tb_ver < 1.074 && player.planetoid?.trial) {
		resetUpgrades("np")
		resetUpgrades("cloud")
		player.planetoid.trial.lvl = 0		
	}
	player.tb_ver = TB_VER
}

function deepNaN(obj, data) {
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == 'string') {
			if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k]
		} else {
			if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k]
			if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k])
		}
	}
	return obj
}

function deepUndefinedAndDecimal(obj, data) {
	if (obj == null) return data
	for (let x = 0; x < Object.keys(data).length; x++) {
		let k = Object.keys(data)[x]
		if (obj[k] === null) continue
		if (obj[k] === undefined) obj[k] = data[k]
		else {
			if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k])
			else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k])
		}
	}
	return obj
}

function retrieveData(obj, setup) {
	if (player[obj]) player[obj] = deepUndefinedAndDecimal(player[obj], setup())
}

function convertStringToDecimal() {
	retrieveData("aRes", setupDecel)
	retrieveData("gal", setupGal)
	retrieveData("unRes", setupRecel)
	retrieveData("planetoid", setupPlanetoid)
}

function cannotSave() { return CHEAT }

let saveInterval
function save() {
	let str = btoa(JSON.stringify(player))
	if (cannotSave() || findNaN(player)) return
	tmp.prevSave = localStorage.getItem(TB_SAVE)
	localStorage.setItem(TB_SAVE, str)
	console.log("Game Saved")
}

function resetSaveInterval() {
	clearInterval(saveInterval)
	saveInterval = setInterval(save, 30000)
}

function load(str) {
	let data
	if (str && str !== null) data = JSON.parse(atob(str))
	if (data && safecheckSave(data)) loadPlayer(data)
	else newPlayer()

	resetMap()
	resetTemp()
	updateTemp()

	let now = Date.now()
	//if (player.lastTick > 0) tmp.offline = (now - player.lastTick) / 1e3
	player.lastTick = now

	resetSaveInterval()
}

function exporty() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	save();
	let file = new Blob([str], {type: "text/plain"})
	window.URL = window.URL || window.webkitURL;
	let a = document.createElement("a")
	a.href = window.URL.createObjectURL(file)
	a.download = "RGCI Thunderized Balancing - "+new Date().toGMTString()+".txt"
	a.click()
}

function export_copy() {
	let str = btoa(JSON.stringify(player))
	if (findNaN(str, true)) return

	let copyText = document.getElementById('copy')
	copyText.value = str
	copyText.style.visibility = "visible"
	copyText.select();
	document.execCommand("copy");
	copyText.style.visibility = "hidden"
	console.log("Exported to clipboard")
}

function importy() {
	let loadgame = prompt("Paste your save. WARNING: THIS WILL OVERWRITE THIS SAVE!")
	if (loadgame != null) {
		let keep = player
		try {
			let data = JSON.parse(atob(loadgame))
			if (!safecheckSave(data)) return
			load(loadgame)
			save()
		} catch (error) {
			alert("Error importing")
			console.error(error)
			player = keep
		}
	}
}

function loadGame(start=true, gotNaN=false) {
	load(localStorage.getItem(TB_SAVE))

	setupHTML()
	updateHTML()

	grassCanvas()
	tmp.el.loading.el.remove()
	setInterval(loop, 100/3)
	setInterval(checkNaN, 1000)
}

function wipe() {
	if (!confirm('Are you sure you want to wipe your save?')) return
	if (!confirm("This will reset everything, with no rewards! Are you really sure to wipe?")) return
	alert("If you did that accidentally, you can reload to retrieve your save. However, you have 30 seconds to think!")
	load() //blank save
}

function checkNaN() {
	if (findNaN(player)) {
		alert("Game Data got NaNed")
		load(localStorage.getItem(TB_SAVE))
	}
}

function findNaN(obj, str=false, data=getPlayerData()) {
	if (!obj) return false
	if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj))
	for (let x = 0; x < Object.keys(obj).length; x++) {
		let k = Object.keys(obj)[x]
		if (typeof obj[k] == "number") if (isNaN(obj[k])) return true
		if (str) {
			if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
		} else {
			if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return true
		}
		if (typeof obj[k] == "object") return findNaN(obj[k], str, data[k])
	}
	return false
}