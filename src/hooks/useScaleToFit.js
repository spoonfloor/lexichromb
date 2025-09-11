// src/hooks/useScaleToFit.js
import { useEffect } from 'react';

export default function useScaleToFit(wrapperRef) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const parent = wrapper.parentElement;
    const computed = window.getComputedStyle(parent);
    const padLeft = parseFloat(computed.paddingLeft) || 0;
    const padRight = parseFloat(computed.paddingRight) || 0;
    const padTop = parseFloat(computed.paddingTop) || 0;
    const padBottom = parseFloat(computed.paddingBottom) || 0;

    const marginX = padLeft + padRight;
    const marginY = padTop + padBottom;

    function measureNaturalSize() {
      const prevTransform = wrapper.style.transform;
      wrapper.style.transform = 'none';
      const rect = wrapper.getBoundingClientRect();
      wrapper.style.transform = prevTransform;
      return { naturalWidth: rect.width, naturalHeight: rect.height };
    }

    let rafId = null;

    function scaleBox() {
      const { naturalWidth, naturalHeight } = measureNaturalSize();
      const availableWidth = window.innerWidth - marginX;
      const availableHeight = window.innerHeight - marginY;

      const scale = Math.min(
        availableWidth / naturalWidth,
        availableHeight / naturalHeight,
        1
      );

      wrapper.style.transform = `scale(${scale})`;
    }

    function onResize() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(scaleBox);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    const timeoutId = setTimeout(() => {
      scaleBox();
    }, 100); // 100ms delay to ensure layout is ready

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [wrapperRef]);
}
