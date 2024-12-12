import { tr } from './tr';
import { en } from './en';

export const translations = {
  TR: tr,
  EN: en,
};

export type TranslationKeys = typeof tr;
export type Language = keyof typeof translations;
