var mapID = 'g'
var mapLoc = "Grass Field"

var mapPos
function resetMap() {
	mapPos = {
		earth: [1,2],
		space: [1,2],
		planetoid: [0,1]
	}

	onSwitchDim(inPlanetoid() ? "planetoid" : "earth")
	if (player.planetoid?.started) mapPos.planetoid = [1,1]

	let pos = getMapPos()
	switchMapPos(pos[0], pos[1], mapPos.dim)
}

window.addEventListener('keydown', e=>{
	if (shiftDown) return
	if (e.keyCode == 65 || e.keyCode == 37) moveMap(-1,0)
	if (e.keyCode == 68 || e.keyCode == 39) moveMap(1,0)
	if (e.keyCode == 87 || e.keyCode == 38) moveMap(0,-1)
	if (e.keyCode == 83 || e.keyCode == 40) moveMap(0,1)
})

const MAP = {
	earth: [
		['stats'],
		['time','opt',   null,  'fd','rf' ],
		['upg', 'g',     'pc',  'gh','gal'],
		['auto','chrono','chal','dc',null ],
	],
	space: [
		['stats'],
		['time','opt',null ,null ],
		['gal', 'sc',  'at'  ,'sac'],
		[null , null, 'chal',null ]
	],
	planetoid: [
		['opt'],
		['ring', 'g', 'astro'],
		['trial']
	],
}

const MAP_UNLS = {
	opt: _ => player.xp.gte(10) || player.pTimes,
	stats: _ => false, //player.pTimes > 0,
	time: _ => player.pTimes > 0,
	chrono: _ => grassHopped(),

	//EARTH
	g: _ => true,
	upg: _ => player.xp.gte(10) || player.pTimes,
	auto: _ => (player.level > 5 || player.pTimes) && !inRecel(),
	pc: _ => player.level > 5 || player.pTimes,
	chal: _ => player.pTimes > 0,
	gh: _ => player.cTimes > 0,
	fd: _ => hasUpgrade("factory", 0) || MAIN.charger.unl(),
	dc: _ => hasUpgrade("factory", 4) || hasAGHMilestone(7),
	rf: _ => hasUpgrade("factory", 5) || galUnlocked(),
	gal: _ => player.rocket.part > 0 || galUnlocked(),

	//SPACE
	sc: _ => true,
	at: _ => true,
	sac: _ => hasAGHMilestone(0),

	//Planetoid
	ring: _ => true,
	astro: _ => true,
	trial: _ => player.planetoid?.aTimes,
}

const MAP_IDS = (_=>{
	let x = []
	for (i of Object.values(MAP)) for (j of i) for (k of j) if (k) x.push(k)
	return x
})()

function unlockedMapId(i, dim) {
	if (dim && !canAccessDim(dim)) return
	return MAP_UNLS[i] && MAP_UNLS[i]()
}

function getMapPosId(x, y, dim) {
	return MAP?.[dim]?.[y]?.[x]
}

function switchMapId(id) {
	mapID = id
	delete player.map_notify[id]
	if (tmp.el) showLoc(MAP_CATEGORIES[id])
}

function getMapPos() {
	return mapPos[mapPos.dim]
}

function moveMap(dx,dy) {
	let pos = getMapPos()
	switchMapPos(pos[0]+dx,pos[1]+dy,mapPos.dim)
}

function switchMapPos(mx,my,dim) {
	let mapId = getMapPosId(mx,my,dim)
	if (unlockedMapId(mapId)) {
		if (mapPos.dim != dim) onSwitchDim(dim)
		mapPos[dim] = [mx, my]
		switchMapId(mapId)
	}
}

