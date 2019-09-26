import { locale, dictionary, getClientLocale } from 'svelte-i18n'

// Set the current locale to en-US
locale.set('en')

// This is a store, so we can subscribe to its changes
locale.subscribe(() => {
  console.log('locale change')
})

// svelte-i18n exports a method to help getting the current client locale
locale.set(
  getClientLocale({
    // the fallback locale, if didn't find any
    fallback: 'en',
    // set to 'true' to check the 'window.navigator.language'
    navigator: true,
    // set the key name to look for a locale on 'window.location.search'
    // 'example.com?locale=en-US'
    search: 'lang',
    // set the key name to look for a locale on 'window.location.hash'
    // 'example.com#locale=en-US'
    hash: 'locale',
  }),
)


// Define a locale dictionary
dictionary.set({
  pt: {
    message: 'Mensagem',
    'switch.lang': 'Trocar idioma',
    greeting: {
      ask: 'Por favor, digite seu nome',
      message: 'Olá {name}, como vai?',
    },
    photos:
      'Você {n, plural, =0 {não tem fotos.} =1 {tem uma foto.} other {tem # fotos.}}',
    cats: 'Tenho {n, number} {n,plural,=0{gatos}one{gato}other{gatos}}',
  },
  en: {
    message: 'Message',
    'switch.lang': 'Switch language',
    greeting: {
      ask: 'Please type your name',
      message: 'Hello {name}, how are you? ',
    },
    photos:
      'You have {n, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}',
    cats: 'I have {n, number} {n,plural,one{cat}other{cats}}',
  },
})