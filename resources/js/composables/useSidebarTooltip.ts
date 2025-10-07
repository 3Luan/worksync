import { reactive, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';

export function useSidebarTooltip() {
  const tooltipShown = reactive<Record<string, boolean>>({});
  const labelElementsByKey = reactive<Record<string, HTMLElement | null>>({});
  let resizeObserver: ResizeObserver | null = null;
  let requestAnimationFrameId: ReturnType<typeof requestAnimationFrame> | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Measure a single element to check if text is truncated (ellipsis).
   * If the element is not present, it removes the entry from tooltipShown and labelElementsByKey.
   * If the element is present but not visible (offsetParent is null), it does nothing.
   */
  const measureOne = (itemKey: string, element: HTMLElement | null) => {
    if (!element) {
      delete tooltipShown[itemKey];
      delete labelElementsByKey[itemKey];
      return;
    }
    if (element.offsetParent === null) return;
    tooltipShown[itemKey] = element.scrollWidth > element.clientWidth;
  };

  /**
   * Measure element to check if text is truncated (ellipsis).
   * Stores the element for later re-measurement.
   */
  const measureElement = (key: string, element: HTMLElement | null) => {
    labelElementsByKey[key] = element;
    measureOne(key, element);
    if (resizeObserver && element) resizeObserver.observe(element);
  };

  /**
   * Create a ref function that measures the element when it is mounted.
   * It checks if the element is an HTMLElement or a Vue component with $el.
   * It uses nextTick to ensure the DOM is updated before measuring.
   */
  const createLabelRef = (key: string) => {
    return (element: Element | { $el: Element } | null) => {
      const htmlElement = element && '$el' in element ? (element.$el as HTMLElement) : (element as HTMLElement | null);
      nextTick(() => measureElement(key, htmlElement));
    };
  };

  /**
   * Re-measure all tracked labels (debounced + double rAF).
   * - Debounce: group rapid triggers (resize/transitionend).
   * - rAF #1: wait for layout flush.
   * - rAF #2: wait for paint/transitions → stable measurement.
   * Default: 50 ms debounce (~3 frames @60Hz).
   */
  const measureAll = () => {
    if (debounceTimer) window.clearTimeout(debounceTimer);

    debounceTimer = window.setTimeout(() => {
      if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);

      // rAF #1: wait for layout flush after recent mutations
      requestAnimationFrameId = requestAnimationFrame(() => {
        // rAF #2: wait one more frame for paint/composition & transitions to settle
        requestAnimationFrameId = requestAnimationFrame(() => {
          Object.entries(labelElementsByKey).forEach(([key, element]) => measureOne(key, element));
          requestAnimationFrameId = null;
        });
      });

      debounceTimer = null;
    }, 50); // ~3 frames at 60Hz; balances responsiveness vs. work during continuous resize/transitions. 20–100ms also works; 50ms is a safe default to avoid flicker while staying responsive.
  };

  const onResize = () => measureAll();

  onMounted(() => {
    window.addEventListener('resize', onResize, { passive: true });
    resizeObserver = new ResizeObserver(onResize);
    const sidebarRoot = document.querySelector('[data-sidebar-root]') as HTMLElement | null;
    if (sidebarRoot) sidebarRoot.addEventListener('transitionend', measureAll);

    nextTick(measureAll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId);
    if (debounceTimer) window.clearTimeout(debounceTimer);
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    const sidebarRoot = document.querySelector('[data-sidebar-root]') as HTMLElement | null;
    if (sidebarRoot) sidebarRoot.removeEventListener('transitionend', measureAll);
  });

  return {
    tooltipShown,
    createLabelRef,
    measureAll,
  };
}