el.update.map = _=>{
	for (x in MAP_IDS) {
		let id = MAP_IDS[x]
		let m_div = tmp.el["map_div_"+id]

		if (m_div) m_div.setDisplay(id == mapID)
	}

	let dim = mapPos.dim
	let [mx,my] = getMapPos()
	let mapId = MAP[mapPos.dim][my][mx]
	tmp.el.position.setTxt(`(${mx+1},${my+1}) ${MAP_CATEGORIES[mapId]}: ${GO_TO_NAMES[mapId]}`)
	tmp.el.position.changeStyle("color", inSpace() ? "#b0f" : "")

	tmp.el.map_footer.setDisplay(player.xp.gte(10) || player.pTimes)
	tmp.el.map_ctrl.setDisplay(!player.options.pin_bottom)
	if (!player.options.pin_bottom) {
		updateMapButton("lMap", mx-1, my, dim)
		updateMapButton("rMap", mx+1, my, dim)
		updateMapButton("uMap", mx, my-1, dim)
		updateMapButton("dMap", mx, my+1, dim)

		tmp.el.spaceMap.setDisplay(galUnlocked() && canAccessDim("space"))
		tmp.el.spaceMap.setTxt("(Z) To " + (inSpace() ? "Ground" : "Space"))
	}
}

function updateMapButton(el, mx, my, dim) {
	const mapId = getMapPosId(mx, my, dim)
	const unl = unlockedMapId(mapId)
	tmp.el[el].setClasses({
		map_btn: true,
		locked: !unl,
		[MAP_COLORS[mapId]]: unl && !player.map_notify[mapId],
		notify: player.map_notify[mapId],
	})
}

//Dimensions
function switchDim(id) {
	switchMapPos(mapPos[id][0], mapPos[id][1], id)
}

function canAccessDim(id) {
	return id == "planetoid" || !player.planetoid?.started
}

function onSwitchDim(dim) {
	mapPos.dim = dim
	if (dim != "space") onPlanetoidSwitch()
}

/* EXTENSION */
const MAP_COLORS = {
	opt: "misc",
	stats: "misc",
	time: "misc",
	chrono: "gh",

	//EARTH
	g: "grass",
	auto: "grass",
	upg: "grass",
	pc: "pp",
	chal: "crystal",
	gh: "gh",
	fd: "gh",
	dc: "gh",
	rf: "gh",
	gal: "gal",

	//SPACE
	sc: "gal",
	at: "gal",
	sac: "sac",

	//Planetoid
	ring: "sac",
	astro: "sac",
	trial: "sac",
}

//Locations
const MAP_CATEGORIES = {
	opt: "Misc",
	stats: "Misc",
	time: "Misc",
	chrono: "Misc",

	//EARTH
	g: "Field",
	auto: "Upgrades",
	upg: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Prestige",
	fd: "Factory",
	dc: "Challenges",
	rf: "Factory",

	//SPACE
	gal: "Prestige",
	sc: "Space",
	at: "Space",
	sac: "Space",

	//Planetoid
	ring: "Planetoid",
	astro: "Planetoid",
	trial: "Planetoid",
}

let locTimeout
function showLoc(x) {
	if (x == mapLoc) return
	mapLoc = x

	tmp.el.loc.setHTML(x)
	tmp.el.loc.setOpacity(0.7)

	clearTimeout(locTimeout)
	locTimeout = setTimeout(_ => tmp.el.loc.setOpacity(0), 2000)
}

//Map
const GO_TO_NAMES = {
	opt: "Options",
	stats: "Multipliers",
	time: "Stats",
	chrono: "Chronology",

	//EARTH
	g: "Field",
	auto: "Automation",
	upg: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Grasshop",
	fd: "Foundry",
	dc: "Realms",
	rf: "Refinery",
	gal: "Galactic",

	//SPACE
	sc: "Star Chart",
	at: "Star Platform",
	sac: "Dark Forest",

	//Planetoid
	ring: "Ring Chart",
	astro: "Upgrades",
	trial: "The Trial",
}

function openMap() {
	go_to = go_to == "map" ? "" : "map"
}

