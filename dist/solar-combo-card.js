/* Solar Combo Card 0.6.0 - https://github.com/deltamike66/solar-combo-card - MIT */
const VERSION = "0.6.0";

const ENTITA = {
  pv1_power: "sensor.{p}_{inv}_pv1_power",
  pv1_voltage: "sensor.{p}_{inv}_pv1_voltage",
  pv1_current: "sensor.{p}_{inv}_pv1_current",
  pv2_power: "sensor.{p}_{inv}_pv2_power",
  pv2_voltage: "sensor.{p}_{inv}_pv2_voltage",
  pv2_current: "sensor.{p}_{inv}_pv2_current",
  inverter_mode: "sensor.{p}_{inv}_operation_mode",
  inverter_temp: "sensor.{p}_{inv}_temperature",
  room_temp: "sensor.{p}_temperatura_locale_inverter",
  load_power: "sensor.{p}_{inv}_output_active_power",
  load_voltage: "sensor.{p}_{inv}_output_effective_voltage",
  battery_soc: "sensor.{p}_bms_state_of_charge",
  battery_power: "sensor.{p}_bms_potenza",
  battery_voltage: "sensor.{p}_bms_tensione_totale",
  battery_current: "sensor.{p}_bms_corrente",
  cell_min: "sensor.{p}_bms_cella_minima",
  cell_max: "sensor.{p}_bms_cella_massima",
  cell_delta: "sensor.{p}_bms_delta_celle",
  bms_alarms: "sensor.{p}_bms_allarmi",
  charger_power: "sensor.{p}_r4850g2_output_power",
  charger_voltage: "sensor.{p}_r4850g2_output_voltage",
  charger_current: "sensor.{p}_r4850g2_output_current",
  charger_standby: "switch.{p}_r4850g2_standby",
  charge_auto: "switch.{p}_gestione_automatica_carica",
  charge_state: "sensor.{p}_stato_gestione_carica",
  grid_power: "sensor.{p}_r4850g2_input_power",
  grid_voltage: "sensor.{p}_r4850g2_input_voltage",
  charge_start: "number.{p}_carica_avvio_sotto_cella_min",
  charge_stop: "number.{p}_carica_stop_sopra_cella_min",
  charge_confirm: "number.{p}_carica_conferma_avvio",
  charge_min_ah: "number.{p}_carica_ah_minimi",
  charge_voltage: "number.{p}_carica_tensione_r4850g2",
  charge_current: "number.{p}_carica_corrente_r4850g2",
  charge_margin: "number.{p}_carica_margine_sul_consumo",
  full_charge_days: "number.{p}_carica_completa_ogni_giorni",
  charged_ah: "sensor.{p}_carica_ah_caricati",
  charge_current_req: "sensor.{p}_carica_corrente_richiesta",
  cell_max_charge: "sensor.{p}_soglia_cella_max_carica",
  cell_max_protection: "sensor.{p}_soglia_cella_max_protezione",
  days_since_full: "sensor.{p}_giorni_dall_ultima_carica_completa",
  inverter_battery_power: null,
};

const SOGLIA_W = 10;

const DUR_BASE = 1.5;
const FONDO_SCALA_W = 500;
const VELOCITA_MAX = 6;

const L = 60;
const NODI = {
  pv1: { x: 70, y: 90, disegno: "pannello" },
  pv2: { x: 190, y: 90, disegno: "pannello" },
  inverter: { x: 130, y: 200, disegno: "inverter" },
  casa: { x: 340, y: 200, disegno: "casa" },
  batteria: { x: 130, y: 310, disegno: "batteria" },
  r4850: { x: 270, y: 310, disegno: "raddrizzatore" },
  rete: { x: 390, y: 310, disegno: "traliccio" },
};

