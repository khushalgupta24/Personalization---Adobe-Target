import { useEffect } from "react";

function sanitizeViewName(viewName) {
  if (!viewName) return "home";

  return String(viewName)
    .trim()
    .replace(/^[/#]+|[/#]+$/g, "") || "home";
}

function waitForAlloy(maxAttempts = 20, delay = 250) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      const ready =
        typeof window !== "undefined" &&
        typeof window.alloy === "function" &&
        window.__alloyReady === true;

      if (ready) {
        resolve();
        return;
      }

      attempts += 1;

      if (attempts >= maxAttempts) {
        reject(new Error("Adobe Experience Platform Web SDK is not ready on window.alloy."));
        return;
      }

      window.setTimeout(check, delay);
    };

    check();
  });
}

export default function useTargetView({ viewName, pageName, target = {} }) {
  useEffect(() => {
    const currentView = sanitizeViewName(viewName);
    let isCancelled = false;

    async function sendViewEvent() {
      try {
        await waitForAlloy();

        if (isCancelled) {
          return;
        }

        const result = await window.alloy("sendEvent", {
          renderDecisions: true,
          xdm: {
            web: {
              webPageDetails: {
                name: pageName || currentView,
                viewName: currentView
              }
            }
          },
          data: {
            __adobe: {
              target
            }
          }
        });

        console.info(`[Web SDK] sendEvent(viewName="${currentView}")`, result);
      } catch (error) {
        console.warn("[Web SDK] Unable to send SPA view event:", error.message);
      }
    }

    sendViewEvent();

    return () => {
      isCancelled = true;
    };
  }, [viewName, pageName, JSON.stringify(target)]);
}
