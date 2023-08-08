const SC_IDS = {
	progress: [
		[0],
		[1,2],
		[10,6,3],
		[11,12,4,5],
		[13,7,8,9]
	],
	qol: [
		[null,0,1,3],
		[5,6,2,4],
		[7,8,9,null],
		[11,10,12,13],
		[14,15]
	],
	auto: [
		[4,0,1],
		[2,3,5,6],
		[7],
		[8,9],
		[10,11,12]
	],
}

const STAR_CHART = {
	progress: [
		{
			max: 1,

			title: "Novice Fuelery",
			desc: `Unlock Tier II Rocket Fuel Upgrades.`,

			icon: ['Curr/RocketFuel','Icons/StarSpeed'],

			cost: i => E(0),
			bulk: i => 1
		}, {
			max: 1,

			title: "Intermediate Fuelery",
			desc: `Unlock Tier III Rocket Fuel Upgrades.`,

			branch: 0,
			icon: ['Curr/RocketFuel','Icons/StarSpeed'],

			cost: i => E(1e5),
			bulk: i => 1
		}, {
			max: 1,

			title: "Flashback I",
			desc: `Unlock "Weaker TP" in Prestige Upgrades.`,

			branch: 0,
			icon: ['Icons/TP','Icons/StarSpeed'],

			cost: i => E(1e3),
			bulk: i => 1
		}, {
			max: 1,

			title: "Flashback II",
			desc: `Unlock "Steel Charge" in the Generator.`,

			branch: 2,
			icon: ['Curr/Charge','Icons/StarSpeed'],

			cost: i => E(1e4),
			bulk: i => 1
		}, {
			max: 1,

			title: "Flashback III",
			desc: `Unlock "Space Power" milestone in Charger.`,

			branch: 3,
			icon: ['Icons/SP','Icons/StarSpeed'],

			cost: i => E(1e5),
			bulk: i => 1
		}, {
			max: Infinity,

			title: "Flashback IV",
			desc: `Increase the level cap for "TP" Prestige Upgrade.`,

			branch: 3,
			icon: ['Icons/TP','Icons/StarSpeed'],
							
			cost: i => E(5).pow(i**1.25+5),
			bulk: i => E(i).log(5).sub(5).root(1.25).floor().toNumber() + 1,

			effect(i) {
				return i
			},
			effDesc: x => "+" + format(x, 0) + " levels"
		}, {
			max: 1,

			title: "Negativity Givings",
			desc: `Unlock Negative Energy, which you must gain by grasshopping less.`,

			branch: 2,
			icon: ['Icons/Challenge','Icons/StarSpeed'],

			cost: i => E(1e4),
			bulk: i => 1
		}, {
			max: 20,

			title: "Improved Factory",
			desc: `Raise level caps for each Factory upgrade by <b class="green">+5</b> per level.`,

			branch: 4,
			icon: ['Icons/Assembler','Icons/StarSpeed'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(10).pow(i**1.25+6),
			bulk: i => E(i).log10().sub(6).root(1.25).floor().toNumber()+1,

			effect(i) {
				return i * 5
			},
			effDesc: x => "+" + format(x, 0) + " levels"
		}, {
			max: 1,

			title: "Hopped Space",
			desc: `Each Grass-Hop increases Space Power by 5%. (starting at 50)`,

			branch: 5,
			icon: ['Icons/SP','Icons/StarSpeed'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(1e10),
			bulk: i => 1,

			effect(i) {
				return E(1.05).pow(Math.max(player.grasshop - 49, 0))
			},
			effDesc: x => format(x) + "x"
		}, {
			max: 1,

			title: "Tiered Space",
			desc: `Every 5 tiers, gain more Space Power by <b class="green">tier base</b>. (starting at 50)`,

			branch: 5,
			icon: ['Icons/SP','Icons/StarSpeed'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(1e11),
			bulk: i => 1,

			effect(i) {
				if (player.tier < 50) return E(1)
				return E(MAIN.tier.base(0)).pow(Math.floor((player.tier - 50) / 5 + 1))
			},
			effDesc: x => format(x) + "x"
		}, {
			max: 1,

			title: "Overpowerful Fuels",
			desc: `Rocket Part is ascended, but scales faster. Unlock new Momentum upgrades.`,

			branch: 2,
			icon: ['Curr/RocketFuel','Icons/StarSpeed'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(2e15),
			bulk: i => 1
		}, {
			max: 1,

			title: "Momentum Towards Light",
			desc: `Unlock a new Momentum Upgrade.`,

			branch: 10,
			icon: ['Curr/Momentum','Icons/StarSpeed'],

			cost: i => E(1e18),
			bulk: i => 1
		}, {
			max: 20,

			title: "Positive Attraction",
			desc: `Grasshops lose less Negative Energy.`,

			branch: 6,
			icon: ['Icons/Grasshop','Icons/StarSpeed'],

			cost: i => E(10).pow((i+3)**1.5*2),
			bulk: i => E(i).log(100).root(1.5).sub(3).floor().toNumber()+1,

			effect(i) {
				return i/20
			},
			effDesc: x => "-" + format(x * 100, 0) + "%"
		}, {
			max: 1/0,

			title: "Potential Grasshops",
			desc: `Each Potential Grasshop gives +1 Grasshop as long you didn't do it.`,

			branch: 12,
			icon: ['Icons/Grasshop','Icons/StarSpeed'],

			unl: _ => true,
			cost: i => E(10).pow((i+3.5)**1.5*2),
			bulk: i => E(i).log(100).root(1.5).sub(3.5).floor().toNumber()+1,

			effect(i) {
				return i
			},
			effDesc: x => "+" + format(x, 0) + " Grasshop"
		},
	],
	qol: [
		 {
			max: 1,

			title: "Auto-Automation",
			desc: `Keep Automation Upgrades on Galactic except production.`,

			icon: ['Curr/Grass','Icons/StarProgression'],
							
			cost: i => E(0),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Anti-Anti-Auto-Automation",
			desc: `Keep Anti-Automation Upgrades on Galactic except production.`,

			branch: 0,
			icon: ['Curr/AntiGrass','Icons/StarProgression'],

			cost: i => E(20),
			bulk: i => 1
		}, {
			max: 10,

			title: "Resource Restoration",
			desc: `Produce <b class="green">+0.1%</b> of pre-Steelie resources.`,

			branch: 0,
			icon: ['Curr/Prestige','Icons/StarProgression'],
							
			cost: i => E(3).pow(i).mul(30),
			bulk: i => i.div(30).log(3).floor().toNumber() + 1,

			effect(i) {
				return i/1e3
			},
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			max: 10,

			title: "Resource Restoration II",
			desc: `Produce <b class="green">+0.1%</b> of Anti-Realm resources. Anti-Realm Upgrades don't spend anything.`,

			branch: 2,
			icon: ['Curr/Anonymity','Icons/StarProgression'],
							
			cost: i => E(3).pow(i).mul(1e4),
			bulk: i => i.div(1e4).log(3).floor().toNumber() + 1,

			effect(i) {
				return i/1e3
			},
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			max: 10,

			title: "Steel Labor",
			desc: `Produce <b class="green">+0.1%</b> of Steel gain. Factory, Foundry, and Generator don't spend anything.`,

			branch: 2,
			icon: ['Curr/Steel','Icons/StarProgression'],

			cost: i => E(3).pow(i).mul(1e5),
			bulk: i => i.div(1e5).log(3).floor().toNumber() + 1,

			effect(i) {
				return i/1e3
			},
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			max: 1,

			title: "Bulk Hops",
			desc: `Bulk Grasshops on one click.`,

			branch: 0,
			icon: ['Icons/Grasshop','Icons/StarProgression'],

			cost: i => E(200),
			bulk: i => 1
		}, {
			max: 1,

			title: "Reassembled",
			desc: `Keep Assembler. <b class="red">Challenges still reset on Galactic!</b>`,

			branch: 5,
			icon: ['Icons/Assembler','Icons/StarProgression'],
	
			cost: i => E(1e3),
			bulk: i => 1
		}, {
			unl: _ => MAIN.sac.did(),
			max: 1,

			title: "Bulk Skips",
			desc: `Bulk Grass-Skips on one click.`,

			branch: 5,
			icon: ['Icons/Grassskip','Icons/StarProgression'],

			cost: i => E(1e13),
			bulk: i => 1
		}, {
			max: 1,

			title: "Why Not Speed?",
			desc: `Rocket Part only resets Rocket Fuel cost.`,

			branch: 5,
			icon: ['Curr/Charge','Icons/StarProgression'],

			cost: i => E(1e5),
			bulk: i => 1
		}, {
			max: 1,

			title: "Unforgettable Fuel",
			desc: `Keep Rocket Fuel on Galactic.`,

			branch: 5,
			icon: ['Curr/RocketFuel','Icons/StarProgression'],

			cost: i => E(1e6),
			bulk: i => 1
		}, {
			unl: _ => MAIN.sac.did(),
			max: 1,

			title: "Why Not Charge Again?",
			desc: `Keep Foundry and Generator on Grass-Skip.`,

			branch: 8,
			icon: ['Curr/Charge','Icons/StarProgression'],

			cost: i => E(1e3),
			bulk: i => 1
		}, {
			unl: _ => MAIN.sac.did(),
			max: 1,

			title: "Challenging and Beyond",
			desc: `Pre-Galactic Challenges don't reset on Galactic. <b class='red'>Locked Challenges do nothing.</b>`,

			branch: 8,
			icon: ['Icons/Challenge','Icons/StarProgression'],

			cost: i => E(1e6),
			bulk: i => 1
		}, {
			unl: _ => MAIN.sac.did(),
			max: 1,

			title: "Realm Intergation",
			desc: `Normal Realm progress saves on decelerating.`,

			branch: 8,
			icon: ['Curr/AntiGrass','Icons/StarProgression'],

			cost: i => E(1e15),
			bulk: i => 1
		}, {
			unl: _ => MAIN.sac.did(),
			max: 1,

			title: "Realm Simulataneous",
			desc: `Combine Grass and Anti-Grass in both Realms.`,

			branch: 12,
			icon: ['Curr/AntiGrass','Icons/StarProgression'],

			cost: i => E(1e30),
			bulk: i => 1
		}, {
			unl: _ => hasAGHMilestone(11),
			max: 1,

			title: "Stardust Generator",
			desc: `Produce <b class="green">+0.1%</b> of Star gain.`,

			branch: 12,
			icon: ['Curr/Star','Icons/StarProgression'],

			cost: i => E(1e30),
			bulk: i => 1,

			effect(i) {
				return i/1e3
			},
			effDesc: x => "+"+formatPercent(x)+"/s"
		}, {
			unl: _ => hasAGHMilestone(11),
			max: 1,

			title: "Excited!",
			desc: `Produce <b class="green">+0.1%</b> of Fun gain.`,

			branch: 12,
			icon: ['Curr/Fun','Icons/StarProgression'],

			cost: i => E(1e30),
			bulk: i => 1,

			effect(i) {
				return i/1e3
			},
			effDesc: x => "+"+formatPercent(x)+"/s"
		},
	],
	auto: [
		{
			max: 1,

			title: "Smart Factory",
			desc: `Automate the Factory.`,

			icon: ['Curr/Steel','Icons/StarAuto'],
							
			cost: i => E(0),
			bulk: i => 1
		}, {
			max: 1,

			title: "Self-Generator",
			desc: `Automate the Generator.`,

			branch: 0,
			icon: ['Curr/Charge','Icons/StarAuto'],

			cost: i => E(20),
			bulk: i => 1
		}, {
			max: 1,

			title: "Moving and Launch",
			desc: `Automate the Refinery and Momentum Upgrades.`,

			branch: 0,
			icon: ['Curr/RocketFuel','Icons/StarAuto'],

			cost: i => E(50),
			bulk: i => 1
		}, {
			max: 40,

			title: "Speedrun",
			desc: `Auto-Challenge Timer is faster.`,

			branch: 0,
			icon: ['Icons/Challenge','Icons/StarAuto'],

			cost: i => E(2).pow(i).mul(10),
			bulk: i => i.div(10).log(2).floor().toNumber() + 1,

			effect(i) {
				return i/5+1
			},
			effDesc: x => format(x,1)+"x faster"
		}, {
			max: 1,

			title: "Star Accelerator",
			desc: `Automate Star Accumulator.`,

			branch: 0,
			icon: ['Icons/StarAccumulator','Icons/StarAuto'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(1e6),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Platinum Grinder",
			desc: `Automate Platinum Upgrades.`,

			branch: 0,
			icon: ['Curr/Platinum','Icons/StarAuto'],

			cost: i => E(3e3),
			bulk: i => 1,
		}, {
			max: 10,

			title: "Quickly Forgettable II",
			desc: `Cheapen Non-Charger Generator Upgrades.`,

			branch: 0,
			icon: ['Icons/Assembler','Icons/StarAuto'],

			cost: i => E(2).pow(i).mul(100),
			bulk: i => i.div(100).log(2).floor().toNumber() + 1,

			effect(i) {
				return E(10).pow(i)
			},
			effDesc: x => "/"+format(x)
		}, {
			max: 15,

			title: "Speedgrass",
			desc: `Auto-Cutting is faster.`,

			branch: 0,
			icon: ['Curr/Grass','Icons/StarAuto'],

			cost: i => E(10).pow((i+2)**0.8),
			bulk: i => E(i).log10().sub(2).root(0.8).floor().toNumber()+1,

			effect(i) {
				return i/10+1
			},
			effDesc: x => format(x,1)+"x faster"
		}, {
			max: 1,

			title: "Speedhop",
			desc: `Automate Grasshops and Grass-Skips.`,

			branch: 7,
			icon: ['Icons/Grasshop','Icons/StarAuto'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(1e6),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Boring as Dry",
			desc: `Automate Fundry. They don't spend anything.`,

			branch: 7,
			icon: ['Icons/Fundry','Icons/StarAuto'],

			unl: _ => MAIN.sac.did(),
			cost: i => E(1e20),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Beyond The Stars",
			desc: `Automate Progression Chart.`,

			branch: 9,
			icon: ['Curr/Star','Icons/StarAuto'],

			unl: _ => hasAGHMilestone(11),
			cost: i => E(1e20),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Super-Boring Generator Time",
			desc: `Automate SFRGT. They don't spend anything.`,

			branch: 9,
			icon: ['Curr/SuperFun','Icons/StarAuto'],

			unl: _ => hasAGHMilestone(11),
			cost: i => E(1e20),
			bulk: i => 1,
		}, {
			max: 1,

			title: "Dark Matter Synthesizer",
			desc: `Automate Dark Matter Plant. They don't spend anything.`,

			branch: 9,
			icon: ['Curr/DarkMatter','Icons/StarAuto'],

			unl: _ => hasAGHMilestone(11),
			cost: i => E(1e20),
			bulk: i => 1,
		},
	],
}

function drawTree() {
	treeCanvas()

	tree_ctx.clearRect(0, 0, tree_canvas.width, tree_canvas.height);
	for (let id in STAR_CHART) if (tmp.gal.sc.tab == id) {
		let tt = tmp.gal.sc[id]
		for (let i = 0; i < STAR_CHART[id].length; i++) {
			let tu = STAR_CHART[id][i]

			let branch = tu.branch
			if (branch !== undefined && tt.unl[i] && tt.unl[branch]) {
				drawTreeBranch(id, branch, i)
			}
		}
	}
}

function treeCanvas() {
	if (!retrieveCanvasData2()) return
	if (tree_canvas && tree_ctx) {
		window.addEventListener("resize", resizeCanvas2)

		tree_canvas.width = tree_canvas.clientWidth
		tree_canvas.height = tree_canvas.clientHeight
	}
}

function drawTreeBranch(id, num1, num2) {
	var start = document.getElementById("sc_upg_"+id+num1).getBoundingClientRect();
	var end = document.getElementById("sc_upg_"+id+num2).getBoundingClientRect();
	var x1 = start.left + (start.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
	var y1 = start.top + (start.height / 2) - (window.innerHeight-tree_canvas.height) + 90;
	var x2 = end.left + (end.width / 2) - (document.body.scrollWidth-tree_canvas.width)/2;
	var y2 = end.top + (end.height / 2) - (window.innerHeight-tree_canvas.height) + 90;
	tree_ctx.lineWidth=10;
	tree_ctx.beginPath();
	let color = "#00520b"
	tree_ctx.strokeStyle = "#fff"
	tree_ctx.moveTo(x1, y1);
	tree_ctx.lineTo(x2, y2);
	tree_ctx.stroke();
}

el.setup.star_chart = _=>{
	let nt = new Element("star_chart_table")
	let h = ""

	for (let id in SC_IDS) {
		h += `<div id="star_chart_${id}">`

		let t = SC_IDS[id]

		for (let y in t) {
			h += `<div class="table_center">`

			for (let x in t[y]) {
				let i = t[y][x]

				let h2 = ""

				if (i != null) {
					let tu = STAR_CHART[id][i]
					let icon = ['Bases/SpaceBase']
					if (tu.icon) for (ic in tu.icon) icon.push(tu.icon[ic])
					else icon.push('Icons/Placeholder')

					h2 += `
					<div class="sc_upg_ctn" id="sc_upg_${id}${i}" onclick="clickSCUpgrade('${id}', ${i})">`
					for (ic in icon) h2 += `<img draggable="false" src="${"images/"+icon[ic]+".png"}">`
					h2 += `<img id="sc_upg_${id}${i}_max_base" draggable="false" src="${"images/max.png"}">`
					
					h2 += `
						<div id="sc_upg_${id}${i}_cost" class="scu_cost">??? Stars</div>
						<div id="sc_upg_${id}${i}_amt" class="scu_amt">0</div>
						<div class="upg_max" id="sc_upg_${id}${i}_max" class="upg_max">Maxed!</div>
					</div>
					`
				}

				h += `
				<div class="sc_upg_div">
					${h2}
				</div>
				`
			}

			h += `</div>`
		}

		h += `</div>`
	}

	nt.setHTML(h)
}

const SC_SCOST = {}

function hasStarTree(id,i) { return starTreeAmt(id,i)>0 }
function starTreeEff(id,i,def=1) { return (tmp?.gal?.sc && tmp.gal.sc[id].eff[i]) || def }
function starTreeAmt(id,i) { return (galUnlocked() && player.gal.star_chart[id][i]) || 0 }

function updateSCTemp() {
	let data = tmp.gal.sc || {
		qol: {
			max: [],
			cost: [],
			bulk: [],
			eff: [],
			unl: [],
		},
		auto: {
			max: [],
			cost: [],
			bulk: [],
			eff: [],
			unl: [],
		},
		progress: {
			max: [],
			cost: [],
			bulk: [],
			eff: [],
			unl: [],
		},
		tab: "progress",
		choosed: [null, null]
	}
	if (!tmp.gal.sc) tmp.gal.sc = data

	let star = player.gal.stars
	for (let id in STAR_CHART) {
		let tt = data[id]

		for (let i = 0; i < STAR_CHART[id].length; i++) {
			let tu = STAR_CHART[id][i]
			let amt = player.gal.star_chart[id][i]||0

			tt.max[i] = tu.max||1
			tt.cost[i] = tu.cost(amt)
			tt.bulk[i] = tu.bulk(star)
			if (tu.effect) tt.eff[i] = tu.effect(amt)

			let unl = tu.unl?tu.unl():true
			let afford = star.gte(tt.cost[i])
			if (tu.branch !== undefined && !hasStarTree(id,tu.branch)) unl = false

			tt.unl[i] = unl
		}
	}
}

function clickSCUpgrade(id,x) {
	if (shiftDown || (tmp.gal.sc.choosed[0] == id && tmp.gal.sc.choosed[1] == x)) buyMaxSCUpgrade(id, x)
	else tmp.gal.sc.choosed = [id, x]
}

function buySCUpgrade(id,x) {
	let tu = tmp.gal.sc[id]

	let amt = player.gal.star_chart[id]

	if ((amt[x]||0) < tu.max[x]) if (Decimal.gte(player.gal.stars,tu.cost[x])) {
		player.gal.stars = player.gal.stars.sub(tu.cost[x]).max(0)
		amt[x] = amt[x] ? amt[x] + 1 : 1

		updateSCTemp()
	}
}

function buyNextSCUpgrade(id,x) {
	let tu = tmp.gal.sc[id]

	let upg = STAR_CHART[id][x]
	let amt = player.gal.star_chart[id]
	let amt2 = amt[x]||0

	if (amt2 < tu.max[x] && Decimal.gte(player.gal.stars,tu.cost[x])) {
		let bulk = Math.min(tu.bulk[x], Math.ceil((amt2 + 1) / 25) * 25)

		if (bulk > amt2) {
			let cost = upg.cost(bulk-1)

			amt[x] = Math.min(amt[x] ? Math.max(amt[x],bulk) : bulk,tu.max[x])
			player.gal.stars = player.gal.stars.sub(cost).max(0)

			updateSCTemp()
		}
	}
}

function buyMaxSCUpgrade(id,x) {
	let tu = tmp.gal.sc[id]

	let upg = STAR_CHART[id][x]

	if (true) {
		let amt = player.gal.star_chart[id]
		let amt2 = amt[x]||0

		if (amt2 < tu.max[x]) if (Decimal.gte(player.gal.stars,tu.cost[x])) {
			let bulk = tu.bulk[x]

			if (bulk > amt2) {
				let cost = upg.cost(bulk-1)

				amt[x] = Math.min(amt[x] ? Math.max(amt[x],bulk) : bulk,tu.max[x])
				player.gal.stars = player.gal.stars.sub(cost).max(0)

				updateSCTemp()
			}
		}
	}
}

function updateStarChart() {
	let star = player.gal.stars
	let ch = tmp.gal.sc.choosed

	tmp.el.starAmt.setTxt(star.format(0))
	tmp.el.starProd.setHTML(tmp.gal.star_gain_p > 0 ? " <span class='smallAmt'>"+formatGain(player.gal.stars,tmp.gal.star_gain.mul(tmp.gal.star_gain_p))+"</span>" : "")

	tmp.el.sc_desc_div.setDisplay(ch[0])
	if (ch[0]) {
		let [id, i] = ch
		let tt = tmp.gal.sc[id]
		let tu = STAR_CHART[id][i]
		let amt = player.gal.star_chart[id][i]||0
		let max = tt.max[i]

		tmp.el.sc_title.setHTML(`[${id}-${i+1}] <h3>${tu.title}</h3>`)

		let h = ''
		if (max > 1 && max > amt) h += `Level <b class="yellow">${format(amt,0)}${max < Infinity ? ' / ' + max : ""}</b><br>`

		h += tu.desc
		if (tu.effDesc) h += '<br>Effect: <span class="cyan">'+tu.effDesc(tt.eff[i])+"</span>"
		h += '<br>'

		let canBuy = Decimal.gte(star, tt.cost[i])
		let hasBuy25 = (Math.floor(amt / 25) + 1) * 25 < max
		let hasMax = amt + 1 < max

		if (amt < max) {
			h += `<br><span class="${Decimal.gte(star,tt.cost[i])?"green":"red"}">Cost: ${format(tt.cost[i],0)} Stars</span>`

			let cost2 = tu.costOnce?Decimal.mul(tt.cost[i],25-amt%25):tu.cost((Math.floor(amt/25)+1)*25-1)
			let cost3 = tu.costOnce?Decimal.mul(tt.cost[i],max-amt):tu.cost(max-1)
			if (hasBuy25) h += `<br><span class="${Decimal.gte(star,cost2)?"green":"red"}">Next 25: ${format(cost2,0)} Stars</span>`
			else if (hasMax) h += `<br><span class="${Decimal.gte(star,cost3)?"green":"red"}">Max: ${format(cost3,0)} Stars</span>`
		} else h += "<br><b class='pink'>Maxed!</b>"

		tmp.el.sc_desc.setHTML(h)

		tmp.el["sc_upg_buy"].setClasses({ locked: !canBuy })
		tmp.el["sc_upg_buy"].setDisplay(amt < max)
		tmp.el["sc_upg_buy"].setTxt("Buy" + (hasMax ? " 1" : ""))
		tmp.el["sc_upg_next"].setClasses({ locked: !canBuy })
		tmp.el["sc_upg_next"].setDisplay(hasBuy25)
		tmp.el["sc_upg_max"].setClasses({ locked: !canBuy })
		tmp.el["sc_upg_max"].setDisplay(hasMax)
	}

	for (let id in STAR_CHART) {
		let d = tmp.gal.sc.tab == id
		let tt = tmp.gal.sc[id]

		tmp.el["star_chart_"+id].setDisplay(d)

		if (d) for (let i = 0; i < STAR_CHART[id].length; i++) {
			let id2 = "sc_upg_"+id+i
			let ud = tmp.el[id2]

			if (!ud) continue

			let unl = tmp.gal.sc[id].unl[i]

			tmp.el[id2].setClasses({sc_upg_ctn: true, choosed: ch[0] == id && ch[1] == i})
			tmp.el[id2].setDisplay(unl)

			if (id2) {
				let amt = player.gal.star_chart[id][i]||0
				let maxed = amt >= tt.max[i]

				tmp.el[id2+"_amt"].setTxt(format(amt,0))
				tmp.el[id2+"_amt"].setDisplay(!maxed)
				tmp.el[id2+"_cost"].setDisplay(!maxed)
				tmp.el[id2+"_cost"].setTxt(format(tt.cost[i],0)+" Stars")
				tmp.el[id2+"_cost"].setClasses({scu_cost: true, locked: star.lt(tt.cost[i]) && amt < tt.max[i]})
				tmp.el[id2+"_max"].setDisplay(maxed)
				tmp.el[id2+"_max_base"].setDisplay(maxed)
			}
		}
	}

	drawTree()
}