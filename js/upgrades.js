const U_STEP = [1,25,1/0]

///[Name, Player Data, Base, Spent]
const UPG_RES = {
	grass: ["Grass",_=>[player,"grass"],'GrassBase','Curr/Grass'],
	perk: ["Perk",_=>[player,"maxPerk","spentPerk"],'PerkBase','Curr/Perks'],
	pp: ["PP",_=>[player,"pp"],'PrestigeBase','Curr/Prestige'],
	plat: ["Platinum",_=>[player,"plat"],"PlatBase",'Curr/Platinum'],
	crystal: ["Crystals",_=>[player,"crystal"],"CrystalBase",'Curr/Crystal'],
	steel: ["Steel",_=>[player,"steel"],"GrasshopBase",'Curr/Steel'],
	aGrass: ["Anti-Grass",_=>[player.aRes,"grass"],'AntiGrassBase','Curr/Grass'],
	ap: ["AP",_=>[player.aRes,"ap"],'AnonymityBase','Curr/Anonymity'],
	oil: ["Oil",_=>[player.aRes,"oil"],'LiquefyBase','Curr/Oil'],
	rf: ["Rocket Fuel",_=>[player.rocket,"amount"],'RocketBase','Curr/RocketFuel'],
	momentum: ["Momentum",_=>[player.rocket,"momentum"],'RocketBase','Curr/Momentum'],
	star: ["Stars",_=>[player.gal,"stars"],'SpaceBase','Curr/Star'],
	moonstone: ["Moonstone",_=>[player.gal,"moonstone"],'MoonBase','Curr/Moonstone'],
	fun: ["Fun",_=>[player.aRes,"fun"],'FunBase','Curr/Fun'],
	sfrgt: ["SFRGT",_=>[player.aRes,"sfrgt"],'FunBase','Curr/SuperFun'],
	dm: ["Dark Matter",_=>[player.gal,"dm"],'DarkMatterBase','Curr/DarkMatter'],
	unGrass: ["Unnatural Grass",_=>[player.unRes,"grass"],'UnnaturalBase','Curr/Grass'],
	np: ["NP",_=>[player.unRes,"np"],'NormalityBase','Curr/Normality'],
	cloud: ["Clouds",_=>[player.unRes,"cloud"],'CloudBase','Curr/Cloud'],
	planetarium: ["Planetarium",_=>[player.planetoid,"grass"],'PlanetBase','Curr/Planetarium'],
	obs: ["Observatorium",_=>[player.planetoid,"obs"],'RingBase','Curr/Observatorium'],
	res: ["Reservatorium",_=>[player.planetoid,"res"],'ResBase','Curr/Reservatorium'],
	astro: ["Astrolabe",_=>[player.planetoid,"astro"],'AstroBase','Curr/Astrolabe'],
	measure: ["Measure",_=>[player.planetoid,"measure"],'MeasureBase','Curr/Measure'],
	ring: ["Ring",_=>[player.planetoid,"ring"],'ObsBase','Curr/Ring'],
	line: ["Line",()=>[player.planetoid,"line"],'ConstellationBase','Curr/Lines'],
	arc: ["Arc",()=>[player.planetoid,"arc"],'ConstellationBase','Curr/Arcs'],
	stardust: ["Stardust",()=>[player.planetoid,"stardust"],'NebulaBase','Curr/Stardust'],
}

const isResNumber = ['perk','chrona']