const FLUSSI = {
  pv1: { d: "M 70 116 C 70 150, 130 140, 130 175", colore: "var(--scc-solare)" },
  pv2: { d: "M 190 116 C 190 150, 130 140, 130 175", colore: "var(--scc-solare)" },
  casa: { d: "M 149 200 L 318 200", colore: "var(--scc-casa)" },
  batteria: { d: "M 130 225 L 130 288", colore: "var(--scc-batteria)" },
  r4850: { d: "M 245 310 L 152 310", colore: "var(--scc-caricatore)" },
  rete: { d: "M 381 310 L 295 310", colore: "var(--scc-rete)" },
};

const DISEGNI = {
  pannello: `
    <g class="sole">
      <circle cx="51" cy="9" r="5" fill="#ffc107"/>
      <path d="M51 1v2.5M51 15v2.5M43 9h2.5M56.5 9H59M45.3 3.3l1.8 1.8M54.9 12.9l1.8 1.8M45.3 14.7l1.8-1.8M54.9 5.1l1.8-1.8"
            stroke="#ffc107" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <path d="M30 44v11M21 56h18" stroke="#78909c" stroke-width="3" stroke-linecap="round"/>
    <polygon points="9,16 47,16 55,44 3,44" fill="#1e5aa8" stroke="#0d3b75" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M18.5 16L16 44M28 16L29 44M37.5 16L42 44M6 25.3h44.7M4.5 34.7h47.8"
          stroke="#8fb8ec" stroke-width="0.9"/>
    <polygon points="11,18 22,18 12,30 7,30" fill="#fff" opacity=".18"/>`,
  inverter: `
    <rect x="11" y="5" width="38" height="50" rx="4" fill="#eceff1" stroke="#607d8b" stroke-width="1.8"/>
    <rect x="16" y="11" width="28" height="17" rx="2" fill="#263238"/>
    <path d="M18 19.5c2.5-7 5-7 7.5 0s5 7 7.5 0 5-7 7.5 0" fill="none" stroke="#4fc3f7" stroke-width="1.6"/>
    <circle cx="20" cy="35" r="2.2" fill="#66bb6a"/>
    <circle cx="27" cy="35" r="2.2" fill="#ffca28"/>
    <circle cx="34" cy="35" r="2.2" fill="#ef5350"/>
    <path d="M17 44h26M17 48h26" stroke="#b0bec5" stroke-width="1.6" stroke-linecap="round"/>`,
  casa: `
    <g class="sole-casa">
      <path d="M47 1.5v3.5M47 25v3.5M33.5 15H37M57 15h2.5M37.5 5.5l2.5 2.5M54 22l2.5 2.5M37.5 24.5L40 22M54 8l2.5-2.5"
            stroke="#ffb300" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="47" cy="15" r="8" fill="#ffc107"/>
      <circle cx="44.6" cy="12.6" r="3.2" fill="#ffe082" opacity=".7"/>
    </g>
    <g class="rete-casa">
      <path d="M6.5 0.8L1.8 27M6.5 0.8L11.2 27M0.8 5.2h11.4M1.8 10.4h9.4M3.6 5.2l5.8 5.2M9.4 5.2l-5.8 5.2M2.9 17h7.2M2.4 17l7.6 8M10.6 17l-7.6 8"
            fill="none" stroke="#607d8b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0.9" cy="6.3" r="0.9" fill="#78909c"/><circle cx="12.1" cy="6.3" r="0.9" fill="#78909c"/>
    </g>
    <g class="batt-casa">
      <rect x="6.5" y="4" width="5" height="2.6" rx="0.8" fill="#2e7d32"/>
      <rect x="3" y="6.3" width="12" height="19" rx="2.2" fill="#43a047" stroke="#2e7d32" stroke-width="1.2"/>
      <rect x="5.2" y="8.6" width="7.6" height="3.4" rx="0.8" fill="#a5d6a7"/>
      <rect x="5.2" y="13.2" width="7.6" height="3.4" rx="0.8" fill="#a5d6a7"/>
      <path d="M10 17.6l-3 4.4h2.4l-0.8 3.2 3.2-4.6h-2.4z" fill="#fff"/>
    </g>
    <path d="M3 55.5h54" stroke="#90a4ae" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="38" y="35" width="16" height="20.5" fill="#dfe4e7" stroke="#607d8b" stroke-width="1.3"/>
    <rect x="36" y="31.5" width="20" height="4" rx="0.8" fill="#455a64"/>
    <rect x="41" y="40" width="10" height="15.5" fill="#b0bec5" stroke="#78909c" stroke-width="0.8"/>
    <path d="M41 43.8h10M41 47.6h10M41 51.4h10" stroke="#90a4ae" stroke-width="0.8"/>
    <rect x="8" y="24" width="30" height="31.5" fill="#eceff1" stroke="#607d8b" stroke-width="1.5"/>
    <polygon points="4.5,26 23,10.5 41.5,26" fill="#455a64" stroke="#37474f" stroke-width="1" stroke-linejoin="round"/>
    <rect class="finestra" x="12" y="31" width="9" height="8" stroke="#546e7a" stroke-width="1"/>
    <rect class="finestra" x="25" y="31" width="9" height="8" stroke="#546e7a" stroke-width="1"/>
    <rect class="finestra" x="12" y="44" width="9" height="7" stroke="#546e7a" stroke-width="1"/>
    <rect x="26" y="43" width="7" height="12.5" fill="#607d8b"/>
    <circle cx="31.4" cy="49.5" r="0.7" fill="#cfd8dc"/>
    <g fill="#558b2f">
      <circle cx="3.6" cy="52.2" r="3.6"/><circle cx="8.2" cy="50.8" r="4.6"/><circle cx="12.8" cy="53" r="3"/>
      <circle cx="56.2" cy="52.6" r="3.2"/><circle cx="53.4" cy="54" r="2.2"/>
    </g>
    <g fill="#7cb342">
      <circle cx="2.8" cy="50.8" r="1.6"/><circle cx="7" cy="48.6" r="2"/><circle cx="55.4" cy="51.2" r="1.4"/>
    </g>`,
  batteria: `
    <rect x="16" y="8" width="8" height="6" rx="1" fill="#455a64"/>
    <rect x="36" y="8" width="8" height="6" rx="1" fill="#455a64"/>
    <rect x="8" y="13" width="44" height="42" rx="4" fill="#eceff1" stroke="#455a64" stroke-width="2"/>
    <rect class="livello" x="12" y="17" width="36" height="34" rx="2" fill="#66bb6a"/>
    <path d="M17 21h6M20 18v6M37 21h6" stroke="#455a64" stroke-width="1.6" stroke-linecap="round"/>
    <path class="fulmine" d="M32 24l-8 12h6l-2 10 8-12h-6z" fill="#fff" stroke="#37474f" stroke-width="1.2" stroke-linejoin="round"/>`,
  raddrizzatore: `
    <rect x="5" y="15" width="50" height="32" rx="3" fill="#cfd8dc" stroke="#546e7a" stroke-width="1.8"/>
    <circle cx="19" cy="31" r="10" fill="#90a4ae" stroke="#546e7a" stroke-width="1.2"/>
    <path d="M19 21.5v19M9.5 31h19M12.3 24.3l13.4 13.4M12.3 37.7l13.4-13.4" stroke="#546e7a" stroke-width="1"/>
    <circle cx="19" cy="31" r="2.5" fill="#546e7a"/>
    <circle class="alone" cx="37" cy="22" r="6.5"/>
    <circle class="led" cx="37" cy="22" r="3.4" stroke="#37474f" stroke-width="0.8"/>
    <circle cx="45" cy="22" r="2" fill="#90a4ae"/>
    <path d="M33 30h17M33 34h17M33 38h17" stroke="#90a4ae" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M49 21l-3 5h2.5l-1 4 3.5-5.5h-2.5z" fill="#ffca28"/>`,
  traliccio: `
    <g class="scintilla"><path d="M53 3l-4 7h3l-1.5 6 5-8h-3z" fill="#ffc107"/></g>
    <path d="M30 4L17 56M30 4l13 52M10 15h40M14 27h32M23 15l14 12M37 15L23 27M21.5 37h17M20 37l19 12M40 37L19 49M15 56h30"
          fill="none" stroke="#78909c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="10" cy="17" r="1.8" fill="#78909c"/><circle cx="50" cy="17" r="1.8" fill="#78909c"/>
    <circle cx="14" cy="29" r="1.8" fill="#78909c"/><circle cx="46" cy="29" r="1.8" fill="#78909c"/>`,
};

