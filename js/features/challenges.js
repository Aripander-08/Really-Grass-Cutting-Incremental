const CHALS = [
	{
		id: 'pp',

		title: `Grassless`,
		desc: `You cannot buy any grass upgrades.`,
		cond: _=>!hasUpgrades("grass"),
		reward: `Grass gain is <b class='green'>doubled</b> each completion.`,

		max: 10,
		goal: i=>60+15*i,
		bulk: i=>Math.floor((i-60)/15+1),

		goalDesc: x=>"Level "+format(x,0),
		goalAmt: _=>player.level,

		eff: i=>Decimal.pow(2,i),
		effDesc: x=>format(x,0)+"x",
	},{
		id: 'pp',

		title: `Less Level`,
		desc: `Prestige Upgrade's "XP II" does nothing.`,
		cond: _=>!hasUpgrade("pp",1),
		reward: `XP gain is <b class='green'>doubled</b> each completion.`,

		max: 10,
		goal: i=>80+20*i,
		bulk: i=>Math.floor((i-80)/20+1),

		goalDesc: x=>"Level "+format(x,0),
		goalAmt: _=>player.level,

		eff: i=>Decimal.pow(2,i),
		effDesc: x=>format(x,0)+"x",
	},{
		id: 'crystal',

		title: `No Tiers`,
		desc: `You can't tier up.`,
		cond: _=>player.tier==0,
		reward: `TP gain is <b class='green'>doubled</b> each completion.`,

		max: 7,
		goal: i=>Math.ceil(50+15*i),
		bulk: i=>Math.floor((i-50)/15+1),

		goalDesc: x=>"Level "+format(x,0),
		goalAmt: _=>player.level,

		eff: i=>Decimal.pow(2,i),
		effDesc: x=>format(x,1)+"x",
	},{
		id: 'crystal',

		title: `Perkless`,
		desc: `You cannot buy Perks.`,
		cond: _=>player.chal.c4,
		reward: `Perk gain is increased by <b class="green">+0.2</b> per completion.`,

		max: 5,
		goal: i=>7+i*3,
		bulk: i=>Math.floor((i-7)/3+1),

		goalDesc: x=>"Tier "+format(x,0),
		goalAmt: _=>player.tier,

		eff: i=>i/5+1,
		effDesc: x=>format(x,1)+"x",
	},{
		id: 'crystal',

		title: `Prestigeless`,
		desc: `You cannot buy Prestige Upgrades.`,
		cond: _=>!hasUpgrades("pp"),
		reward: `PP gain is <b class="green">doubled</b> each completion.`,

		max: 7,
		goal: i=>4+i*2,
		bulk: i=>Math.floor((i-4)/2+1),

		goalDesc: x=>"Tier "+format(x,0),
		goalAmt: _=>player.tier,

		eff: i=>Decimal.pow(2,i),
		effDesc: x=>format(x,0)+"x",
	},{
		id: 'crystal',
		title: `Unefficient`,
		desc: `You cannot buy Grass and Prestige Upgrades.`,

		cond: _=>!hasUpgrades("grass")&&!hasUpgrades("pp"),

		max: 5,
		goal: i=>4+i*2,
		goalDesc: x=>"Tier "+format(x,0),
		goalAmt: _=>player.tier,
		bulk: i=>Math.floor((i-4)/2+1),

		reward: `Platinum gain is increased by <b class="green">+1</b> per completion.`,
		eff: i=>i,
		effDesc: x=>format(x,1)+"x",
	},{
		id: 'steel',
		title: `Clear Crystal`,
		desc: `You can't buy Crystal Upgrades.`,

		unl: _=>player.grasshop >= 15,
		cond: _=>!hasUpgrades("crystal"),

		max: 6,
		goal: i=>11+i*5,
		goalDesc: x=>"Tier "+format(x,0),
		goalAmt: _=>player.tier,
		bulk: i=>Math.floor((i-11)/5+1),

		reward: `Steel gain is <b class='green'>tripled</b> each completion.`,
		eff: i=>Decimal.pow(3,i),
		effDesc: x=>format(x,1)+"x",
	},{
		id: 'steel',
		title: `Empower`,
		desc: `Non-Steelie Challenge Rewards do nothing. Additionally, you gain 1 Perk per level.`,

		unl: _=>player.grasshop >= 18,
		cond: _=>false,

		max: 4,
		goal: i=>25+i*3,
		goalDesc: x=>"Tier "+format(x,0),
		goalAmt: _=>player.tier,
		bulk: i=>Math.floor((i-25)/3+1),

		reward: `Charge gain is increased by <b class='green'>5x</b> each completion.`,
		eff: i=>Decimal.pow(5,i),
		effDesc: x=>format(x,1)+"x",
	},{
		id: 'gal',
		title: `Sleepy Hop`,
		desc: `You must grasshop at least as you can. Getting 10 Rocket Parts will complete it.`,

		unl: _=>hasStarTree("progress", 6),
		cond: _=>galUnlocked()&&tmp.chal.goal[8]>=player.grasshop,

		max: 11,
		goal: i=>Math.max(30-i*3,0),
		goalDesc: x=>"Grasshop "+format(x,0),
		goalAmt: _=>player.rocket.part==10?player.grasshop:1/0,
		bulk: i=>Math.floor((30-i)/3+1),

		reward: `Nothing.`,
		eff: i=>i,
		effDesc: x=>"however, you will feel a sense of accomplishment",
	},{
		id: 'gal',
		title: `Dreamy Grasswalk`,
		desc: `You can't grasshop.`,

		unl: _=>player.chal.comp[8] == 12,
		cond: _=>player.grasshop==0,

		max: Infinity,
		goal: i=>i*3,
		goalDesc: x=>"Grass-Skip "+format(x,0),
		goalAmt: _=>player.aRes.grassskip,
		bulk: i=>Math.floor(i/3+1),

		reward: `Nothing.`,
		eff: i=>i,
		effDesc: x=>"however, you will feel a sense of accomplishment",
	}
]

