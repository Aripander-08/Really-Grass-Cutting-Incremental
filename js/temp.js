var tmp = {}
var tmp_update = []

function resetTemp() {
	keep = []
	tmp = {
        pass: 0,

		el: tmp.el,
		map_notify: {},

		grasses: [],
		spawn_time: 0,
		rangeCut: 50,
		autocut: 5,
		autocutTime: 0,
		autocutAmt: 1,
		spawnAmt: 1,

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

        /*darkChargeEffs: {},

        reservConvert: 0,

        solar_upgs_effect: [],

        minStats: {
            gh: 0,
            gs: 0,
        },*/
	}

	for (let x in UPG_RES) tmp.upg_res[x] = E(0)
	for (let x in UPGS) {
		tmp.upgs[x] = {
			unlLength: 0,
			max: [],
			costOnce: [],
			cost: [],
			bulk: [],
			eff: [],
		}
	}

    //for (let x in SOLAR_UPGS) tmp.solar_upgs_effect[x] = []
}

function updateTemp() {
	updateRealmTemp()
	for (let x = 0; x < tmp_update.length; x++) tmp_update[x]()
}