const CLIC = {
  pv1: "pv1_power", pv2: "pv2_power", inverter: "inverter_mode", casa: "load_power",
  batteria: "battery_soc", r4850: "charger_power", rete: "grid_power",
};

class SolarComboCard extends HTMLElement {
  static getStubConfig() {
    return { prefix: "solar_combo" };
  }

  setConfig(config) {
    if (!config) throw new Error("Configurazione mancante");
    const prefisso = config.prefix || "solar_combo";
    const inverter = config.inverter || "smg_ii";
    const ent = {};
    for (const [k, v] of Object.entries(ENTITA)) {
      ent[k] = v ? v.replace("{p}", prefisso).replace("{inv}", inverter) : null;
    }
    Object.assign(ent, config.entities || {});
    const soglia = Number(config.threshold);
    this._soglia = config.threshold !== undefined && Number.isFinite(soglia) && soglia >= 0 ? soglia : SOGLIA_W;
    const positivo = (v, def, min) => {
      const n = Number(v);
      return v !== undefined && Number.isFinite(n) && n >= min ? n : def;
    };
    this._fondoScala = positivo(config.flow_scale, FONDO_SCALA_W, 1);
    this._durMin = DUR_BASE / positivo(config.flow_max_speed, VELOCITA_MAX, 1);
    this._config = config;
    this._ent = ent;
    this._costruita = false;
    if (this._hass) this._aggiorna();
  }

