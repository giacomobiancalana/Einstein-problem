import * as util from 'util';
//const util = require('util');


// Problema di Einstein

// Tutte le proprietà, manca solo la posizione della casa ma quella non la faremo comparire come proprietà, ma come posizione
// dell'elemento nell'array della soluzione.
const COL = {
  GIALLA: "giall",
  ROSSA: "rossa",
  BLUE: "bluee",
  VERDE: "verde",
  BIANCA: "bianc",
} as const;
type Colore = (typeof COL)[keyof typeof COL];
const coloriArray: readonly Colore[] = Object.values(COL);

const NAZ = {
  SVEDESE: "svede",
  TEDESCA: "tedes",
  NORVEGESE: "norve",
  INGLESE: "ingle",
  DANESE: "danes",
} as const;
type Nazionalita = (typeof NAZ)[keyof typeof NAZ];
const nazionalitaArray: readonly Nazionalita[] = Object.values(NAZ);

const BEV = {
  ACQUA: "acqua",
  TEA: "teaea",
  LATTE: "latte",
  CAFFE: "caffé",
  BIRRA: "birra",
} as const;
type Bevanda = (typeof BEV)[keyof typeof BEV];;
const bevandeArray: readonly Bevanda[] = Object.values(BEV);

const SIG = {
  DUNHILL: "Dunhi",
  BLENDS: "Blend",
  PALL_MALL: "PallM",
  PRINCE: "Princ",
  BLU_MASTER: "BluMa",
} as const;
type Sigaretta = (typeof SIG)[keyof typeof SIG];
const sigaretteArray: readonly Sigaretta[] = Object.values(SIG);

const ANIM = {
  GATTO: "gatto",
  CAVALLO: "caval",
  UCCELLO: "uccel",
  PESCE: "pesce",
  CANE: "canee",
} as const;
type Animale = (typeof ANIM)[keyof typeof ANIM];
const animaliArray = ['gatto', 'caval', 'uccel', 'pesce', 'canee'] as const;


//type ConfigCasa = { colore: Colore, nazionalita: Nazionalita, bevanda: Bevanda, sigaretta: Sigaretta, animale: Animale };
type ConfigCasa = [Colore, Nazionalita, Bevanda, Sigaretta, Animale];

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
      const indexInglese = attualeNazioniPerm.findIndex(el => el === NAZ.INGLESE);
      const indexNorvegese = attualeNazioniPerm.findIndex(el => el === NAZ.NORVEGESE);
      const indexCasaBlu = attualeColorPerm.findIndex(el => el === COL.BLUE);
      const indexCasaVerde = attualeColorPerm.findIndex(el => el === COL.VERDE);
      const indexCasaBianca = attualeColorPerm.findIndex(el => el === COL.BIANCA);
      if (attualeColorPerm[indexInglese] === COL.ROSSA && indexNorvegese === 0 && Math.abs(indexCasaBlu-indexNorvegese) === 1 &&
        (indexCasaBianca - indexCasaVerde) === 1) {
        // Possiamo anche provare (indexCasaBianca - indexCasaVerde) >= 1 -> soluzione/i diversa/e da quella solita!!
        sol[size] = [attualeColorPerm, attualeNazioniPerm];
        size++;
      };
    };
  };
  // console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  // console.log(size);
  return sol;
};


/** Questa funzione deve aggiungere elementi alle permutazioni e altre permutazioni, e filtrare */
function vincolBevSiga(): [Colore[], Nazionalita[], Bevanda[], Sigaretta[]][] {
  let sol: [Colore[], Nazionalita[], Bevanda[], Sigaretta[]][] = [];
  let size = 0;
  const tempSol: [Colore[], Nazionalita[]][] = sottoSpazioVincoli_1_4_9_14();
  for (const s of tempSol) {
    for (let i = 0; i < bevandePerm.length; i++) {
      const attualeBevPerm = bevandePerm[i];
      for (let j = 0; j < sigaPerm.length; j++) {
        const attualeSigaPerm = sigaPerm[j];
        const indexDanese = s[1].findIndex(el => el === NAZ.DANESE);
        const indexTedesco = s[1].findIndex(el => el === NAZ.TEDESCA)
        const indexCasaVerde = s[0].findIndex(el => el === COL.VERDE);
        const indexCasaGialla = s[0].findIndex(el => el === COL.GIALLA);
        const indexBirra = attualeBevPerm.findIndex(el => el === BEV.BIRRA);
        const indexAcqua = attualeBevPerm.findIndex(el => el === BEV.ACQUA);
        const indexBlend = attualeSigaPerm.findIndex(el => el === SIG.BLENDS);
        if (attualeBevPerm[indexDanese] === BEV.TEA && attualeSigaPerm[indexCasaGialla] === SIG.DUNHILL && attualeBevPerm[indexCasaVerde] === BEV.CAFFE &&
          attualeBevPerm[2] === BEV.LATTE && attualeSigaPerm[indexBirra] === SIG.BLU_MASTER && attualeSigaPerm[indexTedesco] === SIG.PRINCE &&
          // (attualeBevPerm[indexBlend - 1] === BEV.ACQUA || attualeBevPerm[indexBlend + 1] === BEV.ACQUA) oppure
          Math.abs(indexAcqua - indexBlend) === 1) {
          sol[size] = [...s, attualeBevPerm, attualeSigaPerm];
          size++;
        };
      };
    };
  };
  // console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  // console.log(size);
  return sol;
};

function lastVincoli(): [Colore[], Nazionalita[], Bevanda[], Sigaretta[], Animale[]][] {
  let sol: [Colore[], Nazionalita[], Bevanda[], Sigaretta[], Animale[]][] = [];
  let size = 0;
  const tempSol = vincolBevSiga();
  for (const s of tempSol) {
    for (let i = 0; i < animaliPerm.length; i++) {
      const attualeAnimaliPerm = animaliPerm[i];
      const indexSvedese = s[1].findIndex(el => el === NAZ.SVEDESE);
      const indexPallMall = s[3].findIndex(el => el === SIG.PALL_MALL);
      const indexBlends = s[3].findIndex(el => el === SIG.BLENDS);
      const indexGatto = attualeAnimaliPerm.findIndex(el => el === ANIM.GATTO);
      const indexDunhill = s[3].findIndex(el => el === SIG.DUNHILL);
      const indexCavallo = attualeAnimaliPerm.findIndex(el => el === ANIM.CAVALLO);
      if (attualeAnimaliPerm[indexSvedese] === ANIM.CANE && attualeAnimaliPerm[indexPallMall] === ANIM.UCCELLO &&
        Math.abs(indexBlends - indexGatto) === 1 && Math.abs(indexDunhill - indexCavallo) === 1) {
        sol[size] = [...s, attualeAnimaliPerm];
        size++;
      };
    };
  };
  console.log(util.inspect(sol, { showHidden: false, depth: null, colors: true }));
  console.log(size);
  return sol;
};

lastVincoli();






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

function oldCreateSottoSpazioSol() {
  let sol: any[][][][] = [];
  let size = 0;
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

/** Provo a elencare tutte le configurazioni possibili di soluzione */
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