const UPGS = {
	grass: {
		unl: _=> player.decel == 0,

		cannotBuy: _=>inChal(0) || inChal(5),

		autoUnl: _=>hasUpgrade('auto',3),
		noSpend: _=>hasUpgrade('assembler',0),

		title: "Upgrades",

		ctn: [
			{
				max: Infinity,

				title: "Grass Value",
				desc: `Increase Grass gain by <b class="green">+1</b> per level.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

				res: "grass",
				icon: ['Curr/Grass'],
				
				cost: i => Decimal.pow(1.15,i).mul(10).ceil(),
				bulk: i => i.div(10).max(1).log(1.15).floor().toNumber()+1,

				effect(i) {
					let x = Decimal.pow(2,Math.floor(i/25)).mul(i+1)

					return x
				},
				effDesc: x => x.format()+"x",
			},{
				max: 250,

				title: "More Grass",
				desc: `Increase grass cap by <b class="green">+1</b> per level.`,

				res: "grass",
				icon: ['Icons/MoreGrass'],
				
				cost: i => Decimal.pow(1.15,i).mul(25).ceil(),
				bulk: i => i.div(25).max(1).log(1.15).floor().toNumber()+1,

				effect(i) {
					let x = i

					return x
				},
				effDesc: x => "+"+format(x,0),
			},{
				max: 50,

				title: "Grow Speed",
				desc: `Grass grows <b class="green">+50%</b> faster per level.`,

				res: "grass",
				icon: ['Icons/Speed'],
				
				cost: i => Decimal.pow(2,i).mul(3).ceil(),
				bulk: i => i.div(3).max(1).log(2).floor().toNumber()+1,

				effect(i) {
					let x = i/4+1

					return x
				},
				effDesc: x => format(x)+"x",
			},{
				max: Infinity,

				title: "XP",
				desc: `Increase experience (XP) gain by <b class="green">+0.5</b> per level.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

				res: "grass",
				icon: ['Icons/XP'],
				
				cost: i => Decimal.pow(1.15,i).mul(50).ceil(),
				bulk: i => i.div(50).max(1).log(1.15).floor().toNumber()+1,

				effect(i) {
					let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)

					return x
				},
				effDesc: x => x.format()+"x",
			},{
				max: 10,

				title: "Range",
				desc: `Increase grass cut range by <b class="green">+10</b> per level. Base is 70.`,

				res: "grass",
				icon: ['Icons/Range'],
				
				cost: i => Decimal.pow(5,i).mul(70).ceil(),
				bulk: i => i.div(70).max(1).log(5).floor().toNumber()+1,

				effect(i) {
					let x = i*10

					return x
				},
				effDesc: x => "+"+format(x,0),
			},{
				max: Infinity,

				unl: _=>player.pTimes>0,

				title: "PP",
				desc: `Increase prestige points (PP) gained by <b class="green">+50%</b> per level.<br>This is <b class="green">doubled</b> every <b class="yellow">25</b> levels.`,

				res: "grass",
				icon: ['Curr/Prestige'],
				
				cost: i => Decimal.pow(1.25,i).mul(3e10).ceil(),
				bulk: i => i.div(3e10).max(1).log(1.25).floor().toNumber()+1,

				effect(i) {
					let x = Decimal.pow(2,Math.floor(i/25)).mul(i/2+1)
					x = x.pow(upgEffect('crystal',4)+getChargeEff(2,0))
					return x
				},
				effDesc: x => x.format()+"x",
			},
		],
	},
	perk: {
		title: "Perk Upgrades",
		btns: `<button id="losePerksBtn" class="buyAllUpg" onclick='toggleOption("losePerks")'>Keep on reset: <span id="losePerks"></span></button>`,

		cannotBuy: _=>inChal(3),

		req: _=>(player.level >= 1 || player.pTimes > 0)&&!player.decel,
		reqDesc: _=>player.decel?`You can't gain Perks!`:`Reach Level 1 to unlock.`,

		underDesc: _=>getUpgResTitle('perk'),

		autoUnl: _=>hasUpgrade('assembler',3),

		ctn: [
			{
				title: "Value Perk",
				desc: `Increase Grass gain by <b class="green">+100%</b> per level.`,

				res: "perk",
				icon: ['Curr/Grass'],
				
				cost: 1,
				max: 100,

				effect: i => i+1,
				effDesc: x => format(x,0)+"x",
			},{
				title: "Cap Perk",
				desc: `Increase grass cap by <b class="green">+20</b> per level.`,

				res: "perk",
				icon: ['Icons/MoreGrass'],

				max: 5,
				cost: 1,

				effect: i => i*20,
				effDesc: x => "+"+format(x,0),
			},{
				title: "Grow Speed Perk",
				desc: `Increase grass grow speed by <b class="green">+25%</b> per level.`,

				res: "perk",
				icon: ['Icons/Speed'],
				
				cost: 1,
				max: 10,

				effect: i => i/4+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.pTimes,
				title: "XP Perk",
				desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

				res: "perk",
				icon: ['Icons/XP'],

				cost: 1,
				max: 50,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.pTimes,
				title: "Range Perk",
				desc: `Increase grass cut range by <b class="green">10</b> per level.`,

				res: "perk",
				icon: ['Icons/Range'],

				cost: 3,
				max: 5,

				effect: i => i*10,
				effDesc: x => "+"+format(x,0),
			},{
				unl: _=>player.pTimes,
				title: "Grow Amount Perk",
				desc: `Increase the grass grow amount by <b class="green">+1</b>.`,

				res: "perk",
				icon: ['Icons/MoreGrass', "Icons/StarSpeed"],
 
				cost: 10,
				max: 1,

				effect: i => i,
				effDesc: x => "+"+format(x,0),
			},{
				unl: _=>player.cTimes>0,
				title: "PP Perk",
				desc: `Increase PP gain by <b class="green">+50%</b> per level.`,

				res: "perk",
				icon: ['Curr/Prestige'],
				
				cost: 10,
				max: 50,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.cTimes>0,

				title: "TP Perk",
				desc: `Increase TP gain by <b class="green">+50%</b> per level.`,

				res: "perk",
				icon: ['Icons/TP'],
				
				cost: 15,
				max: 50,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>grassHopped(),
				title: "Crystal Perk",
				desc: `Increase Crystal gain by <b class="green">+25%</b> per level.`,

				res: "perk",
				icon: ['Curr/Crystal'],
				
				cost: 15,
				max: 50,

				effect: i => i/4+1,
				effDesc: x => format(x)+"x",
			},
		],
	},
	auto: {
		title: "Automation Upgrades",

		unl: _=>!player.decel,
		req: _=>player.pTimes > 0,
		reqDesc: `Prestige once to unlock.`,

		ctn: [
			{
				max: 5,

				title: "Autocut",
				desc: `Auto cuts grass every <b class="green">1.5</b> seconds. (-0.1s every level after the first)`,
			
				res: "grass",
				icon: ['Curr/Grass','Icons/Automation'],
							
				cost: i => Decimal.pow(10,i).mul(1e3).ceil(),
				bulk: i => i.div(1e3).max(1).log(10).floor().toNumber()+1,
			
				effect(i) {
					let x = 1.5-Math.max(i-1,0)/10
					return x
				},
				effDesc: x => format(tmp.autocut)+" seconds",
			},{
				unl: _=>player.pTimes>0,
				max: 5,

				title: "Autocut Value",
				desc: `Auto cuts grass is worth <b class="green">+1x</b> more grass, XP & TP.`,
			
				res: "pp",
				icon: ['Curr/Grass','Icons/StarSpeed'],
							
				cost: i => Decimal.pow(10,i).mul(200).ceil(),
				bulk: i => i.div(200).max(1).log(10).floor().toNumber()+1,
			
				effect(i) {
					let x = E(i+1)
			
					return x
				},
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.cTimes>0,
				max: 10,

				title: "Autocut Amount",
				desc: `Increases auto cut amount by <b class="green">+1</b>.`,
			
				res: "crystal",
				icon: ['Icons/MoreGrass','Icons/StarSpeed'],
							
				cost: i => Decimal.pow(5,i).mul(25).ceil(),
				bulk: i => i.div(25).max(1).log(5).floor().toNumber()+1,
			
				effect(i) {
					let x = i
			
					return x
				},
				effDesc: x => "+"+format(x,0),
			},{
				unl: _=>player.cTimes>0,

				title: "Grass Upgrade Autobuy",
				desc: `Automate Grass Upgrades.`,
			
				res: "pp",
				icon: ['Curr/Grass','Icons/Automation'],
							
				cost: 1e6
			},{
				unl: _=>player.cTimes>0,

				title: "Perk Save P",
				desc: `Keep perks on Prestige.`,
			
				res: "pp",
				icon: ['Curr/Perks','Icons/StarProgression'],
							
				cost: 1e10
			},{
				unl: _=>player.cTimes>0,

				title: "Prestige Upgrade Autobuy",
				desc: `Automate Prestige Upgrades.`,
			
				res: "crystal",
				icon: ['Curr/Prestige','Icons/Automation'],

				cost: 1e5
			},{
				unl: _=>grassHopped(),

				title: "Perk Save C",
				desc: `Keep perks on Crystalize.`,
			
				res: "crystal",
				icon: ['Curr/Perks','Icons/StarProgression'],

				cost: 1e7
			},{
				unl: _=>grassHopped(),

				title: "Crystal Upgrade Autobuy",
				desc: `Automate Crystal Upgrades.`,
			
				res: "crystal",
				icon: ['Curr/Crystal','Icons/Automation'],
							
				cost: 1e8
			},{
				unl: _=>player.sTimes>0,

				max: 10,

				title: "PP Generation",
				desc: `Passively generate <b class="green">+0.1%</b> of PP you would earn on prestige per second.`,
			
				res: "pp",
				icon: ['Curr/Prestige','Icons/Plus'],
							
				cost: i => Decimal.pow(7,i).mul(1e25),
				bulk: i => i.div(1e25).max(1).log(7).floor().toNumber()+1,
				effect(i) {
					let x = i/1e3
			
					return x
				},
				effDesc: x => "+"+formatPercent(x)+"/s",
			},{
				unl: _=>hasUpgrade('factory', 4) || galUnlocked(),

				max: 10,

				title: "Crystal Generation",
				desc: `Passively generate <b class="green">+0.1%</b> of crystal you would earn on crystalize per second.`,
			
				res: "crystal",
				icon: ['Curr/Crystal','Icons/Plus'],

				cost: i => Decimal.pow(3,i).mul(1e15).ceil(),
				bulk: i => i.div(1e15).max(1).log(3).floor().toNumber()+1,
				effect(i) {
					let x = i/1e3
			
					return x
				},
				effDesc: x => "+"+formatPercent(x)+"/s",
			}
		],
	},
	plat: {
		title: "Platinum Upgrades",

		unl: _=>player.pTimes>0,
		autoUnl: _=>hasStarTree('auto',6),

		req: _=>player.tier >= 2 || player.cTimes > 0,
		reqDesc: `Reach Tier 2 to unlock.`,

		underDesc: _=>getUpgResTitle('plat')+` (${formatPercent(tmp.platChance)} grow chance)`,

		ctn: [
			{
				title: "Starter AC",
				desc: `Grass automatically cuts <b class="green">+0.1x</b> faster.`,

				res: "plat",
				icon: ['Curr/Grass','Icons/Automation'],

				max: 20,
				cost: 5,

				effect: i => i/10+1,
				effDesc: x => format(x, 1)+"x",
			},{
				title: "Starter XP",
				desc: `Increase XP gain by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Icons/XP'],

				max: 10,
				cost: 3,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				title: "Starter Grass",
				desc: `Increase grass gain by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Curr/Grass'],
				
				max: 10,
				cost: 3,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.cTimes>0,

				title: "Plat PP",
				desc: `Increase PP gain by <b class="green">+25%</b> per level.`,

				res: "plat",
				icon: ['Curr/Prestige'],
				
				max: 40,
				cost: 50,

				effect: i => i/4+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.cTimes>0,

				title: "Plat TP",
				desc: `Increase TP gain by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Icons/TP'],

				max: 10,
				cost: 100,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.cTimes>0,

				title: "Plat Crystal",
				desc: `Increase Crystal gain by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Curr/Crystal'],

				max: 10,
				cost: 100,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.sTimes>0,

				title: "Plat Steel",
				desc: `Increase steel gain by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Curr/Steel'],
				
				max: 100,
				cost: 100,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{

				unl: _=>hasUpgrade('factory',2),

				title: "Plat Charge",
				desc: `Increase charge rate by <b class="green">+50%</b> per level.`,

				res: "plat",
				icon: ['Curr/Charge'],

				max: 100,
				cost: 500,

				effect: i => i/2+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.aRes?.aTimes,

				title: "Plat Anonymity",
				desc: `Increase AP gain by <b class="green">+20%</b> per level.`,

				res: "plat",
				icon: ['Curr/Anonymity'],

				max: 100,
				cost: 1e3,

				effect: i => i/5+1,
				effDesc: x => format(x)+"x",
			},{
				unl: _=>player.aRes?.lTimes,

				title: "Platinum Oil",
				desc: `Increase Oil gain by <b class="green">+20%</b> per level.`,

				res: "plat",
				icon: ['Curr/Oil'],

				max: 10,
				cost: 2e3,

				effect: i => i/5+1,
				effDesc: x => format(x)+"x",
			}
		],
	},
}

function chosenUpgrade(id, x) {
	let ch = tmp.upg_ch
	return ch[0] == id && ch[1] == x
}

function clickUpgrade(id, x) {
	if (shiftDown) buyMaxUpgrade(id, x)
	else tmp.upg_ch = [id, x]
}

function buyUpgrade(id, x, type = "once", amt) {
	//Upgrade Data
	let tu = tmp.upgs[id]
	let upg = UPGS[id].ctn[x]
	let upgData = player.upgs[id] ?? []

	//Determine Levels
	let lvl = upgData[x] ?? 0
	let bulk = amt ? getUpgradeBulk(id, x, amt) : tu.bulk[x]
	if (type == "next") bulk = Math.min(bulk, Math.ceil((lvl + 1) / 25) * 25)

	bulk = Math.min(bulk, tu.max[x])
	if (!(lvl < bulk)) return
	if (type == "once") bulk = lvl + 1
	if (tu.cannotBuy) return

	//Spend Resource
	if (!tu.noSpend) {
		let res = upg.res
		let num = isResNumber.includes(res)
		let cost = tu.costOnce[x] ? tu.cost[x] * (bulk - lvl) : upg.cost(bulk - 1)
		let r = UPG_RES[res][1]()

		if (r[2]) {
			let [p,q] = [r[0], r[2]]
			p[q] += cost
		} else {
			let [p,q] = r
			p[q] = num ? Math.max(p[q]-cost, 0) : p[q].sub(cost).max(0)
		}
		updateUpgResource(res)
	}

	upgData[x] = bulk
	player.upgs[id] = upgData
	updateUpgTemp(id)
}

function buyNextUpgrade(id, x) {
	buyUpgrade(id, x, "next")
}

function buyMaxUpgrade(id, x) {
	buyUpgrade(id, x, "max")
}

function buyAllUpgrades(id) {
	let upgs = UPGS[id]
	for (let [x, upg] of Object.entries(upgs.ctn)) {
		if (upg.unl ? upg.unl() : true) buyUpgrade(id, x, "max")
	}
}

function getUpgradeResource(id, x) {
	return tmp.upg_res[UPGS[id].ctn[x].res]
}

function getUpgradeBulk(id, x, amt) {
	let upg = UPGS[id].ctn[x]
	let tu = tmp.upgs[id]
	let res = amt || getUpgradeResource(id, x)

	let lvl = 0
	let min = getUpgradeLvl(id, x)
	if (tu.costOnce[x]) lvl = tu.noSpend ? Infinity : Math.floor(res / tu.cost[x]) + min
	else if (E(res).gte(tu.cost[x])) lvl = upg.bulk(E(res))
	else lvl = min

	return lvl
}

function updateUpgTemp(id) {
	let upgs = UPGS[id]
	if (!compute(upgs.req, true)) return

	let uc = upgs.ctn
	let tu = tmp.upgs[id]
	let ul = 0
	for (let x in uc) {
		let upg = uc[x]
		if (!compute(upg.unl, true)) continue

		let amt = getUpgradeLvl(id, x)
		let res = tmp.upg_res[upg.res]

		tu.max[x] = compute(upg.max, 1)
		tu.costOnce[x] = typeof upg.cost != "function"
		tu.cost[x] = tu.costOnce[x] ? upg.cost : upg.cost(amt)
		tu.bulk[x] = getUpgradeBulk(id, x)

		if (amt < tu.max[x]) ul++
		if (upg.effect) tu.eff[x] = upg.effect(amt)
	}
	if (upgs.cannotBuy) tu.cannotBuy = upgs.cannotBuy()
	if (upgs.noSpend) tu.noSpend = upgs.noSpend()
	if (upgs.autoUnl) tu.autoUnl = upgs.autoUnl()
	if (CHEAT) tu.noSpend = tu.autoUnl = true
	tu.unlLength = ul
}

function switchAutoUpg(id) {
	player.autoUpg[id] = !player.autoUpg[id]
}

function setupUpgradesHTML(id) {
	let table = new Element("upgs_div_"+id)

	if (table.el) {
		let upgs = UPGS[id]
		let html = ""

		table.addClass("upgs_div")
		table.addClass(id)

		html += `
			<div style="height: 40px;">
				${upgs.title} <button class="buyAllUpg" onclick="buyAllUpgrades('${id}')">Buy All</button><button class="buyAllUpg" id="upg_auto_${id}" onclick="switchAutoUpg('${id}')">Auto: OFF</button> ${upgs.btns ?? ''}
			</div><div id="upgs_ctn_${id}" class="upgs_ctn">
			</div><div style="height: 40px;" id="upg_under_${id}">
			</div>
			<div id="upg_desc_div_${id}" class="upg_desc ${id}">
				<div id="upg_desc_${id}"></div>
				<div style="position: absolute; bottom: 0; width: 100%;">
					<button onclick="tmp.upg_ch = []">Close</button>
					<button id="upg_buy_${id}" onclick="buyUpgrade('${id}',tmp.upg_ch[1])">Buy 1</button>
					<button id="upg_buy_next_${id}" onclick="buyNextUpgrade('${id}',tmp.upg_ch[1])">Buy Next</button>
					<button id="upg_buy_max_${id}" onclick="buyMaxUpgrade('${id}',tmp.upg_ch[1])">Buy Max</button>
				</div>
			</div>
			<div id="upg_req_div_${id}" class="upg_desc ${id}">
				<div id="upg_req_desc_${id}" style="position:absolute;top:50%;width: 100%;transform:translateY(-50%);font-size:30px;"></div>
			</div>
		`

		table.setHTML(html)

		html = ""
		for (let x in UPGS[id].ctn) {
			let upg = UPGS[id].ctn[x]
			let icon = [id=='auto'&&x==0?'Bases/AutoBase':'Bases/'+UPG_RES[upg.res][2]]
			if (upg.icon) icon.push(...upg.icon)
			else icon.push('Icons/Placeholder')

			html += `
			<div class="upg_ctn" id="upg_ctn_${id}${x}" onclick="clickUpgrade('${id}', ${x})">`
			for (i in icon) html +=
				`<img class="img_desc" draggable="false" src="${"images/"+icon[i]+".png"}">`
			html += `<img class='img_desc' id="upg_ctn_${id}${x}_max_base" draggable="false" src="images/max.png">
				<img class="img_res" draggable="false" src="${"images/Bases/"+UPG_RES[upg.res][2]+".png"}"><img class="img_res" draggable="false" src="${"images/"+UPG_RES[upg.res][3]+".png"}">
				<div class="upg_tier">${upg.tier ? ['', '', 'II', 'III', 'IV', 'V'][upg.tier] : ""}</div>
				<div id="upg_ctn_${id}${x}_cost" class="upg_cost"></div>
				<div id="upg_ctn_${id}${x}_amt" class="upg_amt">argh</div>
				<div class="upg_max" id="upg_ctn_${id}${x}_max" class="upg_max">Maxed!</div>
			</div>`
		}

		let el = new Element(`upgs_ctn_${id}`)
		el.setHTML(html)
	}
}

function updateUpgradesHTML(id) {
	let upgs = UPGS[id]
	let height = document.getElementById(`upgs_ctn_${id}`).offsetHeight-25
	let tu = tmp.upgs[id]
	let ch = tmp.upg_ch[0] == id ? tmp.upg_ch[1] : -1

	let unl = compute(upgs.unl)
	tmp.el["upgs_div_"+id].setDisplay(unl)

	if (unl) {
		let req = compute(upgs.req)
		tmp.el["upg_req_div_"+id].setDisplay(!req)

		if (req) {
			if (upgs.underDesc) tmp.el["upg_under_"+id].setHTML(upgs.underDesc())
			tmp.el["upg_desc_div_"+id].setDisplay(ch > -1)

			if (ch > -1) {
				let upg = UPGS[id].ctn[ch]
				let max = tu.max[ch]
				let amt = getUpgradeLvl(id, ch)
				let res = tmp.upg_res[upg.res]
				let dis = UPG_RES[upg.res][0]

				let h = `<h2>${upg.title}</h2><br>`
				if (max > 1 && max > amt) h += `Level <b class="yellow">${format(amt,0)} ${tu.max[ch] < Infinity ? " / " + format(max, 0) : ""}</b><br>`

				h += upg.desc
				if (upg.effDesc) h += '<br>Effect: <span class="cyan">'+upg.effDesc(tu.eff[ch])+"</span>"
				h += '<br>'

				let canBuy = Decimal.gte(tmp.upg_res[upg.res], tu.cost[ch])
				let hasBuy25 = (Math.floor(amt / 25) + 1) * 25 < max
				let hasMax = amt + 1 < max

				if (amt < max) {
					h += `<br><span class="${canBuy?"green":"red"}">Cost: ${format(tu.cost[ch],0)} ${dis}</span>`

					let cost2 = tu.costOnce[ch]?Decimal.mul(tu.cost[ch],25-amt%25):upg.cost((Math.floor(amt/25)+1)*25-1)
					let cost3 = tu.costOnce[ch]?Decimal.mul(tu.cost[ch],max-amt):upg.cost(max-1)
					if (hasBuy25) h += `<br><span class="${Decimal.gte(tmp.upg_res[upg.res],cost2)?"green":"red"}">Next 25: ${format(cost2,0)} ${dis}</span>`
					else if (hasMax) h += `<br><span class="${Decimal.gte(tmp.upg_res[upg.res],cost3)?"green":"red"}">Max: ${format(cost3,0)} ${dis}</span>`

					h += `<br>You have ${format(res,0)} ${dis}`
				} else h += "<br><b class='pink'>Maxed!</b>"

				tmp.el["upg_desc_"+id].setHTML(h)
				tmp.el["upg_buy_"+id].setClasses({ locked: !canBuy })
				tmp.el["upg_buy_"+id].setDisplay(amt < max)
				tmp.el["upg_buy_"+id].setTxt("Buy" + (hasMax ? " 1" : ""))
				tmp.el["upg_buy_next_"+id].setClasses({ locked: !canBuy })
				tmp.el["upg_buy_next_"+id].setDisplay(hasBuy25)
				tmp.el["upg_buy_max_"+id].setClasses({ locked: !canBuy })
				tmp.el["upg_buy_max_"+id].setDisplay(hasMax)
			}

			if (ch < 0) {
				tmp.el["upg_auto_"+id].setDisplay(tu.autoUnl)
				if (tu.autoUnl) tmp.el["upg_auto_"+id].setTxt("Auto: "+(player.autoUpg[id]?"ON":"OFF"))

				for (let x = 0; x < upgs.ctn.length; x++) {
					let upg = upgs.ctn[x]
					let div_id = "upg_ctn_"+id+x
					let amt = getUpgradeLvl(id, x)

					let unlc = compute(upg.unl) && (player.options.hideUpgOption ? amt < tu.max[x] : true)
					tmp.el[div_id].setDisplay(unlc)

					if (!unlc) continue

					let res = tmp.upg_res[upg.res]

					tmp.el[div_id].changeStyle("width",height+"px")
					tmp.el[div_id].changeStyle("height",height+"px")

					tmp.el[div_id+"_cost"].setTxt(amt < tu.max[x] ? format(tu.cost[x],0) : "")
					tmp.el[div_id+"_cost"].setClasses({upg_cost: true, locked: Decimal.lt(res,tu.cost[x]) && amt < tu.max[x]})

					tmp.el[div_id+"_amt"].setTxt(amt < tu.max[x] ? format(amt,0) : "")
					tmp.el[div_id+"_max"].setDisplay(amt >= tu.max[x])
					tmp.el[div_id+"_max_base"].setDisplay(amt >= tu.max[x])
				}
			}
		} else if (upgs.reqDesc) tmp.el["upg_req_desc_"+id].setHTML(compute(upgs.reqDesc))
	}
}

function getUpgradeLvl(id, x) { return player.upgs[id]?.[x] ?? 0 }
function hasUpgrade(id,x) { return getUpgradeLvl(id, x) > 0 }
function hasUpgrades(id) {
	if (!player.upgs[id]) return false
	for (let i of player.upgs[id]) if (i > 0) return true
	return false
}
function upgEffect(id,x,def=1) { return tmp.upgs[id].eff[x] || def }

function resetUpgrades(id) {
	delete player.upgs[id]
}

function updateUpgResource(id) {
	let [p,q,u] = UPG_RES[id][1]()
	tmp.upg_res[id] = p?.[q] ?? 0
	if (u) tmp.upg_res[id] -= p?.[u] ?? 0
}

function getUpgResTitle(res) {
	let amt = tmp.upg_res[res]
	return (E(amt).lt(1e33) ? "You have " : "") + "<b>" + format(amt, 0) + "</b> " + UPG_RES[res][0]
}

function toggleOption(x) { player.options[x] = !player.options[x] }

tmp_update.push(_=>{
	for (let x in UPG_RES) updateUpgResource(x)
	for (let x in UPGS) updateUpgTemp(x)
})

el.setup.upgs = _=>{
	for (let x in UPGS) setupUpgradesHTML(x)
}

el.update.upgs = _=>{
	if (mapID == 'g') {
		updateUpgradesHTML('grass')
		updateUpgradesHTML('aGrass')
		updateUpgradesHTML('unGrass')
		updateUpgradesHTML('planetarium')
	}
	if (mapID == 'upg') {
		updateUpgradesHTML('perk')
		updateUpgradesHTML('plat')
		tmp.el.normal_upgs.setDisplay(!inRecel())

		tmp.el.losePerksBtn.setDisplay(hasUpgrade('auto', 4))
		tmp.el.losePerks.setTxt(player.options.losePerks ? "OFF" : "ON")
	}
	if (mapID == 'auto') {
		updateUpgradesHTML('auto')
		updateUpgradesHTML('aAuto')

		updateUpgradesHTML('assembler')
	}
	if (mapID == 'pc') {
		updateUpgradesHTML('pp')
		updateUpgradesHTML('crystal')

		updateUpgradesHTML('ap')
		updateUpgradesHTML('oil')

		updateUpgradesHTML('np')
		updateUpgradesHTML('cloud')
	}
	if (mapID == 'gh') {
		updateUpgradesHTML('factory')
		updateUpgradesHTML('funMachine')
	}
	if (mapID == 'fd') {
		updateUpgradesHTML('foundry')
		updateUpgradesHTML('gen')

		updateUpgradesHTML('fundry')
		updateUpgradesHTML('sfrgt')
	}
	if (mapID == 'rf') {
		updateUpgradesHTML('rocket')
		updateUpgradesHTML('momentum')
	}

	if (mapID == 'opt') {
		tmp.el.wipeBtn.setDisplay(player.pTimes)
		tmp.el.sciBtn.setDisplay(player.pTimes)
		tmp.el.scientific.setTxt(player.options.scientific?"ON":"OFF")
		tmp.el.hideCapBtn.setDisplay(tmp.unRes.habit != undefined)
		tmp.el.capOpt.setTxt(player.options.lowGrass?250:"∞")
		tmp.el.hideMaxBtn.setDisplay(tmp.unRes.habit != undefined)
		tmp.el.hideMax.setTxt(player.options.hideUpgOption?"Hidden":"Shown")
		tmp.el.hideMilestoneBtn.setDisplay(grassHopped())
		tmp.el.hideMilestone.setTxt(player.options.hideMilestone?"Unobtained":"All")
	}
}