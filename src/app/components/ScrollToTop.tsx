import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Resets the window to the top whenever the route changes.
 *
 * Without this a new page inherits the previous page's scroll offset, so following a
 * link from halfway down a long list drops you into the middle of the next page. The
 * app mounts <BrowserRouter> rather than a data router, so React Router's own
 * <ScrollRestoration /> is unavailable — it requires createBrowserRouter.
 *
 * Scrolling happens on the window: there is no inner scroll container and no overflow
 * rule on html/body/#root, so scrollTo is enough.
 *
 * Renders nothing; mount it inside <Router> and above <Routes>.
 */
export function ScrollToTop(): null {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Leave POP alone — that is back/forward, where the browser restores the previous
    // offset itself and jumping to the top would lose the reader's place.
    if (navigationType === 'POP') return;

    // An in-page anchor is asking for a specific position, not the top.
    if (hash) return;

    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