  set hass(hass) {
    this._hass = hass;
    this._aggiorna();
  }

  getCardSize() {
    return 7;
  }

  _stato(k) {
    const id = this._ent[k];
    return id && this._hass ? this._hass.states[id] : undefined;
  }

  _num(k) {
    const s = this._stato(k);
    if (!s) return NaN;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : NaN;
  }

  _fmt(v, dec = 0) {
    if (!Number.isFinite(v)) return "—";
    const lingua = (this._hass && this._hass.locale && this._hass.locale.language) || "it";
    return v.toLocaleString(lingua, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  _potenza(w) {
    if (!Number.isFinite(w)) return "— W";
    return Math.abs(w) >= 1000 ? `${this._fmt(w / 1000, 2)} kW` : `${this._fmt(w)} W`;
  }

  _costruisci() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const nodi = Object.entries(NODI).map(([k, n]) => `
      <g class="nodo" data-nodo="${k}" transform="translate(${n.x - L / 2} ${n.y - L / 2})">
        <rect class="area" width="${L}" height="${L}"></rect>
        ${DISEGNI[n.disegno]}
      </g>`).join("");
    const flussi = Object.entries(FLUSSI).map(([k, f]) => `
      <g data-flusso="${k}" style="--c:${f.colore}">
        <path class="linea" d="${f.d}"></path>
        <path class="punti" d="${f.d}"></path>
      </g>`).join("");
    const titolo = this._config.title
      ? `<div class="titolo">${this._config.title}</div>` : "";
    this.shadowRoot.innerHTML = `
      <style>${STILE}</style>
      <ha-card>
        ${titolo}
        <svg viewBox="0 0 440 380" role="img" aria-label="Flusso di energia solar-combo">
          ${flussi}
          ${nodi}
          <!-- stringhe FV: testi sopra i cerchi -->
          <text class="tit" x="70" y="24">PV1</text>
          <text class="val" x="70" y="42" data-t="pv1"></text>
          <text class="sub" x="70" y="56" data-t="pv1_sub"></text>
          <text class="tit" x="190" y="24">PV2</text>
          <text class="val" x="190" y="42" data-t="pv2"></text>
          <text class="sub" x="190" y="56" data-t="pv2_sub"></text>
          <!-- inverter: testi a sinistra -->
          <text class="tit fine" x="96" y="190">Inverter</text>
          <text class="sub fine" x="96" y="205" data-t="inv_modo"></text>
          <text class="sub fine" x="96" y="219" data-t="inv_temp"></text>
          <text class="sub fine" x="96" y="233" data-t="locale_temp"></text>
          <!-- casa -->
          <text class="tit" x="340" y="164">Casa</text>
          <text class="val" x="340" y="244" data-t="casa"></text>
          <text class="sub" x="340" y="258" data-t="casa_sub"></text>
          <!-- inverter <-> batteria: valore accanto alla linea -->
          <text class="sub inizio" x="140" y="259" data-t="inv_batt"></text>
          <!-- batteria: testi a sinistra e celle sotto -->
          <text class="tit fine" x="96" y="292">Batteria</text>
          <text class="val fine" x="96" y="310" data-t="soc"></text>
          <text class="sub fine" x="96" y="324" data-t="batt_p"></text>
          <text class="sub fine" x="96" y="338" data-t="batt_v"></text>
          <text class="sub" x="130" y="356" data-t="celle"></text>
          <!-- R4850G2 -->
          <text class="tit" x="270" y="266">R4850G2</text>
          <text class="stato" x="270" y="279" data-t="r48_stato"></text>
          <text class="val" x="270" y="354" data-t="r48"></text>
          <text class="sub" x="270" y="368" data-t="r48_sub"></text>
          <!-- rete del gestore -->
          <text class="tit" x="390" y="266">Rete</text>
          <text class="val" x="390" y="354" data-t="rete"></text>
          <text class="sub" x="390" y="368" data-t="rete_sub"></text>
        </svg>
        ${this._config.show_charge === false ? "" : PANNELLO_CARICA}
        <div class="piede">
          <div class="allarme" data-t="allarmi"></div>
        </div>
      </ha-card>`;
    this.shadowRoot.querySelectorAll(".nodo").forEach((g) => {
      g.addEventListener("click", () => this._piuInfo(this._ent[CLIC[g.dataset.nodo]]));
    });
    this.shadowRoot.querySelectorAll("[data-info]").forEach((el) => {
      el.addEventListener("click", () => this._piuInfo(this._ent[el.dataset.info]));
    });
    this._costruita = true;
  }

  _piuInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  }

