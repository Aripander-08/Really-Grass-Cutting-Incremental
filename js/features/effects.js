let EFFECT = {}

function updateEffectTemp() {
	const data = {}
	tmp.effs = data
	for (let [id, effs] of Object.entries(EFFECT)) {
		if (!effs.unl()) continue

		let res = effs.res()
		data[id] = {}
		for (let [eff_id, eff] of Object.entries(effs.effs)) {
			if (compute(eff.unl)) data[id][eff_id] = eff.eff(advCalc(effs.getEff, res, eff))
		}
	}
}
tmp_update.push(updateEffectTemp)

function getEffect(id, x, def = 1) {
	let eff = tmp.effs?.[id]?.[x]
	return !isNaN(eff) ? eff : def
}

function setupEffectsHTML(x) {
	new Element('eff_div_'+x).setHTML(`
		<h3 id='eff_title_${x}'></h3>
		<span id='eff_ctn_${x}'></span>
	`)
}

el.setup.effs = _=>{
	for (let x in EFFECT) setupEffectsHTML(x)
}

function updateEffectHTML(x) {
	let data = EFFECT[x]
	let data_effs = data.effs
	let data_tmp = tmp.effs[x]
	let res = data.res()

	if (!data_tmp) return

	let html = ''
	for (const [id, eff] of Object.entries(data_tmp)) {
		let data_eff = data_effs[id]
		html += advCalc(data.effDesc, data_eff.desc(eff), data_eff) + "<br>"
	}

	tmp.el['eff_title_'+x].setHTML(data.title ? data.title(res) + "<br>" : "")
	tmp.el['eff_ctn_'+x].setHTML(html)
}