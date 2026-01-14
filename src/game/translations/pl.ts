import type { RuleSection } from './types';

export const RULES_CONTENT_PL: RuleSection[] = [
  {
    title: 'O grze',
    blocks: [
      { kind: 'paragraph', text: 'Mafia to fabularna gra towarzyska przeznaczona dla 2–20 osób.' },
      { kind: 'paragraph', text: 'Gracze dzielą się na dwie frakcje: Mafię oraz Miasto (zwykłych mieszkańców). Mafia wygrywa, gdy wyeliminuje wszystkich obywateli, natomiast Miasto triumfuje po pozbyciu się Mafii.' },
      { kind: 'paragraph', text: 'Rozgrywka opiera się na dedukcji, blefie oraz umiejętnym zarządzaniu zdolnościami kart.' }
    ]
  },
  {
    title: 'Początek gry',
    blocks: [
      { kind: 'paragraph', text: 'Na początku partii każdy gracz otrzymuje taką samą liczbę kart.' },
      { kind: 'paragraph', text: 'Przed pierwszą nocą gracze powinni zapoznać się z działaniem swoich kart nocnych.' },
      { kind: 'paragraph', text: 'System rozdawania kart posiada zabezpieczenia przed skrajnie niesprawiedliwymi układami (np. trafienie wszystkich Chmurostąpów do jednego gracza). Szczegóły znajdują się w sekcji „Zasady balansu kart”.' }
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
        title: 'Pierwsza noc - narada Mafii',
        blocks: [
          { kind: 'paragraph', text: 'Na początku pierwszej nocy prowadzący budzi całą Mafię. To jedyny moment, w którym Mafiosi mogą niemo ustalić strategię i kolejność eliminacji. Po zakończeniu narady Mafia ponownie zasłania oczy i rozpoczyna się standardowa sekwencja nocy.' }
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
          'Gracze wnoszą oskarżenia wobec osób podejrzanych o przynależność do Mafii, dążąc do skazania ich na śmierć szubienicą.',
          'Oskarżeni gracze wygłaszają mowy obronne, starając się przekonać innych o swojej niewinności. Jeśli Duch Bobo odebrał któremuś z oskarżonych głos, wskazuje on osobę (adwokata), której zadaniem jest obrona poprzez tłumaczenie mimiki i ruchów oskarżonego.',
          'Konferansjer wymienia oskarżonych w kolejności, w jakiej odbędzie się głosowanie. Następnie dla każdego z nich prowadzący wykonuje odliczanie: „Kto chce zagłosować za śmiercią [Imię], proszę podnieść rękę w górę za trzy, dwa, jeden”. Głosować mogą wszyscy (nawet sami oskarżeni), chyba że Sędzia (Soudce) odebrał komuś to prawo.'
        ]
      },
      { kind: 'paragraph', text: 'Niektóre role modyfikują siłę głosu: głos Mecziara liczy się podwójnie, natomiast liczba głosów oddanych na Kovacza jest pomniejszana o jeden. Komunista może raz na grę znieść przywileje Mecziara, Kovacza, Sędziego oraz cenzurę Ducha Bobo, zrównując prawa wszystkich graczy.' },
      { kind: 'paragraph', text: 'Konferansjer liczy głosy ręcznie, samodzielnie uwzględniając bonus Mecziara i modyfikator Kovacza. Aplikacja jedynie wyświetla ikony przy odpowiednich rolach, więc prowadzący musi pamiętać o korekcie wyniku.' },
      { kind: 'paragraph', text: 'W przypadku remisu następuje dogrywka: wszyscy uprawnieni gracze głosują kolejno na oskarżonych z równą liczbą głosów, decydując „za” lub „przeciw” ich skazaniu.' },
      { kind: 'paragraph', text: 'Przed ogłoszeniem ostatecznego wyroku Astronom może użyć swojej zdolności, by natychmiast zakończyć dzień bez śmierci skazanego.' }
    ]
  },
  {
    title: 'Reguły obronne',
    blocks: [
      { kind: 'paragraph', text: 'Gracze posiadają środki obrony przed śmiercią, które aktywują się automatycznie. Użycie karty Chmurostąp, Immunitet, Kamizelka kuloodporna, Zwierciadło lub Linoskoczek powoduje jej bezpowrotną utratę.' },
    ],
    subsections: [
      {
        title: 'Tunel',
        blocks: [
          { kind: 'paragraph', text: 'Jeśli trafiony zostanie pierwszy wskazany gracz, pocisk przemieszcza się tunelem do drugiego. Jeśli od jednego gracza wychodzi więcej tuneli, pocisk dzieli się na odłamki, które przelatują wszystkimi tunelami (zachowując właściwości normalnego pocisku). Pocisk ani odłamki nie mogą przebyć tego samego tunelu dwukrotnie. W przypadku istnienia dwóch lub trzech tuneli w tym samym kierunku między tymi samymi graczami, pocisk nie dzieli się, lecz leci tunelem utworzonym najwcześniej.' }
        ]
      },
      {
        title: 'Maska Gazowa',
        blocks: [
          { kind: 'paragraph', text: 'Posiadacze kart Mag 2, Szalony Strzelec 2 oraz Duch Bobo są wyposażeni w Maskę Gazową, chroniącą przed Piaskiem i zapachem Skarpetki.' }
        ]
      }
    ]
  },
  {
    title: 'Reguły obronne – noc',
    blocks: [
      { kind: 'paragraph', text: 'Każdy nocny atak weryfikowany jest przez system obron w określonej kolejności – zadziałanie jednej z barier przerywa sprawdzanie pozostałych. Przed listą priorytetów zawsze sprawdzane jest, czy Matrix nie przechwycił pocisku.' },
      { kind: 'paragraph', text: 'Aplikacja przetwarza ataki zgodnie z poniższą hierarchią, ale raport końcowy jest losowo przetasowany, aby utrudnić identyfikację strzelców.' }
    ],
    subsections: [
      {
        title: 'a) Pocisk od Mafii',
        blocks: [
          { kind: 'list', title: 'Strzela Mafioso z najwyższym numerem:', ordered: true, items: ['Magnes', 'Tunel', 'Zwierciadło', 'Ślina', 'Al Capone', 'Doktor', 'Kamizelka kuloodporna', 'Chmurostąp'] }
        ]
      },
      {
        title: 'b) Pocisk od Szalonego Strzelca',
        blocks: [
          { kind: 'list', ordered: true, items: ['Magnes', 'Tunel', 'Zwierciadło', 'Ślina', 'Doktor', 'Kamizelka kuloodporna', 'Chmurostąp'] }
        ]
      },
      {
        title: 'c) Pocisk od Snajpera',
        blocks: [
          { kind: 'list', ordered: true, items: ['Magnes', 'Tunel', 'Zwierciadło', 'Ślina', 'Doktor', 'Kamizelka kuloodporna', 'Chmurostąp'] }
        ]
      },
      {
        title: 'd) Zapach Skarpetki',
        blocks: [
          { kind: 'list', ordered: true, items: ['Maska Gazowa', 'Doktor', 'Chmurostąp'] }
        ]
      },
      {
        title: 'e) Pocisk od Matrixa',
        blocks: [
          { kind: 'list', ordered: true, items: ['Zwierciadło', 'Kamizelka kuloodporna', 'Chmurostąp'] }
        ]
      }
    ]
  },
  {
    title: 'Reguły obronne – dzień',
    blocks: [
      { kind: 'paragraph', text: 'W dzień obrona również działa automatycznie i jest rozpatrywana przed faktyczną śmiercią gracza. Jeśli Ślepy Kat wskazał ofiarę zastępczą, zamiana celów następuje przed zużyciem tarcz.' }
    ],
    subsections: [
      {
        title: 'a) Skazanie w głosowaniu',
        blocks: [
          { kind: 'list', ordered: true, items: ['Linoskoczek', 'Immunitet', 'Chmurostąp'] }
        ]
      },
      {
        title: 'b) Strzał w dzień (Anarchista, Masowy Morderca, Bomba)',
        blocks: [
          { kind: 'list', ordered: true, items: ['Immunitet', 'Kamizelka kuloodporna', 'Chmurostąp'] }
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
              'Jailer',
              'Grabarz',
              'Matrix',
              'Magowie',
              'Ślina',
              'Pijawka',
              'Piasek',
              'Kobra',
              'Magnes',
              'Duch Bobo',
              'Doktor',
              'Jożin z Bażin',
              'Mafia',
              'Szaleni Strzelcy',
              'Snajper',
              'Skarpetka',
              'Sędzia',
              'Ślepy Kat',
              'Strzał Matrixa'
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
              'Grabarz',
              'Matrix',
              'Magowie',
              'Ślina',
              'Pijawka',
              'Piasek',
              'Doktor',
              'Jożin z Bażin',
              'Mafia',
              'Snajper',
              'Skarpetka',
              'Ślepy Kat',
              'Strzał Matrixa'
            ]
          }
        ]
      },
      {
        title: 'c) Dodatkowe zasady nocne',
        blocks: [
          { kind: 'paragraph', text: 'Pod koniec co trzeciej nocy (zaczynając od drugiej) budzi się Luneta, aby dowiedzieć się, którzy gracze byli aktywni.' },
          { kind: 'paragraph', text: 'Niektóre role (np. Matrix) mają ograniczoną liczbę użyć; po wyczerpaniu ładunków prowadzący przestaje je budzić.' }
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
          'Gracz może posiadać tylko jedną kartę Mafii.',
          'Gracz może posiadać tylko jedną kartę z pary Gandalf / Kawał Konia.',
          'Gracz może posiadać tylko jedną kartę z zestawu: Mag 2 / Szalony Strzelec 2 / Duch Bobo.',
          'Gracz może posiadać tylko jedną kartę z pary Pijawka / Kobra.',
          'Gracz może posiadać tylko jednego Szalonego Strzelca.',
          'Gracz może posiadać tylko jedną kartę Ślina.',
          'Gracz może posiadać tylko jedną kartę z pary Ateista / Matrix.',
          'Gracz posiadający kartę Mafii nie może otrzymać Doktora ani Lunety.',
          'Gracz może otrzymać maksymalnie dwa Chmurostąpy.',
          'Gracz może otrzymać maksymalnie dwóch Linoskoczków.',
          'Gracz posiadający kartę Grabarz, Pijawka, Al Capone, Gandalf lub Kawał Konia może otrzymać tylko jednego Chmurostąpa.'
        ]
      }
    ]
  }
];

