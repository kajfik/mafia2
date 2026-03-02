import type { RuleSection } from './types';
import type { CardId } from '../types';

const card = (cardId: CardId, labelOverride?: string) =>
  labelOverride ? `{{card:${cardId}|${labelOverride}}}` : `{{card:${cardId}}}`;
const gasMask = (labelOverride?: string) =>
  labelOverride ? `{{gasMask|${labelOverride}}}` : '{{gasMask}}';
const tunnel = (labelOverride?: string) =>
  labelOverride ? `{{tunnel|${labelOverride}}}` : '{{tunnel}}';

export const RULES_CONTENT_PL: RuleSection[] = [
  {
    title: 'O grze',
    blocks: [
      { kind: 'paragraph', text: `Mafia to fabularna gra towarzyska dla 2–20 osób.` },
      { kind: 'paragraph', text: `Gracze dzielą się na dwie frakcje: ${card('Mafia', 'Mafię')} oraz Miasto (zwykłych mieszkańców). ${card('Mafia', 'Mafia')} wygrywa, gdy wyeliminuje wszystkich obywateli, natomiast Miasto triumfuje po pozbyciu się ${card('Mafia', 'Mafii')}.` },
      { kind: 'paragraph', text: 'Rozgrywka opiera się na dedukcji, blefie oraz umiejętnym zarządzaniu zdolnościami kart.' }
    ]
  },
  {
    title: 'Początek gry',
    blocks: [
      { kind: 'paragraph', text: 'Na początku partii każdy gracz otrzymuje taką samą liczbę kart.' },
      { kind: 'paragraph', text: 'Przed pierwszą nocą gracze powinni zapoznać się z działaniem swoich kart nocnych.' },
      { kind: 'paragraph', text: `System rozdawania kart posiada zabezpieczenia przed skrajnie niesprawiedliwymi układami (np. trafienie wszystkich ${card('CloudWalker', 'Chmurostąpów')} do jednego gracza). Szczegóły znajdują się w sekcji „Zasady balansu kart”.` }
    ]
  },
  {
    title: 'Noc',
    blocks: [
      { kind: 'paragraph', text: 'Gdy Konferansjer ogłasza noc, wszyscy gracze zamykają oczy. Następnie prowadzący wywołuje kolejno aktywne postacie, pytając o użycie zdolności i wybór celu. Obudzeni gracze odpowiadają bezszelestnie, używając gestów głowy lub rąk.' },
      { kind: 'paragraph', text: 'Noce dzielą się na parzyste i nieparzyste – od numeru nocy zależy, które karty są budzone i w jakiej kolejności.' },
      { kind: 'paragraph', text: 'Szczegółowy schemat budzeń ról nocnych i dziennych znajdziesz w sekcji „Kolejność budzeń”.' }
    ],
    subsections: [
      {
        title: `Pierwsza noc - narada ${card('Mafia', 'Mafii')}`,
        blocks: [
          { kind: 'paragraph', text: `Na początku pierwszej nocy prowadzący budzi całą ${card('Mafia', 'Mafię')}. To jedyny moment, w którym ${card('Mafia', 'Mafiosi')} mogą niemo ustalić strategię i kolejność eliminacji. Po zakończeniu narady ${card('Mafia', 'Mafia')} ponownie zasłania oczy i rozpoczyna się standardowa sekwencja nocy.` }
        ]
      }
    ]
  },
  {
    title: 'Dzień',
    blocks: [
      { kind: 'paragraph', text: 'O poranku miasto budzi się do życia, gracze otwierają oczy, a Konferansjer przedstawia raport z nocy.' },
      { kind: 'paragraph', text: 'Wyeliminowani gracze kończą udział w rozgrywce – od tej chwili nie mogą zabierać głosu ani brać udziału w głosowaniach.' },
      {
        kind: 'list',
        ordered: true,
        title: 'Przebieg dnia:',
        items: [
          'Konferansjer odczytuje sprawozdanie z wydarzeń nocnych.',
          `Gracze wnoszą oskarżenia wobec osób podejrzanych o przynależność do ${card('Mafia', 'Mafii')}, dążąc do skazania ich na śmierć szubienicą.`,
          `Oskarżeni gracze wygłaszają mowy obronne, starając się przekonać innych o swojej niewinności. Jeśli ${card('GhostBobo', 'Duch Bobo')} odebrał któremuś z oskarżonych głos, wskazuje on osobę (adwokata), której zadaniem jest obrona poprzez tłumaczenie mimiki i ruchów oskarżonego.`,
          `Konferansjer wymienia oskarżonych. Jeśli jest tylko jeden kandydat, gracze głosują dwukrotnie: najpierw za, a następnie przeciw jego egzekucji. W przypadku wielu kandydatów, gracze głosują kolejno wyłącznie za śmiercią każdego z nich. Przy każdym głosowaniu prowadzący odlicza: „Kto głosuje [opcja], proszę podnieść rękę za trzy, dwa, jeden”. Głosować mogą wszyscy (w tym sami oskarżeni), chyba że ${card('Judge', 'Sędzia')} odebrał komuś to prawo.`,
          `Po rozstrzygnięciu fazy głosowania miasto zasypia.`
        ]
      },
      { kind: 'paragraph', text: `Niektóre role modyfikują siłę głosu: głos ${card('Meciar', 'Mecziara')} liczy się podwójnie, natomiast liczba głosów oddanych na ${card('Kovac', 'Kovacza')} jest pomniejszana o jeden. ${card('Communist', 'Komunista')} może raz na grę znieść przywileje ${card('Meciar', 'Mecziara')}, ${card('Kovac', 'Kovacza')}, ${card('Judge', 'Sędziego')} oraz cenzurę ${card('GhostBobo', 'Ducha Bobo')}, zrównując prawa wszystkich graczy.` },
      { kind: 'paragraph', text: `Konferansjer liczy głosy ręcznie, samodzielnie uwzględniając bonus ${card('Meciar', 'Mecziara')} i modyfikator ${card('Kovac', 'Kovacza')}. Aplikacja jedynie wyświetla ikony przy odpowiednich rolach, więc prowadzący musi pamiętać o korekcie wyniku.` },
      { kind: 'paragraph', text: 'W przypadku remisu, kandydaci z równą liczbą głosów mogą – jeśli chcą – wygłosić ostateczną mowę obronną. Następnie przeprowadza się między nimi dogrywkę na tych samych zasadach. Jeśli ponownie dojdzie do remisu, głosowanie kończy się natychmiast bez egzekucji.' },
      { kind: 'paragraph', text: `Przed ogłoszeniem ostatecznego wyroku ${card('Astronomer', 'Astronom')} może użyć swojej zdolności, by natychmiast zakończyć dzień bez śmierci skazanego.` }
    ]
  },
  {
    title: 'Reguły obronne',
    blocks: [
      { kind: 'paragraph', text: `Gracze posiadają środki obrony przed śmiercią, które aktywują się automatycznie. Użycie karty ${card('CloudWalker', 'Chmurostąp')}, ${card('Immunity', 'Immunitet')}, ${card('KevlarVest', 'Kamizelka kuloodporna')}, ${card('Mirror', 'Zwierciadło')} lub ${card('RopeWalker', 'Linoskoczek')} powoduje jej bezpowrotną utratę.` },
    ],
    subsections: [
      {
        title: tunnel('Tunel'),
        blocks: [
          { kind: 'paragraph', text: 'Jeśli trafiony zostanie pierwszy wskazany gracz, pocisk przemieszcza się tunelem do drugiego. Jeśli od jednego gracza wychodzi więcej tuneli, pocisk dzieli się na odłamki, które przelatują wszystkimi tunelami (zachowując właściwości normalnego pocisku). Pocisk ani odłamki nie mogą przebyć tego samego tunelu dwukrotnie. W przypadku istnienia dwóch lub trzech tuneli w tym samym kierunku między tymi samymi graczami, pocisk nie dzieli się, lecz leci tunelem utworzonym najwcześniej.' }
        ]
      },
      {
        title: gasMask('Maska Gazowa'),
        blocks: [
          { kind: 'paragraph', text: `Posiadacze kart ${card('Mage', 'Mag 2')}, ${card('MadGunman', 'Szalony Strzelec 2')} oraz ${card('GhostBobo', 'Duch Bobo')} są wyposażeni w ${gasMask('Maska Gazowa')}, chroniącą przed ${card('Sand', 'Piaskiem')} i zapachem ${card('Sock', 'Skarpetki')}.` }
        ]
      }
    ]
  },
  {
    title: 'Reguły obronne – noc',
    blocks: [
      { kind: 'paragraph', text: `Każdy nocny atak weryfikowany jest przez system obron w określonej kolejności – zadziałanie jednej z barier przerywa sprawdzanie pozostałych. Przed listą priorytetów zawsze sprawdzane jest, czy ${card('Matrix')} nie przechwycił pocisku.` },
      { kind: 'paragraph', text: 'Aplikacja przetwarza ataki zgodnie z poniższą hierarchią, ale raport końcowy jest losowo przetasowany, aby utrudnić identyfikację strzelców.' }
    ],
    subsections: [
      {
        title: `a) Pocisk od ${card('Mafia', 'Mafii')}`,
        blocks: [
          { kind: 'list', title: `Strzela ${card('Mafia', 'Mafioso')} z najwyższym numerem:`, ordered: true, items: [card('Magnet', 'Magnes'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('AlCapone', 'Al Capone'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kamizelka kuloodporna'), card('CloudWalker', 'Chmurostąp')] }
        ]
      },
      {
        title: `b) Pocisk od ${card('MadGunman', 'Szalonego Strzelca')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnes'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kamizelka kuloodporna'), card('CloudWalker', 'Chmurostąp')] }
        ]
      },
      {
        title: `c) Pocisk od ${card('Sniper', 'Snajpera')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnes'), tunnel('Tunel'), card('Mirror', 'Zwierciadło'), card('Slime', 'Ślina'), card('Doctor', 'Doktor'), card('KevlarVest', 'Kamizelka kuloodporna'), card('CloudWalker', 'Chmurostąp')] }
        ]
      },
      {
        title: `d) Zapach ${card('Sock', 'Skarpetki')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [gasMask('Maska Gazowa'), card('Doctor', 'Doktor'), card('CloudWalker', 'Chmurostąp')] }
        ]
      },
      {
        title: `e) Pocisk od ${card('Matrix', 'Matrixa')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('KevlarVest', 'Kamizelka kuloodporna'), card('CloudWalker', 'Chmurostąp')] }
        ]
      }
    ]
  },
  {
    title: 'Reguły obronne – dzień',
    blocks: [
      { kind: 'paragraph', text: `W dzień obrona również działa automatycznie i jest rozpatrywana przed faktyczną śmiercią gracza. Jeśli ${card('BlindExecutioner', 'Ślepy Kat')} wskazał ofiarę zastępczą, zamiana celów następuje przed zużyciem tarcz.` }
    ],
    subsections: [
      {
        title: 'a) Skazanie w głosowaniu',
        blocks: [
          { kind: 'list', ordered: true, items: [card('RopeWalker', 'Linoskoczek'), card('Immunity', 'Immunitet'), card('CloudWalker', 'Chmurostąp')] }
        ]
      },
      {
        title: `b) Strzał w dzień (${card('Anarchist', 'Anarchista')}, ${card('MassMurderer', 'Masowy Morderca')}, ${card('Terrorist', 'Bomba')})`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Immunity', 'Immunitet'), card('KevlarVest', 'Kamizelka kuloodporna'), card('CloudWalker', 'Chmurostąp')] }
        ]
      }
    ]
  },
  {
    title: 'Kolejność budzeń',
    blocks: [
      
    ],
    subsections: [
      {
        title: 'a) Noce parzyste',
        blocks: [
          { kind: 'paragraph', text: 'W parzyste noce budzą się kolejno:' },
          {
            kind: 'list',
            items: [
              card('Jailer', 'Jailer'),
              card('Gravedigger', 'Grabarz'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Magowie'),
              card('Slime', 'Ślina'),
              card('Leech', 'Pijawka'),
              card('Sand', 'Piasek'),
              card('Cobra', 'Kobra'),
              card('Magnet', 'Magnes'),
              card('GhostBobo', 'Duch Bobo'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jożin z Bażin'),
              card('Mafia', 'Mafia'),
              card('MadGunman', 'Szaleni Strzelcy'),
              card('Sniper', 'Snajper'),
              card('Sock', 'Skarpetka'),
              card('Judge', 'Sędzia'),
              card('BlindExecutioner', 'Ślepy Kat'),
              card('Matrix', 'Strzał Matrixa')
            ]
          }
        ]
      },
      {
        title: 'b) Noce nieparzyste',
        blocks: [
          { kind: 'paragraph', text: 'W nieparzyste noce budzą się kolejno:' },
          {
            kind: 'list',
            items: [
              card('Gravedigger', 'Grabarz'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Magowie'),
              card('Slime', 'Ślina'),
              card('Leech', 'Pijawka'),
              card('Sand', 'Piasek'),
              card('Doctor', 'Doktor'),
              card('SwampMonster', 'Jożin z Bażin'),
              card('Mafia', 'Mafia'),
              card('Sniper', 'Snajper'),
              card('Sock', 'Skarpetka'),
              card('BlindExecutioner', 'Ślepy Kat'),
              card('Matrix', 'Strzał Matrixa')
            ]
          }
        ]
      },
      {
        title: 'c) Dodatkowe zasady nocne',
        blocks: [
          { kind: 'paragraph', text: `Pod koniec co trzeciej nocy (zaczynając od drugiej) budzi się ${card('Spyglass', 'Luneta')}, aby dowiedzieć się, którzy gracze byli aktywni.` },
          { kind: 'paragraph', text: `Niektóre role (np. ${card('Matrix')}) mają ograniczoną liczbę użyć; po wyczerpaniu ładunków prowadzący przestaje je budzić.` }
        ]
      }
    ]
  },
  {
    title: 'Zasady balansu kart',
    blocks: [
      { kind: 'paragraph', text: 'Aby rozgrywka była sprawiedliwa, aplikacja stosuje następujące ograniczenia przy rozdawaniu ról:' },
      {
        kind: 'list',
        items: [
          `Gracz może posiadać tylko jedną kartę ${card('Mafia', 'Mafii')}.`,
          `Gracz może posiadać tylko jedną kartę z pary ${card('Gandalf')} / ${card('HorsePiece', 'Kawał Konia')}.`,
          `Gracz może posiadać tylko jedną kartę z zestawu: ${card('Mage', 'Mag 2')} / ${card('MadGunman', 'Szalony Strzelec 2')} / ${card('GhostBobo', 'Duch Bobo')}.`,
          `Gracz może posiadać tylko jedną kartę z pary ${card('Leech', 'Pijawka')} / ${card('Cobra')}.`,
          `Gracz może posiadać tylko jednego ${card('MadGunman', 'Szalonego Strzelca')}.`,
          `Gracz może posiadać tylko jedną kartę ${card('Slime', 'Śliny')}.`,
          `Gracz może posiadać tylko jedną kartę z pary ${card('Atheist', 'Ateista')} / ${card('Matrix')}.`,
          `Gracz posiadający kartę ${card('Mafia', 'Mafii')} nie może otrzymać ${card('Doctor', 'Doktora')} ani ${card('Spyglass', 'Lunety')}.`,
          `Gracz może otrzymać maksymalnie dwa ${card('CloudWalker', 'Chmurostąpy')}.`,
          `Gracz może otrzymać maksymalnie dwóch ${card('RopeWalker', 'Linoskoczków')}.`,
          `Gracz posiadający kartę ${card('Gravedigger', 'Grabarz')}, ${card('Leech', 'Pijawka')}, ${card('AlCapone', 'Al Capone')}, ${card('Gandalf')} lub ${card('HorsePiece', 'Kawał Konia')} może otrzymać tylko jednego ${card('CloudWalker', 'Chmurostąpa')}.`
        ]
      }
    ]
  }
];

export const TRANSLATIONS_PL = {
  // Role labels
  role_AlCapone: 'Al Capone',
  role_Anarchist: 'Anarchista',
  role_Astronomer: 'Astronom',
  role_Atheist: 'Ateista',
  role_BlindExecutioner: 'Ślepy Kat',
  role_CloudWalker: 'Chmurostąp',
  role_Cobra: 'Kobra',
  role_Communist: 'Komunista',
  role_Doctor: 'Doktor',
  role_Gandalf: 'Gandalf',
  role_GhostBobo: 'Duch Bobo',
  role_Glazier: 'Szklarz',
  role_Gravedigger: 'Grabarz',
  role_HorsePiece: 'Kawał Konia',
  role_Immunity: 'Immunitet',
  role_Jailer: 'Jailer',
  role_Judge: 'Sędzia',
  role_KevlarVest: 'Kamizelka kuloodporna',
  role_Kovac: 'Kovacz',
  role_Leech: 'Pijawka',
  role_MadGunman: 'Szalony Strzelec',
  role_Mafia: 'Mafioso',
  role_Magnet: 'Magnes',
  role_MassMurderer: 'Masowy Morderca',
  role_Matrix: 'Matrix',
  role_Meciar: 'Mecziar',
  role_Mage: 'Mag',
  role_Mirror: 'Zwierciadło',
  role_RopeWalker: 'Linoskoczek',
  role_Sand: 'Piasek',
  role_Slime: 'Ślina',
  role_Sniper: 'Snajper',
  role_Sock: 'Skarpetka',
  role_Spyglass: 'Luneta',
  role_SwampMonster: 'Jożin z Bażin',
  role_Terrorist: 'Terrorysta',
  role_TimeLord: 'Pan Czasu',

  // Card descriptions
  card_description_AlCapone: 'Al Capone jako ojciec chrzestny Mafii jest odporny na jej ataki. Ochrona ta działa na bezpośrednie trafienie przez Mafię oraz na pociski przekierowane przez Tunel, ale nie chroni przed pociskiem przekierowanym przez Magnes lub Zwierciadło.',
  card_description_Anarchist: 'Anarchista może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "I shoot you baby!", po czym strzela do wskazanej przez siebie osoby.',
  card_description_Astronomer: 'Astronom może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Noc!", co natychmiast kończy dzień, nawet jeśli trwa właśnie głosowanie.',
  card_description_Atheist: 'Tunel stworzony przez Maga prowadzący do Ateisty nie działa. Konferansjer nie informuje Maga o tym, że utworzył tunel na Ateistę.',
  card_description_BlindExecutioner: 'Ślepy Kat może dwa razy w ciągu gry wskazać w nocy dwóch graczy. Jeśli następnego dnia pierwszy ze wskazanych graczy miałby zostać powieszony, zamiast niego ginie gracz wskazany jako drugi.',
  card_description_CloudWalker: 'Chmurostąp to podstawowa karta obronna pełniąca funkcję dodatkowego życia. Jest zużywana, jeśli gracz nie posiada innej ochrony.',
  card_description_Cobra: 'Kobra każdej parzystej nocy wskazuje gracza, który według niej posiada kartę Pijawka. Jeśli trafi, pod koniec nocy zyskuje Chmurostąpa i zjada Pijawkę (gracz z tą kartą traci swoje zdolności).',
  card_description_Communist: 'Komunista może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Obywatele, w tej rundzie jesteśmy wszyscy równi", anulując tym samym na jeden dzień zdolności Mecziara, Kovacza, Ducha Bobo i Sędziego.',
  card_description_Doctor: 'Doktor każdej nocy wskazuje gracza, którego leczy, chroniąc go tym samym jednorazowo przed pociskiem lub zapachem Skarpetki. Co trzecią noc (zaczynając od pierwszej lub drugiej) może uleczyć samego siebie. Jeśli Doktor zostanie sam przeciwko jednemu lub kilku Mafiosom i nie może się uleczyć, jest deaktywowany.',
  card_description_Gandalf: 'Jeśli Kawał Konia traci Chmurostąpa, zyskuje go Gandalf. W ciągu nocy może uzyskać w ten sposób tylko jednego Chmurostąpa.',
  card_description_Glazier: 'Jeśli Szklarz nie ma żadnego Zwierciadła, a innemu graczowi w nocy zostanie ono zniszczone, Szklarz zyskuje je pod koniec nocy. Może otrzymać tylko jedno Zwierciadło w ciągu nocy.',
  card_description_GhostBobo: 'Duch Bobo każdej parzystej nocy wskazuje gracza, który następnego dnia będzie miał zakaz mówienia (zakaz ten może znieść tylko Komunista). Jeśli oskarżony gracz ma nałożony przez Ducha Bobo zakaz wypowiadania się, wybiera osobę, która ma go bronić, tłumacząc jego mimikę i gesty.',
  card_description_Gravedigger: 'Grabarz może raz na całą grę w nocy wykopać groby dla Chmurostąpów, dzięki czemu pod koniec nocy zyskuje tyle Chmurostąpów, ile zostało ich tej nocy utraconych przez innych graczy.',
  card_description_HorsePiece: 'Jeśli Gandalf traci Chmurostąpa, zyskuje go Kawał Konia. W ciągu nocy może uzyskać w ten sposób tylko jednego Chmurostąpa.',
  card_description_Immunity: 'Karta obronna używana w przypadku trafienia pociskiem w dzień lub skazania na śmierć przez powieszenie.',
  card_description_Jailer: 'Jailer może raz na całą grę wskazać gracza, którego wtrąca do więzienia, blokując działanie jego zdolności tej nocy. Konferansjer budzi uwięzionego gracza, ale wyraźnie sygnalizuje mu, że znajduje się w więzieniu.',
  card_description_Judge: 'Sędzia każdej parzystej nocy wskazuje gracza, który następnego dnia będzie miał zakaz głosowania. Komunista może znieść ten zakaz.',
  card_description_KevlarVest: 'Karta obronna używana w przypadku trafienia pociskiem.',
  card_description_Kovac: 'Kovacz zmniejsza liczbę głosów oddanych za jego śmiercią o 1. Jeśli Komunista użyje swojej zdolności, Kovacz traci tę funkcję.',
  card_description_Leech: 'Pijawka każdej nocy wskazuje gracza, do którego się przysysa. Jeśli gracz ten traci owej nocy Chmurostąpa lub ginie, Pijawka zyskuje Chmurostąpa. Pijawka może zostać zjedzona przez Kobrę.',
  card_description_MadGunman: 'Szalony Strzelec każdej parzystej nocy oddaje jeden strzał.',
  card_description_Mafia: 'Mafioso może wygrać grę poprzez eliminację wszystkich zwykłych graczy, używając w tym celu pocisku każdej nocy. Aby Mafia wystrzeliła, wszyscy Mafiosi muszą w nocy wskazać tego samego gracza. Aby ustalić kolejność wskazywania, budzą się oni na początku pierwszej nocy.',
  card_description_Mage: 'Mag każdej nocy wskazuje dwóch graczy, między którymi tworzy jednokierunkowy tunel. Jeśli trafiony zostanie pierwszy wskazany gracz, pocisk wędruje tunelem do drugiego.',
  card_description_Magnet: 'Magnes każdej parzystej nocy wskazuje gracza, którego magnetyzuje. Jeśli obok namagnetyzowanego gracza przelatuje pocisk, zostaje on do niego przyciągnięty. Pocisk może zostać przyciągnięty przez namagnetyzowanego gracza tylko raz.',
  card_description_MassMurderer: 'Jeśli Masowy Morderca zostanie skazany na powieszenie, strzela do wszystkich, którzy na niego głosowali.',
  card_description_Matrix: 'Matrix może raz na całą grę w nocy zmienić prawa fizyki – przechwycić wszystkie pociski, które w niego trafią, i wypuścić je pod koniec nocy.',
  card_description_Meciar: 'W głosowaniu jego głos liczy się podwójnie. Jeśli Komunista użyje swojej zdolności, Mecziar traci tę funkcję.',
  card_description_Mirror: 'Karta obronna używana w przypadku trafienia pociskiem Mafii lub Szalonego Strzelca. Po rozbiciu Zwierciadła pocisk wraca do gracza, od którego przyleciał, chyba że Zwierciadło zostało poplamione błotem przez Jożina z Bażin.',
  card_description_RopeWalker: 'Karta obronna chroniąca przed śmiercią na szubienicy.',
  card_description_Sand: 'Gracz z kartą Piasek każdej nocy wskazuje gracza, którego posypuje piaskiem. Piasek neutralizuje efekt Śliny, czyniąc gracza ponownie podatnym na trafienie. Ochronę przed Piaskiem mają gracze z Maską Gazową (Szalony Strzelec 2, Mag 2 i Duch Bobo).',
  card_description_Slime: 'Gracz z kartą Ślina każdej nocy wskazuje gracza, którego chce oślinić. Ośliniony gracz jest raz w nocy chroniony przed pociskiem Mafii, Szalonego Strzelca i Snajpera (pocisk ześlizguje się z celu). Efekt Śliny można zneutralizować Piaskiem.',
  card_description_Sniper: 'Snajper może raz na całą grę wskazać gracza, w którego strzela potężnym pociskiem. Jest on tak silny, że rozbija nawet Zwierciadło i leci dalej.',
  card_description_Sock: 'Gracz ze Skarpetką może raz na całą grę w nocy rzucić Skarpetkę między dwóch graczy, którzy zostają porażeni jej zapachem. Przed zapachem Skarpetki chroni tylko Maska Gazowa, Doktor i Chmurostąp. Szalony Strzelec 2, Mag 2 i Duch Bobo posiadają Maskę Gazową.',
  card_description_Spyglass: 'Luneta budzi się pod koniec każdej trzeciej nocy (zaczynając od drugiej) i dowiaduje się od Konferansjera, którzy gracze obudzili się tej nocy.',
  card_description_SwampMonster: 'Jożin z Bażin może trzy razy w ciągu całej gry wskazać w nocy gracza, któremu poplami Zwierciadło. Pocisk rozbija poplamione błotem Zwierciadło, ale leci dalej. Jożin może użyć swojej zdolności wielokrotnie tej samej nocy. Jeśli gracz posiada również kartę Mafiosa, Snajpera lub Szalonego Strzelca, może poplamić Zwierciadło tylko dwa razy.',
  card_description_Terrorist: 'Terrorysta może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Bomba!", po czym strzela do wszystkich graczy.',
  card_description_TimeLord: 'Pan Czasu może raz na całą grę na początku dnia lub nocy powiedzieć "Jestem Panem czasu!" i przeskoczyć cały dzień lub noc.',

  // App Shell & Navigation
  app_title: 'Mafia²',
  app_continue_game: 'Kontynuuj grę',
  app_continue_round: 'Runda {round}',
  app_new_game: 'Nowa gra',
  nav_game: 'Gra',
  nav_players: 'Gracze',
  nav_logs: 'Raporty',
  nav_rules: 'Zasady',
  nav_cards: 'Karty',
  nav_settings: 'Ustawienia',
  nav_my_cards: 'Moje karty',
  nav_all_cards: 'Wszystkie karty',
  player_link_invalid: 'Nieprawidłowy link gracza. Poproś prowadzącego o nowy.',

  // Rules View
  rules_header_title: 'Reguły',
  rules_missing_language: 'Brak przetłumaczonych reguł dla wybranego języka.',

  // Logs
  logs_heading: 'Dziennik nocy i dnia',
  logs_subheading: 'Pokazywany raport nocy i dnia #{round}',
  logs_round_label: 'Runda',
  logs_view_label: 'Widok',
  logs_public_report_title: 'Raport publiczny',
  logs_public_report_placeholder: 'Raport publiczny pojawi się na początku dnia.',
  logs_round_title: 'Dziennik rundy',
  logs_round_empty: 'Brak wpisów dla tej rundy.',
  logs_panel_title: 'Historia gry',
  logs_panel_empty: 'Brak wpisów w dzienniku.',

  // Cards
  cards_collection_title: 'Kolekcja kart',
  cards_placeholder_description: 'Opis w przygotowaniu.',
  cards_toggle_icons: 'Ikony',
  cards_toggle_images: 'Grafiki',
  cards_section_passive: 'Zdolności pasywne',
  cards_section_active: 'Zdolności aktywne',
  player_add_card_title: 'Dodaj zdobytą kartę',
  player_add_card_button: 'Dodaj kartę',
  player_add_card_type_label: 'Typ karty',
  player_add_card_instance_label: 'Numer karty',
  player_add_card_submit: 'Dodaj kartę',
  player_add_card_duplicate: 'Ta karta jest już na liście.',

  // Settings
  settings_language_title: 'Język aplikacji',
  settings_language_active: 'Aktywny',
  settings_title: 'Ustawienia',
  settings_player_node_size: 'Wielkość pionków graczy',
  settings_reset_player_size: 'Przywróć domyślny rozmiar',
  settings_player_node_hint: 'Ułatwia trafianie w okrągłe znaczniki na dużych stołach.',
  settings_bullet_speed: 'Prędkość pocisków',
  settings_bullet_speed_fast: 'Szybciej',
  settings_bullet_speed_slow: 'Wolniej',
  settings_bullet_speed_hint: 'Steruje tempem animacji nocnych strzałów.',
  settings_storage_title: 'Pamięć',
  settings_export_data_button: 'Eksportuj dane gry',
  settings_import_data_button: 'Importuj z pliku',
  settings_import_warning: 'Import zastępuje bieżącą rozgrywkę.',
  settings_import_error: 'Nie udało się wczytać zapisu. Sprawdź plik i spróbuj ponownie.',

  // GM Player List
  gm_players_title: 'Gracze ({count})',
  gm_players_badge_mafia: 'Mafia',
  gm_players_no_cards: 'Brak kart',
  gm_players_share_button: 'Udostępnij',
  gm_players_qr_button: 'Kod QR',
  gm_players_qr_instruction: 'Zeskanuj kod, aby otworzyć widok gracza.',
  gm_players_qr_generating: 'Generowanie kodu QR…',
  gm_players_copy_link_instead: 'Skopiuj link zamiast tego',
  gm_players_manual_copy_title: 'Skopiuj link ręcznie',
  gm_players_manual_copy_fallback: 'Udostępnianie jest niedostępne na tym urządzeniu. Skopiuj link i wyślij go do {name}.',
  gm_players_manual_copy_label: 'Link',
  gm_players_manual_copy_copy: 'Skopiuj link',
  gm_players_manual_copy_close: 'Zamknij',
  gm_players_share_insecure: 'Udostępnianie działa tylko przez HTTPS (lub localhost). Skopiuj link lub otwórz aplikację przez https://.',
  gm_players_share_unsupported: 'Ta przeglądarka nie obsługuje przycisku Udostępnij. Skopiuj link poniżej.',
  gm_players_share_failure_reason: 'Udostępnianie nie powiodło się na tym urządzeniu. Skopiuj link ręcznie.',
  gm_players_share_title: '{player} — link gracza',
  gm_players_copy_success: 'Link do gracza {player} skopiowany! Wyślij go tej osobie.',
  gm_players_qr_error: 'Nie można wygenerować kodu QR. Link został skopiowany do schowka.',
  gm_players_modal_close_qr_aria: 'Zamknij okno kodu QR',
  gm_players_modal_close_manual_aria: 'Zamknij okno kopiowania',
  gm_players_share_mode_title: 'Tryb udostępniania',
  gm_players_share_mode_hint: 'Ukrywa karty i kolory Mafii podczas pokazywania kodów QR.',
  gm_players_share_mode_on: 'Włączony',
  gm_players_share_mode_off: 'Wyłączony',
  gm_players_share_mode_cards_hidden: 'Karty ukryte w trybie udostępniania.',
  gm_players_section_alive: 'Żywi',
  gm_players_section_dead: 'Martwi',

  // Gameplay Texts
  victory_mafia: 'Wygrywa Mafia.',
  victory_innocent: 'Wygrywa Miasto.',
  log_start_game: 'Nowa gra rozpoczęta.',
  log_player_activate: '{cardLabel} {player} użył zdolności.',
  start_day: 'Rozpocznij dzień',
  start_night_intro: 'Zapada noc, miasteczko zasypia...',
  first_night_message: 'Mafia budzi się, by ustalić strategię.',
  wake_up: 'Budzi się {role}. Czy użyje swojej funkcji?',
  wake_up_use_again: 'Czy {role} chce użyć funkcji ponownie?',
  wake_up_shooter: 'Budzi się {role}. Do kogo chce strzelić?',

  // Role-specific wakeups, logs, and reports

  // Mage
  wake_up_mage_from: 'Budzi się {role}. Z którego gracza chce utworzyć tunel?',
  wake_up_mage_to: 'Dokąd {role} poprowadzi wyjście z tunelu?',
  log_tunnel_duplicate: '{cardLabel} {player} chciał stworzyć tunel {source}->{target}, ale taki już istnieje.',
  log_tunnel_atheist: `{cardLabel} {player} chciał użyć tunelu na graczu {target}, ale to ${card('Atheist', 'Ateista')}.`,
  log_tunnel_same_player: '{cardLabel} {player} nie może stworzyć tunelu na tego samego gracza.',
  log_tunnel_created: '{cardLabel} {player} utworzył tunel {tunnelNumber} ({source} -> {target}).',

  // Slime
  wake_up_slime: 'Budzi się {role}. Kogo chce pokryć śliną?',
  log_action_slime: '{cardLabel} {player} pokrył śliną gracza {target}.',
  public_report_slime: '{name} ocieka śliną.',
  public_report_slime_multi: '{name} ocieka śliną (x{count}).',

  // Leech
  wake_up_leech: 'Budzi się {role}. Do kogo chce się przyssać?',
  log_action_leech: '{cardLabel} {player} przyssał się do gracza {target}.',
  public_report_leech_cloudwalker: `${card('Leech', 'Pijawka')} zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  log_night_leech_cloudwalker: `{cardLabel} {player} zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,

  // Sand
  wake_up_sand: 'Budzi się {role}. Kogo chce obsypać piaskiem?',
  log_action_sand: '{cardLabel} {player} obsypał piaskiem gracza {target}.',
  log_action_sand_fail: `{cardLabel} {player} chciał użyć ${card('Sand', 'Piasku')} na graczu {target}, ale ten posiada Maskę Gazową.`,
  public_report_sand: '{name} ma piasek w oczach.',
  public_report_sand_saved: `Maska Gazowa uchroniła gracza przed ${card('Sand', 'Piaskiem')}.`,

  // Cobra
  wake_up_cobra: 'Budzi się {role}. Kogo chce ukąsić?',
  log_action_cobra: '{name} został ukąszony.',
  public_report_cobra_cloudwalker: `${card('Cobra', 'Kobra')} zjada ${card('Leech', 'Pijawkę')} i zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  log_night_cobra_cloudwalker: `{cardLabel} {player} pożera ${card('Leech', 'Pijawkę')} i zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,

  // Magnet
  wake_up_magnet: 'Budzi się {role}. Kogo chce namagnetyzować?',
  log_action_magnet: '{name} został namagnetyzowany.',

  // Ghost Bobo
  wake_up_ghost: 'Budzi się {role}. Kogo chce uciszyć?',
  log_action_ghost: '{cardLabel} {player} odebrał głos graczowi {target}.',
  public_report_ghost_bobo: '{name} nie może dziś mówić.',

  // Judge
  wake_up_judge: 'Budzi się {role}. Komu chce odebrać prawo głosu?',
  log_action_judge: '{cardLabel} {player} odebrał prawo głosu graczowi {target}.',
  public_report_judge: '{name} nie może dziś głosować.',

  // Swamp Monster
  wake_up_swamp_monster: 'Kogo chce ochlapać błotem?',
  log_night_swamp_attack: '{cardLabel} {player} ochlapał błotem gracza {target}.',

  // Executioner
  wake_up_executioner_save: 'Budzi się {role}. Kogo chce ułaskawić spod szubienicy?',
  wake_up_executioner_victim: 'Kto ma trafić na szubienicę zamiast niego?',
  log_night_executioner_save: '{saved} jest chroniony przed wyrokiem, zamiast niego zginie {victim}.',
  log_day_blind_executioner_redirect: '{cardLabel} {player} — wyrok zostaje przekierowany. {victim} staje pod szubienicą zamiast {saved}.',
  public_report_day_blind_executioner_redirect: 'W ostatniej chwili skazany zostaje podmieniony — {victim} staje pod szubienicą zamiast {saved}.',

  // Sock
  wake_up_sock_first: 'Pomiędzy kogo rzucić Skarpetkę? Wskaż pierwszego gracza.',
  wake_up_sock_second: 'Teraz wskaż sąsiada tego gracza.',
  log_action_sock_throw: `{cardLabel} {player} wycelował ${card('Sock', 'Skarpetką')} między graczy {first} i {second}.`,
  log_sock_throw_intro: `{cardLabel} {player} rzucił ${card('Sock', 'Skarpetkę')} między graczy {first} i {second}. `,
  log_sock_result_gasmask: 'Maska Gazowa ocaliła gracza {name}. ',
  log_sock_result_dead: 'Gracz {name} był już martwy. ',
  log_sock_result_doctor: `${card('Doctor', 'Doktor')} ocalił gracza {name}. `,
  log_sock_result_cloudwalker: `Gracz {name} stracił ${card('CloudWalker', 'Chmurostąpa {num}')}. `,
  log_sock_result_death: 'Gracz {name} opuszcza grę. ',
  public_report_sock_used: `${card('Sock', 'Skarpetka')} została rzucona pomiędzy dwóch graczy. `,
  public_report_sock_first_gasmask: 'Pierwszego gracza ocaliła Maska Gazowa',
  public_report_sock_first_dead: 'Pierwszy gracz był już martwy',
  public_report_sock_first_doctor: `Pierwszego gracza uratował ${card('Doctor', 'Doktor')}`,
  public_report_sock_first_cloudwalker: `Pierwszy gracz stracił ${card('CloudWalker', 'Chmurostąpa {num}')}`,
  public_report_sock_first_death: 'Pierwszy gracz, {name}, opuszcza naszą grę',
  public_report_sock_second_gasmask: ', a drugiego ocaliła Maska Gazowa.',
  public_report_sock_second_dead: ', a drugi gracz był już martwy.',
  public_report_sock_second_doctor: `, a drugiego uratował ${card('Doctor', 'Doktor')}.`,
  public_report_sock_second_cloudwalker: `, a drugi gracz stracił ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  public_report_sock_second_death: ', a drugi gracz, {name}, opuszcza naszą grę.',
  public_report_sock_first_only_suffix: '.',

  // Jailer
  wake_up_jailer: 'Budzi się {role}. Kogo wtrąca do więzienia?',
  log_jailer_imprison: '{cardLabel} {player} wtrącił do więzienia gracza {target}.',
  log_action_blocked_jailed: '{cardLabel} {player} siedzi w więzieniu, więc tej nocy nic się nie wydarzy.',

  // Doctor
  wake_up_doctor_heal_self: 'Budzi się {role}. Kogo chce uleczyć? (może siebie)',
  wake_up_doctor_heal_other: 'Budzi się {role}. Kogo chce uleczyć? (nie może siebie)',
  log_doctor_fail: `{cardLabel} {player} chciał uleczyć {target}, ale cel nie zostanie uleczony, gdyż ${card('Doctor', 'Doktor')} działa w pojedynkę przeciw ${card('Mafia', 'Mafii')}.`,
  log_doctor_success: '{cardLabel} {player} wyleczy gracza {target}.',
  log_doctor_self_locked: '{cardLabel} {player} nie może uleczyć siebie tej nocy.',

  // Matrix
  wake_matrix_shot: 'Budzi się Matrix. W kogo chce strzelić? (pocisk {current}/{total})',
  log_night_matrix_activate: 'Podążaj za białym królikiem... ({cardLabel} {player} użył zdolności.)',
  log_night_matrix_bullet_summary: `Ilość pocisków, które ${card('Matrix', 'Matrix')} {player} przechwycił tej nocy: {count}.`,

  // Spyglass
  wake_up_spyglass: 'Budzi się Luneta. Czy dowiedziała się, kto był aktywny tej nocy?',
  spyglass_reveal_intro: 'Tej nocy budzili się: {names}.',
  spyglass_reveal_none: 'Tej nocy nikt się nie obudził.',

  // Mafia/Shooting
  log_mafia_jailed: `{cardLabel} {player} przebywa w więzieniu, więc ${card('Mafia', 'Mafia')} nie odda strzału.`,
  log_mafia_no_consensus: `${card('Mafia', 'Mafiosi')} nie byli zgodni co do celu, więc tej nocy nikt nie strzelił.`,
  log_shoot: '{cardLabel} {player} strzela do gracza {target}.',
  log_shooter_aim: '{cardLabel} {player} celuje w gracza {target}.',

  // Time Lord
  ui_timelord_skip_night: '{cardLabel}: Pomiń noc',
  ui_timelord_skip_day: '{cardLabel}: Pomiń dzień',
  log_timelord_skip_day: '{cardLabel} {player} przeskoczył dzień.',
  log_timelord_skip_night: '{cardLabel} {player} przeskoczył noc.',

  // Public Reports (Resolution)
  log_day_vest_hit: `{target} traci ${card('KevlarVest', 'Kamizelkę kuloodporną {num}')}.`,
  log_day_ropewalker_lost: `{target} traci ${card('RopeWalker', 'Linoskoczka {num}')}.`,
  log_day_immunity_lost: `{target} traci ${card('Immunity', 'Immunitet {num}')}.`,
  log_day_cloudwalker_lost: `{target} traci ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  log_day_death: '{target} ginie.',

  // Morning Report
  public_report_default: 'Miasteczko Palermo budzi się.',
  public_report_matrix: `Tej nocy ${card('Matrix', 'Matrix')} użył swej funkcji. Ilość pocisków które przechwycił: {count}.`,
  public_report_cloudwalker_gain: `{cardLabel} zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  public_report_glazier_mirror: `${card('Glazier', 'Szklarz')} tworzy ${card('Mirror', 'Zwierciadło {num}')}.`,
  log_night_cloudwalker_gain: `{cardLabel} {player} zdobywa ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  log_night_glazier_mirror: `{cardLabel} {player} tworzy ${card('Mirror', 'Zwierciadło {num}')}.`,
  
  
  // Bullet Report Fragments
  public_report_bullet_start: 'Padł strzał',
  public_report_bullet_dead_target: ', lecz trafił w martwego gracza.',
  public_report_bullet_matrix_catch: ` i ${card('Matrix', 'Matrix')} go pochwycił.`,
  public_report_bullet_magnet: `, został przyciągnięty ${card('Magnet', 'Magnesem')}`,
  public_report_bullet_split: ', rozszczepiając się na {count} części.',
  public_report_bullet_tunnel_single: ', przeleciał tunelem',
  public_report_bullet_tunnel_segment: ' {index}. odłamek przeleciał tunelem',
  public_report_bullet_slime: ` i pocisk ześlizgnął się po ${card('Slime', 'Ślinie')}.`,
  public_report_bullet_al_capone: `, lecz ${card('AlCapone', 'Al Capone')} zneutralizował zagrożenie.`,
  public_report_bullet_doctor: `, lecz ${card('Doctor', 'Doktor')} zneutralizował pocisk.`,
  public_report_bullet_mirror_break: `, pękło ${card('Mirror', 'Zwierciadło {num}')}`,
  public_report_bullet_return: ', pocisk wrócił',
  public_report_bullet_continue: ', kula leci dalej',
  public_report_bullet_vest_loss: ` i ${card('KevlarVest', 'Kamizelka kuloodporna {num}')} została zniszczona.`,
  public_report_bullet_cloudwalker_loss: ` i zmarł ${card('CloudWalker', 'Chmurostąp {num}')}.`,
  public_report_bullet_death: ' i naszą grę opuszcza {name}.',

  log_night_bullet_start: '{cardLabel} {shooter} strzela do gracza {target}. ',
  log_night_bullet_start_generic: 'Padł strzał w kierunku {target}. ',
  log_night_bullet_split: 'Pocisk rozszczepił się na {count} części.',
  log_night_bullet_dead_target: ' i trafia w martwego gracza {target}.',
  log_night_bullet_matrix_catch: ` i ${card('Matrix', 'Matrix')} {target} go pochwycił.`,
  log_night_bullet_magnet_initial: `Pocisk został przyciągnięty ${card('Magnet', 'Magnesem')} do gracza {target}`,
  log_night_bullet_magnet: `, został przyciągnięty ${card('Magnet', 'Magnesem')} do gracza {target}`,
  log_night_bullet_magnet_dead: ` i trafia w martwego gracza {target} (efekt ${card('Magnet', 'Magnesu')}).`,
  log_night_bullet_tunnel_initial: 'Pocisk przeleciał tunelem {num} ({src} -> {target})',
  log_night_bullet_tunnel_single: ', przeleciał tunelem {num} ({src} -> {target})',
  log_night_bullet_tunnel_segment: ' {index}. odłamek przeleciał tunelem {num} ({src} -> {target})',
  log_night_bullet_slime_initial: `Pocisk ześlizguje się po ${card('Slime', 'Ślinie')} z gracza {target}.`,
  log_night_bullet_slime: ` i ześlizguje się po ${card('Slime', 'Ślinie')} z gracza {target}.`,
  log_night_bullet_al_capone_initial: `${card('AlCapone', 'Al Capone')} {target} neutralizuje pocisk.`,
  log_night_bullet_al_capone: ` i ${card('AlCapone', 'Al Capone')} {target} go neutralizuje.`,
  log_night_bullet_doctor_initial: `${card('Doctor', 'Doktor')} uratował gracza {target}.`,
  log_night_bullet_doctor: ` i gracz {target} został wyleczony przez ${card('Doctor', 'Doktora')}.`,
  log_night_bullet_mirror_break_initial: `Pocisk rozbija ${card('Mirror', 'Zwierciadło {num}')} u gracza {target}`,
  log_night_bullet_mirror_break: `, u gracza {target} pękło ${card('Mirror', 'Zwierciadło {num}')}`,
  log_night_bullet_return: ', pocisk wrócił do {target}',
  log_night_bullet_continue_sniper: `, lecz pocisk leci dalej, gdyż ${card('Mirror', 'Zwierciadło')} gracza {target} nie odbija strzałów ${card('Sniper', 'Snajpera')},`,
  log_night_bullet_continue_matrix: `, lecz pocisk leci dalej, gdyż ${card('Mirror', 'Zwierciadło')} gracza {target} nie zatrzymuje strzałów ${card('Matrix', 'Matrixa')},`,
  log_night_bullet_continue_mud: `, lecz pocisk leci dalej, gdyż ${card('Mirror', 'Zwierciadło')} gracza {target} było zabłocone,`,
  log_night_bullet_vest_loss_initial: `Pocisk niszczy ${card('KevlarVest', 'Kamizelkę kuloodporną {num}')} gracza {target}.`,
  log_night_bullet_vest_loss: ` i {target} traci ${card('KevlarVest', 'Kamizelkę kuloodporną {num}')}.`,
  log_night_bullet_cloudwalker_loss_initial: `Pocisk odbiera ${card('CloudWalker', 'Chmurostąpa {num}')} graczowi {target}.`,
  log_night_bullet_cloudwalker_loss: ` i {target} traci ${card('CloudWalker', 'Chmurostąpa {num}')}.`,
  log_night_bullet_death_initial: 'Pocisk zabija gracza {name}.',
  log_night_bullet_death: ' i {name} ginie.',
  log_night_bullet_gandalf_from_horse: ` ${card('Gandalf', 'Gandalf')} {gandalf} zyskuje ${card('CloudWalker', 'Chmurostąpa {num}')} (strata ${card('HorsePiece', 'Kawała Konia')} {horse}: {lost}).`,
  log_night_bullet_horsepiece_from_gandalf: ` ${card('HorsePiece', 'Kawał Konia')} {horse} zyskuje ${card('CloudWalker', 'Chmurostąpa {num}')} (strata ${card('Gandalf', 'Gandalfa')} {gandalf}: {lost}).`,

  // UI
  ui_confirm: 'Tak',
  ui_deny: 'Nie',
  ui_undo: 'Cofnij',
  ui_bomb: 'Bomba!',
  ui_next_phase: 'Dalej',
  ui_replay_bullets: 'Powtórz animację',
  ui_bullet_replay: 'Odtwarzanie przebiegu strzałów...',
  ui_first_night_done: 'Koniec narady Mafii',
  ui_start_night: 'Zacznij noc',
  ui_player_label: 'Gracz: {name}',
  ui_player_jailed_notice: 'Gracz {name} jest w więzieniu — pokaż mu skrzyżowane ręce 🙅.',
  ui_anarchist_baby: 'I shoot you baby!',
  ui_astronomer_night: 'Noc!',
  ui_communist_equal: 'Wszyscy równi!',
  ui_special_no_owner: 'Brak właściciela',
  day_action_vote: 'Przegłosowany',
  day_prompt_vote: 'Wskaż gracza, który został przegłosowany.',
  day_prompt_shot: 'Anarchista oddaje strzał. Wybierz cel.',
  day_prompt_mass_murderer_select: 'Masowy Morderca strzela do swoich oskarżycieli. Zaznacz graczy i potwierdź.',
  day_idle_message: 'Trwa dzień. Użyj dostępnych akcji.',
  day_report_confirm: 'Zatwierdź raport',
  public_report_day_player_left: 'Naszą grę opuszcza {name}.',
  public_report_day_ropewalker_lost: `${card('RopeWalker', 'Linoskoczek {num}')} utracony.`,
  public_report_day_cloudwalker_lost: `${card('CloudWalker', 'Chmurostąp {num}')} utracony.`,
  public_report_day_kevlar_lost: `${card('KevlarVest', 'Kamizelka kuloodporna {num}')} zniszczona.`,
  public_report_day_immunity_lost: `${card('Immunity', 'Immunitet {num}')} zużyty.`,
  ui_mass_murderer_target: 'Skazany: {name}',
  ui_mass_murderer_selected: 'Wybrano: {count}',
  ui_mass_murderer_confirm: 'Oddaj strzały',

  // Warnings
  warn_anarchist_unavailable: 'Anarchista nie może już strzelać.',
  warn_terrorist_unavailable: 'Terrorysta nie może już odpalić bomby.',
  warn_bomb_day_only: 'Bomby można użyć tylko w dzień.',
  warn_astronomer_unavailable: 'Astronom nie może już zakończyć dnia.',
  warn_astronomer_day_only: 'Astronom działa tylko w trakcie dnia.',
  warn_communist_unavailable: 'Komunista nie może już użyć swojej zdolności.',
  warn_communist_day_only: 'Komunista działa tylko w dzień.',

  log_day_vote: 'Gracz {target} został przegłosowany.',
  log_day_shot: `${card('Anarchist', 'Anarchista')} {actor} postrzelił {target}.`,
  log_day_bomb: `${card('Terrorist', 'Terrorysta')} {player} detonuje bombę!`,
  log_day_astronomer: `${card('Astronomer', 'Astronom')} {player} kończy dzień.`,
  log_day_communist: `${card('Communist', 'Komunista')} {player} wprowadza równość.`,
  log_day_mass_murderer_trigger: `${card('MassMurderer', 'Masowy Morderca')} {target} sięga po broń przed wyrokiem.`,
  log_day_mass_murderer_shot: `${card('MassMurderer', 'Masowy Morderca')} {player} zabija {target}.`,

  // Phase Dividers
  log_divider_night_start: 'Noc {round} zaczyna się.',
  log_divider_night_end: 'Noc {round} dobiega końca.',
  log_divider_day_start: 'Dzień {round} zaczyna się.',
  log_divider_day_end: 'Dzień {round} dobiega końca.',

  // Setup Wizard
  setup_next: 'Dalej',
  setup_remove: 'Aby poprawnie rozdać role, musisz usunąć kilka kart...',
  setup_step_count: 'Liczba graczy',
  setup_step_mafia: 'Liczba kart Mafii',
  setup_mafia_description: 'Wybierz, ile kart Mafii znajdzie się w talii ({min} - {max}).',
  setup_mafia_label: 'Karty Mafii w talii',
  setup_mafia_recommended: 'Sugerowana wartość dla {players} graczy: {count}',
  setup_step_names: 'Imiona',
  setup_step_balance: 'Balans gry',
  setup_balance_instruction: 'Aby wyrównać talię, usuń {remove} kart lub dodaj {add}.',
  setup_remove_instruction: 'Musisz usunąć {count} kart, aby wyrównać talię.',
  setup_cards_remaining: 'Do usunięcia',
  setup_cards_missing: 'Brakuje kart',
  setup_cards_total: 'Łącznie kart w talii: {count}',
  setup_cards_minimum: 'Dodaj jeszcze {missing}, aby każdy gracz dostał co najmniej jedną kartę.',
  setup_start_game: 'Rozpocznij grę',
};