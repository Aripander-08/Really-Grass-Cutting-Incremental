MAIN.chrono = {
	unl: _ => player.sTimes,
	setup() {
		return {
			plat: 0,
			moon: 0,
			chrona: 0,
			spent: 0,

			amt: 0,
			offline: 0,

			speed: 1
		}
	},

	can() {
		let speed = parseFloat(document.getElementById("chrono_speed").value)
		return speed >= 1 && speed <= this.max()
	},
	toggle() {
		if (!this.can()) return
		player.ch.speed = parseFloat(document.getElementById("chrono_speed").value)
	},
	max() {
		return upgEffect('chrono', 0, 2)
	},
	fluxMax() {
		return upgEffect('chrono', 2, 1e3)
	},

	warp() {
		if (!this.warpCan()) return

		let power = this.warpPower()
		this.consume(power)
		calc(power, true)
	},
	warpCan() {
		let check = parseInt(document.getElementById("chrono_warp").value)
		if (check < 1) return
		if (check > 100) return
		if (isNaN(check)) return

		return true
	},
	warpPower() {
		return parseFloat(document.getElementById("chrono_warp").value) * this.totalAmt() / 100
	},

	totalAmt() {
		return player.ch.amt + player.ch.offline
	},
	consume(x) {
		if (player.ch.offline) {
			player.ch.offline -= x
			if (player.ch.offline < 0) x = -player.ch.offline
			else return
		}
		player.ch.offline = 0
		player.ch.amt = Math.max(player.ch.amt - x, 0)
	},

	tick(dt) {
		if (player.ch.speed > 1) {
			this.consume(dt * player.ch.speed / upgEffect('chrono', 1))
			if (player.ch.amt == 0) player.ch.speed = 1
		} else {
			player.ch.amt = Math.min(player.ch.amt + dt, this.fluxMax())
		}
		MAIN.chrona.tick()
	}
}

MAIN.chrona = {
	platGain() {
		return Math.max(Math.floor(Math.log10(Math.max(player.plat, 1) / 2e3) / Math.log10(2) + 1), 0)
	},
	platNext(p = player.ch.plat) {
		return 2 ** p * 2e3
	},
	moonGain() { 
		return galUnlocked() ? Math.max(Math.floor(Math.log10(Math.max(player.gal.moonstone, 1) / 10) / Math.log10(2) * 2 + 1), 0) : 0
	},
	moonNext(m = player.ch.moon) {
		return galUnlocked() ? 2 ** (m / 2) * 10 : 10
	},

	tick() {
		player.ch.plat = Math.max(player.ch.plat, this.platGain())
		player.ch.moon = Math.max(player.ch.moon, this.moonGain())
		player.ch.chrona = player.ch.plat + player.ch.moon
	}
}

RESET.time = {
	unl: _=>player.sTimes,

	req: _=>true,
	reqDesc: _=>"",

	resetDesc: `Speed up game until you run out of Time Fluxes.`,
	resetGain: _=> `
		<b>${format(player.ch.offline, 1)}</b> Offline Fluxes<br>
		<b>${format(player.ch.amt, 1)} / ${format(MAIN.chrono.fluxMax(), 0)}</b> Time Fluxes<br>
		<span class='smallAmt'>(${format(player.ch.speed, 1)}x speed)</span>
		<b class='smallAmt red'>(${format(MAIN.chrono.max(), 1)}x maximum)</b>
	`,
	btns: `<input id="chrono_speed" type="text">`,

	title: `Time Speed`,
	resetBtn: `Speedup!`,

	reset(force=false) {
		MAIN.chrono.toggle()
	},
}

RESET.warp = {
	unl: _=>player.sTimes,

	req: _=>galUnlocked(),
	reqDesc: _=>"Galactic once to unlock.",

	resetDesc: `Spend Time Fluxes to immediately skip time.`,
	resetGain: _=>`(+${MAIN.chrono.warpCan() ? format(MAIN.chrono.warpPower(), 0) : "???"} seconds)`,
	btns: `<input id="chrono_warp" type="number" min=1 max=100 value=50>% power`,

	title: `Time Warp`,
	resetBtn: `Warp!`,

	reset(force=false) {
		MAIN.chrono.warp()
	},
}

UPGS.chrono = {
	title: "Chronology Mastery",
	btns: `<button class="buyAllUpg" onclick='UPGS.chrono.respec()'>Respec</button>`,

	unl: _=>player.sTimes,
	underDesc: _=>getUpgResTitle('chrona'),

	ctn: [
		{
			max: Infinity,

			title: "Chrono-Speed",
			desc: `Increase time speed maximum by <b class="green">+1x</b>.`,
		
			res: "chrona",
			icon: ["Curr/Chrona"],

			cost: i => (i+1)**2,
			bulk: i => Math.floor(i**0.5),

			effect(i) {
				return i+2
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Chrono-Resistence",
			desc: `Time Speed loses <b class="green">+20%</b> less Time Fluxes.`,

			res: "chrona",
			icon: ["Curr/Chrona"],

			cost: i => (i+2)**2,
			bulk: i => Math.floor(Math.sqrt(i)-1),

			effect(i) {
				return i/5+1
			},
			effDesc: x => format(x)+"x",
		},{
			max: Infinity,

			title: "Chrono-Warp",
			desc: `Increase time flux capacity by <b class="green">+1,000</b>.`,

			res: "chrona",
			icon: ["Curr/Chrona"],

			cost: i => (i+1)**1.5,
			bulk: i => Math.floor(i**(2/3)),
		
			effect(i) {
				return (i+1)*1e3
			},
			effDesc: x => format(x, 0) + " capacity",
		}
	],

	respec() {
		if (!confirm("Respec your upgrades?")) return
		player.ch.spent = 0
		player.upgs.chrono = []
	}
}

el.update.chrono = _=>{
	if (mapID == 'chrono') {
		let unl = player.sTimes > 0

		tmp.el.chrono_unl.setDisplay(!unl)
		tmp.el.chrono_div.setDisplay(unl)

		if (unl) {
			tmp.el.chrona_plat.setHTML(format(MAIN.chrona.platNext(), 0) + " Platinum")
			tmp.el.chrona_moon.setHTML(galUnlocked() ? format(MAIN.chrona.moonNext(), 0) + " Moonstone" : "")

			tmp.el.reset_btn_time.setClasses({locked: !MAIN.chrono.can()})
			tmp.el.reset_btn_warp.setClasses({locked: !MAIN.chrono.warpCan()})
			updateResetHTML("time")
			updateResetHTML("warp")
			updateUpgradesHTML("chrono")
		}
	}
}