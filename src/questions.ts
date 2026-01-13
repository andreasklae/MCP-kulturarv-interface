import { Source } from './types';

export interface Question {
  no: string;
  en: string;
}

// Wikipedia Questions (General World Knowledge) - 33 questions
export const wikipediaQuestions: Question[] = [
  { en: "What is the history of the Colosseum in Rome?", no: "Hva er historien bak Colosseum i Roma?" },
  { en: "How were the Egyptian pyramids actually built?", no: "Hvordan ble de egyptiske pyramidene faktisk bygget?" },
  { en: "What caused the fall of the Roman Empire?", no: "Hva forårsaket Romerrikets fall?" },
  { en: "Who was Cleopatra and why is she famous?", no: "Hvem var Kleopatra og hvorfor er hun berømt?" },
  { en: "What is the story behind the Terracotta Army in China?", no: "Hva er historien bak Terrakottahæren i Kina?" },
  { en: "How did the Silk Road shape world history?", no: "Hvordan formet Silkeveien verdenshistorien?" },
  { en: "What happened to the lost city of Pompeii?", no: "Hva skjedde med den tapte byen Pompeii?" },
  { en: "Why was the Great Wall of China built?", no: "Hvorfor ble Den kinesiske mur bygget?" },
  { en: "What is the mystery of Stonehenge?", no: "Hva er mysteriet med Stonehenge?" },
  { en: "How did the Renaissance change art and science?", no: "Hvordan endret renessansen kunst og vitenskap?" },
  { en: "What was daily life like in ancient Athens?", no: "Hvordan var dagliglivet i det gamle Athen?" },
  { en: "Who built Machu Picchu and why was it abandoned?", no: "Hvem bygde Machu Picchu og hvorfor ble det forlatt?" },
  { en: "What caused the French Revolution?", no: "Hva forårsaket den franske revolusjon?" },
  { en: "How did the Industrial Revolution transform society?", no: "Hvordan forandret den industrielle revolusjon samfunnet?" },
  { en: "What is the history of the Taj Mahal?", no: "Hva er historien bak Taj Mahal?" },
  { en: "Why did the Titanic sink?", no: "Hvorfor sank Titanic?" },
  { en: "What was the significance of the printing press?", no: "Hva var betydningen av trykkpressen?" },
  { en: "How did ancient Romans build their aqueducts?", no: "Hvordan bygde romerne sine akvedukter?" },
  { en: "What happened during the Black Death in Europe?", no: "Hva skjedde under svartedauden i Europa?" },
  { en: "Who were the Mayans and what happened to their civilization?", no: "Hvem var mayaene og hva skjedde med deres sivilisasjon?" },
  { en: "What is the history of the Acropolis in Athens?", no: "Hva er historien bak Akropolis i Athen?" },
  { en: "How did samurai culture shape Japan?", no: "Hvordan formet samuraikulturen Japan?" },
  { en: "What was life like on the Oregon Trail?", no: "Hvordan var livet på Oregon Trail?" },
  { en: "Why is the Mona Lisa so famous?", no: "Hvorfor er Mona Lisa så berømt?" },
  { en: "What caused World War I?", no: "Hva forårsaket første verdenskrig?" },
  { en: "How did the Ottoman Empire rise and fall?", no: "Hvordan oppsto og falt Det osmanske riket?" },
  { en: "What is the history of chocolate?", no: "Hva er sjokoladens historie?" },
  { en: "Who was Genghis Khan?", no: "Hvem var Djengis Khan?" },
  { en: "How did coffee spread around the world?", no: "Hvordan spredte kaffe seg rundt i verden?" },
  { en: "What is the story of the Trojan War?", no: "Hva er historien om Trojanerkrigen?" },
  { en: "Why did the Berlin Wall fall?", no: "Hvorfor falt Berlinmuren?" },
  { en: "How were medieval castles designed for defense?", no: "Hvordan ble middelalderens slott designet for forsvar?" },
  { en: "What is the history of democracy in ancient Greece?", no: "Hva er historien om demokrati i det gamle Hellas?" },
];