  _testo(k, s) {
    const el = this.shadowRoot.querySelector(`[data-t="${k}"]`);
    if (el && el.textContent !== s) el.textContent = s;
  }

  _flusso(k, w) {
    const g = this.shadowRoot.querySelector(`[data-flusso="${k}"]`);
    const attivo = Number.isFinite(w) && Math.abs(w) >= this._soglia;
    g.classList.toggle("attivo", attivo);
    if (!attivo) return;
    const dur = Math.max(this._durMin, DUR_BASE / (1 + Math.abs(w) / this._fondoScala));
    const durTxt = `${(Math.round(dur * 20) / 20).toFixed(2)}s`;
    const punti = g.querySelector(".punti");
    if (punti.style.animationDuration !== durTxt) punti.style.animationDuration = durTxt;
    punti.style.animationDirection = w < 0 ? "reverse" : "normal";
  }

  _nodo(k, classe, si) {
    this.shadowRoot.querySelector(`[data-nodo="${k}"]`).classList.toggle(classe, !!si);
  }

  _livelloBatteria(soc) {
    const r = this.shadowRoot.querySelector('[data-nodo="batteria"] .livello');
    const f = Number.isFinite(soc) ? Math.max(0, Math.min(100, soc)) / 100 : 0;
    const h = 34 * f;
    r.setAttribute("y", (17 + 34 - h).toFixed(1));
    r.setAttribute("height", h.toFixed(1));
    r.setAttribute("fill", soc < 20 ? "#ef5350" : soc < 40 ? "#ffa726" : "#66bb6a");
  }

