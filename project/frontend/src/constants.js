export const AVATAR_LEVELS = {
  '🦊': 1, '🦉': 1, '🐢': 1, '🦖': 1,
  '🚀': 3, '🌟': 5, '👾': 10, '🌈': 15,
};

export const AVATARS = Object.keys(AVATAR_LEVELS);

export const STARTER_AVATARS = AVATARS.filter(a => AVATAR_LEVELS[a] === 1);

export const LANGUAGE_OPTIONS = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'ca', label: 'Català', flag: 'CA' },
];
