import ejs from 'ejs'

import translationData from '@app/hook-translate/translations.json'

let translations = translationData as {
    [key: string]: {
        templates: { [key: string]: string }
        actions: { [key: string]: string }
    }
}

export default function translate(event: string, payload: any): string | undefined {
    // Can't handle events with no translation
    if (event in translations === false) {
        return undefined
    }

    const translation = translations[event]

    // Inject templates
    Object.entries(translation.templates).forEach(v => {
        payload[v[0]] = ejs.render(v[1], payload)
    })

    let action: string = 'default'
    if ('action' in payload && payload.action in translation.actions) {
        action = payload.action
    }
    
    let template: string = translation.actions[action]
    return template ? ejs.render(translation.actions[action], payload) : undefined
}