  _aggiornaCarica(cmin) {
    const auto = this._stato("charge_auto");
    const badge = this.shadowRoot.querySelector(".badge");
    const attiva = auto && auto.state === "on";
    badge.classList.toggle("spenta", !attiva);
    this._testo("auto", auto ? (attiva ? "ATTIVA" : "DISATTIVATA") : "—");
    const stato = this._stato("charge_state");
    this._testo("c_stato", stato ? stato.state : "—");
    const n = (k, dec) => this._fmt(this._num(k), dec);
    this._testo("c_avvio", `cella min < ${n("charge_start", 2)} V per ${n("charge_confirm", 1)} min`);
    this._testo("c_stop", `cella min > ${n("charge_stop", 2)} V e almeno ${n("charge_min_ah")} Ah`);
    this._testo("c_ah", `${n("charged_ah", 1)} Ah · cella min ora ${this._fmt(cmin, 3)} V`);
    this._testo("c_r48", `${n("charge_voltage", 1)} V · ${n("charge_current", 1)} A (+ ${n("charge_margin", 1)} A sul consumo)`);
    this._testo("c_rich", `${n("charge_current_req", 1)} A`);
    this._testo("c_cmax", `stop ${n("cell_max_charge", 3)} V · protezione ${n("cell_max_protection", 3)} V`);
    const giorni = this._num("full_charge_days");
    this._testo("c_completa", giorni === 0 ? "disattivata"
      : `ogni ${n("full_charge_days")} giorni · ultima ${n("days_since_full", 1)} giorni fa`);
  }

