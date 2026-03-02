import type { RuleSection } from './types';
import type { CardId } from '../types';

const card = (cardId: CardId, labelOverride?: string) =>
  labelOverride ? `{{card:${cardId}|${labelOverride}}}` : `{{card:${cardId}}}`;
const gasMask = (labelOverride?: string) =>
  labelOverride ? `{{gasMask|${labelOverride}}}` : '{{gasMask}}';
const tunnel = (labelOverride?: string) =>
  labelOverride ? `{{tunnel|${labelOverride}}}` : '{{tunnel}}';

export const RULES_CONTENT_CZ: RuleSection[] = [
  {
    title: 'O hře',
    blocks: [
      { kind: 'paragraph', text: `Mafie je společenská hra určená pro 2–20 osob.` },
      { kind: 'paragraph', text: `Hráči se dělí na dvě frakce: ${card('Mafia', 'Mafiány')} a Město (běžní občané). ${card('Mafia', 'Mafie')} vyhrává, když eliminuje všechny občany, zatímco Město vítězí, jakmile se zbaví ${card('Mafia', 'Mafie')}.` },
      { kind: 'paragraph', text: 'Hra je založena na dedukci, blafování a šikovném využívání schopností karet.' }
    ]
  },
  {
    title: 'Začátek hry',
    blocks: [
      { kind: 'paragraph', text: 'Na začátku partie obdrží každý hráč stejný počet karet.' },
      { kind: 'paragraph', text: 'Před první nocí by se hráči měli seznámit s funkcemi svých nočních karet.' },
      { kind: 'paragraph', text: `Systém rozdávání karet má pojistky proti extrémně nespravedlivým kombinacím (např. přidělení všech ${card('CloudWalker', 'Mrákošlapů')} jednomu hráči). Podrobnosti naleznete v sekci „Pravidla vyvážení karet“.` }
    ]
  },
  {
    title: 'Noc',
    blocks: [
      { kind: 'paragraph', text: 'Když Moderátor vyhlásí noc, všichni hráči zavřou oči. Následně moderátor postupně vyvolává aktivní postavy a ptá se na použití schopností a výběr cíle. Probuzení hráči odpovídají tiše pomocí gest hlavou nebo rukama.' },
      { kind: 'paragraph', text: 'Noci se dělí na sudé a liché – na pořadí noci závisí, které karty se budí a v jakém pořadí.' },
      { kind: 'paragraph', text: 'Podrobné schéma buzení nočních a denních rolí naleznete v sekci „Pořadí buzení“.' }
    ],
    subsections: [
      {
        title: `První noc - porada ${card('Mafia', 'Mafie')}`,
        blocks: [
          { kind: 'paragraph', text: `Na začátku první noci moderátor vzbudí celou ${card('Mafia', 'Mafii')}. Je to jediný okamžik, kdy se mohou ${card('Mafia', 'Mafiáni')} beze slov dohodnout na strategii a pořadí eliminace. Po skončení porady si ${card('Mafia', 'Mafie')} opět zakryje oči a začíná standardní noční sekvence.` }
        ]
      }
    ]
  },
  {
    title: 'Den',
    blocks: [
      { kind: 'paragraph', text: 'Ráno se město probouzí, hráči otevírají oči a Moderátor přednese hlášení z noci.' },
      { kind: 'paragraph', text: 'Eliminovaní hráči končí svou účast ve hře – od této chvíle nemohou mluvit ani se účastnit hlasování.' },
      {
        kind: 'list',
        ordered: true,
        title: 'Průběh dne:',
        items: [
          'Moderátor přečte zprávu o nočních událostech.',
          `Hráči vznášejí obvinění proti osobám podezřelým z příslušnosti k ${card('Mafia', 'Mafii')} s cílem odsoudit je k smrti na šibenici.`,
          `Obvinění hráči pronášejí obhajobu a snaží se přesvědčit ostatní o své nevině. Pokud ${card('GhostBobo', 'Duch Bobo')} některému z obviněných odebral hlas, tento hráč určí osobu (advokáta), jejímž úkolem je obhajovat obviněného pomocí tlumočení jeho mimiky a gest.`,
          `Moderátor vyjmenuje obviněné. Je-li kandidát pouze jeden, hlasuje se dvakrát: nejprve pro a poté proti jeho popravě. Je-li kandidátů více, hlasuje se postupně pouze pro smrt každého z nich. Při každém hlasování moderátor odpočítává: „Kdo hlasuje [volba], zvedněte ruku za tři, dva, jedna.“ Hlasovat mohou všichni (včetně obviněných), ledaže jim ${card('Judge', 'Soudce')} toto právo odebral.`,
          ` Jakmile skončí hlasování, město jde spát.`
        ]
      },
      { kind: 'paragraph', text: `Některé role upravují sílu hlasu: hlas ${card('Meciar', 'Mečiara')} se počítá dvakrát, zatímco počet hlasů pro smrt ${card('Kovac', 'Kováče')} se snižuje o jeden. ${card('Communist', 'Komunista')} může jednou za hru zrušit privilegia ${card('Meciar', 'Mečiara')}, ${card('Kovac', 'Kováče')}, ${card('Judge', 'Soudce')} a cenzuru ${card('GhostBobo', 'Ducha Bobo')}, čímž srovná práva všech hráčů.` },
      { kind: 'paragraph', text: `Moderátor počítá hlasy ručně a sám zohledňuje bonus ${card('Meciar', 'Mečiara')} a modifikátor ${card('Kovac', 'Kováče')}. Aplikace pouze zobrazuje ikony u příslušných rolí, takže moderátor musí výsledek sám upravit.` },
      { kind: 'paragraph', text: 'V případě remízy mohou dotčení kandidáti pronést závěrečnou obhajobu, pokud si to přejí. Následuje mezi nimi rozhodující hlasování stejným způsobem jako předtím. Pokud dojde k druhé remíze, hlasování okamžitě končí a nikdo není popraven.' },
      { kind: 'paragraph', text: `Před vyhlášením konečného rozsudku může ${card('Astronomer', 'Astronom')} použít svou schopnost k okamžitému ukončení dne bez smrti odsouzeného.` }
    ]
  },
  {
    title: 'Obranná pravidla',
    blocks: [
      { kind: 'paragraph', text: `Hráči mají možnosti obrany proti smrti, které se aktivují automaticky. Použití karty ${card('CloudWalker', 'Mrákošlap')}, ${card('Immunity', 'Imunita')}, ${card('KevlarVest', 'Kevlar')}, ${card('Mirror', 'Zrcadlo')} nebo ${card('RopeWalker', 'Provazochodec')} způsobí její nevratnou ztrátu.` },
    ],
    subsections: [
      {
        title: tunnel('Tunel'),
        blocks: [
          { kind: 'paragraph', text: 'Pokud je zasažen první označený hráč, kulka se přesune tunelem k druhému. Pokud od jednoho hráče vede více tunelů, kulka se rozdělí na úlomky, které proletí všemi tunely (se zachováním vlastností normální kulky). Kulka ani úlomky nemohou proletět stejným tunelem dvakrát. V případě existence dvou nebo tří tunelů vedoucích stejným směrem mezi týmiž hráči se kulka nedělí, ale letí tunelem vytvořeným nejdříve.' }
        ]
      },
      {
        title: gasMask('Plynová maska'),
        blocks: [
          { kind: 'paragraph', text: `Držitelé karet ${card('Mage', 'Mág 2')}, ${card('MadGunman', 'Šílený Střelec 2')} a ${card('GhostBobo', 'Duch Bobo')} jsou vybaveni ${gasMask('Plynová maska')}, která chrání před ${card('Sand', 'Pískem')} a zápachem ${card('Sock', 'Ponožky')}.` }
        ]
      }
    ]
  },
  {
    title: 'Obranná pravidla – noc',
    blocks: [
      { kind: 'paragraph', text: `Každý noční útok je ověřován systémem ochran v určitém pořadí – aktivace jedné z bariér přeruší kontrolu ostatních. Před seznamem priorit se vždy kontroluje, zda ${card('Matrix')} nezachytil kulku.` },
      { kind: 'paragraph', text: 'Aplikace zpracovává útoky podle níže uvedené hierarchie, ale pořadí událostí v závěrečné zprávě je náhodně promícháno, aby byla ztížena identifikace střelců.' }
    ],
    subsections: [
      {
        title: `a) Kulka od ${card('Mafia', 'Mafie')}`,
        blocks: [
          { kind: 'list', title: `Střílí ${card('Mafia', 'Mafián')} s nejvyšším číslem:`, ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zrcadlo'), card('Slime', 'Slina'), card('AlCapone', 'Al Capone'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kevlar'), card('CloudWalker', 'Mrákošlap')] }
        ]
      },
      {
        title: `b) Kulka od ${card('MadGunman', 'Šíleného Střelce')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zrcadlo'), card('Slime', 'Slina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kevlar'), card('CloudWalker', 'Mrákošlap')] }
        ]
      },
      {
        title: `c) Kulka od ${card('Sniper', 'Snipera')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zrcadlo'), card('Slime', 'Slina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kevlar'), card('CloudWalker', 'Mrákošlap')] }
        ]
      },
      {
        title: `d) Zápach ${card('Sock', 'Ponožky')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [gasMask('Plynová maska'), card('Doctor', 'Doktor'), card('CloudWalker', 'Mrákošlap')] }
        ]
      },
      {
        title: `e) Kulka od ${card('Matrix', 'Matrixe')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('KevlarVest', 'Kevlar'), card('CloudWalker', 'Mrákošlap')] }
        ]
      }
    ]
  },
  {
    title: 'Obranná pravidla – den',
    blocks: [
      { kind: 'paragraph', text: `Ve dne obrana také funguje automaticky a řeší se před samotnou smrtí hráče. Pokud ${card('BlindExecutioner', 'Slepý Kat')} určil náhradní oběť, k výměně cílů dochází před použitím štítů.` }
    ],
    subsections: [
      {
        title: 'a) Odsouzení při hlasování',
        blocks: [
          { kind: 'list', ordered: true, items: [card('RopeWalker', 'Provazochodec'), card('Immunity', 'Imunita'), card('CloudWalker', 'Mrákošlap')] }
        ]
      },
      {
        title: `b) Střelba ve dne (${card('Anarchist', 'Anarchista')}, ${card('MassMurderer', 'Masový Vrah')}, ${card('Terrorist', 'Bomba')})`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Immunity', 'Imunita'), card('KevlarVest', 'Kevlar'), card('CloudWalker', 'Mrákošlap')] }
        ]
      }
    ]
  },
  {
    title: 'Pořadí buzení',
    blocks: [
      
    ],
    subsections: [
      {
        title: 'a) Sudé noci',
        blocks: [
          { kind: 'paragraph', text: 'V sudé noci se postupně budí:' },
          {
            kind: 'list',
            items: [
              card('Jailer', 'Jailer'),
              card('Gravedigger', 'Hrobař'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Mágové'),
              card('Slime', 'Slina'),
              card('Leech', 'Pijavice'),
              card('Sand', 'Písek'),
              card('Cobra', 'Kobra'),
              card('Magnet', 'Magnet'),
              card('GhostBobo', 'Duch Bobo'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jožin z Bažin'),
              card('Mafia', 'Mafie'),
              card('MadGunman', 'Šílení Střelci'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Ponožka'),
              card('Judge', 'Soudce'),
              card('BlindExecutioner', 'Slepý Kat'),
              card('Matrix', 'Střela Matrixe')
            ]
          }
        ]
      },
      {
        title: 'b) Liché noci',
        blocks: [
          { kind: 'paragraph', text: 'V liché noci se postupně budí:' },
          {
            kind: 'list',
            items: [
              card('Gravedigger', 'Hrobař'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Mágové'),
              card('Slime', 'Slina'),
              card('Leech', 'Pijavice'),
              card('Sand', 'Písek'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jožin z Bažin'),
              card('Mafia', 'Mafie'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Ponožka'),
              card('BlindExecutioner', 'Slepý Kat'),
              card('Matrix', 'Střela Matrixe')
            ]
          }
        ]
      },
      {
        title: 'c) Další noční pravidla',
        blocks: [
          { kind: 'paragraph', text: `Na konci každé třetí noci (počínaje druhou) se budí ${card('Spyglass', 'Luneta')}, aby zjistila, kteří hráči byli aktivní.` },
          { kind: 'paragraph', text: `Některé role (např. ${card('Matrix')}) mají omezený počet použití; po vyčerpání nábojů je moderátor přestane budit.` }
        ]
      }
    ]
  },
  {
    title: 'Pravidla vyvážení karet',
    blocks: [
      { kind: 'paragraph', text: 'Aby byla hra spravedlivá, aplikace uplatňuje při rozdávání rolí následující omezení:' },
      {
        kind: 'list',
        items: [
          `Hráč může mít pouze jednu kartu ${card('Mafia', 'Mafie')}.`,
          `Hráč může mít pouze jednu kartu z dvojice ${card('Gandalf')} / ${card('HorsePiece', 'Kus Koňa')}.`,
          `Hráč může mít pouze jednu kartu ze sady: ${card('Mage', 'Mág 2')} / ${card('MadGunman', 'Šílený Střelec 2')} / ${card('GhostBobo', 'Duch Bobo')}.`,
          `Hráč může mít pouze jednu kartu z dvojice ${card('Leech', 'Pijavice')} / ${card('Cobra')}.`,
          `Hráč může mít pouze jednoho ${card('MadGunman', 'Šíleného Střelce')}.`,
          `Hráč může mít pouze jednu kartu ${card('Slime', 'Sliny')}.`,
          `Hráč může mít pouze jednu kartu z dvojice ${card('Atheist', 'Ateista')} / ${card('Matrix')}.`,
          `Hráč s kartou ${card('Mafia', 'Mafie')} nemůže dostat ${card('Doctor', 'Doktora')} ani ${card('Spyglass', 'Lunetu')}.`,
          `Hráč může dostat maximálně dva ${card('CloudWalker', 'Mrákošlapy')}.`,
          `Hráč může dostat maximálně dva ${card('RopeWalker', 'Provazochodce')}.`,
          `Hráč s kartou ${card('Gravedigger', 'Hrobař')}, ${card('Leech', 'Pijavice')}, ${card('AlCapone', 'Al Capone')}, ${card('Gandalf')} nebo ${card('HorsePiece', 'Kus Koňa')} může dostat pouze jednoho ${card('CloudWalker', 'Mrákošlapa')}.`
        ]
      }
    ]
  }
];

export const TRANSLATIONS_CZ = {
  // Role labels
  role_AlCapone: 'Al Capone',
  role_Anarchist: 'Anarchista',
  role_Astronomer: 'Astronom',
  role_Atheist: 'Ateista',
  role_BlindExecutioner: 'Slepý Kat',
  role_CloudWalker: 'Mrákošlap',
  role_Cobra: 'Kobra',
  role_Communist: 'Komunista',
  role_Doctor: 'Doktor',
  role_Gandalf: 'Gandalf',
  role_GhostBobo: 'Duch Bobo',
  role_Glazier: 'Sklenář',
  role_Gravedigger: 'Hrobař',
  role_HorsePiece: 'Kus Koňa',
  role_Immunity: 'Imunita',
  role_Jailer: 'Jailer',
  role_Judge: 'Soudce',
  role_KevlarVest: 'Kevlar',
  role_Kovac: 'Kováč',
  role_Leech: 'Pijavice',
  role_MadGunman: 'Šílený Střelec',
  role_Mafia: 'Mafián',
  role_Magnet: 'Magnet',
  role_MassMurderer: 'Masový Vrah',
  role_Matrix: 'Matrix',
  role_Meciar: 'Mečiar',
  role_Mage: 'Mág',
  role_Mirror: 'Zrcadlo',
  role_RopeWalker: 'Provazochodec',
  role_Sand: 'Písek',
  role_Slime: 'Slina',
  role_Sniper: 'Sniper',
  role_Sock: 'Ponožka',
  role_Spyglass: 'Luneta',
  role_SwampMonster: 'Jožin z Bažin',
  role_Terrorist: 'Terorista',
  role_TimeLord: 'Pán Času',

  // Card descriptions
  card_description_AlCapone: 'Al Capone jako kmotr Mafie je imunní vůči jejím útokům. Tato ochrana funguje na přímý zásah od Mafie a na kulky přesměrované Tunelem, ale nechrání před kulkou přesměrovanou Magnetem nebo Zrcadlem.',
  card_description_Anarchist: 'Anarchista může jednou za celou hru během dne použít svou schopnost zvoláním "I shoot you baby!", načež vystřelí na osobu, kterou si vybere.',
  card_description_Astronomer: 'Astronom může jednou za celou hru během dne použít svou schopnost zvoláním "Noc!", což okamžitě ukončí den, i když právě probíhá hlasování.',
  card_description_Atheist: 'Tunel vytvořený Mágem, který vede k Ateistovi, nefunguje. Moderátor Mága neinformuje o tom, že vytvořil tunel na Ateistu.',
  card_description_BlindExecutioner: 'Slepý Kat může dvakrát za hru v noci označit dva hráče. Pokud by měl být následující den první z označených hráčů oběšen, místo něj zemře hráč označený jako druhý.',
  card_description_CloudWalker: 'Mrákošlap je základní obranná karta fungující jako život navíc. Spotřebuje se, pokud hráč nemá jinou ochranu.',
  card_description_Cobra: 'Kobra každou sudou noc označí hráče, o kterém si myslí, že má kartu Pijavice. Pokud se trefí, na konci noci získá Mrákošlapa a sní Pijavici (hráč s touto kartou ztratí své schopnosti).',
  card_description_Communist: 'Komunista může jednou za celou hru během dne použít svou schopnost zvoláním "Občané, v tomto kole jsme si všichni rovni", čímž na jeden den zruší schopnosti Mečiara, Kováče, Ducha Bobo a Soudce.',
  card_description_Doctor: 'Doktor každou noc označí hráče, kterého léčí, čímž ho jednorázově ochrání před kulkou nebo zápachem Ponožky. Každou třetí noc (počínaje první nebo druhou) může vyléčit sám sebe. Pokud Doktor zůstane sám proti jednomu nebo více Mafiánům a nemůže se vyléčit, je deaktivován.',
  card_description_Gandalf: 'Pokud Kus Koňa ztratí Mrákošlapa, získá ho Gandalf. Během noci může takto získat pouze jednoho Mrákošlapa.',
  card_description_Glazier: 'Pokud Sklenář nemá žádné Zrcadlo a jinému hráči je v noci zničeno, Sklenář ho získá na konci noci. Během noci může obdržet pouze jedno Zrcadlo.',
  card_description_GhostBobo: 'Duch Bobo každou sudou noc označí hráče, který bude mít následující den zákaz mluvit (tento zákaz může zrušit pouze Komunista). Pokud má obviněný hráč zákaz mluvení od Ducha Bobo, vybere si osobu, která ho má obhajovat překládáním jeho mimiky a gest.',
  card_description_Gravedigger: 'Hrobař může jednou za celou hru v noci vykopat hroby pro Mrákošlapy, díky čemuž na konci noci získá tolik Mrákošlapů, kolik jich té noci ztratili ostatní hráči.',
  card_description_HorsePiece: 'Pokud Gandalf ztratí Mrákošlapa, získá ho Kus Koňa. Během noci může takto získat pouze jednoho Mrákošlapa.',
  card_description_Immunity: 'Obranná karta používaná v případě zásahu kulkou ve dne nebo odsouzení k smrti oběšením.',
  card_description_Jailer: 'Jailer může jednou za celou hru označit hráče, kterého uvrhne do vězení, čímž zablokuje působení jeho schopností pro tuto noc. Moderátor vzbudí uvězněného hráče, ale jasně mu signalizuje, že je ve vězení.',
  card_description_Judge: 'Soudce každou sudou noc označí hráče, který bude mít následující den zákaz hlasovat. Komunista může tento zákaz zrušit.',
  card_description_KevlarVest: 'Obranná karta používaná v případě zásahu kulkou.',
  card_description_Kovac: 'Kováč snižuje počet hlasů odevzdaných pro jeho smrt o 1. Pokud Komunista použije svou schopnost, Kováč tuto funkci ztrácí.',
  card_description_Leech: 'Pijavice každou noc označí hráče, ke kterému se přisaje. Pokud tento hráč té noci ztratí Mrákošlapa nebo zemře, Pijavice získá Mrákošlapa. Pijavice může být snědena Kobrou.',
  card_description_MadGunman: 'Šílený Střelec každou sudou noc jednou vystřelí.',
  card_description_Mafia: 'Mafián může vyhrát hru eliminací všech běžných hráčů používáním kulky každou noc. Aby Mafie vystřelila, musí všichni Mafiáni v noci označit stejného hráče. Pro určení pořadí označování se budí na začátku první noci.',
  card_description_Mage: 'Mág každou noc označí dva hráče a vytvoří mezi nimi jednosměrný tunel (z prvního na druhého). Pokud je zasažen první označený hráč, kulka putuje tunelem k druhému.',
  card_description_Magnet: 'Magnet každou sudou noc označí hráče, kterého zmagnetizuje. Pokud kolem zmagnetizovaného hráče proletí kulka, je k němu přitáhnuta. Kulka může být k zmagnetizovanému hráči přitáhnuta pouze jednou.',
  card_description_MassMurderer: 'Pokud je Masový Vrah odsouzen k oběšení, střílí na všechny, kteří pro něj hlasovali.',
  card_description_Matrix: 'Matrix může jednou za celou hru v noci změnit fyzikální zákony – zachytit všechny kulky, které ho zasáhnou, a vypustit je na konci noci.',
  card_description_Meciar: 'Při hlasování se jeho hlas počítá dvakrát. Pokud Komunista použije svou schopnost, Mečiar tuto funkci ztrácí.',
  card_description_Mirror: 'Obranná karta používaná v případě zásahu kulkou Mafie nebo Šíleného Střelce. Po rozbití Zrcadla se kulka vrací k hráči, od kterého přiletěla, ledaže bylo Zrcadlo zašpiněno blátem od Jožina z Bażin.',
  card_description_RopeWalker: 'Obranná karta chránící před smrtí na šibenici.',
  card_description_Sand: 'Hráč s kartou Písek každou noc označí hráče, kterého posype pískem. Písek neutralizuje efekt Sliny, čímž činí hráče opět zranitelným. Ochranu před Pískem mají hráči s Plynovou maskou (Šílený Střelec 2, Mág 2 a Duch Bobo).',
  card_description_Slime: 'Hráč s kartou Slina každou noc označí hráče, kterého chce oslintat. Oslintaný hráč je jednou v noci chráněn před kulkou Mafie, Šíleného Střelce a Snipera (kulka po cíli sklouzne). Efekt Sliny lze neutralizovat Pískem.',
  card_description_Sniper: 'Sniper může jednou za celou hru označit hráče, na kterého vystřelí silnou kulkou. Ta je tak silná, že rozbije i Zrcadlo a letí dál.',
  card_description_Sock: 'Hráč s Ponožkou může jednou za celou hru v noci hodit Ponožku mezi dva hráče, kteří jsou zasaženi jejím zápachem. Před zápachem Ponožky chrání pouze Plynová maska, Doktor a Mrákošlap. Šílený Střelec 2, Mág 2 a Duch Bobo vlastní Plynovou masku.',
  card_description_Spyglass: 'Luneta se budí na konci každé třetí noci (počínaje druhou) a dozvídá se od Moderátora, kteří hráči se té noci probudili.',
  card_description_SwampMonster: 'Jožin z Bažin může třikrát za celou hru v noci označit hráče, kterému zašpiní Zrcadlo. Kulka rozbije Zrcadlo zašpiněné blátem, ale letí dál. Jožin může použít svou schopnost opakovaně tu samou noc. Pokud hráč vlastní také kartu Mafiána, Snipera nebo Šíleného Střelce, může zašpinit Zrcadlo pouze dvakrát.',
  card_description_Terrorist: 'Terorista může jednou za celou hru během dne použít svou schopnost zvoláním "Bomba!", načež vystřelí na všechny hráče.',
  card_description_TimeLord: 'Pán Času může jednou za celou hru na začátku dne nebo noci říct "Jsem Pán času!" a přeskočit celý den nebo noc.',

  // App Shell & Navigation
  app_title: 'Mafia²',
  app_continue_game: 'Pokračovat ve hře',
  app_continue_round: 'Kolo {round}',
  app_new_game: 'Nová hra',
  nav_game: 'Hra',
  nav_players: 'Hráči',
  nav_logs: 'Hlášení',
  nav_rules: 'Pravidla',
  nav_cards: 'Karty',
  nav_settings: 'Nastavení',
  nav_my_cards: 'Moje karty',
  nav_all_cards: 'Všechny karty',
  player_link_invalid: 'Neplatný odkaz hráče. Požádejte moderátora o nový.',

  // Rules View
  rules_header_title: 'Pravidla',
  rules_missing_language: 'Pro zvolený jazyk chybí přeložená pravidla.',

  // Logs
  logs_heading: 'Deník noci a dne',
  logs_subheading: 'Zobrazuje se hlášení noci a dne #{round}',
  logs_round_label: 'Kolo',
  logs_view_label: 'Zobrazení',
  logs_public_report_title: 'Veřejné hlášení',
  logs_public_report_placeholder: 'Veřejné hlášení se objeví na začátku dne.',
  logs_round_title: 'Deník kola',
  logs_round_empty: 'Pro toto kolo nejsou žádné záznamy.',
  logs_panel_title: 'Historie hry',
  logs_panel_empty: 'Žádné záznamy v deníku.',

  // Cards
  cards_collection_title: 'Sbírka karet',
  cards_placeholder_description: 'Popis se připravuje.',
  cards_toggle_icons: 'Ikony',
  cards_toggle_images: 'Grafika',
  cards_section_passive: 'Pasivní schopnosti',
  cards_section_active: 'Aktivní schopnosti',
  player_add_card_title: 'Přidat získanou kartu',
  player_add_card_button: 'Přidat kartu',
  player_add_card_type_label: 'Typ karty',
  player_add_card_instance_label: 'Číslo karty',
  player_add_card_submit: 'Přidat kartu',
  player_add_card_duplicate: 'Tato karta už je v seznamu.',

  // Settings
  settings_language_title: 'Jazyk aplikace',
  settings_language_active: 'Aktivní',
  settings_title: 'Nastavení',
  settings_player_node_size: 'Velikost figurek hráčů',
  settings_reset_player_size: 'Obnovit výchozí velikost',
  settings_player_node_hint: 'Usnadňuje trefování kulatých žetonů na velkých stolech.',
  settings_bullet_speed: 'Rychlost kulek',
  settings_bullet_speed_fast: 'Rychleji',
  settings_bullet_speed_slow: 'Pomaleji',
  settings_bullet_speed_hint: 'Řídí tempo animace nočních výstřelů.',
  settings_storage_title: 'Paměť',
  settings_export_data_button: 'Exportovat data hry',
  settings_import_data_button: 'Importovat ze souboru',
  settings_import_warning: 'Import nahradí aktuální hru.',
  settings_import_error: 'Nepodařilo se načíst záznam. Zkontrolujte soubor a zkuste to znovu.',

  // GM Player List
  gm_players_title: 'Hráči ({count})',
  gm_players_badge_mafia: 'Mafie',
  gm_players_no_cards: 'Žádné karty',
  gm_players_share_button: 'Sdílet',
  gm_players_qr_button: 'QR kód',
  gm_players_qr_instruction: 'Naskenujte kód pro otevření pohledu hráče.',
  gm_players_qr_generating: 'Generování QR kódu…',
  gm_players_copy_link_instead: 'Zkopírovat odkaz místo toho',
  gm_players_manual_copy_title: 'Zkopírovat odkaz ručně',
  gm_players_manual_copy_fallback: 'Sdílení není na tomto zařízení dostupné. Zkopírujte odkaz a pošlete ho {name}.',
  gm_players_manual_copy_label: 'Odkaz',
  gm_players_manual_copy_copy: 'Zkopírovat odkaz',
  gm_players_manual_copy_close: 'Zavřít',
  gm_players_share_insecure: 'Sdílení funguje pouze přes HTTPS (nebo localhost). Zkopírujte odkaz nebo otevřete aplikaci přes https://.',
  gm_players_share_unsupported: 'Tento prohlížeč nepodporuje tlačítko Sdílet. Zkopírujte odkaz níže.',
  gm_players_share_failure_reason: 'Sdílení na tomto zařízení selhalo. Zkopírujte odkaz ručně.',
  gm_players_share_title: '{player} — odkaz hráče',
  gm_players_copy_success: 'Odkaz na hráče {player} zkopírován! Pošlete mu ho.',
  gm_players_qr_error: 'Nelze vygenerovat QR kód. Odkaz byl zkopírován do schránky.',
  gm_players_modal_close_qr_aria: 'Zavřít okno QR kódu',
  gm_players_modal_close_manual_aria: 'Zavřít okno kopírování',
  gm_players_share_mode_title: 'Režim sdílení',
  gm_players_share_mode_hint: 'Skryje karty a barvy Mafie při zobrazování QR kódů.',
  gm_players_share_mode_on: 'Zapnutý',
  gm_players_share_mode_off: 'Vypnutý',
  gm_players_share_mode_cards_hidden: 'Karty skryté v režimu sdílení.',
  gm_players_section_alive: 'Živí',
  gm_players_section_dead: 'Mrtví',

  // Gameplay Texts
  victory_mafia: 'Vyhrává Mafie.',
  victory_innocent: 'Vyhrává Město.',
  log_start_game: 'Nová hra zahájena.',
  log_player_activate: '{cardLabel} {player} použil schopnost.',
  start_day: 'Začít den',
  start_night_intro: 'Padá noc, městečko usíná...',
  first_night_message: 'Mafie se budí, aby určila strategii.',
  wake_up: 'Probouzí se {role}. Použije svou funkci?',
  wake_up_use_again: 'Chce {role} použít funkci znovu?',
  wake_up_shooter: 'Probouzí se {role}. Na koho chce vystřelit?',

  // Role-specific wakeups, logs, and reports

  // Mage
  wake_up_mage_from: 'Probouzí se {role}. Ze kterého hráče chce vytvořit tunel?',
  wake_up_mage_to: 'Kam {role} povede východ z tunelu?',
  log_tunnel_duplicate: '{cardLabel} {player} chtěl vytvořit tunel {source}->{target}, ale tento tunel už existuje.',
  log_tunnel_atheist: `{cardLabel} {player} chtěl použít tunel na hráče {target}, ale je to ${card('Atheist', 'Ateista')}.`,
  log_tunnel_same_player: '{cardLabel} {player} nemůže vytvořit tunel na téhož hráče.',
  log_tunnel_created: '{cardLabel} {player} vytvořil tunel {tunnelNumber} ({source} -> {target}).',

  // Slime
  wake_up_slime: 'Probouzí se {role}. Koho chce pokrýt slinou?',
  log_action_slime: '{cardLabel} {player} pokryl slinou hráče {target}.',
  public_report_slime: '{name} je oslintaný.',
  public_report_slime_multi: '{name} je oslintaný (x{count}).',

  // Leech
  wake_up_leech: 'Probouzí se {role}. Ke komu se chce přisát?',
  log_action_leech: '{cardLabel} {player} se přisál k hráči {target}.',
  public_report_leech_cloudwalker: `${card('Leech', 'Pijavice')} získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  log_night_leech_cloudwalker: `{cardLabel} {player} získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,

  // Sand
  wake_up_sand: 'Probouzí se {role}. Koho chce posypat pískem?',
  log_action_sand: '{cardLabel} {player} posypal pískem hráče {target}.',
  log_action_sand_fail: `{cardLabel} {player} chtěl použít ${card('Sand', 'Písek')} na hráče {target}, ale ten má Plynovou masku.`,
  public_report_sand: '{name} má písek v očích.',
  public_report_sand_saved: `Plynová maska uchránila hráče před ${card('Sand', 'Pískem')}.`,

  // Cobra
  wake_up_cobra: 'Probouzí se {role}. Koho chce uštknout?',
  log_action_cobra: '{name} byl uštknut.',
  public_report_cobra_cloudwalker: `${card('Cobra', 'Kobra')} požírá ${card('Leech', 'Pijavici')} a získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  log_night_cobra_cloudwalker: `{cardLabel} {player} požírá ${card('Leech', 'Pijavici')} a získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,

  // Magnet
  wake_up_magnet: 'Probouzí se {role}. Koho chce zmagnetizovat?',
  log_action_magnet: '{name} byl zmagnetizován.',

  // Ghost Bobo
  wake_up_ghost: 'Probouzí se {role}. Koho chce umlčet?',
  log_action_ghost: '{cardLabel} {player} odebral hlas hráči {target}.',
  public_report_ghost_bobo: '{name} dnes nemůže mluvit.',

  // Judge
  wake_up_judge: 'Probouzí se {role}. Komu chce vzít právo hlasovat?',
  log_action_judge: '{cardLabel} {player} odebral právo hlasovat hráči {target}.',
  public_report_judge: '{name} dnes nemůže hlasovat.',

  // Swamp Monster
  wake_up_swamp_monster: 'Koho chce zašpinit blátem?',
  log_night_swamp_attack: '{cardLabel} {player} zašpinil blátem hráče {target}.',

  // Executioner
  wake_up_executioner_save: 'Probouzí se {role}. Koho chce zachránit před šibenicí?',
  wake_up_executioner_victim: 'Kdo má skončit na šibenici místo něj?',
  log_night_executioner_save: '{saved} je chráněn před rozsudkem, místo něj zemře {victim}.',
  log_day_blind_executioner_redirect: '{cardLabel} {player} — rozsudek je přesměrován. {victim} nahrazuje {saved}.',
  public_report_day_blind_executioner_redirect: 'V poslední chvíli byl odsouzený vyměněn — {victim} nahrazuje {saved}.',

  // Sock
  wake_up_sock_first: 'Mezi koho hodit Ponožku? Označ prvního hráče.',
  wake_up_sock_second: 'Nyní označ souseda tohoto hráče.',
  log_action_sock_throw: `{cardLabel} {player} hodil ${card('Sock', 'Ponožku')} mezi hráče {first} a {second}.`,
  log_sock_throw_intro: `{cardLabel} {player} hodil ${card('Sock', 'Ponožku')} mezi hráče {first} a {second}. `,
  log_sock_result_gasmask: 'Plynová maska zachránila hráče {name}. ',
  log_sock_result_dead: 'Hráč {name} byl již mrtvý. ',
  log_sock_result_doctor: `${card('Doctor', 'Doktor')} zachránil hráče {name}. `,
  log_sock_result_cloudwalker: `Hráč {name} ztratil ${card('CloudWalker', 'Mrákošlapa {num}')}. `,
  log_sock_result_death: 'Hráč {name} opouští hru. ',
  public_report_sock_used: `${card('Sock', 'Ponožka')} byla hozena mezi dva hráče. `,
  public_report_sock_first_gasmask: 'Prvního hráče zachránila Plynová maska',
  public_report_sock_first_dead: 'První hráč byl již mrtvý',
  public_report_sock_first_doctor: `Prvního hráče zachránil ${card('Doctor', 'Doktor')}`,
  public_report_sock_first_cloudwalker: `První hráč ztratil ${card('CloudWalker', 'Mrákošlapa {num}')}`,
  public_report_sock_first_death: 'První hráč, {name}, opouští naši hru',
  public_report_sock_second_gasmask: ' a druhého zachránila Plynová maska.',
  public_report_sock_second_dead: ' a druhý hráč byl již mrtvý.',
  public_report_sock_second_doctor: ` a druhého zachránil ${card('Doctor', 'Doktor')}.`,
  public_report_sock_second_cloudwalker: ` a druhý hráč ztratil ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  public_report_sock_second_death: ' a druhý hráč, {name}, opouští naši hru.',
  public_report_sock_first_only_suffix: '.',

  // Jailer
  wake_up_jailer: 'Probouzí se {role}. Koho uvrhne do vězení?',
  log_jailer_imprison: '{cardLabel} {player} uvrhl do vězení hráče {target}.',
  log_action_blocked_jailed: '{cardLabel} {player} sedí ve vězení, takže se té noci nic nestane.',

  // Doctor
  wake_up_doctor_heal_self: 'Probouzí se {role}. Koho chce vyléčit? (může sebe)',
  wake_up_doctor_heal_other: 'Probouzí se {role}. Koho chce vyléčit? (nemůže sebe)',
  log_doctor_fail: `{cardLabel} {player} chtěl vyléčit {target}, ale cíl nebude vyléčen, protože ${card('Doctor', 'Doktor')} působí sám proti ${card('Mafia', 'Mafii')}.`,
  log_doctor_success: '{cardLabel} {player} vyléčí hráče {target}.',
  log_doctor_self_locked: '{cardLabel} {player} nemůže tuto noc vyléčit sebe.',

  // Matrix
  wake_matrix_shot: 'Probouzí se Matrix. Na koho chce vystřelit? (kulka {current}/{total})',
  log_night_matrix_activate: 'Následuj bílého králíka... ({cardLabel} {player} použil schopnost.)',
  log_night_matrix_bullet_summary: `Počet kulek, které ${card('Matrix', 'Matrix')} {player} zachytil tuto noc: {count}.`,

  // Spyglass
  wake_up_spyglass: 'Probouzí se Luneta. Zjistila, kdo byl v noci aktivní?',
  spyglass_reveal_intro: 'Této noci se budili: {names}.',
  spyglass_reveal_none: 'Této noci se nikdo nevzbudil.',

  // Mafia/Shooting
  log_mafia_jailed: `{cardLabel} {player} je ve vězení, takže ${card('Mafia', 'Mafie')} nevystřelí.`,
  log_mafia_no_consensus: `${card('Mafia', 'Mafiáni')} se neshodli na cíli, takže té noci nikdo nestřílel.`,
  log_shoot: '{cardLabel} {player} střílí na hráče {target}.',
  log_shooter_aim: '{cardLabel} {player} míří na hráče {target}.',

  // Time Lord
  ui_timelord_skip_night: '{cardLabel}: Přeskočit noc',
  ui_timelord_skip_day: '{cardLabel}: Přeskočit den',
  log_timelord_skip_day: '{cardLabel} {player} přeskočil den.',
  log_timelord_skip_night: '{cardLabel} {player} přeskočil noc.',

  // Public Reports (Resolution)
  log_day_vest_hit: `{target} ztrácí ${card('KevlarVest', 'Kevlar {num}')}.`,
  log_day_ropewalker_lost: `{target} ztrácí ${card('RopeWalker', 'Provazochodce {num}')}.`,
  log_day_immunity_lost: `{target} ztrácí ${card('Immunity', 'Imunitu {num}')}.`,
  log_day_cloudwalker_lost: `{target} ztrácí ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  log_day_death: '{target} umírá.',

  // Morning Report
  public_report_default: 'Městečko Palermo se probouzí.',
  public_report_matrix: `Tuto noc ${card('Matrix', 'Matrix')} použil svou funkci. Počet kulek, které zachytil: {count}.`,
  public_report_cloudwalker_gain: `{cardLabel} získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  public_report_glazier_mirror: `${card('Glazier', 'Sklenář')} vytváří ${card('Mirror', 'Zrcadlo {num}')}.`,
  log_night_cloudwalker_gain: `{cardLabel} {player} získává ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  log_night_glazier_mirror: `{cardLabel} {player} vytváří ${card('Mirror', 'Zrcadlo {num}')}.`,
  
  
  // Bullet Report Fragments
  public_report_bullet_start: 'Padl výstřel',
  public_report_bullet_dead_target: ', ale zasáhla mrtvého hráče.',
  public_report_bullet_matrix_catch: ` a ${card('Matrix', 'Matrix')} ho zachytil.`,
  public_report_bullet_magnet: `, byl přitáhnut ${card('Magnet', 'Magnetem')}`,
  public_report_bullet_split: ', rozštěpil se na {count} částí.',
  public_report_bullet_tunnel_single: ', proletěl tunelem',
  public_report_bullet_tunnel_segment: ' {index}. úlomek proletěl tunelem',
  public_report_bullet_slime: ` a kulka sklouzla po ${card('Slime', 'slině')}.`,
  public_report_bullet_al_capone: `, ale ${card('AlCapone', 'Al Capone')} zneutralizoval hrozbu.`,
  public_report_bullet_doctor: `, ale ${card('Doctor', 'Doktor')} zneutralizoval kulku.`,
  public_report_bullet_mirror_break: `, prasklo ${card('Mirror', 'Zrcadlo {num}')}`,
  public_report_bullet_return: ', kulka se vrátila',
  public_report_bullet_continue: ', kulka letí dál',
  public_report_bullet_vest_loss: ` a ${card('KevlarVest', 'Kevlar {num}')} byl zničen.`,
  public_report_bullet_cloudwalker_loss: ` a zemřel ${card('CloudWalker', 'Mrákošlap {num}')}.`,
  public_report_bullet_death: ' a naši hru opouští {name}.',

  log_night_bullet_start: '{cardLabel} {shooter} střílí na hráče {target}. ',
  log_night_bullet_start_generic: 'Padl výstřel směrem na {target}. ',
  log_night_bullet_split: 'Kulka se rozštěpila na {count} částí.',
  log_night_bullet_dead_target: ' a zasáhla mrtvého hráče {target}.',
  log_night_bullet_matrix_catch: ` a ${card('Matrix', 'Matrix')} {target} ho zachytil.`,
  log_night_bullet_magnet_initial: `Kulka byla přitáhnuta ${card('Magnet', 'Magnetem')} k hráči {target}`,
  log_night_bullet_magnet: `, byla přitáhnuta ${card('Magnet', 'Magnetem')} k hráči {target}`,
  log_night_bullet_magnet_dead: ` a zasáhla mrtvého hráče {target} (${card('Magnet', 'Magnetu')} efekt).`,
  log_night_bullet_tunnel_initial: 'Kulka proletěla tunelem {num} ({src} -> {target})',
  log_night_bullet_tunnel_single: ', proletěla tunelem {num} ({src} -> {target})',
  log_night_bullet_tunnel_segment: ' {index}. úlomek proletěl tunelem {num} ({src} -> {target})',
  log_night_bullet_slime_initial: `Kulka sklouzla po ${card('Slime', 'slině')} z hráče {target}.`,
  log_night_bullet_slime: ` a sklouzla po ${card('Slime', 'slině')} z hráče {target}.`,
  log_night_bullet_al_capone_initial: `${card('AlCapone', 'Al Capone')} {target} neutralizuje kulku.`,
  log_night_bullet_al_capone: ` a ${card('AlCapone', 'Al Capone')} {target} ji neutralizuje.`,
  log_night_bullet_doctor_initial: `${card('Doctor', 'Doktor')} zachránil hráče {target}.`,
  log_night_bullet_doctor: ` a hráč {target} byl vyléčen ${card('Doctor', 'Doktorem')}.`,
  log_night_bullet_mirror_break_initial: `Kulka rozbíjí ${card('Mirror', 'Zrcadlo {num}')} u hráče {target}`,
  log_night_bullet_mirror_break: `, u hráče {target} prasklo ${card('Mirror', 'Zrcadlo {num}')}`,
  log_night_bullet_return: ', kulka se vrátila k {target}',
  log_night_bullet_continue_sniper: `, ale kulka letí dál, protože ${card('Mirror', 'Zrcadlo')} hráče {target} neodráží střely ${card('Sniper', 'Snipera')},`,
  log_night_bullet_continue_matrix: `, ale kulka letí dál, protože ${card('Mirror', 'Zrcadlo')} hráče {target} nezastavuje střely ${card('Matrix', 'Matrixe')},`,
  log_night_bullet_continue_mud: `, ale kulka letí dál, protože ${card('Mirror', 'Zrcadlo')} hráče {target} bylo zablácené,`,
  log_night_bullet_vest_loss_initial: `Kulka ničí ${card('KevlarVest', 'Kevlar {num}')} hráče {target}.`,
  log_night_bullet_vest_loss: ` a {target} ztrácí ${card('KevlarVest', 'Kevlar {num}')}.`,
  log_night_bullet_cloudwalker_loss_initial: `Kulka bere ${card('CloudWalker', 'Mrákošlapa {num}')} hráči {target}.`,
  log_night_bullet_cloudwalker_loss: ` a {target} ztrácí ${card('CloudWalker', 'Mrákošlapa {num}')}.`,
  log_night_bullet_death_initial: 'Kulka zabíjí hráče {name}.',
  log_night_bullet_death: ' a {name} umírá.',
  log_night_bullet_gandalf_from_horse: ` ${card('Gandalf', 'Gandalf')} {gandalf} získává ${card('CloudWalker', 'Mrákošlapa {num}')} (ztráta ${card('HorsePiece', 'Kusu Koňa')} {horse}: {lost}).`,
  log_night_bullet_horsepiece_from_gandalf: ` ${card('HorsePiece', 'Kus Koňa')} {horse} získává ${card('CloudWalker', 'Mrákošlapa {num}')} (ztráta ${card('Gandalf', 'Gandalfa')} {gandalf}: {lost}).`,

  // UI
  ui_confirm: 'Ano',
  ui_deny: 'Ne',
  ui_undo: 'Zpět',
  ui_bomb: 'Bomba!',
  ui_next_phase: 'Dále',
  ui_replay_bullets: 'Opakovat animaci',
  ui_bullet_replay: 'Přehrávání průběhu střelby...',
  ui_first_night_done: 'Konec porady Mafie',
  ui_start_night: 'Začít noc',
  ui_player_label: 'Hráč: {name}',
  ui_player_jailed_notice: 'Hráč {name} je ve vězení — ukažte mu zkřížené ruce 🙅.',
  ui_anarchist_baby: 'I shoot you baby!',
  ui_astronomer_night: 'Noc!',
  ui_communist_equal: 'Všichni rovni!',
  ui_special_no_owner: 'Bez majitele',
  day_action_vote: 'Přehlasován',
  day_prompt_vote: 'Označ hráče, který byl přehlasován.',
  day_prompt_shot: 'Anarchista střílí. Vyber cíl.',
  day_prompt_mass_murderer_select: 'Masový Vrah střílí na své žalobce. Označ hráče a potvrď.',
  day_idle_message: 'Probíhá den. Použij dostupné akce.',
  day_report_confirm: 'Potvrdit hlášení',
  public_report_day_player_left: 'Naši hru opouští {name}.',
  public_report_day_ropewalker_lost: `Zemřel ${card('RopeWalker', 'Provazochodec {num}')}.`,
  public_report_day_cloudwalker_lost: `Zemřel ${card('CloudWalker', 'Mrákošlap {num}')}.`,
  public_report_day_kevlar_lost: `Zemřel ${card('KevlarVest', 'Kevlar {num}')}.`,
  public_report_day_immunity_lost: `Zemřela ${card('Immunity', 'Imunita {num}')}.`,
  ui_mass_murderer_target: 'Odsouzený: {name}',
  ui_mass_murderer_selected: 'Vybráno: {count}',
  ui_mass_murderer_confirm: 'Vystřelit',

  // Warnings
  warn_anarchist_unavailable: 'Anarchista už nemůže střílet.',
  warn_terrorist_unavailable: 'Terorista už nemůže odpálit bombu.',
  warn_bomb_day_only: 'Bombu lze použít pouze ve dne.',
  warn_astronomer_unavailable: 'Astronom už nemůže ukončit den.',
  warn_astronomer_day_only: 'Astronom funguje pouze během dne.',
  warn_communist_unavailable: 'Komunista už nemůže použít svou schopnost.',
  warn_communist_day_only: 'Komunista funguje pouze ve dne.',

  log_day_vote: 'Hráč {target} byl přehlasován.',
  log_day_shot: `${card('Anarchist', 'Anarchista')} {actor} postřelil {target}.`,
  log_day_bomb: `${card('Terrorist', 'Terorista')} {player} odpaluje bombu!`,
  log_day_astronomer: `${card('Astronomer', 'Astronom')} {player} ukončuje den.`,
  log_day_communist: `${card('Communist', 'Komunista')} {player} zavádí rovnost.`,
  log_day_mass_murderer_trigger: `${card('MassMurderer', 'Masový Vrah')} {target} sahá po zbrani před rozsudkem.`,
  log_day_mass_murderer_shot: `${card('MassMurderer', 'Masový Vrah')} {player} zabíjí {target}.`,

  // Phase Dividers
  log_divider_night_start: 'Noc {round} začíná.',
  log_divider_night_end: 'Noc {round} končí.',
  log_divider_day_start: 'Den {round} začíná.',
  log_divider_day_end: 'Den {round} končí.',

  // Setup Wizard
  setup_next: 'Dále',
  setup_remove: 'Pro správné rozdání rolí musíš odstranit několik karet...',
  setup_step_count: 'Počet hráčů',
  setup_step_mafia: 'Počet karet Mafie',
  setup_mafia_description: 'Vyber, kolik karet Mafie bude v balíčku ({min} - {max}).',
  setup_mafia_label: 'Karty Mafie v balíčku',
  setup_mafia_recommended: 'Doporučená hodnota pro {players} hráčů: {count}',
  setup_step_names: 'Jména',
  setup_step_balance: 'Vyvážení hry',
  setup_balance_instruction: 'Pro vyrovnání balíčku odstraň {remove} karet nebo přidej {add}.',
  setup_remove_instruction: 'Musíš odstranit {count} karet, abys vyrovnal balíček.',
  setup_cards_remaining: 'K odstranění',
  setup_cards_missing: 'Chybí karet',
  setup_cards_total: 'Celkem karet v balíčku: {count}',
  setup_cards_minimum: 'Přidej ještě {missing}, aby každý hráč dostal alespoň jednu kartu.',
  setup_start_game: 'Zahájit hru',
};