export const TRANSLATIONS_PL = {
  role_CloudWalker: 'Chmurostąp',
  role_Immunity: 'Immunitet',
  role_RopeWalker: 'Linoskoczek',
  role_KevlarVest: 'Kamizelka kuloodporna',
  role_Matrix: 'Matrix',
  role_Jailer: 'Jailer',
  role_Mage: 'Mag',
  role_Slime: 'Ślina',
  role_Leech: 'Pijawka',
  role_Sand: 'Piasek',
  role_Cobra: 'Kobra',
  role_Magnet: 'Magnes',
  role_Sock: 'Skarpetka',
  role_GhostBobo: 'Duch Bobo',
  role_Mafia: 'Mafioso',
  role_MadGunman: 'Szalony Strzelec',
  role_Sniper: 'Snajper',
  role_Mirror: 'Zwierciadło',
  role_Terrorist: 'Terrorysta',
  role_Astronomer: 'Astronom',
  role_Meciar: 'Mecziar',
  role_Kovac: 'Kovacz',
  role_AlCapone: 'Al Capone',
  role_Gandalf: 'Gandalf',
  role_HorsePiece: 'Kawał Konia',
  role_Atheist: 'Ateista',
  role_Anarchist: 'Anarchista',
  role_Glazier: 'Szklarz',
  role_MassMurderer: 'Masowy Morderca',
  role_Judge: 'Sędzia',
  role_BlindExecutioner: 'Ślepy Kat',
  role_Communist: 'Komunista',
  role_Spyglass: 'Luneta',
  role_Gravedigger: 'Grabarz',
  role_TimeLord: 'Pan Czasu',
  role_Doctor: 'Doktor',
  role_SwampMonster: 'Jożin z Bażin',

  // Card descriptions
  card_description_AlCapone: 'Al Capone jako ojciec chrzestny Mafii jest odporny na jej ataki. Ochrona ta działa tylko na bezpośrednie trafienie przez Mafię, nie chroni natomiast przed pociskiem przekierowanym przez Tunel, Magnes lub Zwierciadło.',
  card_description_Anarchist: 'Anarchista może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "I shoot you baby!", po czym strzela do wskazanej przez siebie osoby.',
  card_description_Astronomer: 'Astronom może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Noc!", co natychmiast kończy dzień, nawet jeśli trwa właśnie głosowanie.',
  card_description_Atheist: 'Tunel stworzony przez Maga prowadzący do Ateisty nie działa. Konferansjer nie informuje Maga o tym, że utworzył tunel na Ateistę.',
  card_description_Doctor: 'Doktor każdej nocy wskazuje gracza, którego leczy, chroniąc go tym samym jednorazowo przed pociskiem lub zapachem Skarpetki. Co trzecią noc (zaczynając od pierwszej lub drugiej) może uleczyć samego siebie. Jeśli Doktor zostanie sam przeciwko jednemu lub kilku Mafiosom i nie może się uleczyć, jest deaktywowany.',
  card_description_GhostBobo: 'Duch Bobo każdej parzystej nocy wskazuje gracza, który następnego dnia będzie miał zakaz mówienia (zakaz ten może znieść tylko Komunista). Jeśli oskarżony gracz ma nałożony przez Ducha Bobo zakaz wypowiadania się, wybiera osobę, która ma go bronić, tłumacząc jego mimikę i gesty.',
  card_description_Sock: 'Gracz ze Skarpetką może raz na całą grę w nocy rzucić Skarpetkę między dwóch graczy, którzy zostają porażeni jej zapachem. Przed zapachem Skarpetki chroni tylko Maska Gazowa, Doktor i Chmurostąp. Szalony Strzelec 2, Mag 2 i Duch Bobo posiadają Maskę Gazową.',
  card_description_Gandalf: 'Jeśli Kawał Konia traci Chmurostąpa, zyskuje go Gandalf. W ciągu nocy może uzyskać w ten sposób tylko jednego Chmurostąpa.',
  card_description_Gravedigger: 'Grabarz może raz na całą grę w nocy wykopać groby dla Chmurostąpów, dzięki czemu pod koniec nocy zyskuje tyle Chmurostąpów, ile zostało ich tej nocy utraconych przez innych graczy.',
  card_description_Immunity: 'Karta obronna używana w przypadku trafienia pociskiem w dzień lub skazania na śmierć przez powieszenie.',
  card_description_Jailer: 'Jailer może raz na całą grę wskazać gracza, którego wtrąca do więzienia, blokując działanie jego zdolności tej nocy. Konferansjer budzi uwięzionego gracza, ale wyraźnie sygnalizuje mu, że znajduje się w więzieniu.',
  card_description_SwampMonster: 'Jożin z Bażin może trzy razy w ciągu całej gry wskazać w nocy gracza, któremu poplami Zwierciadło. Pocisk rozbija poplamione błotem Zwierciadło, ale leci dalej. Jożin może użyć swojej zdolności wielokrotnie tej samej nocy. Jeśli gracz posiada również kartę Mafiosa, Snajpera lub Szalonego Strzelca, może poplamić Zwierciadło tylko dwa razy.',
  card_description_KevlarVest: 'Karta obronna używana w przypadku trafienia pociskiem.',
  card_description_Cobra: 'Kobra każdej parzystej nocy wskazuje gracza, który według niej posiada kartę Pijawka. Jeśli trafi, pod koniec nocy zyskuje Chmurostąpa i zjada Pijawkę (gracz z tą kartą traci swoje zdolności).',
  card_description_Communist: 'Komunista może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Obywatele, w tej rundzie jesteśmy wszyscy równi", anulując tym samym na jeden dzień zdolności Mecziara, Kovacza, Ducha Bobo i Sędziego.',
  card_description_Kovac: 'Kovacz zmniejsza liczbę głosów oddanych za jego śmiercią o 1. Jeśli Komunista użyje swojej zdolności, Kovacz traci tę funkcję.',
  card_description_HorsePiece: 'Jeśli Gandalf traci Chmurostąpa, zyskuje go Kawał Konia. W ciągu nocy może uzyskać w ten sposób tylko jednego Chmurostąpa.',
  card_description_Spyglass: 'Luneta budzi się pod koniec każdej trzeciej nocy (zaczynając od drugiej) i dowiaduje się od Konferansjera, którzy gracze obudzili się tej nocy.',
  card_description_Mafia: 'Mafioso może wygrać grę poprzez eliminację wszystkich zwykłych graczy, używając w tym celu pocisku każdej nocy. Aby Mafia wystrzeliła, wszyscy Mafiosi muszą w nocy wskazać tego samego gracza. Aby ustalić kolejność wskazywania, budzą się oni na początku pierwszej nocy.',
  card_description_Mage: 'Mag każdej nocy wskazuje dwóch graczy, między którymi tworzy jednokierunkowy tunel. Jeśli trafiony zostanie pierwszy wskazany gracz, pocisk wędruje tunelem do drugiego.',
  card_description_Magnet: 'Magnes każdej parzystej nocy wskazuje gracza, którego magnetyzuje. Jeśli obok namagnetyzowanego gracza przelatuje pocisk, zostaje on do niego przyciągnięty. Pocisk może zostać przyciągnięty przez namagnetyzowanego gracza tylko raz.',
  card_description_MassMurderer: 'Jeśli Masowy Morderca zostanie skazany na powieszenie, strzela do wszystkich, którzy na niego głosowali.',
  card_description_Matrix: 'Matrix może raz na całą grę w nocy zmienić prawa fizyki – przechwycić wszystkie pociski, które w niego trafią, i wypuścić je pod koniec nocy.',
  card_description_Meciar: 'W głosowaniu jego głos liczy się podwójnie. Jeśli Komunista użyje swojej zdolności, Mecziar traci tę funkcję.',
  card_description_CloudWalker: 'Chmurostąp to podstawowa karta obronna pełniąca funkcję dodatkowego życia. Jest zużywana, jeśli gracz nie posiada innej ochrony.',
  card_description_TimeLord: 'Pan Czasu może raz na całą grę na początku dnia lub nocy powiedzieć "Jestem Panem czasu!" i przeskoczyć cały dzień lub noc.',
  card_description_Sand: 'Gracz z kartą Piasek każdej nocy wskazuje gracza, którego posypuje piaskiem. Piasek neutralizuje efekt Śliny, czyniąc gracza ponownie podatnym na trafienie. Ochronę przed Piaskiem mają gracze z Maską Gazową (Szalony Strzelec 2, Mag 2 i Duch Bobo).',
  card_description_Leech: 'Pijawka każdej nocy wskazuje gracza, do którego się przysysa. Jeśli gracz ten traci owej nocy Chmurostąpa lub ginie, Pijawka zyskuje Chmurostąpa. Pijawka może zostać zjedzona przez Kobrę.',
  card_description_RopeWalker: 'Karta obronna chroniąca przed śmiercią na szubienicy.',
  card_description_BlindExecutioner: 'Ślepy Kat może dwa razy w ciągu gry wskazać w nocy dwóch graczy. Jeśli następnego dnia pierwszy ze wskazanych graczy miałby zostać powieszony, zamiast niego ginie gracz wskazany jako drugi.',
  card_description_Sniper: 'Snajper może raz na całą grę wskazać gracza, w którego strzela potężnym pociskiem. Jest on tak silny, że rozbija nawet Zwierciadło i leci dalej.',
  card_description_Judge: 'Sędzia każdej parzystej nocy wskazuje gracza, który następnego dnia będzie miał zakaz głosowania. Komunista może znieść ten zakaz.',
  card_description_MadGunman: 'Szalony Strzelec każdej parzystej nocy oddaje jeden strzał.',
  card_description_Glazier: 'Jeśli Szklarz nie ma żadnego Zwierciadła, a innemu graczowi w nocy zostanie ono zniszczone, Szklarz zyskuje je pod koniec nocy. Może otrzymać tylko jedno Zwierciadło w ciągu nocy.',
  card_description_Slime: 'Gracz z kartą Ślina każdej nocy wskazuje gracza, którego chce oślinić. Ośliniony gracz jest raz w nocy chroniony przed pociskiem Mafii, Szalonego Strzelca i Snajpera (pocisk ześlizguje się z celu). Efekt Śliny można zneutralizować Piaskiem.',
  card_description_Terrorist: 'Terrorysta może raz na całą grę w ciągu dnia użyć swojej zdolności, mówiąc "Bomba!", po czym strzela do wszystkich graczy.',
  card_description_Mirror: 'Karta obronna używana w przypadku trafienia pociskiem Mafii lub Szalonego Strzelca. Po rozbiciu Zwierciadła pocisk wraca do gracza, od którego przyleciał, chyba że Zwierciadło zostało poplamione błotem przez Jożina z Bażin.',

  // App Shell & Navigation
  app_title: 'Mafia²',
  app_continue_game: 'KONTYNUUJ GRĘ',
  app_continue_round: 'Runda {round}',
  app_new_game: 'NOWA GRA',
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
  logs_public_report_title: 'Raport publiczny',
  logs_public_report_placeholder: 'Raport publiczny pojawi się na początku dnia.',
  logs_round_title: 'Dziennik rundy',
  logs_round_empty: 'Brak wpisów dla tej rundy.',
  logs_panel_title: 'Historia gry',
  logs_panel_empty: 'Brak wpisów w dzienniku.',

  // Cards
  cards_collection_title: 'Kolekcja kart',
  cards_placeholder_description: 'Opis w przygotowaniu.',

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
  settings_storage_description: 'Czyści automatyczny zapis i przeładowuje aplikację.',
  settings_reset_data_button: 'Wyzeruj dane gry',

  // GM Player List
  gm_players_title: 'Gracze ({count})',
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
  gm_players_share_text: 'Otwórz karty gracza {player} w aplikacji.',
  gm_players_copy_success: 'Link do gracza {player} skopiowany! Wyślij go tej osobie.',
  gm_players_qr_error: 'Nie można wygenerować kodu QR. Link został skopiowany do schowka.',
  gm_players_modal_close_qr_aria: 'Zamknij okno kodu QR',
  gm_players_modal_close_manual_aria: 'Zamknij okno kopiowania',

  // Generic responses
  ui_yes: 'Tak',
  ui_no: 'Nie',

  // Setup Wizard
  setup_next: 'DALEJ',

  // Gameplay Texts
  setup_remove: 'Aby poprawnie rozdać role, musisz usunąć kilka kart...',
  win_mafia: 'Wygrywa Mafia.',
  win_innocent: 'Wygrywa Miasto (Niewinni).',
  log_start_game: 'Nowa gra rozpoczęta.',
  log_player_activate: '{cardLabel} {player} użył zdolności.',
  night_log_matrix_activate: 'Podążaj za białym królikiem... ({cardLabel} {player} użył zdolności.)',
  night_log_matrix_bullet_summary: 'Ilość pocisków, które Matrix {player} przechwycił tej nocy: {count}.',
  start_day: 'Rozpocznij dzień',
  start_night_intro: 'Zapada noc, miasteczko zasypia...',
  first_night_message: 'Mafia budzi się, by ustalić strategię.',
  wake_up: 'Budzi się {role}. Czy użyje swojej funkcji?',
  wake_up_use_again: 'Czy {role} chce użyć funkcji ponownie?',
  wake_up_spyglass: 'Budzi się Luneta. Czy dowiedziała się, kto był aktywny tej nocy?',
  wake_matrix_shot: 'Budzi się Matrix. W kogo chce strzelić? (pocisk {current}/{total})',
  wake_up_jailer: 'Budzi się {role}. Kogo wtrąca do więzienia?',
  wake_up_slime: 'Budzi się {role}. Kogo chce pokryć śliną?',
  wake_up_leech: 'Budzi się {role}. Do kogo chce się przyssać?',
  wake_up_sand: 'Budzi się {role}. Kogo chce obsypać piaskiem?',
  wake_up_shooter: 'Budzi się {role}. Do kogo chce strzelić?',
  wake_up_judge: 'Budzi się {role}. Komu chce odebrać prawo głosu?',

  // Actions
  wake_up_mage_from: 'Budzi się {role}. Z którego gracza chce utworzyć tunel?',
  wake_up_mage_to: 'Dokąd {role} poprowadzi wyjście z tunelu?',
  report_slime: '{cardLabel} {player} pokrył śliną gracza {target}.',
  report_leech: '{cardLabel} {player} przyssał się do gracza {target}.',
  report_sand: '{cardLabel} {player} obsypał piaskiem gracza {target}.',
  report_sand_fail: '{cardLabel} {player} chciał użyć Piasku na graczu {target}, ale ten posiada Maskę Gazową.',
  wake_up_cobra: 'Budzi się {role}. Kogo chce ukąsić?',
  report_cobra: '{name} został ukąszony.',
  wake_up_magnet: 'Budzi się {role}. Kogo chce namagnetyzować?',
  report_magnet: '{name} został namagnetyzowany.',
  wake_up_ghost: 'Budzi się {role}. Kogo chce uciszyć?',
  wake_up_swamp_monster: 'Kogo chce ochlapać błotem?',
  wake_up_executioner_save: 'Budzi się {role}. Kogo chce ułaskawić spod szubienicy?',
  wake_up_executioner_victim: 'Kto ma trafić na szubienicę zamiast niego?',
  wake_up_sock_first: 'Pomiędzy kogo rzucić Skarpetkę? Wskaż pierwszego gracza.',
  wake_up_sock_second: 'Teraz wskaż sąsiada tego gracza.',
  spyglass_reveal_intro: 'Tej nocy budzili się: {names}.',
  spyglass_reveal_none: 'Tej nocy nikt się nie obudził.',
  report_ghost: '{cardLabel} {player} odebrał głos graczowi {target}.',
  report_judge: '{cardLabel} {player} odebrał prawo głosu graczowi {target}.',
  night_log_swamp_attack: '{cardLabel} {player} ochlapał błotem gracza {target}.',
  night_log_executioner_save: '{saved} jest chroniony przed wyrokiem, zamiast niego zginie {victim}.',
  log_executioner_same_target: '{cardLabel} {player} nie może wskazać tego samego gracza ({target}) jako ofiary i chronionego.',
  report_sock_throw: '{cardLabel} {player} wycelował Skarpetką między graczy {first} i {second}.',
  log_sock_invalid_neighbor: '{cardLabel} {player} nie może rzucić Skarpetki między {first} i {target}, gdyż nie są sąsiadami.',
  log_sock_same_target: '{cardLabel} {player} musi wybrać dwóch różnych graczy.',
  log_sock_throw_intro: '{cardLabel} {player} rzucił Skarpetkę między graczy {first} i {second}. ',
  log_sock_result_gasmask: 'Maska Gazowa ocaliła gracza {name}. ',
  log_sock_result_dead: 'Gracz {name} był już martwy. ',
  log_sock_result_doctor: 'Doktor ocalił gracza {name}. ',
  log_sock_result_cloudwalker: 'Gracz {name} stracił Chmurostąpa. ',
  log_sock_result_death: 'Gracz {name} opuszcza grę. ',
  log_jailer_imprison: '{cardLabel} {player} wtrącił do więzienia gracza {target}.',
  log_action_blocked_jailed: '{cardLabel} {player} siedzi w więzieniu, więc tej nocy nic się nie wydarzy.',

  // Doctor
  wake_up_doctor_heal_self: 'Budzi się {role}. Kogo chce uleczyć? (może siebie)',
  wake_up_doctor_heal_other: 'Budzi się {role}. Kogo chce uleczyć? (nie może siebie)',
  report_heal_fail: '{cardLabel} {player} chciał uleczyć {target}, ale cel nie zostanie uleczony, gdyż Doktor działa w pojedynkę przeciw Mafii.',
  report_heal_success: '{cardLabel} {player} wyleczy gracza {target}.',
  report_heal_self_locked: '{cardLabel} {player} nie może uleczyć siebie tej nocy.',

  // Mafia/Shooting
  wake_up_mafia_aim: 'Budzi się {role}. W kogo celuje?',
  log_mafia_jailed: '{cardLabel} {player} przebywa w więzieniu, więc Mafia nie odda strzału.',
  log_mafia_no_consensus: 'Mafiosi nie byli zgodni co do celu, więc tej nocy nikt nie strzelił.',
  log_shoot: '{cardLabel} {player} strzela do gracza {target}.',
  log_shooter_aim: '{cardLabel} {player} celuje w gracza {target}.',

  // Public Reports (Resolution)
  report_vest_hit: '{target} traci Kamizelkę kuloodporną {num}.',
  report_ropewalker_lost: '{target} traci Linoskoczka {num}.',
  report_immunity_lost: '{target} traci Immunitet {num}.',
  report_life_lost: '{target} traci Chmurostąpa {num}.',
  report_death: '{target} ginie.',
  log_tunnel_duplicate: '{cardLabel} {player} chciał stworzyć tunel {source}->{target}, ale taki już istnieje.',
  log_tunnel_atheist: '{cardLabel} {player} chciał użyć tunelu na graczu {target}, ale to Ateista.',
  log_tunnel_same_player: '{cardLabel} {player} nie może stworzyć tunelu na tego samego gracza.',
  log_tunnel_created: '{cardLabel} {player} utworzył tunel {tunnelNumber} ({source} -> {target}).',

  // Morning Report
  night_report_default: 'Miasteczko Palermo budzi się.',
  night_report_ghost_bobo: '{name} nie może dziś mówić.',
  night_report_judge: '{name} nie może dziś głosować.',
  night_report_slime: '{name} ocieka śliną.',
  night_report_slime_multi: '{name} ocieka śliną (x{count}).',
  night_report_sand: '{name} ma piasek w oczach.',
  night_report_sand_saved: 'Maska Gazowa uchroniła gracza przed Piaskiem.',
  night_report_matrix: 'Tej nocy Matrix użył swej funkcji. Ilość pocisków które przechwycił: {count}.',
  night_report_sock_used: 'Skarpetka została rzucona pomiędzy dwóch graczy. ',
  night_report_sock_first_gasmask: 'Pierwszego gracza ocaliła Maska Gazowa',
  night_report_sock_first_dead: 'Pierwszy gracz był już martwy',
  night_report_sock_first_doctor: 'Pierwszego gracza uratował Doktor',
  night_report_sock_first_cloudwalker: 'Pierwszy gracz stracił Chmurostąpa',
  night_report_sock_first_death: 'Pierwszy gracz, {name}, opuszcza grę',
  night_report_sock_second_gasmask: ', a drugiego ocaliła Maska Gazowa.',
  night_report_sock_second_dead: ', a drugi gracz był już martwy.',
  night_report_sock_second_doctor: ', a drugiego uratował Doktor.',
  night_report_sock_second_cloudwalker: ', a drugi gracz stracił Chmurostąpa.',
  night_report_sock_second_death: ', a grę opuszcza {name}.',
  night_report_sock_first_only_suffix: '.',
  night_report_leech_cloudwalker: 'Pijawka zdobywa Chmurostąpa {num}.',
  night_report_cobra_cloudwalker: 'Kobra zjada Pijawkę i zdobywa Chmurostąpa {num}.',
  night_report_gravedigger_cloudwalker: 'Grabarz wykopuje Chmurostąpa {num}.',
  night_report_glazier_mirror: 'Szklarz tworzy Zwierciadło {num}.',
  night_report_gandalf_cloudwalker: 'Gandalf zdobywa Chmurostąpa {num}.',
  night_report_horsepiece_cloudwalker: 'Kawał Konia zdobywa Chmurostąpa {num}.',
  night_log_leech_cloudwalker: '{cardLabel} {player} zdobywa Chmurostąpa {num}.',
  night_log_cobra_cloudwalker: '{cardLabel} {player} pożera Pijawkę i zdobywa Chmurostąpa {num}.',
  night_log_gravedigger_cloudwalker: '{cardLabel} {player} zdobywa Chmurostąpa {num}.',
  night_log_gandalf_cloudwalker: '{cardLabel} {player} zdobywa Chmurostąpa {num}.',
  night_log_horsepiece_cloudwalker: '{cardLabel} {player} zdobywa Chmurostąpa {num}.',
  night_log_glazier_mirror: '{cardLabel} {player} tworzy Zwierciadło {num}.',
  night_log_bullet_continue_sniper: ', lecz pocisk leci dalej, gdyż Zwierciadło {target} nie odbija strzałów Snajpera,',
  night_log_bullet_continue_matrix: ', lecz pocisk leci dalej, gdyż Zwierciadło {target} nie zatrzymuje strzałów Matrixa,',
  night_log_bullet_continue_mud: ', lecz pocisk leci dalej, gdyż Zwierciadło {target} było zabłocone,',
  // Bullet Report Fragments
  night_report_bullet_dead_target: ', lecz trafił w martwego gracza.',
  night_report_bullet_start: 'Padł strzał',
  night_report_bullet_matrix_catch: ' i Matrix go pochwycił.',
  night_report_bullet_magnet: ', został przyciągnięty Magnesem',
  night_report_bullet_magnet_dead: ', przyciągając kulę do martwego gracza.',
  night_report_bullet_split: ', rozszczepiając się na {count} części.',
  night_report_bullet_tunnel_single: ', przeleciał tunelem',
  night_report_bullet_tunnel_segment: ' {index}. odłamek przeleciał tunelem',
  night_report_bullet_slime: ' i pocisk ześlizgnął się po ślinie.',
  night_report_bullet_al_capone: ', lecz Al Capone zneutralizował zagrożenie.',
  night_report_bullet_doctor: ', lecz Doktor zneutralizował pocisk.',
  night_report_bullet_mirror_break: ', pękło Zwierciadło {num}',
  night_report_bullet_return: ', pocisk wrócił',
  night_report_bullet_continue: ', kula leci dalej',
  night_report_bullet_vest_loss: ' i Kamizelka kuloodporna {num} została zniszczona.',
  night_report_bullet_cloudwalker_loss: ' i zmarł Chmurostąp {num}.',
  night_report_bullet_death: ' i {name} ginie.',
  night_log_bullet_start: '{cardLabel} {shooter} strzela do gracza {target}. ',
  night_log_bullet_start_generic: 'Padł strzał w kierunku {target}. ',
  night_log_bullet_split: 'Pocisk rozszczepił się na {count} części.',
  night_log_bullet_dead_target: ' Trafia w martwego gracza {target}.',
  night_log_bullet_matrix_catch: ' i Matrix {target} go pochwycił.',
  night_log_bullet_magnet_initial: 'Pocisk został przyciągnięty Magnesem do gracza {target}',
  night_log_bullet_magnet: ', został przyciągnięty Magnesem do gracza {target}',
  night_log_bullet_magnet_dead: ' i trafia w martwego gracza {target} (efekt Magnesu).',
  night_log_bullet_tunnel_initial: 'Pocisk przeleciał tunelem {num} ({src} -> {target})',
  night_log_bullet_tunnel_single: ', przeleciał tunelem {num} ({src} -> {target})',
  night_log_bullet_tunnel_segment: ' {index}. odłamek przeleciał tunelem {num} ({src} -> {target})',
  night_log_bullet_slime_initial: 'Pocisk ześlizguje się po ślinie {target}.',
  night_log_bullet_slime: ' i ześlizguje się po ślinie {target}.',
  night_log_bullet_al_capone_initial: 'Al Capone {target} neutralizuje pocisk.',
  night_log_bullet_al_capone: ' i Al Capone {target} go neutralizuje.',
  night_log_bullet_doctor_initial: 'Doktor ratuje gracza {target}.',
  night_log_bullet_doctor: ' i gracz {target} zostaje wyleczony.',
  night_log_bullet_mirror_break_initial: 'Pocisk rozbija Zwierciadło {num} u gracza {target}',
  night_log_bullet_mirror_break: ', u gracza {target} pękło Zwierciadło {num}',
  night_log_bullet_return: ', pocisk wrócił do {target}',
  night_log_bullet_vest_loss_initial: 'Pocisk niszczy Kamizelkę kuloodporną {num} gracza {target}.',
  night_log_bullet_vest_loss: ' i {target} traci Kamizelkę kuloodporną {num}.',
  night_log_bullet_cloudwalker_loss_initial: 'Pocisk odbiera Chmurostąpa {num} graczowi {target}.',
  night_log_bullet_cloudwalker_loss: ' i {target} traci Chmurostąpa {num}.',
  night_log_bullet_death_initial: 'Pocisk zabija gracza {name}.',
  night_log_bullet_death: ' i {name} ginie.',
  night_log_bullet_gandalf_from_horse: ' Gandalf {gandalf} zyskuje Chmurostąpa {num} (strata Kawała Konia {horse}: {lost}).',
  night_log_bullet_horsepiece_from_gandalf: ' Kawał Konia {horse} zyskuje Chmurostąpa {num} (strata Gandalfa {gandalf}: {lost}).',

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
  ui_timelord_skip_night: 'Pan Czasu: Pomiń noc',
  ui_timelord_skip_day: 'Pan Czasu: Pomiń dzień',
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
  day_report_player_left: '{name} opuszcza naszą grę.',
  day_report_ropewalker_lost: 'Linoskoczek {num} utracony.',
  day_report_cloudwalker_lost: 'Chmurostąp {num} utracony.',
  day_report_kevlar_lost: 'Kamizelka kuloodporna {num} zniszczona.',
  day_report_immunity_lost: 'Immunitet {num} zużyty.',
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
  log_day_shot: '{actor} postrzelił {target}.',
  log_day_bomb: 'Terrorysta {player} detonuje bombę!',
  log_day_astronomer: 'Astronom {player} kończy dzień.',
  log_day_communist: 'Komunista {player} wprowadza równość.',
  log_timelord_skip_day: 'Pan Czasu {player} przeskoczył dzień.',
  log_timelord_skip_night: 'Pan Czasu {player} przeskoczył noc.',
  log_day_mass_murderer_trigger: 'Masowy Morderca {target} sięga po broń przed wyrokiem.',
  log_day_mass_murderer_shot: 'Masowy Morderca {player} zabija {target}.',

  // Phase Dividers
  log_divider_night_start: 'Noc {round} zaczyna się.',
  log_divider_night_end: 'Noc {round} dobiega końca.',
  log_divider_day_start: 'Dzień {round} zaczyna się.',
  log_divider_day_end: 'Dzień {round} dobiega końca.',

  // Setup
  setup_step_count: 'Liczba graczy',
  setup_step_mafia: 'Liczba kart Mafii',
  setup_mafia_description: 'Wybierz, ile kart Mafii znajdzie się w talii. Minimum {min}, maksimum {max} (o jednego mniej niż liczba graczy).',
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
  setup_start_game: 'ROZPOCZNIJ GRĘ',
};