  _aggiorna() {
    if (!this._config || !this._hass) return;
    if (!this._costruita) this._costruisci();

    let pvTot = 0;
    for (const n of ["pv1", "pv2"]) {
      const p = this._num(`${n}_power`);
      this._testo(n, this._potenza(p));
      this._testo(`${n}_sub`, `${this._fmt(this._num(`${n}_voltage`))} V · ${this._fmt(this._num(`${n}_current`), 1)} A`);
      this._flusso(n, p);
      this._nodo(n, "attivo", p >= this._soglia);
      if (Number.isFinite(p)) pvTot += p;
    }

    const modo = this._stato("inverter_mode");
    this._testo("inv_modo", modo ? modo.state : "—");
    this._testo("inv_temp", `${this._fmt(this._num("inverter_temp"))} °C`);
    this._testo("locale_temp", `locale ${this._fmt(this._num("room_temp"), 1)} °C`);
    const casa = this._num("load_power");
    this._testo("casa", this._potenza(casa));
    this._testo("casa_sub", `${this._fmt(this._num("load_voltage"))} V`);
    this._flusso("casa", casa);
    this._nodo("casa", "attivo", casa >= this._soglia);

    const soc = this._num("battery_soc");
    const pBatt = this._num("battery_power");
    this._testo("soc", `${this._fmt(soc)} %`);
    this._testo("batt_p", this._potenza(pBatt));
    this._testo("batt_v", `${this._fmt(this._num("battery_voltage"), 1)} V · ${this._fmt(this._num("battery_current"), 1)} A`);
    const cmin = this._num("cell_min"), cmax = this._num("cell_max"), delta = this._num("cell_delta");
    this._testo("celle", `celle ${this._fmt(cmin, 3)}–${this._fmt(cmax, 3)} V · Δ ${this._fmt(delta)} mV`);
    this._livelloBatteria(soc);
    this._nodo("batteria", "in-carica", pBatt >= this._soglia);

    const pR48 = this._num("charger_power");
    const standby = this._stato("charger_standby");
    const auto = this._stato("charge_auto");
    const statoR48 = standby ? (standby.state === "on" ? "STANDBY" : "ACCESO") : "—";
    const modoR48 = auto ? (auto.state === "on" ? "AUTO" : "MANUALE") : "";
    this._testo("r48_stato", modoR48 ? `${statoR48} · ${modoR48}` : statoR48);
    this._testo("r48", this._potenza(pR48));
    this._testo("r48_sub", `${this._fmt(this._num("charger_voltage"), 1)} V · ${this._fmt(this._num("charger_current"), 1)} A`);
    this._flusso("r4850", pR48);
    this._nodo("r4850", "acceso", !!standby && standby.state === "off");
    const pRete = this._num("grid_power");
    this._testo("rete", this._potenza(pRete));
    this._testo("rete_sub", `${this._fmt(this._num("grid_voltage"))} V`);
    this._flusso("rete", pRete);
    this._nodo("rete", "attivo", pRete >= this._soglia);

    let pInvBatt = this._num("inverter_battery_power");
    if (!Number.isFinite(pInvBatt)) pInvBatt = pBatt - (Number.isFinite(pR48) ? pR48 : 0);
    this._testo("inv_batt", Number.isFinite(pInvBatt) && Math.abs(pInvBatt) >= this._soglia
      ? `${pInvBatt > 0 ? "↓" : "↑"} ${this._potenza(Math.abs(pInvBatt))}` : "");
    this._flusso("batteria", pInvBatt);

    const consuma = casa >= this._soglia;
    this._nodo("casa", "da-solare", consuma && pvTot >= this._soglia);
    const daBatteria = consuma && pInvBatt <= -this._soglia;
    this._nodo("casa", "da-batteria", daBatteria);
    this._nodo("casa", "da-rete", daBatteria && pR48 >= this._soglia);

    if (this._config.show_charge !== false) this._aggiornaCarica(cmin);

    const allarmi = this._stato("bms_alarms");
    const a = allarmi && !["", "unknown", "unavailable"].includes(allarmi.state) ? allarmi.state : "";
    this._testo("allarmi", a ? `Allarmi BMS: ${a}` : "");
  }
}

const RIGHE_CARICA = [
  ["Stato", "c_stato", "charge_state"],
  ["Avvio", "c_avvio", "charge_start"],
  ["Stop", "c_stop", "charge_stop"],
  ["Caricati", "c_ah", "charged_ah"],
  ["R4850G2", "c_r48", "charge_voltage"],
  ["Corrente richiesta", "c_rich", "charge_current_req"],
  ["Cella max", "c_cmax", "cell_max_charge"],
  ["Carica completa", "c_completa", "full_charge_days"],
];
const PANNELLO_CARICA = `
  <div class="carica">
    <div class="testata" data-info="charge_auto">
      <span>Gestione automatica carica</span>
      <span class="badge" data-t="auto"></span>
    </div>
    <div class="griglia">
      ${RIGHE_CARICA.map(([et, k, info]) =>
        `<div class="et" data-info="${info}">${et}</div><div class="v" data-info="${info}" data-t="${k}"></div>`).join("")}
    </div>
  </div>`;

