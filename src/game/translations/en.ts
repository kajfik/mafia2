import type { RuleSection } from './types';
import type { CardId } from '../types';

const card = (cardId: CardId, labelOverride?: string) =>
  labelOverride ? `{{card:${cardId}|${labelOverride}}}` : `{{card:${cardId}}}`;

export const RULES_CONTENT_EN: RuleSection[] = [
  {
    title: 'About the Game',
    blocks: [
      { kind: 'paragraph', text: `Mafia is a role-playing party game for 2–20 people.` },
      { kind: 'paragraph', text: `Players are divided into two factions: the ${card('Mafia', 'Mafia')} and the Town (ordinary citizens). The ${card('Mafia', 'Mafia')} wins by eliminating all citizens, while the Town triumphs by eliminating the ${card('Mafia', 'Mafia')}.` },
      { kind: 'paragraph', text: 'Gameplay relies on deduction, bluffing, and the strategic use of card abilities.' }
    ]
  },
  {
    title: 'Game Start',
    blocks: [
      { kind: 'paragraph', text: 'At the beginning of the game, each player receives the same number of cards.' },
      { kind: 'paragraph', text: 'Before the first night, players should familiarize themselves with the mechanics of their night cards.' },
      { kind: 'paragraph', text: `The dealing system includes safeguards against severely unbalanced distributions (e.g., all ${card('CloudWalker', 'CloudWalkers')} going to a single player). Details can be found in the "Card Balance Rules" section.` }
    ]
  },
  {
    title: 'Night',
    blocks: [
      { kind: 'paragraph', text: 'When the Announcer declares night, all players close their eyes. The host then calls upon active roles in turn, requesting ability usage and target selection. Awakened players respond silently using head gestures or hand signals.' },
      { kind: 'paragraph', text: 'Nights are classified as even or odd – the night number determines which cards wake up and in what order.' },
      { kind: 'paragraph', text: 'A detailed schedule of night and day role wake-ups can be found in the "Wake-up Order" section.' }
    ],
    subsections: [
      {
        title: `First Night - ${card('Mafia', 'Mafia')} Meeting`,
        blocks: [
          { kind: 'paragraph', text: `At the start of the first night, the host wakes the entire ${card('Mafia', 'Mafia')}. This is the only moment the ${card('Mafia', 'Mafiosi')} can silently agree on a strategy and elimination order. After the meeting, the ${card('Mafia', 'Mafia')} closes their eyes again, and the standard night sequence begins.` }
        ]
      }
    ]
  },
  {
    title: 'Day',
    blocks: [
      { kind: 'paragraph', text: 'In the morning, the town wakes up, players open their eyes, and the Announcer presents the night report.' },
      { kind: 'paragraph', text: 'Eliminated players are removed from the game – from this moment on, they cannot speak or participate in voting.' },
      {
        kind: 'list',
        ordered: true,
        title: 'Day Sequence:',
        items: [
          'The Announcer reads the report of night events.',
          `Players make accusations against those suspected of belonging to the ${card('Mafia', 'Mafia')}, aiming to sentence them to hang.`,
          `Accused players give defense speeches, trying to convince others of their innocence. If ${card('GhostBobo', 'Ghost Bobo')} has silenced an accused player, they designate an advocate to defend them by interpreting the accused's facial expressions and movements.`,
          `The Announcer lists the accused. If there is only one candidate, players vote twice: first for, and then against their execution. If there are multiple candidates, players vote only for the death of each candidate sequentially. For every vote, the host counts down: "Those voting [option], please raise your hands in three, two, one." Everyone may vote (including the accused), unless the ${card('Judge', 'Judge')} has revoked their right.`,
          `Once the voting phase is resolved, the town goes to sleep.`
        ]
      },
      { kind: 'paragraph', text: `Some roles modify voting power: ${card('Meciar', 'Meciar\'s')} vote counts double, while the number of votes cast against ${card('Kovac', 'Kovac')} is reduced by one. The ${card('Communist', 'Communist')} can, once per game, nullify the privileges of ${card('Meciar', 'Meciar')}, ${card('Kovac', 'Kovac')}, the ${card('Judge', 'Judge')}, and the censorship of ${card('GhostBobo', 'Ghost Bobo')}, equalizing everyone's rights.` },
      { kind: 'paragraph', text: `The Announcer counts votes manually, adjusting for ${card('Meciar', 'Meciar\'s')} bonus and ${card('Kovac', 'Kovac\'s')} modifier. The app only displays icons next to the relevant roles, so the host must remember to correct the tally.` },
      { kind: 'paragraph', text: 'In the event of a tie, the tied candidates may offer a final defense if they wish. A runoff vote is then conducted between them in the same manner as before. If a second tie occurs, the voting ends immediately with no execution.' },
      { kind: 'paragraph', text: `Before the final verdict is announced, the ${card('Astronomer', 'Astronomer')} may use their ability to immediately end the day, preventing the convict's death.` }
    ]
  },
  {
    title: 'Defensive Rules',
    blocks: [
      { kind: 'paragraph', text: `Players possess defensive abilities which activate automatically. Using a ${card('CloudWalker', 'CloudWalker')}, ${card('Immunity', 'Immunity')}, ${card('KevlarVest', 'Kevlar Vest')}, ${card('Mirror', 'Mirror')}, or ${card('RopeWalker', 'RopeWalker')} card results in its permanent consumption.` },
    ],
    subsections: [
      {
        title: 'Tunnel',
        blocks: [
          { kind: 'paragraph', text: 'If the tunnel entrance (first player) is hit, the bullet travels through the tunnel to the exit (second player). If multiple tunnels originate from one player, the bullet splits into fragments that travel through all tunnels (retaining standard bullet properties). Neither the bullet nor fragments can pass through the same tunnel twice. In the case of two or three tunnels in the same direction between the same players, the bullet does not split but travels through the earliest created tunnel.' }
        ]
      },
      {
        title: 'Gas Mask',
        blocks: [
          { kind: 'paragraph', text: `Holders of ${card('Mage', 'Mage 2')}, ${card('MadGunman', 'Mad Gunman 2')}, and ${card('GhostBobo', 'Ghost Bobo')} cards possess a Gas Mask, protecting them against ${card('Sand', 'Sand')} and the smell of the ${card('Sock', 'Sock')}.` }
        ]
      }
    ]
  },
  {
    title: 'Defensive Rules – Night',
    blocks: [
      { kind: 'paragraph', text: `Every night attack is verified by the defense system in a specific order – the activation of one defense prevents the checking of others. Before the priority list is checked, the system always determines if ${card('Matrix')} intercepted the bullet.` },
      { kind: 'paragraph', text: 'The application processes attacks according to the hierarchy below, but the final report is randomly shuffled to obscure the shooter\'s identity.' }
    ],
    subsections: [
      {
        title: `a) Bullet from ${card('Mafia', 'Mafia')}`,
        blocks: [
          { kind: 'list', title: `The ${card('Mafia', 'Mafioso')} with the highest priority shoots:`, ordered: true, items: [card('Magnet', 'Magnet'), 'Tunnel', card('Mirror', 'Mirror'), card('Slime', 'Slime'), card('AlCapone', 'Al Capone'), card('Doctor', 'Doctor'), card('KevlarVest', 'Kevlar Vest'), card('CloudWalker', 'CloudWalker')] }
        ]
      },
      {
        title: `b) Bullet from ${card('MadGunman', 'Mad Gunman')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), 'Tunnel', card('Mirror', 'Mirror'), card('Slime', 'Slime'), card('Doctor', 'Doctor'), card('KevlarVest', 'Kevlar Vest'), card('CloudWalker', 'CloudWalker')] }
        ]
      },
      {
        title: `c) Bullet from ${card('Sniper', 'Sniper')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Magnet', 'Magnet'), 'Tunnel', card('Mirror', 'Mirror'), card('Slime', 'Slime'), card('Doctor', 'Doctor'), card('KevlarVest', 'Kevlar Vest'), card('CloudWalker', 'CloudWalker')] }
        ]
      },
      {
        title: `d) Smell of the ${card('Sock', 'Sock')}`,
        blocks: [
          { kind: 'list', ordered: true, items: ['Gas Mask', card('Doctor', 'Doctor'), card('CloudWalker', 'CloudWalker')] }
        ]
      },
      {
        title: `e) Bullet from ${card('Matrix', 'Matrix')}`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('KevlarVest', 'Kevlar Vest'), card('CloudWalker', 'CloudWalker')] }
        ]
      }
    ]
  },
  {
    title: 'Defensive Rules – Day',
    blocks: [
      { kind: 'paragraph', text: `During the day, defense also works automatically and is resolved before the actual death of a player. If the ${card('BlindExecutioner', 'Blind Executioner')} indicated a substitute victim, the target swap occurs before shields are consumed.` }
    ],
    subsections: [
      {
        title: 'a) Sentencing by vote',
        blocks: [
          { kind: 'list', ordered: true, items: [card('RopeWalker', 'RopeWalker'), card('Immunity', 'Immunity'), card('CloudWalker', 'CloudWalker')] }
        ]
      },
      {
        title: `b) Shot during the day (${card('Anarchist', 'Anarchist')}, ${card('MassMurderer', 'Mass Murderer')}, ${card('Terrorist', 'Bomb')})`,
        blocks: [
          { kind: 'list', ordered: true, items: [card('Immunity', 'Immunity'), card('KevlarVest', 'Kevlar Vest'), card('CloudWalker', 'CloudWalker')] }
        ]
      }
    ]
  },
  {
    title: 'Wake-up Order',
    blocks: [
      
    ],
    subsections: [
      {
        title: 'a) Even Nights',
        blocks: [
          { kind: 'paragraph', text: 'On even nights, the following roles wake up in order:' },
          {
            kind: 'list',
            items: [
              card('Jailer', 'Jailer'),
              card('Gravedigger', 'Gravedigger'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Mages'),
              card('Slime', 'Slime'),
              card('Leech', 'Leech'),
              card('Sand', 'Sand'),
              card('Cobra', 'Cobra'),
              card('Magnet', 'Magnet'),
              card('GhostBobo', 'Ghost Bobo'),
              card('Doctor', 'Doctor'),
              card('SwampMonster', 'Swamp Monster'),
              card('Mafia', 'Mafia'),
              card('MadGunman', 'Mad Gunmen'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Sock'),
              card('Judge', 'Judge'),
              card('BlindExecutioner', 'Blind Executioner'),
              card('Matrix', 'Matrix Shot')
            ]
          }
        ]
      },
      {
        title: 'b) Odd Nights',
        blocks: [
          { kind: 'paragraph', text: 'On odd nights, the following roles wake up in order:' },
          {
            kind: 'list',
            items: [
              card('Gravedigger', 'Gravedigger'),
              card('Matrix', 'Matrix'),
              card('Mage', 'Mages'),
              card('Slime', 'Slime'),
              card('Leech', 'Leech'),
              card('Sand', 'Sand'),
              card('Doctor', 'Doctor'),
              card('SwampMonster', 'Swamp Monster'),
              card('Mafia', 'Mafia'),
              card('Sniper', 'Sniper'),
              card('Sock', 'Sock'),
              card('BlindExecutioner', 'Blind Executioner'),
              card('Matrix', 'Matrix Shot')
            ]
          }
        ]
      },
      {
        title: 'c) Additional Night Rules',
        blocks: [
          { kind: 'paragraph', text: `At the end of every third night (starting from the second), the ${card('Spyglass', 'Spyglass')} wakes up to learn which roles were active.` },
          { kind: 'paragraph', text: `Some roles (e.g., ${card('Matrix')}) have a limited number of uses; once charges are exhausted, the host stops waking them.` }
        ]
      }
    ]
  },
  {
    title: 'Card Balance Rules',
    blocks: [
      { kind: 'paragraph', text: 'To ensure balanced gameplay, the application applies the following restrictions during role distribution:' },
      {
        kind: 'list',
        items: [
          `A player may hold only one ${card('Mafia', 'Mafia')} card.`,
          `A player may hold only one card from the pair ${card('Gandalf')} / ${card('HorsePiece', 'Horse Piece')}.`,
          `A player may hold only one card from the set: ${card('Mage', 'Mage 2')} / ${card('MadGunman', 'Mad Gunman 2')} / ${card('GhostBobo', 'Ghost Bobo')}.`,
          `A player may hold only one card from the pair ${card('Leech', 'Leech')} / ${card('Cobra')}.`,
          `A player may hold only one ${card('MadGunman', 'Mad Gunman')}.`,
          `A player may hold only one ${card('Slime', 'Slime')} card.`,
          `A player may hold only one card from the pair ${card('Atheist', 'Atheist')} / ${card('Matrix')}.`,
          `A player holding a ${card('Mafia', 'Mafia')} card cannot receive ${card('Doctor', 'Doctor')} or ${card('Spyglass', 'Spyglass')}.`,
          `A player may receive a maximum of two ${card('CloudWalker', 'CloudWalkers')}.`,
          `A player may receive a maximum of two ${card('RopeWalker', 'RopeWalkers')}.`,
          `A player holding a ${card('Gravedigger', 'Gravedigger')}, ${card('Leech', 'Leech')}, ${card('AlCapone', 'Al Capone')}, ${card('Gandalf')}, or ${card('HorsePiece', 'Horse Piece')} card may receive only one ${card('CloudWalker', 'CloudWalker')}.`
        ]
      }
    ]
  }
];

export const TRANSLATIONS_EN = {
  // Role labels
  role_AlCapone: 'Al Capone',
  role_Anarchist: 'Anarchist',
  role_Astronomer: 'Astronomer',
  role_Atheist: 'Atheist',
  role_BlindExecutioner: 'Blind Executioner',
  role_CloudWalker: 'CloudWalker',
  role_Cobra: 'Cobra',
  role_Communist: 'Communist',
  role_Doctor: 'Doctor',
  role_Gandalf: 'Gandalf',
  role_GhostBobo: 'Ghost Bobo',
  role_Glazier: 'Glazier',
  role_Gravedigger: 'Gravedigger',
  role_HorsePiece: 'Horse Piece',
  role_Immunity: 'Immunity',
  role_Jailer: 'Jailer',
  role_Judge: 'Judge',
  role_KevlarVest: 'Kevlar Vest',
  role_Kovac: 'Kovac',
  role_Leech: 'Leech',
  role_MadGunman: 'Mad Gunman',
  role_Mafia: 'Mafioso',
  role_Magnet: 'Magnet',
  role_MassMurderer: 'Mass Murderer',
  role_Matrix: 'Matrix',
  role_Meciar: 'Meciar',
  role_Mage: 'Mage',
  role_Mirror: 'Mirror',
  role_RopeWalker: 'RopeWalker',
  role_Sand: 'Sand',
  role_Slime: 'Slime',
  role_Sniper: 'Sniper',
  role_Sock: 'Sock',
  role_Spyglass: 'Spyglass',
  role_SwampMonster: 'Swamp Monster',
  role_Terrorist: 'Terrorist',
  role_TimeLord: 'Time Lord',

  // Card descriptions
  card_description_AlCapone: 'Al Capone, as the godfather of the Mafia, is immune to its attacks. This protection applies only to direct hits from the Mafia; it does not protect against a bullet redirected via a Tunnel, Magnet, or Mirror.',
  card_description_Anarchist: 'The Anarchist can use their ability once per game during the day by saying "I shoot you baby!", then shooting a chosen player.',
  card_description_Astronomer: 'The Astronomer can use their ability once per game during the day by saying "Night!", immediately ending the day even if a vote is in progress.',
  card_description_Atheist: 'A tunnel created by a Mage leading to the Atheist fails to work. The Announcer does not inform the Mage that they created a tunnel to an Atheist.',
  card_description_BlindExecutioner: 'The Blind Executioner can indicate two players at night, twice per game. If the first indicated player is sentenced to hang the next day, the second indicated player dies instead.',
  card_description_CloudWalker: 'CloudWalker is a basic defense card acting as an extra life. It is consumed if the player has no other protection available.',
  card_description_Cobra: 'Every even night, the Cobra points to a player they believe holds the Leech card. If they guess correctly, they gain a CloudWalker at the end of the night and devour the Leech (the player with that card loses their abilities).',
  card_description_Communist: 'The Communist can use their ability once per game during the day by saying "Citizens, in this round we are all equal," canceling the abilities of Meciar, Kovac, Ghost Bobo, and the Judge for one day.',
  card_description_Doctor: 'Every night, the Doctor points to a player to heal, protecting them once from a bullet or the smell of the Sock. Every third night (starting from the first or second), they may heal themselves. If the Doctor is left alone against one or more Mafiosi and cannot heal themselves, they are deactivated.',
  card_description_Gandalf: 'If Horse Piece loses a CloudWalker, Gandalf gains it. They can only gain one CloudWalker per night this way.',
  card_description_Glazier: 'If the Glazier has no Mirror, and another player has theirs destroyed during the night, the Glazier gains it at the end of the night. They can receive only one Mirror per night.',
  card_description_GhostBobo: 'Every even night, Ghost Bobo points to a player who will be forbidden from speaking the next day (only the Communist can lift this ban). If the accused player is silenced by Ghost Bobo, they designate a person to defend them by interpreting their facial expressions and gestures.',
  card_description_Gravedigger: 'Once per game at night, the Gravedigger can dig graves to recover CloudWalkers, gaining as many CloudWalkers at the end of the night as were lost by other players that night.',
  card_description_HorsePiece: 'If Gandalf loses a CloudWalker, Horse Piece gains it. They can only gain one CloudWalker per night this way.',
  card_description_Immunity: 'Defense card used if hit by a bullet during the day or sentenced to hang.',
  card_description_Jailer: 'Once per game, the Jailer can indicate a player to imprison, blocking their ability for that night. The Announcer wakes the imprisoned player but clearly signals that they are in prison.',
  card_description_Judge: 'Every even night, the Judge points to a player who will be forbidden from voting the next day. The Communist can lift this ban.',
  card_description_KevlarVest: 'Defense card used if hit by a bullet.',
  card_description_Kovac: 'Kovac reduces the number of votes cast for his death by 1. If the Communist uses their ability, Kovac loses this function.',
  card_description_Leech: 'Every night, the Leech points to a player to latch onto. If that player loses a CloudWalker or dies that night, the Leech gains a CloudWalker. The Leech can be devoured by the Cobra.',
  card_description_MadGunman: 'The Mad Gunman fires one shot every even night.',
  card_description_Mafia: 'A Mafioso can win the game by eliminating all ordinary players, using a bullet every night. To fire, all Mafiosi must point to the same player at night. To coordinate their targets, they wake up at the start of the first night.',
  card_description_Mage: 'Every night, the Mage selects two players to create a one-way tunnel. If the first player (entrance) is hit, the bullet travels through the tunnel to the second player (exit).',
  card_description_Magnet: 'Every even night, the Magnet targets a player to magnetize. If a bullet flies past the magnetized player, it is attracted to them. A bullet can be attracted by a magnetized player only once.',
  card_description_MassMurderer: 'If the Mass Murderer is sentenced to hang, they shoot everyone who voted for them.',
  card_description_Matrix: 'Once per game at night, Matrix can bend the laws of physics – intercepting all bullets that hit them, and releasing them at the end of the night.',
  card_description_Meciar: 'In voting, his vote counts double. If the Communist uses their ability, Meciar loses this function.',
  card_description_Mirror: 'Defense card used if hit by a Mafia or Mad Gunman bullet. After the Mirror shatters, the bullet returns to the shooter, unless the Mirror was muddied by the Swamp Monster.',
  card_description_RopeWalker: 'Defense card protecting against death on the gallows.',
  card_description_Sand: 'The player with the Sand card targets a player every night to throw sand at. Sand neutralizes the effect of Slime, making the player vulnerable to being hit. Players with a Gas Mask (Mad Gunman 2, Mage 2, and Ghost Bobo) are protected against Sand.',
  card_description_Slime: 'The player with the Slime card indicates a player every night to cover with slime. The slimed player is protected once during the night against a bullet from the Mafia, Mad Gunman, and Sniper (the bullet slides off). The Slime effect can be neutralized by Sand.',
  card_description_Sniper: 'Once per game, the Sniper can indicate a player to shoot with a high-caliber bullet. It is so powerful that it shatters Mirrors and continues its trajectory.',
  card_description_Sock: 'Once per game at night, the player with the Sock can throw it between two players, who are then overcome by its smell. Only a Gas Mask, Doctor, and CloudWalker protect against the Sock\'s smell. Mad Gunman 2, Mage 2, and Ghost Bobo possess a Gas Mask.',
  card_description_Spyglass: 'The Spyglass wakes up at the end of every third night (starting from the second) and is informed by the Announcer which roles were active that night.',
  card_description_SwampMonster: 'The Swamp Monster can indicate a player three times per game at night to muddy their Mirror. A bullet shatters a muddy Mirror but keeps flying. The Swamp Monster can use their ability multiple times in the same night. If the player also holds a Mafioso, Sniper, or Mad Gunman card, they can muddy a Mirror only twice.',
  card_description_Terrorist: 'The Terrorist can use their ability once per game during the day by saying "Bomb!", then shooting all players.',
  card_description_TimeLord: 'The Time Lord can say "I am the Time Lord!" once per game at the beginning of the day or night to skip the current phase.',

  // App Shell & Navigation
  app_title: 'Mafia²',
  app_continue_game: 'Continue Game',
  app_continue_round: 'Round {round}',
  app_new_game: 'New Game',
  nav_game: 'Game',
  nav_players: 'Players',
  nav_logs: 'Logs',
  nav_rules: 'Rules',
  nav_cards: 'Cards',
  nav_settings: 'Settings',
  nav_my_cards: 'My Cards',
  nav_all_cards: 'All Cards',
  player_link_invalid: 'Invalid player link. Request a new one from the host.',

  // Rules View
  rules_header_title: 'Rules',
  rules_missing_language: 'No translated rules available for the selected language.',

  // Logs
  logs_heading: 'Day and Night Log',
  logs_subheading: 'Showing report for night and day #{round}',
  logs_round_label: 'Round',
  logs_view_label: 'View',
  logs_public_report_title: 'Public Report',
  logs_public_report_placeholder: 'The public report will appear at the start of the day.',
  logs_round_title: 'Round Log',
  logs_round_empty: 'No entries for this round.',
  logs_panel_title: 'Game History',
  logs_panel_empty: 'Log is empty.',

  // Cards
  cards_collection_title: 'Card Collection',
  cards_placeholder_description: 'Description coming soon.',
  cards_toggle_icons: 'Icons',
  cards_toggle_images: 'Images',
  player_add_card_title: 'Add a gained card',
  player_add_card_button: 'Add card',
  player_add_card_type_label: 'Card type',
  player_add_card_instance_label: 'Instance number',
  player_add_card_submit: 'Add card',
  player_add_card_duplicate: 'That card is already on your list.',

  // Settings
  settings_language_title: 'App Language',
  settings_language_active: 'Active',
  settings_title: 'Settings',
  settings_player_node_size: 'Player Node Size',
  settings_reset_player_size: 'Reset to Default',
  settings_player_node_hint: 'Facilitates tapping round tokens on large tables.',
  settings_bullet_speed: 'Bullet Speed',
  settings_bullet_speed_fast: 'Faster',
  settings_bullet_speed_slow: 'Slower',
  settings_bullet_speed_hint: 'Controls the pace of night shot animations.',
  settings_storage_title: 'Storage',
  settings_export_data_button: 'Export Game Data',
  settings_import_data_button: 'Import from File',
  settings_import_warning: 'Importing replaces the current game.',
  settings_import_error: 'Failed to load save. Check the file and try again.',

  // GM Player List
  gm_players_title: 'Players ({count})',
  gm_players_badge_mafia: 'Mafia',
  gm_players_no_cards: 'No cards',
  gm_players_share_button: 'Share',
  gm_players_qr_button: 'QR Code',
  gm_players_qr_instruction: 'Scan the code to open the player view.',
  gm_players_qr_generating: 'Generating QR code...',
  gm_players_copy_link_instead: 'Copy link instead',
  gm_players_manual_copy_title: 'Copy Link Manually',
  gm_players_manual_copy_fallback: 'Sharing is unavailable on this device. Copy the link and send it to {name}.',
  gm_players_manual_copy_label: 'Link',
  gm_players_manual_copy_copy: 'Copy Link',
  gm_players_manual_copy_close: 'Close',
  gm_players_share_insecure: 'Sharing requires HTTPS (or localhost). Copy the link or open the app via https://.',
  gm_players_share_unsupported: 'This browser does not support the Share button. Copy the link below.',
  gm_players_share_failure_reason: 'Sharing failed on this device. Copy the link manually.',
  gm_players_share_title: '{player} — Player Link',
  gm_players_copy_success: 'Link for player {player} copied! Send it to them.',
  gm_players_qr_error: 'Could not generate QR code. Link copied to clipboard.',
  gm_players_modal_close_qr_aria: 'Close QR code window',
  gm_players_modal_close_manual_aria: 'Close copy window',
  gm_players_share_mode_title: 'Sharing Mode',
  gm_players_share_mode_hint: 'Hides Mafia cards and colors while showing QR codes.',
  gm_players_share_mode_on: 'On',
  gm_players_share_mode_off: 'Off',
  gm_players_share_mode_cards_hidden: 'Cards hidden in sharing mode.',

  // Gameplay Texts
  victory_mafia: 'Mafia wins.',
  victory_innocent: 'Town wins.',
  log_start_game: 'New game started.',
  log_player_activate: '{cardLabel} {player} used their ability.',
  start_day: 'Start Day',
  start_night_intro: 'Night falls. The town goes to sleep...',
  first_night_message: 'Mafia wakes up to establish strategy.',
  wake_up: '{role} wakes up. Do they want to use their function?',
  wake_up_use_again: 'Does {role} want to use their function again?',
  wake_up_shooter: '{role} wakes up. Who do they want to shoot?',

  // Role-specific wakeups, logs, and reports

  // Mage
  wake_up_mage_from: '{role} wakes up. Where does the tunnel start?',
  wake_up_mage_to: 'Where does the tunnel end?',
  log_tunnel_duplicate: '{cardLabel} {player} attempted to create tunnel {source}->{target}, but it already exists.',
  log_tunnel_atheist: `{cardLabel} {player} attempted to use a tunnel on player {target}, but they are ${card('Atheist', 'an Atheist')}.`,
  log_tunnel_same_player: '{cardLabel} {player} cannot create a tunnel on the same player.',
  log_tunnel_created: '{cardLabel} {player} created tunnel {tunnelNumber} ({source} -> {target}).',

  // Slime
  wake_up_slime: '{role} wakes up. Who do they want to slimed?',
  log_action_slime: '{cardLabel} {player} slimed player {target}.',
  public_report_slime: '{name} is dripping with slime.',
  public_report_slime_multi: '{name} is dripping with slime (x{count}).',

  // Leech
  wake_up_leech: '{role} wakes up. Who do they want to latch onto?',
  log_action_leech: '{cardLabel} {player} latched onto player {target}.',
  public_report_leech_cloudwalker: `${card('Leech')} gains ${card('CloudWalker', 'CloudWalker {num}')}.`,
  log_night_leech_cloudwalker: `{cardLabel} {player} gains ${card('CloudWalker', 'CloudWalker {num}')}.`,

  // Sand
  wake_up_sand: '{role} wakes up. Who do they want to throw sand at?',
  log_action_sand: '{cardLabel} {player} threw sand at player {target}.',
  log_action_sand_fail: `{cardLabel} {player} attempted to use ${card('Sand')} on player {target}, but they possess a Gas Mask.`,
  public_report_sand: '{name} has sand in their eyes.',
  public_report_sand_saved: `Gas Mask saved the player from ${card('Sand')}.`,

  // Cobra
  wake_up_cobra: '{role} wakes up. Who do they want to bite?',
  log_action_cobra: '{name} was bitten.',
  public_report_cobra_cloudwalker: `${card('Cobra')} devours ${card('Leech')} and gains ${card('CloudWalker', 'CloudWalker {num}')}.`,
  log_night_cobra_cloudwalker: `{cardLabel} {player} devours ${card('Leech')} and gains ${card('CloudWalker', 'CloudWalker {num}')}.`,

  // Magnet
  wake_up_magnet: '{role} wakes up. Who do they want to magnetize?',
  log_action_magnet: '{name} was magnetized.',

  // Ghost Bobo
  wake_up_ghost: '{role} wakes up. Who do they want to silence?',
  log_action_ghost: '{cardLabel} {player} silenced player {target}.',
  public_report_ghost_bobo: '{name} cannot speak today.',

  // Judge
  wake_up_judge: '{role} wakes up. Whose voting right do they want to revoke?',
  log_action_judge: '{cardLabel} {player} revoked the voting right of player {target}.',
  public_report_judge: '{name} cannot vote today.',

  // Swamp Monster
  wake_up_swamp_monster: 'Who do they want to splash with mud?',
  log_night_swamp_attack: '{cardLabel} {player} splashed mud on player {target}.',

  // Executioner
  wake_up_executioner_save: '{role} wakes up. Who do they want to save from the gallows?',
  wake_up_executioner_victim: 'Who should go to the gallows instead?',
  log_night_executioner_save: '{saved} is protected from the sentence; {victim} will die instead.',

  // Sock
  wake_up_sock_first: 'Between whom to throw the Sock? Indicate the first player.',
  wake_up_sock_second: 'Now indicate that player\'s neighbor.',
  log_action_sock_throw: `{cardLabel} {player} aimed ${card('Sock', 'the Sock')} between players {first} and {second}.`,
  log_sock_throw_intro: `{cardLabel} {player} threw ${card('Sock', 'the Sock')} between players {first} and {second}. `,
  log_sock_result_gasmask: 'Gas Mask saved player {name}. ',
  log_sock_result_dead: 'Player {name} was already dead. ',
  log_sock_result_doctor: `${card('Doctor')} saved player {name}. `,
  log_sock_result_cloudwalker: `Player {name} lost ${card('CloudWalker', 'CloudWalker {num}')}. `,
  log_sock_result_death: 'Player {name} leaves the game. ',
  public_report_sock_used: `${card('Sock', 'A Sock')} was thrown between two players. `,
  public_report_sock_first_gasmask: 'The first player was saved by a Gas Mask',
  public_report_sock_first_dead: 'The first player was already dead',
  public_report_sock_first_doctor: `The first player was saved by ${card('Doctor', 'a Doctor')}`,
  public_report_sock_first_cloudwalker: `The first player lost ${card('CloudWalker', 'CloudWalker {num}')}`,
  public_report_sock_first_death: 'The first player, {name}, leaves our game',
  public_report_sock_second_gasmask: ', and the second was saved by a Gas Mask.',
  public_report_sock_second_dead: ', and the second player was already dead.',
  public_report_sock_second_doctor: `, and the second was saved by ${card('Doctor', 'a Doctor')}.`,
  public_report_sock_second_cloudwalker: `, and the second player lost ${card('CloudWalker', 'CloudWalker {num}')}.`,
  public_report_sock_second_death: ', and the second player, {name}, leaves our game.',
  public_report_sock_first_only_suffix: '.',

  // Jailer
  wake_up_jailer: '{role} wakes up. Who do they put in prison?',
  log_jailer_imprison: '{cardLabel} {player} imprisoned player {target}.',
  log_action_blocked_jailed: '{cardLabel} {player} is in prison, so nothing will happen tonight.',

  // Doctor
  wake_up_doctor_heal_self: '{role} wakes up. Who do they want to heal? (can be self)',
  wake_up_doctor_heal_other: '{role} wakes up. Who do they want to heal? (cannot be self)',
  log_doctor_fail: `{cardLabel} {player} attempted to heal {target}, but failed because ${card('Doctor', 'the Doctor')} works alone against ${card('Mafia', 'the Mafia')}.`,
  log_doctor_success: '{cardLabel} {player} heals player {target}.',
  log_doctor_self_locked: '{cardLabel} {player} cannot heal themselves tonight.',

  // Matrix
  wake_matrix_shot: 'Matrix wakes up. Who do they want to shoot at? (bullet {current}/{total})',
  log_night_matrix_activate: 'Follow the white rabbit... ({cardLabel} {player} used ability.)',
  log_night_matrix_bullet_summary: `Number of bullets ${card('Matrix')} {player} intercepted tonight: {count}.`,

  // Spyglass
  wake_up_spyglass: 'Spyglass wakes up. Did they learn who was active tonight?',
  spyglass_reveal_intro: 'Tonight, the following woke up: {names}.',
  spyglass_reveal_none: 'Nobody woke up tonight.',

  // Mafia/Shooting
  log_mafia_jailed: `{cardLabel} {player} is in prison, so ${card('Mafia', 'the Mafia')} will not take a shot.`,
  log_mafia_no_consensus: `${card('Mafia', 'Mafiosi')} did not agree on a target, so no one shot tonight.`,
  log_shoot: '{cardLabel} {player} shoots at player {target}.',
  log_shooter_aim: '{cardLabel} {player} aims at player {target}.',

  // Time Lord
  ui_timelord_skip_night: '{cardLabel}: Skip Night',
  ui_timelord_skip_day: '{cardLabel}: Skip Day',
  log_timelord_skip_day: '{cardLabel} {player} skipped the day.',
  log_timelord_skip_night: '{cardLabel} {player} skipped the night.',

  // Public Reports (Resolution)
  log_day_vest_hit: `{target} loses ${card('KevlarVest', 'Kevlar Vest {num}')}.`,
  log_day_ropewalker_lost: `{target} loses ${card('RopeWalker', 'RopeWalker {num}')}.`,
  log_day_immunity_lost: `{target} loses ${card('Immunity', 'Immunity {num}')}.`,
  log_day_cloudwalker_lost: `{target} loses ${card('CloudWalker', 'CloudWalker {num}')}.`,
  log_day_death: '{target} dies.',

  // Morning Report
  public_report_default: 'The Palermo Town wakes up.',
  public_report_matrix: `${card('Matrix')} used his function tonight. Number of bullets intercepted: {count}.`,
  public_report_cloudwalker_gain: `{cardLabel} gains ${card('CloudWalker', 'CloudWalker {num}')}.`,
  public_report_glazier_mirror: `${card('Glazier')} creates ${card('Mirror', 'Mirror {num}')}.`,
  log_night_cloudwalker_gain: `{cardLabel} {player} gains ${card('CloudWalker', 'CloudWalker {num}')}.`,
  log_night_glazier_mirror: `{cardLabel} {player} creates ${card('Mirror', 'Mirror {num}')}.`,
  
  
  // Bullet Report Fragments
  public_report_bullet_start: 'A shot was fired',
  public_report_bullet_dead_target: ', but hit a dead player.',
  public_report_bullet_matrix_catch: ` and ${card('Matrix')} caught it.`,
  public_report_bullet_magnet: `, was attracted by ${card('Magnet', 'the Magnet')}`,
  public_report_bullet_split: ', splitting into {count} parts.',
  public_report_bullet_tunnel_single: ', flew through a tunnel',
  public_report_bullet_tunnel_segment: ' {index}. fragment flew through a tunnel',
  public_report_bullet_slime: ` and the bullet slid off ${card('Slime', 'the slime')}.`,
  public_report_bullet_al_capone: `, but ${card('AlCapone')} neutralized the threat.`,
  public_report_bullet_doctor: `, but ${card('Doctor', 'the Doctor')} neutralized the bullet.`,
  public_report_bullet_mirror_break: `, ${card('Mirror', 'Mirror {num}')} shattered`,
  public_report_bullet_return: ', the bullet returned',
  public_report_bullet_continue: ', the bullet flies on',
  public_report_bullet_vest_loss: ` and ${card('KevlarVest', 'Kevlar Vest {num}')} was destroyed.`,
  public_report_bullet_cloudwalker_loss: ` and ${card('CloudWalker', 'CloudWalker {num}')} died.`,
  public_report_bullet_death: ' and {name} leaves our game.',

  log_night_bullet_start: '{cardLabel} {shooter} fires at player {target}. ',
  log_night_bullet_start_generic: 'A shot was fired towards {target}. ',
  log_night_bullet_split: 'The bullet split into {count} parts.',
  log_night_bullet_dead_target: ' and it hit dead player {target}.',
  log_night_bullet_matrix_catch: ` and ${card('Matrix')} {target} caught it.`,
  log_night_bullet_magnet_initial: `The bullet was attracted by ${card('Magnet', 'the Magnet')} to player {target}`,
  log_night_bullet_magnet: `, was attracted by ${card('Magnet', 'the Magnet')} to player {target}`,
  log_night_bullet_magnet_dead: ` and hits dead player {target} (${card('Magnet')} effect).`,
  log_night_bullet_tunnel_initial: 'The bullet flew through tunnel {num} ({src} -> {target})',
  log_night_bullet_tunnel_single: ', flew through tunnel {num} ({src} -> {target})',
  log_night_bullet_tunnel_segment: ' {index}. fragment flew through tunnel {num} ({src} -> {target})',
  log_night_bullet_slime_initial: `The bullet slides off ${card('Slime', 'the slime')} on {target}.`,
  log_night_bullet_slime: ` and slides off ${card('Slime', 'the slime')} on {target}.`,
  log_night_bullet_al_capone_initial: `${card('AlCapone')} {target} neutralizes the bullet.`,
  log_night_bullet_al_capone: ` and ${card('AlCapone')} {target} neutralizes it.`,
  log_night_bullet_doctor_initial: `${card('Doctor', 'The Doctor')} healed player {target}.`,
  log_night_bullet_doctor: ` and player {target} was healed by ${card('Doctor', 'the Doctor')}.`,
  log_night_bullet_mirror_break_initial: `The bullet shatters ${card('Mirror', 'Mirror {num}')} on player {target}`,
  log_night_bullet_mirror_break: `, ${card('Mirror', 'Mirror {num}')} on player {target} shattered`,
  log_night_bullet_return: ', the bullet returned to {target}',
  log_night_bullet_continue_sniper: `, but the bullet flies on because {target}'s ${card('Mirror', 'the Mirror')} does not reflect ${card('Sniper')} shots,`,
  log_night_bullet_continue_matrix: `, but the bullet flies on because {target}'s ${card('Mirror', 'the Mirror')} does not stop ${card('Matrix')} shots,`,
  log_night_bullet_continue_mud: `, but the bullet flies on because {target}'s ${card('Mirror', 'the Mirror')} was muddy,`,
  log_night_bullet_vest_loss_initial: `The bullet destroys ${card('KevlarVest', 'Kevlar Vest {num}')} of player {target}.`,
  log_night_bullet_vest_loss: ` and {target} loses ${card('KevlarVest', 'Kevlar Vest {num}')}.`,
  log_night_bullet_cloudwalker_loss_initial: `The bullet takes ${card('CloudWalker', 'CloudWalker {num}')} from player {target}.`,
  log_night_bullet_cloudwalker_loss: ` and {target} loses ${card('CloudWalker', 'CloudWalker {num}')}.`,
  log_night_bullet_death_initial: 'The bullet kills player {name}.',
  log_night_bullet_death: ' and {name} dies.',
  log_night_bullet_gandalf_from_horse: ` ${card('Gandalf')} {gandalf} gains ${card('CloudWalker', 'CloudWalker {num}')} (loss of ${card('HorsePiece')} {horse}: {lost}).`,
  log_night_bullet_horsepiece_from_gandalf: ` ${card('HorsePiece')} {horse} gains ${card('CloudWalker', 'CloudWalker {num}')} (loss of ${card('Gandalf')} {gandalf}: {lost}).`,

  // UI
  ui_confirm: 'Yes',
  ui_deny: 'No',
  ui_undo: 'Undo',
  ui_bomb: 'Bomb!',
  ui_next_phase: 'Next',
  ui_replay_bullets: 'Replay Animation',
  ui_bullet_replay: 'Playing back shots...',
  ui_first_night_done: 'Mafia meeting ended',
  ui_start_night: 'Start Night',
  ui_player_label: 'Player: {name}',
  ui_player_jailed_notice: 'Player {name} is in prison — show them crossed arms 🙅.',
  ui_anarchist_baby: 'I shoot you baby!',
  ui_astronomer_night: 'Night!',
  ui_communist_equal: 'Everyone equal!',
  ui_special_no_owner: 'No owner',
  day_action_vote: 'Voted Out',
  day_prompt_vote: 'Select the player who was voted out.',
  day_prompt_shot: 'The Anarchist takes a shot. Choose target.',
  day_prompt_mass_murderer_select: 'Mass Murderer shoots at their accusers. Select players and confirm.',
  day_idle_message: 'It is day. Use available actions.',
  day_report_confirm: 'Confirm Report',
  public_report_day_player_left: '{name} leaves our game.',
  public_report_day_ropewalker_lost: `${card('RopeWalker', 'RopeWalker {num}')} was lost.`,
  public_report_day_cloudwalker_lost: `${card('CloudWalker', 'CloudWalker {num}')} was lost.`,
  public_report_day_kevlar_lost: `${card('KevlarVest', 'Kevlar Vest {num}')} was destroyed.`,
  public_report_day_immunity_lost: `${card('Immunity', 'Immunity {num}')} was used.`,
  ui_mass_murderer_target: 'Sentenced: {name}',
  ui_mass_murderer_selected: 'Selected: {count}',
  ui_mass_murderer_confirm: 'Fire Shots',

  // Warnings
  warn_anarchist_unavailable: 'The Anarchist can no longer shoot.',
  warn_terrorist_unavailable: 'The Terrorist can no longer detonate the bomb.',
  warn_bomb_day_only: 'The bomb can only be used during the day.',
  warn_astronomer_unavailable: 'The Astronomer can no longer end the day.',
  warn_astronomer_day_only: 'The Astronomer works only during the day.',
  warn_communist_unavailable: 'The Communist can no longer use their ability.',
  warn_communist_day_only: 'The Communist works only during the day.',

  log_day_vote: 'Player {target} was voted out.',
  log_day_shot: `${card('Anarchist')} {actor} shot {target}.`,
  log_day_bomb: `${card('Terrorist')} {player} detonates the bomb!`,
  log_day_astronomer: `${card('Astronomer')} {player} ends the day.`,
  log_day_communist: `${card('Communist')} {player} enforces equality.`,
  log_day_mass_murderer_trigger: `${card('MassMurderer')} {target} reaches for a weapon before the sentence.`,
  log_day_mass_murderer_shot: `${card('MassMurderer')} {player} kills {target}.`,

  // Phase Dividers
  log_divider_night_start: 'Night {round} begins.',
  log_divider_night_end: 'Night {round} ends.',
  log_divider_day_start: 'Day {round} begins.',
  log_divider_day_end: 'Day {round} ends.',

  // Setup Wizard
  setup_next: 'Next',
  setup_remove: 'To distribute roles correctly, you must remove some cards...',
  setup_step_count: 'Number of Players',
  setup_step_mafia: 'Number of Mafia Cards',
  setup_mafia_description: 'Choose how many Mafia cards will be in the deck ({min} - {max}).',
  setup_mafia_label: 'Mafia Cards in Deck',
  setup_mafia_recommended: 'Recommended count for {players} players: {count}',
  setup_step_names: 'Names',
  setup_step_balance: 'Game Balance',
  setup_balance_instruction: 'To balance the deck, remove {remove} cards or add {add}.',
  setup_remove_instruction: 'You must remove {count} cards to balance the deck.',
  setup_cards_remaining: 'To Remove',
  setup_cards_missing: 'Cards Missing',
  setup_cards_total: 'Total cards in deck: {count}',
  setup_cards_minimum: 'Add {missing} more so each player gets at least one card.',
  setup_start_game: 'Start Game',
};