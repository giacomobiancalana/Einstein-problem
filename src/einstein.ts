import * as util from 'util';
//const util = require('util');
// Problema di Einstein

// Tutte le proprietà, manca solo la posizione della casa ma quella non la faremo comparire come proprietà, ma come posizione
// della casa nell'array della soluzione.
const coloriArray = ["giall", "rossa", "bluee", "verde", "bianc"] as const;
type Colore = typeof coloriArray[number];
// const COLORI = {
//   GIALLA: "giall",
//   ROSSA: "rossa"
// } as const;
const nazionalitaArray = ['svede', 'tedes', 'norve', 'ingle', 'danes'] as const;
type Nazionalita = typeof nazionalitaArray[number];
const bevandeArray = ['acqua', 'teaea', 'latte', 'caffé', 'birra'] as const;
type Bevanda = typeof bevandeArray[number];
const sigaretteArray = ['Dunhi', 'Blend', 'PallM', 'Princ', 'BluMa'] as const;
type Sigaretta = typeof sigaretteArray[number];
const animaliArray = ['gatto', 'caval', 'uccel', 'pesce', 'canee'] as const;
type Animale = typeof animaliArray[number];
// PAROLE SCRITTE COSI' PER FARLE TUTTE A 5 CARATTERI: SI VISUALIZZANO MEGLIO COSI'

//type ConfigCasa = { colore: Colore, nazionalita: Nazionalita, bevanda: Bevanda, sigaretta: Sigaretta, animale: Animale };
type ConfigCasa = [Colore, Nazionalita, Bevanda, Sigaretta, Animale];

type ConfigSolution = [ConfigCasa, ConfigCasa, ConfigCasa, ConfigCasa, ConfigCasa]


// Provo a elencare tutte le configurazioni possibili di soluzione

/** Restituisce tutte le possibili permutazioni di un array. */
function permLoop<T extends string>(arr: T[]): T[][] {  // accum è un insieme di permutazioni
  let accum: T[][] = [[]];
  for (const r of arr) {
    let res: T[][] = [];  // array vuoto a cui aggiungere le nuove permutazioni
    for (let i = 0; i < accum.length; i++) {
      for (let j = 0; j < accum[i].length + 1; j++) {
        const tempInternalArray = [...accum[i]];
        tempInternalArray.splice(j, 0, r);
        res.push(tempInternalArray);
      }
    };
    accum = res;
  };
  return accum;
};

const colorPerm = permLoop<Colore>([...coloriArray]);
const nazioniPerm = permLoop<Nazionalita>([...nazionalitaArray]);
const bevandePerm = permLoop<Bevanda>([...bevandeArray]);
const sigaPerm = permLoop<Sigaretta>([...sigaretteArray]);
const animaliPerm = permLoop<Animale>([...animaliArray]);