const STILE = `
  :host {
    --scc-solare: var(--energy-solar-color, #ff9800);
    --scc-inverter: var(--primary-color, #03a9f4);
    --scc-casa: var(--energy-non-fossil-color, #0f9d58);
    --scc-batteria: var(--energy-battery-in-color, #f06292);
    --scc-caricatore: #26a69a;
    --scc-rete: var(--energy-grid-consumption-color, #488fc2);
  }
  ha-card { padding: 8px 12px 12px; }
  .titolo { font-size: 1.2em; font-weight: 500; padding: 4px 4px 0; color: var(--primary-text-color); }
  svg { width: 100%; height: auto; display: block; }
  text { fill: var(--primary-text-color); text-anchor: middle; font-family: inherit; }
  text.fine { text-anchor: end; }
  text.inizio { text-anchor: start; }
  .tit { font-size: 12px; font-weight: 600; }
  .val { font-size: 13px; font-weight: 700; }
  .sub { font-size: 10px; fill: var(--secondary-text-color); }
  .stato { font-size: 9px; font-weight: 600; fill: var(--scc-caricatore); letter-spacing: .04em; }
  .nodo { cursor: pointer; }
  .nodo .area { fill: transparent; }
  .nodo .sole, .nodo .scintilla, .nodo .fulmine { opacity: 0; transition: opacity .4s; }
  .nodo.attivo .sole, .nodo.attivo .scintilla, .nodo.in-carica .fulmine { opacity: 1; }
  .nodo .sole-casa, .nodo .batt-casa, .nodo .rete-casa { opacity: 0; transition: opacity .6s; }
  .nodo.da-solare .sole-casa, .nodo.da-batteria .batt-casa, .nodo.da-rete .rete-casa { opacity: 1; }
  .nodo .batt-casa { transition: opacity .6s, transform .6s; }
  .nodo.da-rete .batt-casa { transform: translateX(8px); }
  .nodo .finestra { fill: #78909c; transition: fill .4s; }
  .nodo.attivo .finestra { fill: #ffd54f; }
  .nodo .led { fill: #78909c; }
  .nodo .alone { fill: #00e676; opacity: 0; }
  .nodo.acceso .led { fill: #00e676; }
  .nodo.acceso .alone { animation: scc-led 1.6s ease-in-out infinite; }
  @keyframes scc-led { 0%, 100% { opacity: .15; } 50% { opacity: .6; } }
  .nodo .livello { transition: y .6s, height .6s, fill .6s; }
  .linea { fill: none; stroke: var(--c); stroke-width: 2; opacity: .25; }
  .punti { fill: none; stroke: var(--c); stroke-width: 3.5; stroke-linecap: round;
           stroke-dasharray: 0.1 14; opacity: 0; }
  .attivo .linea { opacity: .55; }
  .attivo .punti { opacity: 1; animation: scc-flusso 1s linear infinite; }
  @keyframes scc-flusso { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -28.2; } }
  .carica { margin: 4px 4px 0; padding: 8px 10px; border-radius: 10px;
            background: var(--secondary-background-color, #f3f3f3); font-size: 12px; }
  .testata { display: flex; justify-content: space-between; align-items: center;
             font-weight: 600; margin-bottom: 6px; cursor: pointer; color: var(--primary-text-color); }
  .badge { font-size: 10px; letter-spacing: .05em; padding: 2px 8px; border-radius: 10px;
           background: var(--scc-caricatore); color: #fff; }
  .badge.spenta { background: var(--disabled-text-color, #9e9e9e); }
  .griglia { display: grid; grid-template-columns: max-content 1fr; gap: 3px 12px; }
  .griglia .et { color: var(--secondary-text-color); cursor: pointer; }
  .griglia .v { color: var(--primary-text-color); cursor: pointer; }
  .piede { font-size: 12px; color: var(--secondary-text-color); padding: 4px 4px 0; }
  .allarme { color: var(--error-color, #db4437); font-weight: 600; }
`;

customElements.define("solar-combo-card", SolarComboCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "solar-combo-card",
  name: "Solar Combo Card",
  description: "Flusso di energia dell'impianto solar-combo: FV, inverter SMG II, JK-BMS, R4850G2, casa e rete",
  preview: true,
});

console.info(`%c SOLAR-COMBO-CARD %c ${VERSION} `,
  "color:#fff;background:#ff9800;font-weight:700", "color:#ff9800;background:#fff");
