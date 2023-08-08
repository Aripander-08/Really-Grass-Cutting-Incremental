MAIN.grass = {
	gain(realm = player.decel) {
		return tmp.realm.gain[realm].grass
	},
	cap() {
		let x = 10
		if (inAccel()) x += upgEffect('grass',1,0)+upgEffect('perk',1,0)
		if (!inRecel()) x += upgEffect('ap',4,0)
		if (inRecel()) x = 250
		if (player.options.lowGrass) x = Math.min(x, 250)

		return x
	},
	spawn() {
		let x = 2
		if (inAccel()) {
			x /= upgEffect('grass',2,1)
			x /= upgEffect('perk',2,1)
		}
		if (inDecel()) x /= upgEffect('aGrass',1,1)
		if (inRecel()) x = 1/10
		if (hasUpgrade('momentum', 1)) x /= 3
		if (hasUpgrade('rocket', 16)) x = 1 / (1 / x + upgEffect('rocket', 16))
		if (inPlanetoid()) {
			x = (player.planetoid.started && !player.planetoid.pause && !inFormation("fz") ? 3 : 1/0)

			let div = 1
			div += upgEffect("planetarium", 3)
			div += upgEffect("obs", 3)
			div *= upgEffect("obs", 5)
			x /= div
		}
		return x
	},
	range() {
		let r = 70
		if (inAccel()) r += upgEffect('grass',4,0) + upgEffect('perk',4,0)
		if (!inRecel()) r += upgEffect('aGrass',6,0)
		r += upgEffect("unGrass",2,0)
		if (inFormation("dr")) r /= 2
		if (inFormation("sc")) r *= 2
		return r
	},
	auto() {
		let interval = upgEffect('auto',0,0)/upgEffect('plat',0,0)
		interval /= starTreeEff("auto",7)
		if (inDecel()) interval *= 10 / upgEffect('aAuto', 0)
		if (inRecel()) interval = 0.5
		if (inPlanetoid()) interval = 10
		return interval
	},
}

const G_SIZE = 15
const G_RANGE = 50

var mouse_pos = {x:0,y:0}
var range_pos = {x:0,y:0}
var mouse_in = false

function createGrass() {
	if (tmp.grasses.length < tmp.grassCap) {
		let rng = Math.random()

		let nt = hasGSMilestone(5) && rng < 0.1
		let pl = !inPlanetoid() && (player.tier >= 2 || player.cTimes > 0) && Math.random() < tmp.platChance
		let ms = pl && galUnlocked() && Math.random() < tmp.gal.ms.chance
		let obs = inPlanetoid() && Math.random() < plMAIN.obs.chance()

		tmp.grasses.push({
			x: Math.random(),
			y: Math.random(),

			nt: nt,
			pl: pl,
			ms: ms,
			obs: obs
		})
	}
}

function removeGrass(i, auto) {
	let tg = tmp.grasses[i]
	if (!tg) return

	let v = auto ? (hasUpgrade('res', 4) ? tmp.unRes.habit.max / 10 : 1) * auto : tg.habit ?? 1
	let av = tv = v
	if (auto) av *= tmp.autocutBonus
	if (tg.nt) tv = MAIN.tier.base()

	for (const i of tmp.realm.in) cutRealmGrass(i, v, tv)
	if (galUnlocked()) player.gal.sp = player.gal.sp.add(tmp.gal.astral.gain.mul(v))

	if (tg.pl) player.plat = E(tmp.platGain).mul(hasGSMilestone(0) ? av : v).add(player.plat)
	if (tg.ms) player.gal.moonstone = E(tmp.gal.ms.gain).mul(v).add(player.gal.moonstone)
	if (tg.obs) {
		player.planetoid.obs = plMAIN.obs.gain().mul(v).add(player.planetoid.obs)
		if (plMAIN.obs.canGetRes()) player.planetoid.res = plMAIN.obs.gain().mul(v).add(player.planetoid.res)
	}
	if (hasGSMilestone(4)) {
		if (tg.ms) player.gal.msLuck = 1
		else if (tg.pl) player.gal.msLuck += 0.05
		else player.gal.msLuck += 0.0001
	}
	if (inFormation("cm")) player.planetoid.combo++

	tmp.grasses.splice(i, 1)
}

