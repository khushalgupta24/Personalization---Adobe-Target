import { useEffect } from "react";

function waitForAlloy(timeoutMs = 5000, intervalMs = 50) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const timer = setInterval(() => {
      if (typeof window.alloy === "function") {
        clearInterval(timer);
        resolve(window.alloy);
        return;
      }

      if (Date.now() - start >= timeoutMs) {
        clearInterval(timer);
        reject(
          new Error(
            "Adobe Experience Platform Web SDK is not ready on window.alloy."
          )
        );
      }
    }, intervalMs);
  });
}

export default function useTargetView(viewName) {
  useEffect(() => {
    if (!viewName) return;

    let cancelled = false;

    async function sendViewEvent() {
      try {
        const alloy = await waitForAlloy();

        if (cancelled) return;

        console.log(`[Web SDK] sendEvent("${viewName}")`);

        await alloy("sendEvent", {
          renderDecisions: true,
          xdm: {
            eventType: "web.webpagedetails.pageViews",
            web: {
              webPageDetails: {
                name: document.title,
                viewName: viewName,
                URL: window.location.href
              },
              webReferrer: {
                URL: document.referrer || ""
              }
            }
          }
        });
      } catch (error) {
        console.error("[Web SDK] Unable to send SPA view event:", error);
      }
    }

    sendViewEvent();

    return () => {
      cancelled = true;
    };
  }, [viewName]);
}