export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  isCustom?: boolean;
}

export type TranslationKey =
  // Nav & Header
  | 'navClock'
  | 'navTimers'
  | 'navStopwatch'
  | 'navFocus'
  | 'ambientMode'
  | 'exitAmbient'
  | 'sound'
  | 'mute'
  | 'unmute'
  | 'language'

  // Clock
  | 'localTime'
  | 'dayProgress'
  | 'completed'
  | 'worldClock'
  | 'worldClockDesc'
  | 'addCity'
  | 'searchCity'
  | 'chime'
  | 'digital'
  | 'analog'
  | 'sameTime'
  | 'close'

  // Timers
  | 'quickTimers'
  | 'quickTimerDesc'
  | 'autoStart'
  | 'customTimer'
  | 'createCustomTimer'
  | 'activeTimers'
  | 'timerLabel'
  | 'duration'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'alarmSound'
  | 'alarmSoundMenu'
  | 'alarmSoundDesc'
  | 'oneClickStart'
  | 'start'
  | 'pause'
  | 'resume'
  | 'restart'
  | 'finished'
  | 'left'
  | 'loop'
  | 'total'
  | 'clearAllTimers'
  | 'noActiveTimers'
  | 'applyToAll'
  | 'preview'
  | 'done'
  | 'cancel'
  | 'save'
  | 'testAlarm'
  | 'volume'

  // Presets & Tags
  | 'breakAndTea'
  | 'focusedSprint'
  | 'deepWork'
  | 'fullHour'
  | 'express'
  | 'steep'
  | 'shortTask'
  | 'powerNap'
  | 'pomodoroFocus'
  | 'studySession'

  // Sounds
  | 'soundSoftBell'
  | 'soundDigitalBeep'
  | 'soundAnalogClock'
  | 'soundZenGong'
  | 'soundWoodblock'
  | 'soundCrystalPing'

  // Stopwatch
  | 'precisionStopwatch'
  | 'lap'
  | 'reset'
  | 'lapSplits'
  | 'splitsDesc'
  | 'fastest'
  | 'slowest'
  | 'copySplits'
  | 'copied'
  | 'performance'
  | 'totalTime'

  // Focus
  | 'intervalFlow'
  | 'intervalDesc'
  | 'deepFocus'
  | 'shortBreak'
  | 'longBreak'
  | 'skip'
  | 'config'
  | 'focusConfig'
  | 'focusDuration'
  | 'shortBreakDuration'
  | 'longBreakDuration'
  | 'cyclesBeforeLong'
  | 'autoStartBreaks'
  | 'autoStartFocus'
  | 'completedFocusBlocks'
  | 'cycleOf'

  // Footer & General
  | 'footerTagline';

export type TranslationDictionary = Record<TranslationKey, string>;

export const DEFAULT_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
];

