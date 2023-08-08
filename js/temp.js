var tmp = {}
var tmp_update = []

function resetTemp() {
	keep = []
	tmp = {
		el: tmp.el,
		map_notify: {},

		grasses: [],
		spawn_time: 0,
		rangeCut: 50,
		autocut: 5,
		autocutTime: 0,
		autocutAmt: 1,
		spawnAmt: 1,
		cutAmt: 1,

		platChance: 0.001,
		platGain: 1,

		level: {},
		tier: {},

		upgs: {},
		upg_res: {},
		upg_ch: [],
		perks: 0,

		chal: {
			bulk: [],
			amt: [],
			goal: [],
			eff: [],
		},

		gh: {},
		charge: {},

		realm: {},
		aRes: {
			gs: {}
		},
		unRes: {
			gj: {}
		},
		plRes: {}
	}

	for (let x in UPG_RES) tmp.upg_res[x] = E(0)
	for (let x in UPGS) {
		tmp.upgs[x] = {
			unlLength: 0,
			max: [],
			cost: [],
			bulk: [],
			eff: [],
		}
	}
}

function updateTemp() {
	updateRealmTemp()
    //tmp.lunarUnl = player.grassjump>=5
    //tmp.total_astral = player.astral+100*player.astralPrestige

	for (let x = 0; x < tmp_update.length; x++) tmp_update[x]()
}