let go_to = ''
el.setup.go_to = _ => {
	let html = ""
	for (const [dim, d_dim] of Object.entries(MAP)) {
		html += `<table class="map_div table_fix" id="map_div_${dim}">`
		for (const [y, dy] of Object.entries(d_dim)) {
			html += "<tr>"
			for (const [x, dx] of Object.entries(dy)) {
				html += `<td id="map_div_${dim}_${dx}">`
				if (dx !== null) {
					html += `<button id="map_btn_${dim}_${dx}" onclick="switchMapPos(${x}, ${y}, '${dim}')">${GO_TO_NAMES[dx]}</button>`
					html += `<button class="map_pin" id="map_pin_${dim}_${dx}" onclick="pinMap('${dim}', '${dx}')">Pin</button>`
				}
				html += "</td>"
			}
			html += "</tr>"
		}
		html += "</table>"
	}
	new Element("map_div_inner").setHTML(html)
}

el.update.go_to = _ => {
	let shown = go_to == "map"
	tmp.el.map_btn.setClasses({ notify: Object.keys(player.map_notify).length > 0 })
	tmp.el.map_div.setDisplay(shown)
	if (shown) {
		for (const [dim, d_dim] of Object.entries(MAP)) {
			tmp.el[`map_div_${dim}`].setDisplay(mapPos.dim == dim)
			if (mapPos.dim != dim) continue

			for (const [y, dy] of Object.entries(d_dim)) {
				for (const [x, dx] of Object.entries(dy)) {
					if (dx !== null) {
						const unl = MAP_UNLS[dx]()
						tmp.el[`map_div_${dim}_${dx}`].setDisplay(unl)
						if (unl) updateMapButton(`map_btn_${dim}_${dx}`, x, y, dim)
					}
				}
			}
		}

		tmp.el.spaceButton.setDisplay(galUnlocked() && canAccessDim("space"))
		tmp.el.spaceButton.setTxt("(Z) To " + (inSpace() ? "Ground" : "Space"))
	}
}

//Notifications
const MAP_NOTIFY = {
	opt: _ => 0,
	stats: _ => player.pTimes > 0 ? 1 : 0,
	time: _ => player.pTimes > 0 ? 1 : 0,
	chrono: _ => galUnlocked() ? 2 : player.sTimes ? 1 : 0,

	//EARTH
	g: _ => 0,
	auto: _ => galUnlocked() || hasUpgrade("factory", 3) ? 2 :
		player.pTimes > 0 ? 1 :
		0,
	upg: _ => player.cTimes > 0 || player.tier >= 2 ? 2 :
		player.pTimes > 0 || player.level >= 1 ? 1 :
		0,
	pc: _ => player.cTimes > 0 || player.level > 100 ? 2 :
		player.pTimes > 0 || player.level >= 30 ? 1 :
		0,
	chal: _ => player.sTimes > 0 ? 2 :
		player.cTimes > 0 ? 1 :
		0,
	gh: _ => galUnlocked() ? player.aRes.grassskip + (player.aRes.level >= aMAIN.gs.req() ? 1 : 0) :
		player.grasshop + (player.level >= MAIN.gh.req() ? 1 : 0),
	fd: _ => galUnlocked() || hasUpgrade("factory", 2) ? 3 :
		hasUpgrade("factory", 1) ? 2 :
		hasUpgrade("factory", 0) ? 1 :
		0,
	dc: _ => hasUpgrade("funMachine", 3) ? 2 : 
		galUnlocked() || hasUpgrade("factory", 4) ? 1 : 
		0,
	rf: _ => galUnlocked() || hasUpgrade("factory", 6) ? 2 :
		hasUpgrade("factory", 5) ? 1 :
		0,
	gal: _ => galUnlocked() || player.rocket.part >= 10 ? 1 : 0,

	//SPACE
	sc: _ => 0,
	at: _ => 0,
	sac: _ => hasAGHMilestone(11) ? 2 : hasAGHMilestone(7) ? 1 : 0,
}