function sottoSpazioVincoli_1_4_9_14(): [Colore[], Nazionalita[]][] {  // Questa funzione in effetti fa due cose insieme: crea il sottospazio delle soluzioni e
  // pone i vincoli mano a mano, invece che creare il sottospazio prima e poi filtrare le soluzioni

  let sol: [Colore[], Nazionalita[]][] = [];
  let size = 0;
  for (let i = 0; i < colorPerm.length; i++) {
    const attualeColorPerm = colorPerm[i];
    for (let j = 0; j < nazioniPerm.length; j++){
      const attualeNazioniPerm = nazioniPerm[j];
      const indexInglese = attualeNazioniPerm.findIndex(el => el === 'ingle');
      const indexNorvegese = attualeNazioniPerm.findIndex(el => el === 'norve');
      const indexCasaBlu = attualeColorPerm.findIndex(el => el === 'bluee');
      const indexCasaVerde = attualeColorPerm.findIndex(el => el === 'verde');
      const indexCasaBianca = attualeColorPerm.findIndex(el => el === 'bianc');
      if (attualeColorPerm[indexInglese] === 'rossa' && indexNorvegese === 0 && Math.abs(indexCasaBlu-indexNorvegese) === 1 &&
        (indexCasaBianca - indexCasaVerde) === 1
      ) {
        // TODO: possiamo anche provare (indexCasaBianca - indexCasaVerde) >= 1 -> soluzione/i diversa/e da quella solita!!
        sol[size] = [attualeColorPerm, attualeNazioniPerm];
        size++;
      };
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
  return sol;
};
// ESECUZIONE
let tempSol = sottoSpazioVincoli_1_4_9_14();

/** Questa funzione deve aggiungere elementi alle permutazioni e altre permutazioni, e filtrare */
function vincolBevSiga(tempSol: [Colore[], Nazionalita[]][]): [Colore[], Nazionalita[], Bevanda[], Sigaretta[]][] {
  let sol: [Colore[], Nazionalita[], Bevanda[], Sigaretta[]][] = [];
  let size = 0;
  for (const s of tempSol) {
    for (let i = 0; i < bevandePerm.length; i++) {
      const attualeBevPerm = bevandePerm[i];
      for (let j = 0; j < sigaPerm.length; j++) {
        const attualeSigaPerm = sigaPerm[j];
        const indexDanese = s[1].findIndex(el => el === 'danes');
        const indexTedesco = s[1].findIndex(el => el === 'tedes')
        const indexCasaVerde = s[0].findIndex(el => el === 'verde');
        const indexCasaGialla = s[0].findIndex(el => el === 'giall');
        const indexBirra = attualeBevPerm.findIndex(el => el === 'birra');
        const indexAcqua = attualeBevPerm.findIndex(el => el === 'acqua');
        const indexBlend = attualeSigaPerm.findIndex(el => el === 'Blend');
        if (attualeBevPerm[indexDanese] === 'teaea' && attualeSigaPerm[indexCasaGialla] === 'Dunhi' && attualeBevPerm[indexCasaVerde] === 'caffé' &&
          attualeBevPerm[2] === 'latte' && attualeSigaPerm[indexBirra] === 'BluMa' && attualeSigaPerm[indexTedesco] === 'Princ' &&
          // (attualeBevPerm[indexBlend - 1] === 'acqua' || attualeBevPerm[indexBlend + 1] === 'acqua') oppure
          Math.abs(indexAcqua - indexBlend) === 1
        ) {
          sol[size] = [...s, attualeBevPerm, attualeSigaPerm];
          size++;
        };
      };
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
  return sol;
};

let temp2Sol = vincolBevSiga(tempSol);

// TODO: vincoli successivi? e creiamo le relative funzioni










// VECCHIE FUNZIONI

function createSottoSpazioSol() {
  let sol: any[][][] = [];  //TODO: tipizza meglio
  let size = 0;
  // let yy: [[Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita]][];
  for (let i = 0; i < colorPerm.length; i++) {
    for (let j = 0; j < nazioniPerm.length; j++){
      sol[size] = [colorPerm[i], nazioniPerm[j]]  // array di una configurazione
      size++;
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
  return sol;
};

/** Da non utilizzare con più di 3 perms (array di permitazioni): Errore -> "JavaScript heap out of memory" */
function createSpazioSol() {
  const u = performance.now();
  let sol: any[][][] = [];
  let size = 0;
  // let yy: [[Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita]][];
  for (let i = 0; i < colorPerm.length; i++) {
    for (let j = 0; j < nazioniPerm.length; j++){
      for (let k = 0; k < bevandePerm.length; k++){
        // for (let h = 0; h < sigaPerm.length; h++){
        //   for (let m = 0; m < animaliPerm.length; m++){
            sol[size] = [colorPerm[i], nazioniPerm[j], bevandePerm[k]];  // array di una configurazione
            size++;
        //   };
        // };
      };
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
};
// ESECUZIONE
// createSpazioSol();

//////////////////////

function oldCreateSpazioSol() {
  let sol: any[][][][] = [];
  let size = 0;
  // let yy: [[Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita]][];
  for (let i = 0; i < colorPerm.length; i++) {
    sol[i] = [];
    for (let j = 0; j < nazioniPerm.length; j++){
      sol[i][j] = [colorPerm[i], nazioniPerm[j]]
      size++;
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
};

function oldCreateSpazioSolDiversaVisual() {
  let sol: any[][][][] = [];
  let size = 0;
  // let yy: [[Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita], [Colore, Nazionalita]][];
  for (let i = 0; i < colorPerm.length; i++) {
    sol[i] = [];
    for (let j = 0; j < nazioniPerm.length; j++){
      sol[i][j] = [];
      for (let k = 0; k < colorPerm[i].length; k++) {
        sol[i][j].push([colorPerm[i][k], nazioniPerm[j][k]]);
      };
      size++;
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
};

function computePossibiliCase() {
  let possibiliCase: ConfigCasa[] = [];
  let numPossibiliCase = 0;
  for (const col of coloriArray) {
    for (const naz of nazionalitaArray) {
      for (const bev of bevandeArray) {
        for (const sig of sigaretteArray) {
          for (const ani of animaliArray) {
            possibiliCase.push([col, naz, bev, sig, ani])
            numPossibiliCase++;
          };
        };
      };
    };
  };
  
  console.log(`Le case possibili sono ${numPossibiliCase}.`);
  console.log('Ecco le possibiliCase:');
  console.dir(possibiliCase, { showHidden: true, depth: null });
};
