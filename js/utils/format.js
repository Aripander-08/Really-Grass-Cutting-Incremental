const FORMATS = {
	sc(ex, acc) {
		let e = ex.log10().floor()

		if (e.lt(6)) {
			let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
			return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
		} else {
			if (ex.gte("eeee10")) {
				let slog = ex.slog()
				return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(2)) + "F" + format(slog.floor(), 0)
			}
			let m = ex.div(E(10).pow(e))
			let be = e.log10().gte(9)
			return neg+(be?'':m.toFixed(2))+'e'+format(e, 0, "mixed_sc")
		}
	},
	st(ex, acc) {
		let e = ex.log10().floor().toNumber()
		let e3 = Math.floor(e/3)
		if (e3 < 1) return neg+ex.toFixed(Math.max(Math.min(acc-e, acc), 0))

		let e3_mul = e3*3
		let m = ex.div(E(10).pow(e3_mul))
		return neg+(m.toFixed(2-e+e3_mul)+' ')+["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"][e3]
	},
	mixed_sc(ex, acc) {
		ex = E(ex)
		let e = ex.log10().floor()
		if (e.gte(6) && e.lt(36)) return format(ex, acc, "st")
		else return format(ex, acc, "sc")
	}
}


const INFINITY_NUM = E(2).pow(1024);
const SUBSCRIPT_NUMBERS = "₀₁₂₃₄₅₆₇₈₉";
const SUPERSCRIPT_NUMBERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function toSubscript(value) {
	return value.toFixed(0).split("")
	  .map((x) => x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)])
	  .join("");
}

function toSuperscript(value) {
	return value.toFixed(0).split("")
	  .map((x) => x === "-" ? "₋" : SUPERSCRIPT_NUMBERS[parseInt(x, 10)])
	  .join("");
}

function format(ex, acc=2, type) {
	ex = E(ex)
	neg = ex.lt(0)?"-":""

	if (ex.mag == Infinity) return neg + 'Infinity'
	if (Number.isNaN(ex.mag)) return neg + 'NaN'
	if (ex.lt(0)) ex = ex.mul(-1)
	if (ex.eq(0)) return ex.toFixed(acc)

	if (!type) type = player.options.scientific ? "sc" : "mixed_sc"
	return neg+FORMATS[type](ex, acc)
}

function gainHTML(rate, gain) {
	let r = Decimal.mul(gain, rate)
    return r.gt(0) ? " <span class='smallAmt'>" + formatGain(r) + "</span>" : ''
}

function formatGain(gain) {
	return "(+"+format(gain)+"/s)"
}

function formatTime(ex,acc=2,type="s") {
	ex = E(ex)
	if (ex.gte(86400)) return format(ex.div(86400).floor(),0,"sc")+":"+formatTime(ex.mod(86400),acc,'d')
	if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0,"sc")+":"+formatTime(ex.mod(3600),acc,'h')
	if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0,"sc")+":"+formatTime(ex.mod(60),acc,'m')
	return (ex.gte(10)||type!="m" ?"":"0")+ex.toFixed(1)
}

function formatReduction(ex) { ex = E(ex); return format(E(1).sub(ex).mul(100))+"%" }

function formatPercent(ex) { ex = E(ex); return format(ex.mul(100))+"%" }

function formatMult(ex,acc=2) { ex = E(ex); return ex.gte(1)?"×"+ex.format(acc):"/"+ex.pow(-1).format(acc)}