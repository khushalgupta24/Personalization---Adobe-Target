import { useEffect } from "react";

let lastViewName = null;
let lastViewTimestamp = 0;

const useTargetView = (viewName) => {
  useEffect(() => {
    const fireView = () => {
      if (!(window.adobe && window.adobe.target)) return;

      const now = Date.now();

      // Prevent rapid duplicate impressions for same view in local/dev rendering
      if (lastViewName === viewName && now - lastViewTimestamp < 500) {
        return;
      }

      lastViewName = viewName;
      lastViewTimestamp = now;

      console.log("Triggering Target View:", viewName);
      window.adobe.target.triggerView(viewName);
    };

    if (window.adobe && window.adobe.target) {
      fireView();
    } else {
      document.addEventListener("at-library-loaded", fireView);
    }

    return () => {
      document.removeEventListener("at-library-loaded", fireView);
    };
  }, [viewName]);
};

export default useTargetView;