// SNL Questions (Norwegian History & Culture) - 33 questions
export const snlQuestions: Question[] = [
  { no: "Hva er historien bak Norges nasjonaldag, 17. mai?", en: "What is the history behind Norway's national day, May 17th?" },
  { no: "Hvordan ble Oslo hovedstad i stedet for Bergen eller Trondheim?", en: "How did Oslo become the capital instead of Bergen or Trondheim?" },
  { no: "Hva var betydningen av unionsoppløsningen i 1905?", en: "What was the significance of the dissolution of the union in 1905?" },
  { no: "Hvordan påvirket svartedauden det norske samfunnet?", en: "How did the Black Death affect Norwegian society?" },
  { no: "Hva er historien bak bunaden og dens regionale varianter?", en: "What is the history behind the bunad and its regional variants?" },
  { no: "Hvordan utviklet den norske oljeindustrien seg fra 1969?", en: "How did the Norwegian oil industry develop from 1969?" },
  { no: "Hva er opprinnelsen til rosemaling som kunstform?", en: "What is the origin of rosemaling as an art form?" },
  { no: "Hvordan ble det norske skolesystemet etablert?", en: "How was the Norwegian school system established?" },
  { no: "Hva var Kalmarunionens betydning for Norge?", en: "What was the significance of the Kalmar Union for Norway?" },
  { no: "Hvordan utviklet norsk friluftsliv seg som kulturell tradisjon?", en: "How did Norwegian outdoor life develop as a cultural tradition?" },
  { no: "Hva er historien bak de norske stavkirkene?", en: "What is the history behind the Norwegian stave churches?" },
  { no: "Hvordan påvirket dansketiden norsk kultur og språk?", en: "How did the Danish period affect Norwegian culture and language?" },
  { no: "Hva var hekseprosessene i Norge på 1600-tallet?", en: "What were the witch trials in Norway in the 1600s?" },
  { no: "Hvordan ble den norske grunnloven utformet i 1814?", en: "How was the Norwegian constitution drafted in 1814?" },
  { no: "Hva er historien bak Hurtigruten?", en: "What is the history behind Hurtigruten?" },
  { no: "Hvordan utviklet norsk fiskeriindustri seg gjennom historien?", en: "How did the Norwegian fishing industry develop throughout history?" },
  { no: "Hva var motstandsbevegelsens rolle under andre verdenskrig?", en: "What was the role of the resistance movement during World War II?" },
  { no: "Hvordan ble nasjonalromantikken uttrykt i norsk kunst?", en: "How was national romanticism expressed in Norwegian art?" },
  { no: "Hva er historien bak det norsk matkonserveringsindustrien?", en: "What is the history behind the Norwegian food preservation industry?" },
  { no: "Hvordan påvirket reformasjonen det religiøse livet i Norge?", en: "How did the Reformation affect religious life in Norway?" },
  { no: "Hva var hanseatenes rolle i Bergen?", en: "What was the role of the Hanseatic merchants in Bergen?" },
  { no: "Hvordan utviklet den norske skipsfartsindustrien seg?", en: "How did the Norwegian shipping industry develop?" },
  { no: "Hva er historien bak norsk emigrasjon til Amerika?", en: "What is the history behind Norwegian emigration to America?" },
  { no: "Hvordan ble det norske helsevesenet etablert?", en: "How was the Norwegian healthcare system established?" },
  { no: "Hva var betydningen av laksefisket i norsk historie?", en: "What was the significance of salmon fishing in Norwegian history?" },
  { no: "Hvordan utviklet norsk arkitektur seg fra middelalderen til i dag?", en: "How did Norwegian architecture develop from the Middle Ages to today?" },
  { no: "Hva er opprinnelsen til tradisjonelle norske matretter som lutefisk og rakfisk?", en: "What is the origin of traditional Norwegian dishes like lutefisk and rakfisk?" },
  { no: "Hvordan påvirket industrialiseringen norske kystsamfunn?", en: "How did industrialization affect Norwegian coastal communities?" },
  { no: "Hva var seterbrukets betydning i norsk landbruk?", en: "What was the significance of summer farming in Norwegian agriculture?" },
  { no: "Hvordan utviklet samisk kultur seg i Norge?", en: "How did Sami culture develop in Norway?" },
  { no: "Hva er historien bak norske festninger og forsvarsverker?", en: "What is the history behind Norwegian fortresses and defense works?" },
  { no: "Hvordan ble det norske jernbanenettet bygget ut?", en: "How was the Norwegian railway network built?" },
  { no: "Hva var kvinnenes rolle i det norske samfunnet gjennom historien?", en: "What was the role of women in Norwegian society throughout history?" },
];