export const BUILTIN_TRANSLATIONS: Record<string, TranslationDictionary> = {
  en: {
    navClock: 'World Clock',
    navTimers: 'Timers',
    navStopwatch: 'Stopwatch',
    navFocus: 'Interval Focus',
    ambientMode: 'Ambient Mode',
    exitAmbient: 'Exit Ambient',
    sound: 'Sound',
    mute: 'Mute',
    unmute: 'Unmute',
    language: 'Language',

    localTime: 'Local Time',
    dayProgress: 'Day Progress',
    completed: 'completed',
    worldClock: 'World Clock',
    worldClockDesc: 'Track time zones across global cities',
    addCity: 'Add City',
    searchCity: 'Search city or country...',
    chime: 'Chime',
    digital: 'Digital',
    analog: 'Analog',
    sameTime: 'Same time',
    close: 'Close',

    quickTimers: 'Quick Timer Presets',
    quickTimerDesc: 'Single-click to instantly configure and run a countdown',
    autoStart: 'Auto-start',
    customTimer: 'Custom Timer',
    createCustomTimer: 'Create Custom Timer',
    activeTimers: 'Active Timers',
    timerLabel: 'Timer Label',
    duration: 'Duration',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    alarmSound: 'Alarm Sound',
    alarmSoundMenu: 'Alarm Sound Menu',
    alarmSoundDesc: 'Choose the sound that plays when countdown timers finish',
    oneClickStart: '1-Click Start',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart',
    finished: 'Finished',
    left: 'left',
    loop: 'Loop',
    total: 'Total',
    clearAllTimers: 'Clear All Timers',
    noActiveTimers: 'No active timers right now.',
    applyToAll: 'Apply to All',
    preview: 'Preview',
    done: 'Done',
    cancel: 'Cancel',
    save: 'Save',
    testAlarm: 'Test Alarm Sound',
    volume: 'Volume',

    breakAndTea: 'Break & Tea',
    focusedSprint: 'Focused Sprint',
    deepWork: 'Deep Work Block',
    fullHour: 'Full Hour Session',
    express: 'Express',
    steep: 'Steep',
    shortTask: 'Short Task',
    powerNap: 'Power Nap',
    pomodoroFocus: 'Pomodoro Focus',
    studySession: 'Lecture / Study',

    soundSoftBell: 'Soft Bell',
    soundDigitalBeep: 'Digital Beep',
    soundAnalogClock: 'Analog Clock',
    soundZenGong: 'Zen Gong',
    soundWoodblock: 'Woodblock',
    soundCrystalPing: 'Crystal Ping',

    precisionStopwatch: 'High Precision Stopwatch',
    lap: 'Lap',
    reset: 'Reset',
    lapSplits: 'Lap Splits',
    splitsDesc: 'Chronological lap splits with delta comparison',
    fastest: 'Fastest',
    slowest: 'Slowest',
    copySplits: 'Copy Splits',
    copied: 'Copied',
    performance: 'Performance',
    totalTime: 'Total Time',

    intervalFlow: 'Interval Flow',
    intervalDesc: 'Structured focus cycles with restorative breaks',
    deepFocus: 'Deep Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    skip: 'Skip',
    config: 'Config',
    focusConfig: 'Focus Configuration',
    focusDuration: 'Focus Duration (minutes)',
    shortBreakDuration: 'Short Break (minutes)',
    longBreakDuration: 'Long Break (minutes)',
    cyclesBeforeLong: 'Cycles Before Long Break',
    autoStartBreaks: 'Auto-start Breaks',
    autoStartFocus: 'Auto-start Focus Sessions',
    completedFocusBlocks: 'Completed Focus Blocks',
    cycleOf: 'of',

    footerTagline: 'Chronos Time & Precision Studio',
  },

  es: {
    navClock: 'Reloj Mundial',
    navTimers: 'Temporizadores',
    navStopwatch: 'Cronómetro',
    navFocus: 'Enfoque por Intervalos',
    ambientMode: 'Modo Ambiente',
    exitAmbient: 'Salir de Ambiente',
    sound: 'Sonido',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    language: 'Idioma',

    localTime: 'Hora Local',
    dayProgress: 'Progreso del Día',
    completed: 'completado',
    worldClock: 'Reloj Mundial',
    worldClockDesc: 'Sigue zonas horarias de ciudades del mundo',
    addCity: 'Añadir Ciudad',
    searchCity: 'Buscar ciudad o país...',
    chime: 'Campana',
    digital: 'Digital',
    analog: 'Analógico',
    sameTime: 'Misma hora',
    close: 'Cerrar',

    quickTimers: 'Temporizadores Rápidos',
    quickTimerDesc: 'Un solo clic para configurar e iniciar la cuenta atrás',
    autoStart: 'Inicio automático',
    customTimer: 'Personalizado',
    createCustomTimer: 'Crear Temporizador',
    activeTimers: 'Temporizadores Activos',
    timerLabel: 'Etiqueta del Temporizador',
    duration: 'Duración',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    alarmSound: 'Sonido de Alarma',
    alarmSoundMenu: 'Menú de Sonidos de Alarma',
    alarmSoundDesc: 'Elige el sonido que sonará al finalizar el temporizador',
    oneClickStart: 'Inicio 1 Clic',
    start: 'Iniciar',
    pause: 'Pausar',
    resume: 'Continuar',
    restart: 'Reiniciar',
    finished: 'Finalizado',
    left: 'restante',
    loop: 'Bucle',
    total: 'Total',
    clearAllTimers: 'Limpiar Todo',
    noActiveTimers: 'No hay temporizadores activos ahora.',
    applyToAll: 'Aplicar a Todos',
    preview: 'Probar',
    done: 'Listo',
    cancel: 'Cancelar',
    save: 'Guardar',
    testAlarm: 'Probar Alarma',
    volume: 'Volumen',

    breakAndTea: 'Descanso y Té',
    focusedSprint: 'Sprint Concentrado',
    deepWork: 'Bloque de Trabajo',
    fullHour: 'Hora Completa',
    express: 'Rápido',
    steep: 'Infusión',
    shortTask: 'Tarea Corta',
    powerNap: 'Siesta Breve',
    pomodoroFocus: 'Enfoque Pomodoro',
    studySession: 'Estudio / Lectura',

    soundSoftBell: 'Campana Suave',
    soundDigitalBeep: 'Bip Digital',
    soundAnalogClock: 'Reloj Analógico',
    soundZenGong: 'Gong Zen',
    soundWoodblock: 'Bloque de Madera',
    soundCrystalPing: 'Ping Cristalino',

    precisionStopwatch: 'Cronómetro de Precisión',
    lap: 'Vuelta',
    reset: 'Restablecer',
    lapSplits: 'Tiempos por Vuelta',
    splitsDesc: 'Tiempos cronológicos con comparación de diferencia',
    fastest: 'Más Rápido',
    slowest: 'Más Lento',
    copySplits: 'Copiar Vueltas',
    copied: 'Copiado',
    performance: 'Rendimiento',
    totalTime: 'Tiempo Total',

    intervalFlow: 'Flujo de Intervalos',
    intervalDesc: 'Ciclos de concentración estructurados con descansos',
    deepFocus: 'Sesión de Enfoque Profundo',
    shortBreak: 'Descanso Corto',
    longBreak: 'Descanso Largo',
    skip: 'Saltar',
    config: 'Configurar',
    focusConfig: 'Configuración de Enfoque',
    focusDuration: 'Duración de Enfoque (minutos)',
    shortBreakDuration: 'Descanso Corto (minutos)',
    longBreakDuration: 'Descanso Largo (minutos)',
    cyclesBeforeLong: 'Ciclos antes del Descanso Largo',
    autoStartBreaks: 'Inicio automático de descansos',
    autoStartFocus: 'Inicio automático de enfoque',
    completedFocusBlocks: 'Bloques de enfoque completados',
    cycleOf: 'de',

    footerTagline: 'Chronos Estudio de Tiempo y Precisión',
  },

  fr: {
    navClock: 'Horloge Mondiale',
    navTimers: 'Minuteurs',
    navStopwatch: 'Chronomètre',
    navFocus: 'Intervalles',
    ambientMode: 'Mode Ambiant',
    exitAmbient: 'Quitter Ambiant',
    sound: 'Son',
    mute: 'Muet',
    unmute: 'Activer le son',
    language: 'Langue',

    localTime: 'Heure Locale',
    dayProgress: 'Progression de la Journée',
    completed: 'terminé',
    worldClock: 'Horloge Mondiale',
    worldClockDesc: 'Suivez les fuseaux horaires du monde entier',
    addCity: 'Ajouter une Ville',
    searchCity: 'Rechercher ville ou pays...',
    chime: 'Carillon',
    digital: 'Numérique',
    analog: 'Analogique',
    sameTime: 'Même heure',
    close: 'Fermer',

    quickTimers: 'Minuteurs Rapides',
    quickTimerDesc: 'Un clic pour configurer et lancer un compte à rebours',
    autoStart: 'Démarrage auto',
    customTimer: 'Personnalisé',
    createCustomTimer: 'Créer un Minuteur',
    activeTimers: 'Minuteurs Actifs',
    timerLabel: 'Nom du Minuteur',
    duration: 'Durée',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
    alarmSound: 'Sonnerie',
    alarmSoundMenu: 'Menu des Sonneries',
    alarmSoundDesc: 'Choisissez le son joué à la fin du compte à rebours',
    oneClickStart: 'Départ 1-Clic',
    start: 'Démarrer',
    pause: 'Pause',
    resume: 'Reprendre',
    restart: 'Recommencer',
    finished: 'Terminé',
    left: 'restant',
    loop: 'Boucle',
    total: 'Total',
    clearAllTimers: 'Tout Effacer',
    noActiveTimers: 'Aucun minuteur en cours.',
    applyToAll: 'Appliquer à Tous',
    preview: 'Écouter',
    done: 'Terminé',
    cancel: 'Annuler',
    save: 'Enregistrer',
    testAlarm: 'Tester la Sonnerie',
    volume: 'Volume',

    breakAndTea: 'Pause & Thé',
    focusedSprint: 'Sprint Focalisé',
    deepWork: 'Travail Profond',
    fullHour: 'Heure Complète',
    express: 'Express',
    steep: 'Infusion',
    shortTask: 'Tâche Rapide',
    powerNap: 'Micro-sieste',
    pomodoroFocus: 'Focus Pomodoro',
    studySession: 'Étude / Lecture',

    soundSoftBell: 'Cloche Douce',
    soundDigitalBeep: 'Bip Numérique',
    soundAnalogClock: 'Horloge Mécanique',
    soundZenGong: 'Gong Zen',
    soundWoodblock: 'Bloc de Bois',
    soundCrystalPing: 'Ping Cristallin',

    precisionStopwatch: 'Chronomètre Haute Précision',
    lap: 'Tour',
    reset: 'Réinitialiser',
    lapSplits: 'Temps au Tour',
    splitsDesc: 'Temps intermédiaires chronologiques avec écarts',
    fastest: 'Le Plus Rapide',
    slowest: 'Le Plus Lent',
    copySplits: 'Copier les Tours',
    copied: 'Copié',
    performance: 'Performance',
    totalTime: 'Temps Total',

    intervalFlow: 'Rythme d’Intervalles',
    intervalDesc: 'Cycles de travail structurés avec pauses régénératrices',
    deepFocus: 'Session de Concentration',
    shortBreak: 'Petite Pause',
    longBreak: 'Grande Pause',
    skip: 'Passer',
    config: 'Paramètres',
    focusConfig: 'Configuration du Focus',
    focusDuration: 'Durée de Focus (minutes)',
    shortBreakDuration: 'Petite Pause (minutes)',
    longBreakDuration: 'Grande Pause (minutes)',
    cyclesBeforeLong: 'Cycles avant Grande Pause',
    autoStartBreaks: 'Lancer automatiquement les pauses',
    autoStartFocus: 'Lancer automatiquement le focus',
    completedFocusBlocks: 'Blocs de focus terminés',
    cycleOf: 'sur',

    footerTagline: 'Chronos Studio de Temps et Précision',
  },

  de: {
    navClock: 'Weltuhr',
    navTimers: 'Timer',
    navStopwatch: 'Stoppuhr',
    navFocus: 'Intervall-Fokus',
    ambientMode: 'Ambient-Modus',
    exitAmbient: 'Ambient Verlassen',
    sound: 'Ton',
    mute: 'Stummschalten',
    unmute: 'Ton Einschalten',
    language: 'Sprache',

    localTime: 'Ortszeit',
    dayProgress: 'Tagesfortschritt',
    completed: 'abgeschlossen',
    worldClock: 'Weltuhr',
    worldClockDesc: 'Zeitzonen globaler Metropolen im Überblick',
    addCity: 'Stadt Hinzufügen',
    searchCity: 'Stadt oder Land suchen...',
    chime: 'Gong',
    digital: 'Digital',
    analog: 'Analog',
    sameTime: 'Gleiche Zeit',
    close: 'Schließen',

    quickTimers: 'Schnell-Timer',
    quickTimerDesc: 'Mit einem Klick Countdown konfigurieren und starten',
    autoStart: 'Autostart',
    customTimer: 'Benutzerdefiniert',
    createCustomTimer: 'Timer Erstellen',
    activeTimers: 'Aktive Timer',
    timerLabel: 'Timer-Bezeichnung',
    duration: 'Dauer',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
    alarmSound: 'Alarmton',
    alarmSoundMenu: 'Alarmton-Menü',
    alarmSoundDesc: 'Wähle den Ton, der nach Ablauf ertönt',
    oneClickStart: '1-Klick Start',
    start: 'Starten',
    pause: 'Pause',
    resume: 'Fortsetzen',
    restart: 'Neustart',
    finished: 'Fertig',
    left: 'verbleibend',
    loop: 'Schleife',
    total: 'Gesamt',
    clearAllTimers: 'Alle Löschen',
    noActiveTimers: 'Keine aktiven Timer im Moment.',
    applyToAll: 'Auf Alle Anwenden',
    preview: 'Anhören',
    done: 'Fertig',
    cancel: 'Abbrechen',
    save: 'Speichern',
    testAlarm: 'Alarmton Testen',
    volume: 'Lautstärke',

    breakAndTea: 'Pause & Tee',
    focusedSprint: 'Fokussierter Sprint',
    deepWork: 'Deep Work Block',
    fullHour: 'Volle Stunde',
    express: 'Express',
    steep: 'Ziehen lassen',
    shortTask: 'Kurze Aufgabe',
    powerNap: 'Powernap',
    pomodoroFocus: 'Pomodoro-Fokus',
    studySession: 'Lerneinheit',

    soundSoftBell: 'Sanfte Glocke',
    soundDigitalBeep: 'Digitaler Piepton',
    soundAnalogClock: 'Mechanischer Wecker',
    soundZenGong: 'Zen-Gong',
    soundWoodblock: 'Holzblock',
    soundCrystalPing: 'Kristall-Ping',

    precisionStopwatch: 'Präzisions-Stoppuhr',
    lap: 'Runde',
    reset: 'Zurücksetzen',
    lapSplits: 'Rundenzeiten',
    splitsDesc: 'Chronologische Rundenzeiten mit Delta-Vergleich',
    fastest: 'Schnellste',
    slowest: 'Langsamste',
    copySplits: 'Runden Kopieren',
    copied: 'Kopiert',
    performance: 'Leistung',
    totalTime: 'Gesamtzeit',

    intervalFlow: 'Intervall-Ablauf',
    intervalDesc: 'Strukturierte Fokus-Phasen mit regenerativen Pausen',
    deepFocus: 'Fokus-Sitzung',
    shortBreak: 'Kurze Pause',
    longBreak: 'Lange Pause',
    skip: 'Überspringen',
    config: 'Konfiguration',
    focusConfig: 'Fokus-Einstellungen',
    focusDuration: 'Fokus-Dauer (Minuten)',
    shortBreakDuration: 'Kurze Pause (Minuten)',
    longBreakDuration: 'Lange Pause (Minuten)',
    cyclesBeforeLong: 'Zyklen vor langer Pause',
    autoStartBreaks: 'Pausen automatisch starten',
    autoStartFocus: 'Fokus automatisch starten',
    completedFocusBlocks: 'Abgeschlossene Fokus-Blöcke',
    cycleOf: 'von',

    footerTagline: 'Chronos Zeit & Präzisions-Studio',
  },

  ja: {
    navClock: '世界時計',
    navTimers: 'タイマー',
    navStopwatch: 'ストップウォッチ',
    navFocus: '集中インターバル',
    ambientMode: 'アンビエント表示',
    exitAmbient: 'アンビエント解除',
    sound: 'サウンド',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    language: '言語',

    localTime: '現在時刻',
    dayProgress: '今日の進捗',
    completed: '完了',
    worldClock: '世界時計',
    worldClockDesc: '世界主要都市のタイムゾーンを確認',
    addCity: '都市を追加',
    searchCity: '都市または国名で検索...',
    chime: '時報チャイム',
    digital: 'デジタル',
    analog: 'アナログ',
    sameTime: '同時間帯',
    close: '閉じる',

    quickTimers: 'クイックタイマー',
    quickTimerDesc: 'ワンクリックですぐにカウントダウンを開始',
    autoStart: '自動開始',
    customTimer: 'カスタムタイマー',
    createCustomTimer: '新規タイマー作成',
    activeTimers: '進行中のタイマー',
    timerLabel: 'タイマー名',
    duration: '設定時間',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
    alarmSound: 'アラーム音',
    alarmSoundMenu: 'アラーム音メニュー',
    alarmSoundDesc: 'タイマー終了時に再生するアラームを選択',
    oneClickStart: '即座に開始',
    start: '開始',
    pause: '一時停止',
    resume: '再開',
    restart: '最初から',
    finished: '終了しました',
    left: '残り',
    loop: 'リピート',
    total: '合計',
    clearAllTimers: 'すべてクリア',
    noActiveTimers: '現在動作中のタイマーはありません。',
    applyToAll: 'すべてに適用',
    preview: '試聴',
    done: '完了',
    cancel: 'キャンセル',
    save: '保存',
    testAlarm: 'アラームテスト',
    volume: '音量',

    breakAndTea: '休憩とお茶',
    focusedSprint: '集中スプリント',
    deepWork: 'ディープワーク',
    fullHour: '1時間セッション',
    express: 'エクスプレス',
    steep: '蒸らし',
    shortTask: '小タスク',
    powerNap: '仮眠',
    pomodoroFocus: 'ポモドーロ',
    studySession: '学習・読書',

    soundSoftBell: 'ソフトベル',
    soundDigitalBeep: 'デジタル電子音',
    soundAnalogClock: '目覚まし時計チャイム',
    soundZenGong: '禅の鐘 (ゴング)',
    soundWoodblock: 'ウッドブロック',
    soundCrystalPing: 'クリスタルピン',

    precisionStopwatch: '高精度ストップウォッチ',
    lap: 'ラップ',
    reset: 'リセット',
    lapSplits: 'ラップタイム一覧',
    splitsDesc: 'ラップとスプリットタイムの比較詳細',
    fastest: '最速',
    slowest: '最遅',
    copySplits: 'ラップをコピー',
    copied: 'コピー完了',
    performance: '評価',
    totalTime: '合計経過時間',

    intervalFlow: 'インターバルフロー',
    intervalDesc: '集中と休息のリズムを作るポモドーロタイマー',
    deepFocus: '集中タイム',
    shortBreak: '短い休憩',
    longBreak: '長い休憩',
    skip: 'スキップ',
    config: '設定',
    focusConfig: '集中タイマー設定',
    focusDuration: '集中時間 (分)',
    shortBreakDuration: '小休憩時間 (分)',
    longBreakDuration: '長休憩時間 (分)',
    cyclesBeforeLong: '長休憩までのサイクル数',
    autoStartBreaks: '休憩を自動開始',
    autoStartFocus: '集中を自動開始',
    completedFocusBlocks: '完了した集中ブロック',
    cycleOf: '/',

    footerTagline: 'Chronos 高精度タイムスタジオ',
  },

  zh: {
    navClock: '世界时钟',
    navTimers: '计时器',
    navStopwatch: '秒表',
    navFocus: '专注番茄钟',
    ambientMode: '沉浸桌面时钟',
    exitAmbient: '退出沉浸',
    sound: '声音',
    mute: '静音',
    unmute: '开启声音',
    language: '语言',

    localTime: '本地时间',
    dayProgress: '今日进度',
    completed: '已过去',
    worldClock: '世界时钟',
    worldClockDesc: '查看全球主要城市时区与时间',
    addCity: '添加城市',
    searchCity: '搜索城市或国家...',
    chime: '整点报时',
    digital: '数字时钟',
    analog: '指针表盘',
    sameTime: '无时差',
    close: '关闭',

    quickTimers: '快捷计时器',
    quickTimerDesc: '单次点击即可立刻启动倒计时',
    autoStart: '点击即开始',
    customTimer: '自定义计时',
    createCustomTimer: '新建倒计时',
    activeTimers: '运行中的计时器',
    timerLabel: '计时器名称',
    duration: '时长',
    hours: '小时',
    minutes: '分钟',
    seconds: '秒',
    alarmSound: '闹铃提示音',
    alarmSoundMenu: '提示音设置',
    alarmSoundDesc: '选择计时器结束时播放的声音',
    oneClickStart: '一键启动',
    start: '开始',
    pause: '暂停',
    resume: '继续',
    restart: '重新开始',
    finished: '已完成',
    left: '剩余',
    loop: '自动循环',
    total: '总计',
    clearAllTimers: '清空全部',
    noActiveTimers: '当前没有活动的计时器。',
    applyToAll: '应用到所有计时器',
    preview: '试听',
    done: '完成',
    cancel: '取消',
    save: '保存',
    testAlarm: '测试声音',
    volume: '音量',

    breakAndTea: '小憩与喝茶',
    focusedSprint: '高效冲刺',
    deepWork: '深度工作',
    fullHour: '完整一小时',
    express: '速记',
    steep: '沏茶泡面',
    shortTask: '简短任务',
    powerNap: '高效小憩',
    pomodoroFocus: '番茄工作法',
    studySession: '自习研读',

    soundSoftBell: '柔和和弦钟声',
    soundDigitalBeep: '清脆数字蜂鸣',
    soundAnalogClock: '机械双铃闹钟',
    soundZenGong: '禅意颂钵',
    soundWoodblock: '清脆木鱼敲击',
    soundCrystalPing: '水晶清鸣',

    precisionStopwatch: '百分秒高精度秒表',
    lap: '计圈 (Lap)',
    reset: '重置',
    lapSplits: '计圈数据列表',
    splitsDesc: '每圈用时与累计时间对比',
    fastest: '最快圈速',
    slowest: '最慢圈速',
    copySplits: '复制计圈记录',
    copied: '已复制',
    performance: '状态',
    totalTime: '累计总时间',

    intervalFlow: '节奏专注流',
    intervalDesc: '基于科学节奏的专注与恢复循环',
    deepFocus: '深度专注时段',
    shortBreak: '短休息',
    longBreak: '长休息',
    skip: '跳过',
    config: '参数配置',
    focusConfig: '专注参数设置',
    focusDuration: '专注时长 (分钟)',
    shortBreakDuration: '短休息 (分钟)',
    longBreakDuration: '长休息 (分钟)',
    cyclesBeforeLong: '长休息前的循环轮数',
    autoStartBreaks: '自动开始休息',
    autoStartFocus: '自动开始下一轮专注',
    completedFocusBlocks: '已完成专注单元',
    cycleOf: '/',

    footerTagline: 'Chronos 极简高精度时间工作室',
  },

  pt: {
    navClock: 'Relógio Mundial',
    navTimers: 'Temporizadores',
    navStopwatch: 'Cronômetro',
    navFocus: 'Foco em Intervalos',
    ambientMode: 'Modo Ambiente',
    exitAmbient: 'Sair do Ambiente',
    sound: 'Som',
    mute: 'Silenciar',
    unmute: 'Ativar som',
    language: 'Idioma',

    localTime: 'Hora Local',
    dayProgress: 'Progresso do Dia',
    completed: 'concluído',
    worldClock: 'Relógio Mundial',
    worldClockDesc: 'Acompanhe fusos horários de cidades globais',
    addCity: 'Adicionar Cidade',
    searchCity: 'Pesquisar cidade ou país...',
    chime: 'Carrilhão',
    digital: 'Digital',
    analog: 'Analógico',
    sameTime: 'Mesmo horário',
    close: 'Fechar',

    quickTimers: 'Temporizadores Rápidos',
    quickTimerDesc: 'Um clique para iniciar contagens regressivas instantâneas',
    autoStart: 'Início automático',
    customTimer: 'Personalizado',
    createCustomTimer: 'Criar Temporizador',
    activeTimers: 'Temporizadores Ativos',
    timerLabel: 'Nome do Temporizador',
    duration: 'Duração',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    alarmSound: 'Som do Alarme',
    alarmSoundMenu: 'Menu de Sons do Alarme',
    alarmSoundDesc: 'Escolha o toque tocado ao término do temporizador',
    oneClickStart: 'Início em 1 Clique',
    start: 'Iniciar',
    pause: 'Pausar',
    resume: 'Retomar',
    restart: 'Reiniciar',
    finished: 'Finalizado',
    left: 'restante',
    loop: 'Repetir',
    total: 'Total',
    clearAllTimers: 'Limpar Todos',
    noActiveTimers: 'Nenhum temporizador ativo no momento.',
    applyToAll: 'Aplicar a Todos',
    preview: 'Ouvir',
    done: 'Concluído',
    cancel: 'Cancelar',
    save: 'Salvar',
    testAlarm: 'Testar Alarme',
    volume: 'Volume',

    breakAndTea: 'Pausa & Café',
    focusedSprint: 'Sprint Focado',
    deepWork: 'Trabalho Profundo',
    fullHour: 'Hora Completa',
    express: 'Expresso',
    steep: 'Infusão',
    shortTask: 'Tarefa Rápida',
    powerNap: 'Cochilo',
    pomodoroFocus: 'Foco Pomodoro',
    studySession: 'Estudo / Leitura',

    soundSoftBell: 'Sino Suave',
    soundDigitalBeep: 'Bipe Digital',
    soundAnalogClock: 'Relógio Mecânico',
    soundZenGong: 'Gongo Zen',
    soundWoodblock: 'Bloco de Madeira',
    soundCrystalPing: 'Ping Cristalino',

    precisionStopwatch: 'Cronômetro de Precisão',
    lap: 'Volta',
    reset: 'Redefinir',
    lapSplits: 'Tempos de Volta',
    splitsDesc: 'Tempos cronológicos com comparação de deltas',
    fastest: 'Mais Rápida',
    slowest: 'Mais Lenta',
    copySplits: 'Copiar Voltas',
    copied: 'Copiado',
    performance: 'Desempenho',
    totalTime: 'Tempo Total',

    intervalFlow: 'Fluxo de Intervalos',
    intervalDesc: 'Ciclos de foco estruturados com pausas revigorantes',
    deepFocus: 'Sessão de Foco Profundo',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
    skip: 'Pular',
    config: 'Configurar',
    focusConfig: 'Configuração de Foco',
    focusDuration: 'Duração do Foco (minutos)',
    shortBreakDuration: 'Pausa Curta (minutos)',
    longBreakDuration: 'Pausa Longa (minutos)',
    cyclesBeforeLong: 'Ciclos antes da Pausa Longa',
    autoStartBreaks: 'Iniciar pausas automaticamente',
    autoStartFocus: 'Iniciar foco automaticamente',
    completedFocusBlocks: 'Blocos de foco concluídos',
    cycleOf: 'de',

    footerTagline: 'Chronos Estúdio de Tempo e Precisão',
  },

  it: {
    navClock: 'Orologio Mondiale',
    navTimers: 'Timer',
    navStopwatch: 'Cronometro',
    navFocus: 'Focus a Intervalli',
    ambientMode: 'Modalità Ambiente',
    exitAmbient: 'Esci da Ambiente',
    sound: 'Audio',
    mute: 'Muto',
    unmute: 'Attiva audio',
    language: 'Lingua',

    localTime: 'Ora Locale',
    dayProgress: 'Avanzamento del Giorno',
    completed: 'completato',
    worldClock: 'Orologio Mondiale',
    worldClockDesc: 'Monitora i fusi orari delle città nel mondo',
    addCity: 'Aggiungi Città',
    searchCity: 'Cerca città o paese...',
    chime: 'Rintocco',
    digital: 'Digitale',
    analog: 'Analogico',
    sameTime: 'Stesso orario',
    close: 'Chiudi',

    quickTimers: 'Timer Rapidi',
    quickTimerDesc: 'Un solo clic per avviare il conto alla rovescia',
    autoStart: 'Avvio automatico',
    customTimer: 'Personalizzato',
    createCustomTimer: 'Crea Timer',
    activeTimers: 'Timer Attivi',
    timerLabel: 'Nome del Timer',
    duration: 'Durata',
    hours: 'Ore',
    minutes: 'Minuti',
    seconds: 'Secondi',
    alarmSound: 'Suoneria Sveglia',
    alarmSoundMenu: 'Menu Suonerie',
    alarmSoundDesc: 'Scegli la suoneria al completamento del timer',
    oneClickStart: 'Avvio 1-Clic',
    start: 'Avvia',
    pause: 'Pausa',
    resume: 'Riprendi',
    restart: 'Ricomincia',
    finished: 'Finito',
    left: 'rimanenti',
    loop: 'Ripeti',
    total: 'Totale',
    clearAllTimers: 'Elimina Tutti',
    noActiveTimers: 'Nessun timer attivo al momento.',
    applyToAll: 'Applica a Tutti',
    preview: 'Ascolta',
    done: 'Fatto',
    cancel: 'Annulla',
    save: 'Salva',
    testAlarm: 'Prova Suoneria',
    volume: 'Volume',

    breakAndTea: 'Pausa e Tè',
    focusedSprint: 'Sprint Focalizzato',
    deepWork: 'Lavoro Profondo',
    fullHour: 'Ora Piena',
    express: 'Espresso',
    steep: 'Infusione',
    shortTask: 'Breve Attività',
    powerNap: 'Riposino',
    pomodoroFocus: 'Focus Pomodoro',
    studySession: 'Studio / Lettura',

    soundSoftBell: 'Campana Dolce',
    soundDigitalBeep: 'Bip Digitale',
    soundAnalogClock: 'Orologio Meccanico',
    soundZenGong: 'Gong Zen',
    soundWoodblock: 'Blocco di Legno',
    soundCrystalPing: 'Ping Cristallino',

    precisionStopwatch: 'Cronometro di Precisione',
    lap: 'Giro',
    reset: 'Azzera',
    lapSplits: 'Tempi sul Giro',
    splitsDesc: 'Tempi intermedi cronologici con differenze',
    fastest: 'Più Veloce',
    slowest: 'Più Lento',
    copySplits: 'Copia Giri',
    copied: 'Copiato',
    performance: 'Prestazione',
    totalTime: 'Tempo Totale',

    intervalFlow: 'Flusso a Intervalli',
    intervalDesc: 'Sessioni di concentrazione strutturate con pause rigeneranti',
    deepFocus: 'Sessione di Focus Profondo',
    shortBreak: 'Pausa Breve',
    longBreak: 'Pausa Lunga',
    skip: 'Salta',
    config: 'Configura',
    focusConfig: 'Configurazione Focus',
    focusDuration: 'Durata Focus (minuti)',
    shortBreakDuration: 'Pausa Breve (minuti)',
    longBreakDuration: 'Pausa Lunga (minuti)',
    cyclesBeforeLong: 'Cicli prima della Pausa Lunga',
    autoStartBreaks: 'Avvia pause automaticamente',
    autoStartFocus: 'Avvia focus automaticamente',
    completedFocusBlocks: 'Blocchi di focus completati',
    cycleOf: 'di',

    footerTagline: 'Chronos Studio di Precisione e Tempo',
  },
};