const chalSGoal = (_=>{
	let x = []
	for (let i in CHALS) x.push(CHALS[i].goal(0))
	return x
})()

function inChal(x) {
	let p = player.chal.progress
	return p[x]
}

function inChalCond(x) {
	return inChal(x) || (CHALS[x].cond() && !player.decel)
}

function enterChal(x) {
	if (player.chal.progress[x]) {
		delete player.chal.progress[x]
		return
	}

	if (inDecel()) return
	if (CHALS[x].cond()) return
	if (player.chal.comp[x] == CHALS[x].max) return

	if (hasUpgrade('assembler', 9)) player.chal.progress[x] = true
	else player.chal.progress = { [x]: true }

	RESET[CHALS[x].id].reset(true)
}

function chalEff(x,def=E(1)) { return tmp.chal.eff[x] || def }

function autoChalTime() {
	let r = upgEffect("assembler", 8)
	r /= starTreeEff("auto", 3)
	return r
}

tmp_update.push(_=>{
	for (let [i, c] of Object.entries(CHALS)) {
		let comp = player.chal.comp[i] || 0
		tmp.chal.goal[i] = c.goal(comp)
		tmp.chal.eff[i] = c.eff(compute(c.unl) && (!inChal(7) || c.id == "steel") ? comp : 0)

		if (compute(c.unl) && inChalCond(i)) {
			let a = c.goalAmt()
			tmp.chal.amt[i] = a
			tmp.chal.bulk[i] = Math.max(Math.min(c.bulk(a), c.max), 0)
		}
	}
})

el.setup.chal = _=>{
	let table = new Element('chal_table')
	let html = ``

	for (let i in CHALS) {
		let c = CHALS[i]

		html += `
		<div class="chal_div ${c.id}" id="chal_div_${i}" onclick="enterChal(${i})">
			<h3>${c.title}</h3><br>
			<b class="yellow" id="chal_comp_${i}">0 / 0</b><br><br>
			${c.desc}<br><br>

			Reward: ${c.reward}<br>
			(<b class="cyan" id="chal_eff_${i}"></b>)

			<div style="position:absolute; bottom:7px; width:100%;">
				<b id="chal_pro_${i}"></b><br>
				<b class="white" id="chal_goal_${i}"></b>
			</div>
		</div>
		`
	}

	table.setHTML(html)
}

el.update.chal = _=>{
	if (mapID == 'chal') {
		let unl = player.cTimes > 0

		tmp.el.chal_unl.setDisplay(!unl)
		tmp.el.chal_div.setDisplay(unl)

		if (unl) {
			tmp.el.chal_top.setHTML(player.decel ? "<b class='red'>You can't complete Challenges here!</b>" : `
				Click any challenge to start! Click again to exit.<br>
				You can complete Challenges without entering if you satisfy a condition.
			`)
			tmp.el.chal_auto.setDisplay(hasUpgrade("assembler", 8))
			tmp.el.chal_auto.setTxt("Auto-completing in " + format((1 - player.chal.time) * autoChalTime(), 1) + "s")

			for (let i in CHALS) {
				let c = CHALS[i]
				let l = player.chal.comp[i] || 0
				let unl2 = compute(c.unl) && (!player.options.hideUpgOption || l < c.max || player.chal.progress == i)
				tmp.el['chal_div_'+i].setDisplay(unl2)

				if (unl2) {
					let completed = l >= c.max
					let progressing = inChal(i)
					let active = inChalCond(i)

					tmp.el["chal_comp_"+i].setTxt(completed ? "Completed" : format(l,0) + " / " + format(c.max,0))
					tmp.el["chal_comp_"+i].setClasses({[completed ? "pink" : "yellow"]: true})
					tmp.el["chal_eff_"+i].setHTML(c.effDesc(tmp.chal.eff[i]))

					tmp.el["chal_pro_"+i].setTxt(completed ? "" : progressing ? "Progress" : active ? "Active" : "Inactive")
					tmp.el["chal_pro_"+i].setClasses({[completed ? "pink" : progressing ? "yellow" : active ? "green" : "red"]: true})
					tmp.el["chal_goal_"+i].setTxt(completed ? "" : "Goal: "+c.goalDesc(tmp.chal.goal[i]) + (progressing || active ? " (" + format(c.goalAmt(), 0) + ")" : ""))
				}
			}
		}
	}
}