el.update.grassCanvas = _=>{
	if (mapID == 'g') {
		if (grass_canvas.width == 0 || grass_canvas.height == 0) resizeCanvas()
		drawGrass()

		tmp.el.grass_cap.setHTML(`${format(tmp.grasses.length,0)} / ${format(tmp.grassCap,0)}`)
	}
}

function resetGrasses() {
	tmp.grasses = []
	tmp.spawn_time = 0
}

let canvasTick = false
function drawGrass() {
	if (!retrieveCanvasData()) return;
	if (canvasTick) return
	canvasTick = true
	grass_ctx.clearRect(0, 0, grass_canvas.width, grass_canvas.height);

	let gs = tmp.grasses
	if (mouse_in) {
		grass_ctx.fillStyle = "#34AF7C77"

		grass_ctx.fillRect(range_pos.x,range_pos.y,tmp.rangeCut,tmp.rangeCut)
	}

	grass_ctx.strokeStyle = "#0003"

	for (let i = 0; i < gs.length; i++) {
		let g = gs[i]

		if (g) {
			let prog = 0
			grass_ctx.fillStyle = g.habit?hueBright(90,1-unMAIN.habit.progress(g)):g.obs?'#77B':g.ms?'#008DFF':g.pl?"#DDD":inPlanetoid()?"#B3F":grassColor(getRealmSrc().tier+(g.nt?1:0))

			let [x,y] = [Math.min(grass_canvas.width*g.x,grass_canvas.width-G_SIZE),Math.min(grass_canvas.height*g.y,grass_canvas.height-G_SIZE)]

			if (mouse_in) {
				if (range_pos.x < x + G_SIZE &&
					range_pos.x + tmp.rangeCut > x &&
					range_pos.y < y + G_SIZE &&
					tmp.rangeCut + range_pos.y > y) {
						if (tmp.unRes?.habit?.on) {
							if (!g.habit) g.habit = tmp.unRes.habit.start
						} else {
							removeGrass(i)
							i--
						}
		
						continue
					}
			}

			grass_ctx.fillRect(x,y,G_SIZE,G_SIZE)
			grass_ctx.strokeRect(x,y,G_SIZE,G_SIZE)
		}
	}
	canvasTick = false
}

function grassCanvas() {
	if (!retrieveCanvasData()) return
	if (grass_canvas && grass_ctx) {
		window.addEventListener("resize", resizeCanvas)

		grass_canvas.width = grass_canvas.clientWidth
		grass_canvas.height = grass_canvas.clientHeight

		grass_canvas.addEventListener('mousemove', (event)=>{
			mouse_in = true
			mouse_pos.x = event.pageX - grass_rect.left
			mouse_pos.y = event.pageY - grass_rect.top

			range_pos.x = mouse_pos.x - tmp.rangeCut/2
			range_pos.y = mouse_pos.y - tmp.rangeCut/2
		})

		grass_canvas.addEventListener('mouseout', (event)=>{
			mouse_in = false
		})
	}
}

const BASE_COLORS = ["#00AF00", "#7FBF7F", "#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#7F00FF", "#FF00FF"]
function grassColor(tier = 1) {
	if (tier >= BASE_COLORS.length) return hueBright((tier * 40) % 360, 0.25 + 0.5 * Math.sin(tier / 100))
	return BASE_COLORS[tier]
}

function hueBright(hue, brightness) {
	let rgb

	if (hue > 300) rgb = [1, 0, (360 - hue) / 60]
	else if (hue > 240) rgb = [(hue - 240) / 60, 0, 1]
	else if (hue > 180) rgb = [0, (240 - hue) / 60, 1]
	else if (hue > 120) rgb = [0, 1, (hue - 120) / 60]
	else if (hue > 60) rgb = [(120 - hue) / 60, 1, 0]
	else rgb = [1, hue / 60, 0]
	rgb = [
		Math.round(255 * (brightness + rgb[0] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[1] * (1 - brightness))),
		Math.round(255 * (brightness + rgb[2] * (1 - brightness)))
	]

	return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

function toggleLowGrass() {
	if (!player.options.lowGrass && !confirm("This option is for you if you have lag issues on Grass Field. On enabling, your grass amount is capped at 250. Are you sure?")) return
	player.options.lowGrass = !player.options.lowGrass
}