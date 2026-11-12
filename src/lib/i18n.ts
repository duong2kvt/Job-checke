import { useEffect } from 'react'
import { setState, useStore } from './store'

// Two languages, Vietnamese first. Copy lives next to where it is used:
// inline as t('Tiếng Việt', 'English'), or in data files as { vi, en }.

export type Lang = 'vi' | 'en'
export type Tx = { vi: string; en: string }

export function useLang() {
  const lang = useStore((s) => s.lang) ?? 'vi'
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  /** t('Xin chào', 'Hello') or t({ vi, en }) */
  const t = (a: string | Tx, en?: string): string => (typeof a === 'string' ? (lang === 'en' && en !== undefined ? en : a) : a[lang])
  return { lang, t }
}

export const setLang = (lang: Lang) => setState({ lang })
