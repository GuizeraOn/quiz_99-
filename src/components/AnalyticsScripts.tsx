'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsScripts() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Effect to handle UTM tracking on route changes/navigation
    useEffect(() => {
        // Run the UTM script logic whenever the path or search params change
        // This ensures it works on client-side navigation too if new links appear
        const runUtmScript = () => {
            const prefix = ["https://payment.hotmart.com", "https://pay.hotmart.com"];

            function getParams() {
                let t = "";
                const e = window.top?.location.href || window.location.href;
                try {
                    const r = new URL(e);
                    if (null != r) {
                        const a = r.searchParams.get("utm_source"),
                            n = r.searchParams.get("utm_medium"),
                            o = r.searchParams.get("utm_campaign"),
                            m = r.searchParams.get("utm_term"),
                            c = r.searchParams.get("utm_content");
                        if (-1 !== e.indexOf("?")) {
                            t = `&sck=${a}|${n}|${o}|${m}|${c}`;
                        }
                        // console.log(t);
                    }
                } catch (err) {
                    console.error("Error parsing URL params", err);
                }
                return t;
            }

            const t = new URLSearchParams(window.location.search);
            if (t.toString()) {
                document.querySelectorAll("a").forEach(function (e) {
                    for (let r = 0; r < prefix.length; r++) {
                        if (-1 !== e.href.indexOf(prefix[r])) {
                            if (-1 === e.href.indexOf("?")) {
                                e.href += "?" + t.toString() + getParams();
                            } else {
                                e.href += "&" + t.toString() + getParams();
                            }
                        }
                    }
                });
            }
        };

        // Small delay to ensure DOM is ready on navigation
        const timeoutId = setTimeout(runUtmScript, 500);
        return () => clearTimeout(timeoutId);
    }, [pathname, searchParams]);

    return (
        <>
            {/* Meta Pixel Code */}
            <Script
                id="fb-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1423059616094673');
            fbq('track', 'PageView');
          `,
                }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=1423059616094673&ev=PageView&noscript=1"
                    alt=""
                />
            </noscript>
            {/* End Meta Pixel Code */}

            {/* Clarity Tracking Code */}
            <Script
                id="clarity-script"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ujjyxe2u85");
          `,
                }}
            />

            {/* UTM Tracking Script - "Footer" placement logic via lazyOnload or useEffect above */}
            <Script
                id="utm-tracking"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
            let prefix = ["https://payment.hotmart.com", "https://pay.hotmart.com"];

            function getParams() {
                let t = "",
                    e = window.top.location.href,
                    r = new URL(e);
                if (null != r) {
                    let a = r.searchParams.get("utm_source"),
                        n = r.searchParams.get("utm_medium"),
                        o = r.searchParams.get("utm_campaign"),
                        m = r.searchParams.get("utm_term"),
                        c = r.searchParams.get("utm_content"); - 1 !== e.indexOf("?") && (t = \`&sck=\${a}|\${n}|\${o}|\${m}|\${c}\`), console.log(t)
                }
                return t
            }
            ! function() {
                var t = new URLSearchParams(window.location.search);
                t.toString() && document.querySelectorAll("a").forEach(function(e) {
                    for (let r = 0; r < prefix.length; r++) - 1 !== e.href.indexOf(prefix[r]) && (-1 === e.href.indexOf("?") ? e.href += "?" + t.toString() + getParams() : e.href += "&" + t.toString() + getParams())
                })
            }();

            console.log('%cScript de rastreamento de vendas desenvolvido pela Comunidade NOD - Dericson Calari e Samuel Choairy', 'font-size:20px;color:yellow;');
                    `
                }}
            />
        </>
    );
}
