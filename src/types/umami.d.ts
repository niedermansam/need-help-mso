declare namespace umami {
    export function trackEvent(event_name: string, event_data?: {[key:string] : string | number}, url?: string, website_id?: string ):void

    export function trackView(url:string, referrer?:string, website_id?:string):void
}