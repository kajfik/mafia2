import type { RuleSection } from './types';
import type { CardId } from '../types';

const card = (cardId: CardId, labelOverride?: string) =>
  labelOverride ? `{{card:${cardId}|${labelOverride}}}` : `{{card:${cardId}}}`;
const gasMask = (labelOverride?: string) =>
  labelOverride ? `{{gasMask|${labelOverride}}}` : '{{gasMask}}';
const tunnel = (labelOverride?: string) =>
  labelOverride ? `{{tunnel|${labelOverride}}}` : '{{tunnel}}';

export const RULES_CONTENT_PO_NASZYMU: RuleSection[] = [
  {
    title: 'O grze',
    blocks: [
      { kind: 'paragraph', text: `Mafia je spoleczensko gra do 2–20 osób.` },
      { kind: 'paragraph', text: `Gracze se dzielóm na dwie frakcje: ${card('Mafia', 'Mafie')} a Miasto (normalnych obywateli). ${card('Mafia', 'Mafia')} wygrywo jak zabije wszystkich obywateli, zatymco Miasto wygrywo jak se zbawi całej ${card('Mafia', 'Mafii')}.` },
      { kind: 'paragraph', text: 'Gra je założóno na dedukcji, blafowaniu a szykownym wyużywaniu karet.' }
    ]
  },
  {
    title: 'Poczóntek gry',
    blocks: [
      { kind: 'paragraph', text: 'Na poczóntku partii każdy gracz dostanie takóm samóm ilość karet.' },
      { kind: 'paragraph', text: 'Przed piyrwszóm nocóm by se gracze mieli zapoznać z działaniym swoich nocnych karet.' },
      { kind: 'paragraph', text: `System rozdowanio karet polego na zabezpieczyniu przed niesprawiedliwymi kombinacjami (np. że jedyn gracz dostanie wszystki ${card('CloudWalker', 'Mrakoszlapy')}). Dalsze info je w sekcji „Zasady balansu karet”.` }
    ]
  },
  {
    title: 'Noc',
    blocks: [
      { kind: 'paragraph', text: 'Jak Prowadzóncy ogłoszo noc, wszyscy gracze zamykajóm oczy. Potym Prowadzóncy wywołuje aktywne postawy, a pyto se ich na użyci swoich zdolności a wybier celu. Obudzóni gracze odpowiadajóm pocichu, za pomocóm gestów głowy albo rónk.' },
      { kind: 'paragraph', text: 'Noce se dzielóm na parzyste a nieparzyste – na tym zależy, kiere karty sóm budzone a w jakim porzadi.' },
      { kind: 'paragraph', text: 'Podrobny schemat budzyń nocnych a dziynnych roli je w sekcji „Kolejność budzyń”.' }
    ],
    subsections: [
      {
        title: `Piyrwszo noc - narada ${card('Mafia', 'Mafii')}`,
        blocks: [
          { kind: 'paragraph', text: `Na poczóntku piyrwszej nocy Prowadzóncy budzi całóm ${card('Mafia', 'Mafie')}. To je jedyny moment, w kierym se ${card('Mafia', 'Mafianie')} mogóm pocichu domówić strategie a porzadi zabijania. Na kóńcu narady ${card('Mafia', 'Mafia')} zaś idzie spać a zaczyno se normalno noc.` }
        ]
      }
    ]
  },
  {
    title: 'Dziyń',
    blocks: [
      { kind: 'paragraph', text: 'Rano se miasto budzi do życia, gracze otwiyrajóm oczy, a Prowadzóncy przedstawio raport z nocy.' },
      { kind: 'paragraph', text: 'Zabici gracze kóńczóm udział we grze – od tej chwili nimogóm głosować ani mówić.' },
      {
        kind: 'list',
        ordered: true,
        title: 'Przebieg dnia:',
        items: [
          'Prowadzóncy czyto sprawozdani z tego, co se stało w nocy.',
          `Gracze wnoszóm oskarżynia na osoby, kiere podejrzewajóm, że sóm w ${card('Mafia', 'Mafii')}, aby ich posłać na szubienice.`,
          `Oskarżóni gracze majóm mowy obrónne, aby przekonać inkszych, że sóm niewinni. Jeśli ${card('GhostBobo', 'Duch Bobo')} odebroł kierymu oskarżonymu głos, tyn pokazuje na osobe (adwokata), kiero go musi brónić poprzez tłumaczyni min a ruchów oskarżónego.`,
          `Prowadzóncy mianuje oskarżónych w porzadi, w jakim se bydzie głosować. Jeśli je yny jedyn kandydat, gracze głosujóm dwa razy: piyrwsze za, a potym przeciwko egzekucji. Jeśli je wiyncej kandydatów, gracze głosujóm postupnie za śmiercióm każdego z nich. Przi każdym głosowaniu Prowadzóncy robi odliczani: „Kto chce głosować za [opcja], rynce do góry za trzi, dwa, jedyn”. Głosować mogóm wszyscy (aj sami oskarżyni), chyba że ${card('Judge', 'Soudce')} kómusi zakozoł.`,
          `Po głosowaniu miasto idzie spać.`,
        ]
      },
      { kind: 'paragraph', text: `Nikiere role zmiyniajóm siłe głosu: głos ${card('Meciar', 'Mecziara')} se rachuje jak dwa, a ilość głosów na ${card('Kovac', 'Kovacza')} je o jedyn mniyjszo. ${card('Communist', 'Komunista')} może roz za gre zruszyć bonusy ${card('Meciar', 'Mecziara')}, ${card('Kovac', 'Kovacza')}, ${card('Judge', 'Soudce')} a cenzure ${card('GhostBobo', 'Ducha Bobo')}, aby wszyscy mieli równe prawa.` },
      { kind: 'paragraph', text: `Prowadzóncy liczy głosy ryncznie a musi pamiyntać o bonusie ${card('Meciar', 'Mecziara')} a minusie ${card('Kovac', 'Kovacza')}. Aplikacja jyny pokazuje ikony przy rolach, ale wynik musi poprawić Prowadzóncy.` },
      { kind: 'paragraph', text: 'Jak je remis, oskarżóni z równóm liczbóm głosów mogóm - jeśli chcóm - wygłosić ostatecznóm mowe obrónnóm. Potym je miyndzy nimi dogrywka na stejnakich zasadach. Jak by był zaś remis, głosowani se hned kóńczy bez egzekucji.' },
      { kind: 'paragraph', text: `Przed wyrokym może ${card('Astronomer', 'Astronom')} użyć swoi zdolności, aby hned zakóńczyć dziyń bez śmierci skazanego.` }
    ]
  },
  {
    title: 'Reguły obronne',
    blocks: [
      { kind: 'paragraph', text: `Gracze majóm obronne prostrzedki, kiere se aktywujóm automatycznie. Poużyci karty ${card('CloudWalker', 'Mrakoszlap')}, ${card('Immunity', 'Imunita')}, ${card('KevlarVest', 'Kewlar')}, ${card('Mirror', 'Zwierciadło')} albo ${card('RopeWalker', 'Prowazochodec')} powoduje, że ta karta przepado.` },
    ],
    subsections: [
      {
        title: tunnel('Tunel'),
        blocks: [
          { kind: 'paragraph', text: 'Jak zostanie trefióny piyrwszy pokozany gracz, kula leci tunelym do drugiego. Jak od jednego gracza idzie wiyncej tuneli, kula se dzieli na odłamki, kiere lecóm wszystkimi tunelami (majóm ty same właściwości co normalno kula). Kula ani odłamki nimogóm lecieć tym samym tunelym dwa razy. Jak sóm dwa albo trzi tunele w tym samym kierunku miyndzy tymi samymi graczami, kula se nie dzieli, jyny leci tunelym zrobiónym nejwcześnieji.' }
        ]
      },
      {
        title: gasMask('Gazmaska'),
        blocks: [
          { kind: 'paragraph', text: `Ci co majóm karty ${card('Mage', 'Mag 2')}, ${card('MadGunman', 'Szileny Strzelec 2')} a ${card('GhostBobo', 'Duch Bobo')} majóm ${gasMask('Gazmaska')}, kiero chróni przed ${card('Sand', 'Pioskym')} a smrodym z ${card('Sock', 'Fusekli')}.` }
        ]
      }
    ]
  },
  {
    title: 'Reguły obronne – noc',
    blocks: [
      { kind: 'paragraph', text: `Każdy nocny atak se weryfikuje przez system obron w danym porzadi – jak zadziało jedna bariera, reszta se uż niesprawdzo. Przed listóm priorytetów se dycki sprawdzo, jeśli ${card('Matrix')} nie chycił kule.` },
      { kind: 'paragraph', text: 'Aplikacja przeliczo ataki podle tejtu hierarchii, ale kóńcowy raport je naschwol pomiyszany, aby nie szło poznać strzelców.' }
    ],
    subsections: [
      {
        title: `a) Kula od ${card('Mafia', 'Mafii')}`,
        blocks: [
          { kind: 'list', title: `Strzilo ${card('Mafia', 'Mafian')} z najwyższym numerem:`, ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('AlCapone', 'Al Capone'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kewlar'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      },
      {
        title: `b) Kula od ${card('MadGunman', 'Szilonego Strzelca')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kewlar'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      },
      {
        title: `c) Kula od ${card('Sniper', 'Snipera')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kewlar'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      },
      {
        title: `d) Smród z ${card('Sock', 'Fusekli')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [gasMask('Gazmaska'), card('Doctor', 'Doktor'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      },
      {
        title: `e) Kula od ${card('Matrix', 'Matrixa')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('KevlarVest', 'Kewlar'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      }
    ]
  },
  {
    title: 'Reguły obrónne – dziyń',
    blocks: [
      { kind: 'paragraph', text: `We dnie obróna też działo automatycznie a je stosowano przed śmiercióm gracza. Jeśli ${card('BlindExecutioner', 'Slepy Kat')} pokozoł ofiare zastympczóm, zamiana celów nastympuje automatycznie przed zużyciym tarcz.` }
    ],
    subsections: [
      {
        title: 'a) Skazani w głosowaniu',
        blocks: [
          { kind: 'list', ordered: true, items: [card('RopeWalker', 'Prowazochodec'), card('Immunity', 'Imunita'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      },
      {
        title: `b) Strzał w dziyń (${card('Anarchist', 'Anarchista')}, ${card('MassMurderer', 'Masowy Zabijak')}, ${card('Terrorist', 'Bomba')})`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Immunity', 'Imunita'), card('KevlarVest', 'Kewlar'), card('CloudWalker', 'Mrakoszlap')] }
        ]
      }
    ]
  },
  {
    title: 'Kolejność budzyń',
    blocks: [
      
    ],
    subsections: [
      {
        title: 'a) Parzyste noce',
        blocks: [
          { kind: 'paragraph', text: 'W parzyste noce se budzóm:' },
          {
            kind: 'list',
            items: [
              card('Jailer', 'Jailer'),
              card('Gravedigger', 'Grabarz'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Magowie'),
              card('Slime', 'Ślina'),
              card('Leech', 'Pijawica'),
              card('Sand', 'Piosek'),
              card('Cobra', 'Kobra'),
              card('Magnet', 'Magnet'),
              card('GhostBobo', 'Duch Bobo'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jożin z Bażin'),
              card('Mafia', 'Mafia'),
              card('MadGunman', 'Szileny Strzelcy'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Fusekla'),
              card('Judge', 'Soudce'),
              card('BlindExecutioner', 'Slepy Kat'),
              card('Matrix', 'Strzał Matrixa')
            ]
          }
        ]
      },
      {
        title: 'b) Nieparzyste noce',
        blocks: [
          { kind: 'paragraph', text: 'W nieparzyste noce se budzóm:' },
          {
            kind: 'list',
            items: [
              card('Gravedigger', 'Grabarz'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Magowie'),
              card('Slime', 'Ślina'),
              card('Leech', 'Pijawica'),
              card('Sand', 'Piosek'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jożin z Bażin'),
              card('Mafia', 'Mafia'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Fusekla'),
              card('BlindExecutioner', 'Slepy Kat'),
              card('Matrix', 'Strzał Matrixa')
            ]
          }
        ]
      },
      {
        title: 'c) Dodatkowe zasady nocne',
        blocks: [
          { kind: 'paragraph', text: `Pod kóniec każdej trzeci nocy (zaczynajónc od drugi) se budzi ${card('Spyglass', 'Luneta')}, aby wiedziała, kierzi gracze byli aktywni.` },
          { kind: 'paragraph', text: `Nikiere role (np. ${card('Matrix')}) majóm ograniczónóm liczbe użyć; jak se wyczerpióm, Prowadzóncy ich przestowo budzić.` }
        ]
      }
    ]
  },
  {
    title: 'Zasady balansu karet',
    blocks: [
      { kind: 'paragraph', text: 'Aby gra była sprawiedliwo, aplikacja stosuje taki oto ograniczynia przy rozdowaniu roli:' },
      {
        kind: 'list',
        items: [
          `Gracz może mieć jyny jednóm karte ${card('Mafia', 'Mafii')}.`,
          `Gracz może mieć jyny jednóm karte z pary ${card('Gandalf')} / ${card('HorsePiece', 'Kus Konia')}.`,
          `Gracz może mieć jyny jednóm karte z zestawu: ${card('Mage', 'Mag 2')} / ${card('MadGunman', 'Szileny Strzelec 2')} / ${card('GhostBobo', 'Duch Bobo')}.`,
          `Gracz może mieć jyny jednóm karte z pary ${card('Leech', 'Pijawica')} / ${card('Cobra')}.`,
          `Gracz może mieć jyny jednego ${card('MadGunman', 'Szilonego Strzelca')}.`,
          `Gracz może mieć jyny jednóm karte ${card('Slime', 'Śliny')}.`,
          `Gracz może mieć jyny jednóm karte z pary ${card('Atheist', 'Ateista')} / ${card('Matrix')}.`,
          `Gracz co mo karte ${card('Mafia', 'Mafii')} niemoże dostać ${card('Doctor', 'Doktora')} ani ${card('Spyglass', 'Lunety')}.`,
          `Gracz może dostać maksymalnie dwa ${card('CloudWalker', 'Mrakoszlapy')}.`,
          `Gracz może dostać maksymalnie dwóch ${card('RopeWalker', 'Prowazochodców')}.`,
          `Gracz co mo karte ${card('Gravedigger', 'Grabarz')}, ${card('Leech', 'Pijawica')}, ${card('AlCapone', 'Al Capone')}, ${card('Gandalf')} albo ${card('HorsePiece', 'Kus Konia')} może dostać jyny jednego ${card('CloudWalker', 'Mrakoszlapa')}.`
        ]
      }
    ]
  }
];

export const TRANSLATIONS_PO_NASZYMU = {
  // Role labels
  role_AlCapone: 'Al Capone',
  role_Anarchist: 'Anarchista',
  role_Astronomer: 'Astronom',
  role_Atheist: 'Ateista',
  role_BlindExecutioner: 'Slepy Kat',
  role_CloudWalker: 'Mrakoszlap',
  role_Cobra: 'Kobra',
  role_Communist: 'Komunista',
  role_Doctor: 'Doktor',
  role_Gandalf: 'Gandalf',
  role_GhostBobo: 'Duch Bobo',
  role_Glazier: 'Szklorz',
  role_Gravedigger: 'Grabarz',
  role_HorsePiece: 'Kus Konia',
  role_Immunity: 'Imunita',
  role_Jailer: 'Jailer',
  role_Judge: 'Soudce',
  role_KevlarVest: 'Kewlar',
  role_Kovac: 'Kovacz',
  role_Leech: 'Pijawica',
  role_MadGunman: 'Szileny Strzelec',
  role_Mafia: 'Mafia',
  role_Magnet: 'Magnet',
  role_MassMurderer: 'Masowy Zabijak',
  role_Matrix: 'Matrix',
  role_Meciar: 'Mecziar',
  role_Mage: 'Mag',
  role_Mirror: 'Zwierciadło',
  role_RopeWalker: 'Prowazochodec',
  role_Sand: 'Piosek',
  role_Slime: 'Ślina',
  role_Sniper: 'Sniper',
  role_Sock: 'Fusekla',
  role_Spyglass: 'Luneta',
  role_SwampMonster: 'Jożin z Bażin',
  role_Terrorist: 'Terrorysta',
  role_TimeLord: 'Pan Czasu',

  // Card descriptions
  card_description_AlCapone: 'Al Capone jako ojciec chrzestny Mafii je imunni na jeji ataki. Ochróna ta działo na bezpostrzedni strzał Mafii i na kule przekierowane przez Tunel, ale nie chróni przed kulóm przekierowanóm przez Magnet albo Zwierciadło.',
  card_description_Anarchist: 'Anarchista może roz za gre w dziyń użyć swoji zdolności, a powiedzieć "I shoot you baby!", po czym strzylo do osoby, kieróm se wybiere.',
  card_description_Astronomer: 'Astronom może roz za gre w dziyń użyć swoji zdolności, godajónc "Noc!", co hned kóńczy dziyń, aj jak prawie trwo głosowani.',
  card_description_Atheist: 'Tunel zrobiony od Maga do Ateisty nie działo. Prowadzóncy nie godo Magowi, że zrobił tunel na Ateiste.',
  card_description_BlindExecutioner: 'Slepy Kat może dwa razy za gre pokozać w nocy dwóch graczy. Jak w nastympny dziyń piyrwszy ze wskozanych graczy mo być powieszóny, zamiast niego ginie tyn drugi.',
  card_description_CloudWalker: 'Mrakoszlap to je podstawowo karta obrónno, działo jako dodatkowe życi. Zużywo se, jak gracz nimo innej ochróny.',
  card_description_Cobra: 'Kobra każdóm parzystóm noc pokazuje grocza, kiery podle ni mo Pijawice. Jak trefi, pod kóniec nocy dostanie Mrakoszlapa a zjy Pijawice (gracz z tóm kartóm straci swoje zdolności).',
  card_description_Communist: 'Komunista może roz za gre w dziyń użyć swoji zdolności, godajónc "Obywatele, w tej rundzie my sóm wszyscy równi", a tym anuluje na jedyn dziyń zdolności Mecziara, Kovacza, Ducha Bobo a Soudce.',
  card_description_Doctor: 'Doktor każdej nocy pokazuje gracza, kierego lyczy, a tym go chróni roz przed kulóm albo smrodym z Fusekli. Co trzecióm noc (zaczynajónc od piyrwszej albo drugi) może ulyczyć samego siebie. Jak Doktor zustanie sóm przeciwko jednymu albo kielasi Mafianóm a nimóg by se ulyczyć sóm, je deaktywowany.',
  card_description_Gandalf: 'Jak Kus Konia straci Mrakoszlapa, dostanie go Gandalf. W nocy może tak dostać jyny jednego Mrakoszlapa.',
  card_description_Glazier: 'Jak Szklorz nimo żodnego Zwierciadła, a inszemu graczowi w nocy zustanie zniszczóne, Szklorz go dostanie pod kóniec nocy. Może dostać jyny jedno Zwierciadło za noc.',
  card_description_GhostBobo: 'Duch Bobo każdóm parzystóm noc pokazuje grocza, kiery w nastympny dziyń bydzie mioł zakaz mówiynio (zakaz może zruszyć jyny Komunista). Jak oskarżóny gracz mo zakaz dany od Ducha Bobo, wybiyro se osobe, kiero go bydzie brónić tłumaczónc jego miny a gesty.',
  card_description_Gravedigger: 'Grabarz może roz za gre w nocy wykopać groby do Mrakoszlapów, a pod kóniec nocy dostanie tela Mrakoszlapów, wiela ich tej nocy stracili inni grocze.',
  card_description_HorsePiece: 'Jak Gandalf straci Mrakoszlapa, dostanie go Kus Konia. W nocy może tak dostać jyny jednego Mrakoszlapa.',
  card_description_Immunity: 'Karta obrónno na przipadek trefiynio kulóm w dziyń albo skazania na śmierć na szubienicy.',
  card_description_Jailer: 'Jailer może roz za gre pokozać gracza, kierego wsadzi do wiynziynia, blokujónc jego zdolności w tej nocy. Prowadzóncy budzi zawrzitego gracza, ale wyraźnie mu pokazuje, że je zawrzity.',
  card_description_Judge: 'Soudce każdej parzystej nocy pokazuje gracza, kiery w nastympny dziyń bydzie mioł zakaz głosowanio. Komunista może tyn zakaz zruszyć.',
  card_description_KevlarVest: 'Karta obrónno na przipadek trefiynio kulóm.',
  card_description_Kovac: 'Kovacz zmniyjszo liczbe głosów za jego śmiercióm o 1. Jak Komunista użyje swojóm zdolność, Kovacz traci tyn bonus.',
  card_description_Leech: 'Pijawica każdej nocy pokazuje gracza, do kierego se przysyso. Jak tyn gracz straci w nocy Mrakoszlapa albo zginie, Pijawica dostanie Mrakoszlapa. Pijawica może być zjedzóno Kobróm.',
  card_description_MadGunman: 'Szileny Strzelec każdej parzystej nocy strzilo na jednego grocza.',
  card_description_Mafia: 'Mafian może wygrać gre przez zabici wszystkich normalnych graczy, używajónc kuli każdej nocy. Aby Mafia wystrzeliła, wszyscy Mafianie muszóm w nocy pokozać tego samego grocza. Aby mógli ustalić porzadi strzilanio, budzóm se na poczóntku piyrwszej nocy.',
  card_description_Mage: 'Mag każdej nocy pokazuje dwóch groczy, miyndzy kierymi robi jednokierunkowy tunel. Jak piyrwszy gracz dostanie kulóm, ta wyndruje tunelym do drugigo.',
  card_description_Magnet: 'Magnet każdej parzystej nocy pokazuje grocza, kierego magnetyzuje. Jak kole namagnetyzowanego gracza leci kula, zostanie do niego przycióngnyto. Kula może być przycióngnyto jyny roz.',
  card_description_MassMurderer: 'Jak Masowy Zabijak zostanie skazany na szubienice, strzylo do wszystkich, kierzi na niego głosowali.',
  card_description_Matrix: 'Matrix może roz za gre w nocy zmiynić prawa fizyki – chycić wszystki kule, co na niego lecóm, a wypuścić ich pod kóniec nocy.',
  card_description_Meciar: 'W głosowaniu se jego głos liczy podwójnie. Jak Komunista użyje swojóm zdolność, Mecziar traci tyn bonus.',
  card_description_Mirror: 'Karta obrónno na przipadek trefiynio kulóm Mafii albo Szilenego Strzelca. Po rozbiciu Zwierciadła kula wraco do gracza, od kierego przileciała, chyba że Zwierciadło było poplamióne błotym od Jożina z Bażin.',
  card_description_RopeWalker: 'Karta obrónno przed śmierciom na szubienicy.',
  card_description_Sand: 'Gracz z kartóm Piosek każdej nocy pokazuje grocza, kierego posypuje pioskym. Piosek ruszy efekt Śliny, a gracz je zaś podatny na strzał. Ochrone przed Pioskym majóm gracze z Gazmaskóm (Szileny Strzelec 2, Mag 2 a Duch Bobo).',
  card_description_Slime: 'Gracz z kartóm Ślina każdej nocy pokazuje grocza, kierego chce oślinić. Oślinióny gracz je roz w nocy chróniony przed kulóm Mafii, Szilenego Strzelca a Snipera (kula se z niego ześlizgnie). Efekt Śliny idzie zruszyć Pioskym.',
  card_description_Sniper: 'Sniper może roz za gre pokozać grocza, w kierego strzilo silnym pociskym. Tyn je tak silny, że rozbije aj Zwierciadło a leci dali.',
  card_description_Sock: 'Gracz z Fuseklóm może roz za gre w nocy ciepnóć Fusekle miyndzy dwóch graczy, kierzi padajóm od jejigo smrodu. Przed smrodym Fusekli chróni jyny Gazmaska, Doktor a Mrakoszlap. Szileny Strzelec 2, Mag 2 a Duch Bobo majóm Gazmaske.',
  card_description_Spyglass: 'Luneta se budzi pod kóniec każdej trzeci nocy (zaczynajónc od drugi) a dowiaduje se od Prowadzóncego, kierzi gracze byli tej nocy obudzóni.',
  card_description_SwampMonster: 'Jożin z Bażin może trzi razy za gre pokozać w nocy gracza, kierymu poplami Zwierciadło. Kula rozbijo brudne Zwierciadło, a leci dali. Jożin może użyć swojóm zdolność wiyncej razy w jednóm noc. Jak mo Jożin też karte Mafiana, Snipera albo Szilenego Strzelca, może poplamić Zwierciadło jyny dwa razy.',
  card_description_Terrorist: 'Terrorysta może roz za gre w dziyń użyć swojóm zdolność, godajónc "Bomba!", po czym strzylo do wszystkich graczy.',
  card_description_TimeLord: 'Pan Czasu może roz za gre na poczóntku dnia albo nocy powiedzieć "Jeżech Panym czasu!" a przeskoczyć cały dziyń albo noc.',

  // App Shell & Navigation
  app_title: 'Mafia²',
  app_continue_game: 'Pokraczować we grze',
  app_continue_round: 'Runda {round}',
  app_new_game: 'Nowo gra',
  nav_game: 'Gra',
  nav_players: 'Gracze',
  nav_logs: 'Logi',
  nav_rules: 'Zasady',
  nav_cards: 'Karty',
  nav_settings: 'Nastawiynia',
  nav_my_cards: 'Moje karty',
  nav_all_cards: 'Wszystki karty',
  player_link_invalid: 'Zły link gracza. Popytej Prowadzóncego o nowy.',

  // Rules View
  rules_header_title: 'Reguły',
  rules_missing_language: 'Ni ma przetłumaczónych reguł do tego jynzyka.',

  // Logs
  logs_heading: 'Dziynnik nocy a dnia',
  logs_subheading: 'Pokazujym raport nocy a dnia #{round}',
  logs_round_label: 'Runda',
  logs_view_label: 'Widok',
  logs_public_report_title: 'Publiczny raport',
  logs_public_report_placeholder: 'Publiczny raport bydzie na poczóntku dnia.',
  logs_round_title: 'Dziynnik rundy',
  logs_round_empty: 'Żadnych wpisów dlo tej rundy.',
  logs_panel_title: 'Historia gry',
  logs_panel_empty: 'Dziynnik je pusty.',

  // Cards
  cards_collection_title: 'Kolekcja karet',
  cards_placeholder_description: 'Opis se robi.',
  cards_toggle_icons: 'Ikony',
  cards_toggle_images: 'Grafiki',
  cards_section_passive: 'Zdolności pasywne',
  cards_section_active: 'Zdolności aktywne',
  player_add_card_title: 'Przidej zdobytóm karte',
  player_add_card_button: 'Przidej karte',
  player_add_card_type_label: 'Typ karty',
  player_add_card_instance_label: 'Numer karty',
  player_add_card_submit: 'Przidej karte',
  player_add_card_duplicate: 'Ta karta uż je na liście.',

  // Settings
  settings_language_title: 'Jynzyk aplikacji',
  settings_language_active: 'Aktywny',
  settings_title: 'Nastawiynia',
  settings_player_node_size: 'Wielkość pionków graczy',
  settings_reset_player_size: 'Resetuj wielkość pionków',
  settings_player_node_hint: 'Pomogo trefić w kulki na wielkich stołach.',
  settings_bullet_speed: 'Pryndkość kuli',
  settings_bullet_speed_fast: 'Szybcij',
  settings_bullet_speed_slow: 'Pomaleji',
  settings_bullet_speed_hint: 'Steruje tempym animacji nocnych strzałów.',
  settings_storage_title: 'Pamiynć',
  settings_export_data_button: 'Eksportuj dane gry',
  settings_import_data_button: 'Importuj z pliku',
  settings_import_warning: 'Import zmazuje aktualnóm rozgrywke.',
  settings_import_error: 'Nie szło wczytać zapisu. Sprowdź plik a spróbuj zaś.',

  // GM Player List
  gm_players_title: 'Gracze ({count})',
  gm_players_badge_mafia: 'Mafia',
  gm_players_no_cards: 'Bez karet',
  gm_players_share_button: 'Udostympnij',
  gm_players_qr_button: 'Kod QR',
  gm_players_qr_instruction: 'Zeskanuj kod, aby otworzyć widok gracza.',
  gm_players_qr_generating: 'Generowani kodu QR…',
  gm_players_copy_link_instead: 'Skopiuj link zamiast tego',
  gm_players_manual_copy_title: 'Skopiuj link ryncznie',
  gm_players_manual_copy_fallback: 'Udostympniani tu nie działo. Skopiuj link a poślij go graczowi {name}.',
  gm_players_manual_copy_label: 'Link',
  gm_players_manual_copy_copy: 'Skopiuj link',
  gm_players_manual_copy_close: 'Zawrzyj',
  gm_players_share_insecure: 'Udostympniani działo jyny bez HTTPS (albo localhost). Skopiuj link albo otwórz aplikacje bez https://.',
  gm_players_share_unsupported: 'Ta przeglądarka nimo przycisku Udostympnij. Skopiuj link na dole.',
  gm_players_share_failure_reason: 'Udostympniani sie nie udało. Skopiuj link ryncznie.',
  gm_players_share_title: '{player} — link gracza',
  gm_players_copy_success: 'Link do gracza {player} skopiowany! Poślij mu go.',
  gm_players_qr_error: 'Nie idzie zrobić kodu QR. Link je w schowku.',
  gm_players_modal_close_qr_aria: 'Zawrzyj okno kodu QR',
  gm_players_modal_close_manual_aria: 'Zawrzyj okno kopiowanio',
  gm_players_share_mode_title: 'Tryb udostympnianio',
  gm_players_share_mode_hint: 'Ukrywo karty a farby Mafii jak pokazujesz kody QR.',
  gm_players_share_mode_on: 'Załónczóny',
  gm_players_share_mode_off: 'Wyłónczóny',
  gm_players_share_mode_cards_hidden: 'Karty ukryte w trybie udostympnianio.',
  gm_players_section_alive: 'Żywi',
  gm_players_section_dead: 'Mortwi',
  // Gameplay Texts
  victory_mafia: 'Wygrywo Mafia.',
  victory_innocent: 'Wygrywo Miasto.',
  log_start_game: 'Nowo gra se zaczła.',
  log_player_activate: '{cardLabel} {player} użył zdolności.',
  start_day: 'Zacznij dziyń',
  start_night_intro: 'Zaczyno noc, miasteczko idzie spać...',
  first_night_message: 'Mafia se budzi, aby ustaliła strategie.',
  wake_up: 'Budzi se {role}. Chce użyć swojóm zdolność?',
  wake_up_use_again: 'Chce {role} zaś użyć swojóm zdolność?',
  wake_up_shooter: 'Budzi se {role}. Na kogo chce strzelić?',

  // Role-specific wakeups, logs, and reports

  // Mage
  wake_up_mage_from: 'Budzi se {role}. Z kierego gracza chce zrobić tunel?',
  wake_up_mage_to: 'Na kierego gracza chce {role} zrobić tunel?',
  log_tunnel_duplicate: '{cardLabel} {player} chcioł zrobić tunel {source}->{target}, ale taki uż je.',
  log_tunnel_atheist: `{cardLabel} {player} chcioł zrobić tunel na gracza {target}, ale to ${card('Atheist', 'Ateista')}.`,
  log_tunnel_same_player: '{cardLabel} {player} nimoże zrobić tunel na tego samego gracza.',
  log_tunnel_created: '{cardLabel} {player} zrobił tunel {tunnelNumber} ({source} -> {target}).',

  // Slime
  wake_up_slime: 'Budzi se {role}. Kogo chce poślinić?',
  log_action_slime: '{cardLabel} {player} poślinił gracza {target}.',
  public_report_slime: '{name} był poślinióny.',
  public_report_slime_multi: '{name} był poślinióny (x{count}).',

  // Leech
  wake_up_leech: 'Budzi se {role}. Do kogo se chce przissać?',
  log_action_leech: '{cardLabel} {player} se przissoł do gracza {target}.',
  public_report_leech_cloudwalker: `${card('Leech', 'Pijawica')} dostała ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  log_night_leech_cloudwalker: `{cardLabel} {player} dostała ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,

  // Sand
  wake_up_sand: 'Budzi se {role}. Kogo chce posypać pioskym?',
  log_action_sand: '{cardLabel} {player} posypoł pioskym gracza {target}.',
  log_action_sand_fail: `{cardLabel} {player} chcioł użyć ${card('Sand', 'Piosku')} na graczu {target}, ale tyn mo Gazmaske.`,
  public_report_sand: '{name} mo piosek w oczach.',
  public_report_sand_saved: `Gazmaska uchróniła gracza przed ${card('Sand', 'Pioskym')}.`,

  // Cobra
  wake_up_cobra: 'Budzi se {role}. Kogo chce ugryźć?',
  log_action_cobra: '{name} był ugryzióny.',
  public_report_cobra_cloudwalker: `${card('Cobra', 'Kobra')} zjadła ${card('Leech', 'Pijawice')} a dostała ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  log_night_cobra_cloudwalker: `{cardLabel} {player} zjadła ${card('Leech', 'Pijawice')} a dostała ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,

  // Magnet
  wake_up_magnet: 'Budzi se {role}. Kogo chce namagnetyzować?',
  log_action_magnet: '{name} był namagnetyzowany.',

  // Ghost Bobo
  wake_up_ghost: 'Budzi se {role}. Kómu chce zakozać mówić?',
  log_action_ghost: '{cardLabel} {player} zakozoł mówić graczowi {target}.',
  public_report_ghost_bobo: '{name} dzisio nimoże mówić.',

  // Judge
  wake_up_judge: 'Budzi se {role}. Komu chce zakozać głosować?',
  log_action_judge: '{cardLabel} {player} zakozoł głosować graczowi {target}.',
  public_report_judge: '{name} dzisio nimoże głosować.',

  // Swamp Monster
  wake_up_swamp_monster: 'Kogo chce ochlapać błotym?',
  log_night_swamp_attack: '{cardLabel} {player} ochlapoł błotem gracza {target}.',

  // Executioner
  wake_up_executioner_save: 'Budzi se {role}. Kogo chce ułaskawić ze szubienicy?',
  wake_up_executioner_victim: 'Kto mo iść na szubienice zamiast niego?',
  log_night_executioner_save: '{saved} je chróniony przed wyrokym, zamiast niego zginie {victim}.',
  log_day_blind_executioner_redirect: '{cardLabel} {player} — wyrok zostoł przekierowany. {victim} idzie pod szubenice zamiast {saved}.',
  public_report_day_blind_executioner_redirect: 'W ostatni chwili skazany zostoł wymiynióny — {victim} idzie pod szubenice zamiast {saved}.',

  // Sock
  wake_up_sock_first: 'Miyndzy kogo ciepnóć Fusekle? Pokoż piyrwszego gracza.',
  wake_up_sock_second: 'Teraz pokoż sómsiada tego gracza.',
  log_action_sock_throw: `{cardLabel} {player} wycelował ${card('Sock', 'Fuseklóm')} miyndzy graczy {first} a {second}.`,
  log_sock_throw_intro: `{cardLabel} {player} ciepnół ${card('Sock', 'Fusekle')} miyndzy graczy {first} a {second}. `,
  log_sock_result_gasmask: 'Gazmaska ochróniła gracza {name}. ',
  log_sock_result_dead: 'Gracz {name} był uż mortwy. ',
  log_sock_result_doctor: `${card('Doctor', 'Doktor')} zachrónił gracza {name}. `,
  log_sock_result_cloudwalker: `Gracz {name} stracił ${card('CloudWalker', 'Mrakoszlapa {num}')}. `,
  log_sock_result_death: 'Gracz {name} umrził. ',
  public_report_sock_used: `${card('Sock', 'Fusekla')} poleciała miyndzy dwóch graczy. `,
  public_report_sock_first_gasmask: 'Piyrwszego gracza ochróniła Gazmaska',
  public_report_sock_first_dead: 'Piyrwszy gracz był uż mortwy',
  public_report_sock_first_doctor: `Piyrwszego gracza zachrónił ${card('Doctor', 'Doktor')}`,
  public_report_sock_first_cloudwalker: `Piyrwszy gracz stracił ${card('CloudWalker', 'Mrakoszlapa {num}')}`,
  public_report_sock_first_death: 'Piyrwszy gracz, {name}, opuszczo naszóm gre',
  public_report_sock_second_gasmask: ', a drugigo ochróniła Gazmaska.',
  public_report_sock_second_dead: ', a drugi gracz był uż mortwy.',
  public_report_sock_second_doctor: `, a drugigo zachrónił ${card('Doctor', 'Doktor')}.`,
  public_report_sock_second_cloudwalker: `, a drugi gracz stracił ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  public_report_sock_second_death: ', a drugi gracz, {name}, opuszczo naszóm gre.',
  public_report_sock_first_only_suffix: '.',

  // Jailer
  wake_up_jailer: 'Budzi se {role}. Kogo wsadzi do wiynziynia?',
  log_jailer_imprison: '{cardLabel} {player} wsadził do wiynziynia gracza {target}.',
  log_action_blocked_jailed: '{cardLabel} {player} siedzi w wiynziyniu, tak tej nocy se nic nie stanie.',

  // Doctor
  wake_up_doctor_heal_self: 'Budzi se {role}. Kogo chce ulyczyć? (może siebie)',
  wake_up_doctor_heal_other: 'Budzi se {role}. Kogo chce ulyczyć? (nimoże siebie)',
  log_doctor_fail: `{cardLabel} {player} chcioł ulyczyć {target}, ale cel nie bydzie ulyczóny, bo ${card('Doctor', 'Doktor')} działo som przeciw ${card('Mafia', 'Mafii')}.`,
  log_doctor_success: '{cardLabel} {player} ulyczy gracza {target}.',
  log_doctor_self_locked: '{cardLabel} {player} nimoże ulyczyć siebie tej nocy.',

  // Matrix
  wake_matrix_shot: 'Budzi se Matrix. Na kogo chce strzelić? (kula {current}/{total})',
  log_night_matrix_activate: 'Dowej pozór na biołego królika... ({cardLabel} {player} poużył zdolność.)',
  log_night_matrix_bullet_summary: `Ilość kul, kiere ${card('Matrix')} {player} chycił tej nocy: {count}.`,

  // Spyglass
  wake_up_spyglass: 'Budzi se Luneta. Dowiedziała se, kto był aktywny tej nocy?',
  spyglass_reveal_intro: 'Tej nocy se obudzili: {names}.',
  spyglass_reveal_none: 'Tej nocy se nigdo nie obudził.',

  // Mafia/Shooting
  log_mafia_jailed: `{cardLabel} {player} je w wiynziyniu, tak ${card('Mafia', 'Mafia')} nie wystrzeli.`,
  log_mafia_no_consensus: `${card('Mafia', 'Mafianie')} nie byli zgodni, tak tej nocy nie wystrzelili.`,
  log_shoot: '{cardLabel} {player} strzilo do gracza {target}.',
  log_shooter_aim: '{cardLabel} {player} celuje w gracza {target}.',

  // Time Lord
  ui_timelord_skip_night: '{cardLabel}: Przeskocz noc',
  ui_timelord_skip_day: '{cardLabel}: Przeskocz dziyń',
  log_timelord_skip_day: '{cardLabel} {player} przeskoczył dziyń.',
  log_timelord_skip_night: '{cardLabel} {player} przeskoczył noc.',

  // Public Reports (Resolution)
  log_day_vest_hit: `{target} traci ${card('KevlarVest', 'Kewlar {num}')}.`,
  log_day_ropewalker_lost: `{target} traci ${card('RopeWalker', 'Prowazochodca {num}')}.`,
  log_day_immunity_lost: `{target} traci ${card('Immunity', 'Imunite {num}')}.`,
  log_day_cloudwalker_lost: `{target} traci ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  log_day_death: '{target} ginie.',

  // Morning Report
  public_report_default: 'Miasteczko Palermo wstowo.',
  public_report_matrix: `Tej nocy ${card('Matrix')} użył swojóm funkcje. Ilość kul kiere chycił: {count}.`,
  public_report_cloudwalker_gain: `{cardLabel} dostoł ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  public_report_glazier_mirror: `${card('Glazier', 'Szklorz')} zrobił ${card('Mirror', 'Zwierciadło {num}')}.`,
  log_night_cloudwalker_gain: `{cardLabel} {player} dostoł ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  log_night_glazier_mirror: `{cardLabel} {player} zrobił ${card('Mirror', 'Zwierciadło {num}')}.`,
  
  
  // Bullet Report Fragments
  public_report_bullet_start: 'Padnół strzał',
  public_report_bullet_dead_target: ', ale trefił mortwego gracza.',
  public_report_bullet_matrix_catch: ` a ${card('Matrix')} go chycił.`,
  public_report_bullet_magnet: `, był przycióngnyty ${card('Magnet', 'Magnetym')}`,
  public_report_bullet_split: ', rozszczepiajónc se na {count} czynści.',
  public_report_bullet_tunnel_single: ', przelecioł tunelym',
  public_report_bullet_tunnel_segment: ' {index}. odłamek przelecioł tunelym',
  public_report_bullet_slime: ` a pocisk se ześlizgnół po ${card('Slime', 'Ślinie')}.`,
  public_report_bullet_al_capone: `, ale ${card('AlCapone', 'Al Capone')} zneutralizował kule.`,
  public_report_bullet_doctor: `, a gracz był ulyczóny przez ${card('Doctor', 'Doktora')}.`,
  public_report_bullet_mirror_break: `, pynkło ${card('Mirror', 'Zwierciadło {num}')}`,
  public_report_bullet_return: ', pocisk se wrócił',
  public_report_bullet_continue: ', ale pocisk leci dali',
  public_report_bullet_vest_loss: ` a ${card('KevlarVest', 'Kewlar {num}')} zostoł zniszczóny.`,
  public_report_bullet_cloudwalker_loss: ` a umrził ${card('CloudWalker', 'Mrakoszlap {num}')}.`,
  public_report_bullet_death: ' a naszóm gre opuszczo {name}.',

  log_night_bullet_start: '{cardLabel} {shooter} strzilo do gracza {target}. ',
  log_night_bullet_start_generic: 'Padnół strzał na gracza {target}. ',
  log_night_bullet_split: 'Pocisk se rozszczepił na {count} czynści.',
  log_night_bullet_dead_target: ' a trefił mortwego gracza {target}.',
  log_night_bullet_matrix_catch: ` a ${card('Matrix')} {target} go chycił.`,
  log_night_bullet_magnet_initial: `Pocisk była przycióngnyty ${card('Magnet', 'Magnetym')} do gracza {target}`,
  log_night_bullet_magnet: `, był przycióngnyty ${card('Magnet', 'Magnetym')} do gracza {target}`,
  log_night_bullet_magnet_dead: ` a trefio w mortwego gracza {target} (efekt ${card('Magnet', 'Magnetu')}).`,
  log_night_bullet_tunnel_initial: 'Pocisk przelecioł tunelym {num} ({src} -> {target})',
  log_night_bullet_tunnel_single: ', przelecioł tunelym {num} ({src} -> {target})',
  log_night_bullet_tunnel_segment: ' {index}. odłamek przelecioł tunelym {num} ({src} -> {target})',
  log_night_bullet_slime_initial: `Pocisk se ześlizguje po ${card('Slime', 'Ślinie')} z gracza {target}.`,
  log_night_bullet_slime: ` a ześlizguje se po ${card('Slime', 'Ślinie')} z gracza {target}.`,
  log_night_bullet_al_capone_initial: `${card('AlCapone', 'Al Capone')} {target} neutralizuje pocisk.`,
  log_night_bullet_al_capone: ` a ${card('AlCapone', 'Al Capone')} {target} jóm neutralizuje.`,
  log_night_bullet_doctor_initial: `${card('Doctor', 'Doktor')} zachrónił gracza {target}.`,
  log_night_bullet_doctor: ` a gracz {target} był wylyczóny przez ${card('Doctor', 'Doktora')}.`,
  log_night_bullet_mirror_break_initial: `Pocisk rozbijo ${card('Mirror', 'Zwierciadło {num}')} u gracza {target}`,
  log_night_bullet_mirror_break: `, u gracza {target} pynkło ${card('Mirror', 'Zwierciadło {num}')}`,
  log_night_bullet_return: ', pocisk se wrócił do {target}',
  log_night_bullet_continue_sniper: `, ale pocisk leci dali, bo ${card('Mirror', 'Zwierciadło')} gracza {target} nie odbijo strzałów ${card('Sniper', 'Snipera')},`,
  log_night_bullet_continue_matrix: `, ale pocisk leci dali, bo ${card('Mirror', 'Zwierciadło')} gracza {target} nie zatrzymuje strzałów ${card('Matrix', 'Matrixa')},`,
  log_night_bullet_continue_mud: `, ale pocisk leci dali, bo ${card('Mirror', 'Zwierciadło')} gracza {target} było brudne,`,
  log_night_bullet_vest_loss_initial: `Pocisk niszczy ${card('KevlarVest', 'Kewlar {num}')} gracza {target}.`,
  log_night_bullet_vest_loss: ` a {target} traci ${card('KevlarVest', 'Kewlar {num}')}.`,
  log_night_bullet_cloudwalker_loss_initial: `Pocisk biere ${card('CloudWalker', 'Mrakoszlapa {num}')} graczowi {target}.`,
  log_night_bullet_cloudwalker_loss: ` a {target} traci ${card('CloudWalker', 'Mrakoszlapa {num}')}.`,
  log_night_bullet_death_initial: 'Pocisk zabijo gracza {name}.',
  log_night_bullet_death: ' a {name} ginie.',
  log_night_bullet_gandalf_from_horse: ` ${card('Gandalf')} {gandalf} dostoł ${card('CloudWalker', 'Mrakoszlapa {num}')} (strata ${card('HorsePiece', 'Kusa Konia')} {horse}: {lost}).`,
  log_night_bullet_horsepiece_from_gandalf: ` ${card('HorsePiece', 'Kus Konia')} {horse} dostoł ${card('CloudWalker', 'Mrakoszlapa {num}')} (strata ${card('Gandalf')} {gandalf}: {lost}).`,

  // UI
  ui_confirm: 'Ja',
  ui_deny: 'Ni',
  ui_undo: 'Zpatki',
  ui_bomb: 'Bómba!',
  ui_next_phase: 'Dali',
  ui_replay_bullets: 'Powtórz animacje',
  ui_bullet_replay: 'Odtwarzani przebiegu strzałów...',
  ui_first_night_done: 'Kóniec narady Mafii',
  ui_start_night: 'Zacznij noc',
  ui_player_label: 'Gracz: {name}',
  ui_player_jailed_notice: 'Gracz {name} je we wiynziyniu — pokoż mu skrziżowane rynce 🙅.',
  ui_anarchist_baby: 'I shoot you baby!',
  ui_astronomer_night: 'Noc!',
  ui_communist_equal: 'Wszyscy równi!',
  ui_special_no_owner: 'Brak właściciela',
  day_action_vote: 'Przegłosowany',
  day_prompt_vote: 'Pokoż gracza, kiery był przegłosowany.',
  day_prompt_shot: 'Anarchista strzilo. Wybier cel.',
  day_prompt_mass_murderer_select: 'Masowy Zabijak strzilo do swoich oskarżycieli. Zaznacz graczy a potwierdź.',
  day_idle_message: 'Trwo dziyń. Użyj dostympnych akcji.',
  day_report_confirm: 'Potwierdź raport',
  public_report_day_player_left: 'Naszóm gre opuszczo {name}.',
  public_report_day_ropewalker_lost: `Umrził ${card('RopeWalker', 'Prowazochodec {num}')}.`,
  public_report_day_cloudwalker_lost: `Umrził ${card('CloudWalker', 'Mrakoszlap {num}')}.`,
  public_report_day_kevlar_lost: `Umrził ${card('KevlarVest', 'Kewlar {num}')}.`,
  public_report_day_immunity_lost: `Umrziła ${card('Immunity', 'Imunita {num}')}.`,
  ui_mass_murderer_target: 'Skazany: {name}',
  ui_mass_murderer_selected: 'Wybrano: {count}',
  ui_mass_murderer_confirm: 'Wystrzel',

  // Warnings
  warn_anarchist_unavailable: 'Anarchista uż nimoże strzelać.',
  warn_terrorist_unavailable: 'Terrorysta uż nimoże odpalić bómbe.',
  warn_astronomer_unavailable: 'Astronom uż nimoże zakóńczyć dziyń.',
  warn_astronomer_day_only: 'Astronom działo jny w dziyń.',
  warn_communist_unavailable: 'Komunista uż nimoże użyć swojóm zdolność.',
  warn_communist_day_only: 'Komunista działo jny w dziyń.',

  log_day_vote: 'Gracz {target} był przegłosowany.',
  log_day_shot: `${card('Anarchist', 'Anarchista')} {actor} strzelił na gracza {target}.`,
  log_day_bomb: `${card('Terrorist', 'Terrorysta')} {player} detonuje bómbe!`,
  log_day_astronomer: `${card('Astronomer', 'Astronom')} {player} kóńczy dziyń.`,
  log_day_communist: `${card('Communist', 'Komunista')} {player} wprowadzo równość.`,
  log_day_mass_murderer_trigger: `${card('MassMurderer', 'Masowy Zabijak')} {target} biere broń przed wyrokym.`,
  log_day_mass_murderer_shot: `${card('MassMurderer', 'Masowy Zabijak')} {player} zabijo {target}.`,

  // Phase Dividers
  log_divider_night_start: 'Noc {round} se zaczyno.',
  log_divider_night_end: 'Noc {round} se kóńczy.',
  log_divider_day_start: 'Dziyń {round} se zaczyno.',
  log_divider_day_end: 'Dziyń {round} se kóńczye.',

  // Setup Wizard
  setup_next: 'Dali',
  setup_remove: 'Aby poprawnie rozdać role, musisz wyciepać pore karet...',
  setup_step_count: 'Liczba graczy',
  setup_step_mafia: 'Liczba karet Mafii',
  setup_mafia_description: 'Wybier, wiela karet Mafii bydzie w talii ({min} - {max}).',
  setup_mafia_label: 'Karty Mafii w talii',
  setup_mafia_recommended: 'Sugerowano wartość dlo {players} graczy: {count}',
  setup_step_names: 'Miana',
  setup_step_balance: 'Balans gry',
  setup_balance_instruction: 'Aby wyrównać talie, wyciep {remove} karet albo przidej {add}.',
  setup_remove_instruction: 'Musisz wyciepać {count} karet, aby wyrównać talie.',
  setup_cards_remaining: 'Do wyciepania',
  setup_cards_missing: 'Brakuje karet',
  setup_cards_total: 'Łóncznie karet w talii: {count}',
  setup_cards_minimum: 'Przidej eszcze {missing}, aby każdy gracz dostoł aspóń jednóm karte.',
  setup_start_game: 'Rozpocznij gre',
};