tmp_update.push(_=>{
	for (let [id, cond] of Object.entries(MAP_NOTIFY)) {
		cond = cond()
		if (tmp.map_notify[id] === undefined) tmp.map_notify[id] = cond
		if (cond > tmp.map_notify[id]) {
			tmp.map_notify[id] = cond
			player.map_notify[id] = 1
		}
	}
})

//Pins
function goToWhere(id, dim) {
	let [mx, my] = findPosition(id, dim)
	if (!canAccessDim(dim)) return
	switchMapPos(mx, my, dim)
}

function findPosition(id, dim) {
	for ([my, y] of Object.entries(MAP[dim])) {
		for ([mx, x] of Object.entries(y)) {
			if (x == id) return [parseInt(mx), parseInt(my)]
		}
	}
}

function openPins() {
	go_to = go_to == "pin" ? "" : "pin"
}

function createPin() {
	if (player.pins.length == 8) return
	for (let [_, loc] of player.pins) if (loc == mapID) return
	player.pins.push([mapPos.dim, mapID])
}

function deletePin(i) {
	let newPins = []
	for (let [j, p] of Object.entries(player.pins)) if (j != i) newPins.push(p)
	player.pins = newPins
}

function pinMap(dim, loc) {
	let newPins = []
	let deleted = false
	for (let p of player.pins) {
		if (p[1] != loc) newPins.push(p)
		else deleted = true
	}
	if (!deleted && player.pins.length < 8) newPins.push([dim, loc])
	player.pins = newPins
}

function sortPins() {
	let sort = {}
	for (var pin of player.pins) {
		let dim = pin[0]
		if (!sort[dim]) sort[dim] = []
		sort[dim].push(pin)
	}

	let newPins = []
	for (let sorted of Object.values(sort)) newPins = newPins.concat(sorted)
	player.pins = newPins
}

function goToPin(i) {
	let pin = player.pins[i]
	goToWhere(pin[1], pin[0])
}

el.setup.pin = _ => {
	let html = ``
	let html_bottom = ``
	for (var i = 0; i < 8; i++) {
		html += `<tr id='pin_row_${i}'>
			<td><button id='pin_go_${i}' onclick='goToPin(${i})'style="width: 160px"></button></td>
			<td><button class='notify' onclick='deletePin(${i})'>X</button></td>
		</tr>`
		html_bottom += `<button id='pin_bottom_${i}' onclick='goToPin(${i})'></button>`
	}
	new Element("pin_table").setHTML(html)
	new Element("pin_bottom").setHTML(html_bottom)
}

el.update.pin = _ => {
	tmp.el.pin_btn.setDisplay(player.sTimes)

	let shown = go_to == "pin"
	tmp.el.pin_div.setDisplay(shown)
	if (shown) {
		tmp.el.sort_pins.setDisplay(galUnlocked())
		tmp.el.pin_bottom_opt.setTxt(player.options.pin_bottom ? "ON" : "OFF")
		for (var i = 0; i < 8; i++) {
			let added = player.pins[i]
			tmp.el["pin_row_"+i].setDisplay(added)

			if (!added) continue
			let shown2 = unlockedMapId(added[1], added[0])
			tmp.el["pin_go_"+i].setClasses({ locked: !shown2, [added[0]]: true })
			tmp.el["pin_go_"+i].setHTML(GO_TO_NAMES[added[1]])
		}
	}

	let bottom = player.options.pin_bottom
	tmp.el.pin_bottom.setDisplay(bottom)
	if (bottom) {
		tmp.el.pin_bottom_opt.setTxt(player.options.pin_bottom ? "ON" : "OFF")
		for (var i = 0; i < 8; i++) {
			let added = player.pins[i]
			tmp.el["pin_bottom_"+i].setDisplay(added)

			if (!added) continue
			let shown2 = unlockedMapId(added[1], added[0])
			tmp.el["pin_bottom_"+i].setDisplay(shown2)
			tmp.el["pin_bottom_"+i].setHTML(GO_TO_NAMES[added[1]])
			tmp.el["pin_bottom_"+i].setClasses({ [added[0]]: true })
		}
	}
}