// Riksantikvaren Questions (Cultural Heritage Sites & Locations) - 34 questions
export const riksantikvarenQuestions: Question[] = [
  { en: "What Viking burial mounds can I visit near Oslo?", no: "Hvilke vikinggravhauger kan jeg besøke nær Oslo?" },
  { en: "Are there any ancient rock carvings in the Trondheim area?", no: "Finnes det gamle helleristninger i Trondheim-området?" },
  { en: "What medieval ruins can I explore in Bergen?", no: "Hvilke middelalderruiner kan jeg utforske i Bergen?" },
  { en: "Where are the best preserved wooden buildings from the 1700s?", no: "Hvor finner jeg de best bevarte trebygningene fra 1700-tallet?" },
  { en: "What WWII fortifications can I see along the Norwegian coast?", no: "Hvilke festninger fra andre verdenskrig kan jeg se langs norskekysten?" },
  { en: "Are there any Iron Age settlements I can visit in Vestland?", no: "Finnes det bosetninger fra jernalderen jeg kan besøke i Vestland?" },
  { en: "What historic lighthouses are open to visitors?", no: "Hvilke historiske fyrtårn er åpne for besøkende?" },
  { en: "Where can I find ancient stone churches in Norway?", no: "Hvor kan jeg finne gamle steinkirker i Norge?" },
  { en: "What industrial heritage sites exist in Telemark?", no: "Hvilke industrielle kulturminner finnes i Telemark?" },
  { en: "Are there any preserved mining towns besides Røros?", no: "Finnes det andre bevarte gruvebyer enn Røros?" },
  { en: "What historic farms can I visit in the fjord regions?", no: "Hvilke historiske gårder kan jeg besøke i fjordområdene?" },
  { en: "Where are the most significant Bronze Age finds in Norway?", no: "Hvor er de viktigste bronsealder-funnene i Norge?" },
  { en: "What coastal fortresses were built to defend against Swedish attacks?", no: "Hvilke kystfestninger ble bygget for å forsvare mot svenske angrep?" },
  { en: "Are there any preserved fishing villages from the 1800s?", no: "Finnes det bevarte fiskevær fra 1800-tallet?" },
  { en: "What medieval monasteries can I explore?", no: "Hvilke middelalderske klostre kan jeg utforske?" },
  { en: "Where can I see traditional Sami cultural sites?", no: "Hvor kan jeg se tradisjonelle samiske kulturminner?" },
  { en: "What heritage sites exist along the old pilgrimage routes to Nidaros?", no: "Hvilke kulturminner finnes langs de gamle pilegrimsveiene til Nidaros?" },
  { en: "Are there any preserved trading posts from the Hanseatic period?", no: "Finnes det bevarte handelssteder fra hansatiden?" },
  { en: "What historic watermills still exist in Norway?", no: "Hvilke historiske vannmøller finnes fortsatt i Norge?" },
  { en: "Where can I find ancient burial cairns in Rogaland?", no: "Hvor kan jeg finne gamle gravrøyser i Rogaland?" },
  { en: "What royal estates are open to the public?", no: "Hvilke kongelige eiendommer er åpne for publikum?" },
  { en: "Are there any preserved charcoal burning sites?", no: "Finnes det bevarte kullmiler?" },
  { en: "What historic shipwrecks can be viewed or visited?", no: "Hvilke historiske skipsvrak kan man se eller besøke?" },
  { en: "Where are the oldest standing buildings in each Norwegian county?", no: "Hvor er de eldste stående bygningene i hvert norske fylke?" },
  { en: "What fortress ruins can I explore in Østfold?", no: "Hvilke festningsruiner kan jeg utforske i Østfold?" },
  { en: "Are there any preserved tar production sites?", no: "Finnes det bevarte tjæremiler?" },
  { en: "What heritage railway stations still exist?", no: "Hvilke kulturminne-jernbanestasjoner finnes fortsatt?" },
  { en: "Where can I find petroglyphs (helleristninger) in Northern Norway?", no: "Hvor kan jeg finne helleristninger i Nord-Norge?" },
  { en: "What historic manor houses can I visit near Kristiansand?", no: "Hvilke historiske herregårder kan jeg besøke nær Kristiansand?" },
  { en: "Are there any preserved copper mining sites in the mountains?", no: "Finnes det bevarte kobbergruver i fjellene?" },
  { en: "What coastal defense towers remain from the Napoleonic era?", no: "Hvilke kysttårn fra Napoleonstiden finnes fortsatt?" },
  { en: "Where are the oldest bridges in Norway?", no: "Hvor er de eldste broene i Norge?" },
  { en: "What traditional boathouses (naust) are protected as heritage sites?", no: "Hvilke tradisjonelle naust er fredet som kulturminner?" },
  { en: "Where can I find heritage sites related to the Norwegian resistance movement?", no: "Hvor kan jeg finne kulturminner knyttet til den norske motstandsbevegelsen?" },
];

// Get questions by source
export function getQuestionsBySource(source: Source): Question[] {
  switch (source) {
    case 'wikipedia':
      return wikipediaQuestions;
    case 'snl':
      return snlQuestions;
    case 'riksantikvaren':
      return riksantikvarenQuestions;
  }
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Selected question with source info
export interface SelectedQuestion {
  source: Source;
  index: number;
}

// Get random question indices based on selected sources
export function getRandomQuestionIndices(sources: Source[], count: number = 6): SelectedQuestion[] {
  if (sources.length === 0) return [];
  
  const questionsPerSource = Math.floor(count / sources.length);
  const remainder = count % sources.length;
  
  const selections: SelectedQuestion[] = [];
  
  sources.forEach((source, sourceIdx) => {
    const sourceQuestions = getQuestionsBySource(source);
    const indices = Array.from({ length: sourceQuestions.length }, (_, i) => i);
    const shuffledIndices = shuffleArray(indices);
    
    // Add extra question to first sources if there's a remainder
    const numToTake = questionsPerSource + (sourceIdx < remainder ? 1 : 0);
    
    for (let i = 0; i < numToTake && i < shuffledIndices.length; i++) {
      selections.push({ source, index: shuffledIndices[i] });
    }
  });
  
  // Shuffle the final list so sources are mixed
  return shuffleArray(selections);
}

// Get translated question from selection
export function getQuestionText(selection: SelectedQuestion, language: 'no' | 'en'): string {
  const questions = getQuestionsBySource(selection.source);
  return questions[selection.index][language];
}
