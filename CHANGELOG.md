# Novità della Solar Combo Card

Per aggiornare: da HACS apri **Solar Combo Card** e premi **Aggiorna**, poi ricarica la pagina del browser. Se l'hai installata a mano, sostituisci `/config/www/solar-combo-card.js` e cambia la versione nell'URL della risorsa (per esempio `?v=0.13.0`).

## 0.13.0

**Estrattore d'aria del locale inverter.** Sotto i testi dell'inverter può comparire un ventilatore con la scritta «estrattore ON/OFF»: quando l'estrattore è acceso le pale girano in azzurro, da spento è grigio e fermo.

- Perché aggiornare: dalla dashboard vedi subito se l'estrattore è in funzione, per esempio mentre il R4850G2 carica o dopo, finché l'aria in uscita non si raffredda.
- L'estrattore non è un'entità del firmware, quindi va indicato a mano con la nuova chiave `exhaust_fan` sotto `entities` (uno `switch` o un `fan`), per esempio `exhaust_fan: switch.locale_inverter_estrattore_d_aria`. Senza la chiave il ventilatore non compare e la card resta come prima.
- Toccando il ventilatore si apre la finestra dell'entità, da cui puoi accenderlo o spegnerlo; toccando la scritta si apre la Cronologia.

## 0.12.0

**Energia del giorno nella Solar Combo Card.** Sotto lo schema c'è la fascia «Oggi» con quattro riquadri in kWh, azzerati ogni mezzanotte: energia prodotta dal FV, erogata in casa, prelevata dalla rete e immessa in batteria.

- Perché aggiornare: in un colpo d'occhio vedi quanto ha reso il fotovoltaico oggi, quanto ha consumato la casa e quanta energia hai dovuto prendere dalla rete per caricare la batteria.
- I totali vengono dal package `homeassistant/packages/solar_combo_energia.yaml` del progetto solar-combo (`utility_meter` giornalieri, entità `sensor.solar_combo_fv_giorno`, `_casa_giorno`, `_rete_giorno`, `_batteria_carica_giorno`). Se il package non c'è, la fascia non compare.
- Toccando un riquadro si apre la Cronologia della sua energia.
- Nuova opzione `show_daily: false` per nascondere la fascia; nuove chiavi `energy_pv`, `energy_load`, `energy_grid`, `energy_battery_in`.

## 0.11.1

**Flusso del R4850G2 corretto.** Su alcuni R4850G2 la potenza d'uscita (*R4850G2 Output Power*) vale sempre 0 anche mentre carica. La card mostrava allora «0 W», nessun flusso dal R4850G2 alla batteria e una freccia falsa dall'inverter alla batteria. Ora, quando quella potenza è 0 o manca, la card la calcola da tensione × corrente d'uscita.

- Perché aggiornare: con il R4850G2 acceso vedi di nuovo il percorso rete → R4850G2 → batteria → inverter, e la potenza giusta del caricabatterie.
- Il firmware solar-combo aggiornato calcola già la potenza allo stesso modo.

## 0.11.0

**Nuova card del pacco batterie: Solar Combo BMS Card** (`type: custom:solar-combo-bms-card`). È nello stesso file della Solar Combo Card: aggiornando ce l'hai già, basta aggiungerla alla dashboard.

- Perché aggiornare: in una sola card c'è tutto il JK-BMS, con lo stile del display del BMS. Ci sono tensione, corrente e verso (in carica, in scarica, a riposo), l'anello del SOC, la capacità totale e residua, le celle min/max con il loro numero, Δ, le temperature, la potenza, i cicli, gli allarmi e i MOS di carica e scarica. In basso la tensione di ogni cella, con la più alta in azzurro e la più bassa in rosso. Non serve un'altra card da HACS per il BMS.
- Toccando un valore o una cella si apre la Cronologia; le voci senza entità vengono nascoste.
- Con `prefix: solar_offgrid` funziona anche con il firmware solar-offgrid-c3.
- La Solar Combo Card non cambia.

## 0.10.0

**Temperature dell'aria del R4850G2.** Sotto il caricabatterie compare la corrente d'aria della ventola. Entra a sinistra, fredda (azzurra), ed esce a destra, calda (arancio). Accanto ci sono la temperatura dell'aria in ingresso e quella in uscita.

- Perché aggiornare: dalla dashboard si vede subito se il R4850G2 si scalda troppo, per esempio quando l'uscita dell'aria è ostruita o il locale è caldo. Non serve più aprire le entità diagnostiche.
- Quando il R4850G2 è acceso l'aria si muove; in standby resta ferma e sbiadita.
- Toccando una delle due temperature si apre la Cronologia con ingresso e uscita nello stesso grafico.
- Nuove chiavi `charger_temp_in` e `charger_temp_out`, con predefiniti `sensor.{p}_r4850g2_input_temperature` e `sensor.{p}_r4850g2_output_temperature`. Il firmware solar-combo le fornisce già, quindi non serve configurare niente.

## 0.9.0

**Allarmi dell'inverter.** In fondo alla card, sopra gli allarmi del BMS, c'è la riga «Allarmi inverter» con i guasti (*Fault*) e i warning (*Warning*) dell'SMG II. Chiavi `inverter_fault` e `inverter_warning`.

## 0.8.1

Nel pannello della carica, la riga «Avvio» mostra la conferma in secondi («per N s»), oppure «subito» quando la conferma è 0. Segue il parametro *Carica · Conferma avvio*, che nel firmware ora è in secondi.

## 0.8.0

**Ogni valore apre la Cronologia.** Toccando un valore della card, sia nello schema sia nel pannello della carica, si apre la pagina Cronologia di Home Assistant con il grafico delle sue entità. I valori combinati, come tensione · corrente, mostrano tutte le entità nello stesso grafico. Le illustrazioni aprono ancora la finestra dei dettagli.

## 0.7.0

**Totale FV.** PV1 e PV2 confluiscono in un riquadro con la somma dei watt, collegato all'inverter. Ogni tratto si anima quando la sua potenza supera la soglia.

## 0.6.0

**Temperatura del locale inverter.** Sotto l'inverter c'è la riga «locale xx,x °C», letta dalla sonda DS18B20. Chiave `room_temp`.

## 0.5.0

Prima versione pubblicata. Flusso di energia con 2 stringhe FV, inverter, batteria JK-BMS, R4850G2, casa e rete. Le illustrazioni seguono lo stato e sotto lo schema c'è il pannello della gestione automatica della carica.
