'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const DEFAULT_MESSAGES = {
  contextMenu: 'Right-click is disabled to protect this website content.',
  copy: 'Copying text from this page is disabled.',
  save: 'Saving this web page is disabled.',
  print: 'Printing this page is disabled for copyright protection.',
  source: 'Viewing page source is restricted.',
  devtools: 'Developer inspection shortcuts are restricted.',
  screenshot: 'Screen capture shortcuts are restricted.',
};

function isEditableTarget(target, selector) {
  if (!(target instanceof Element)) return false;
  return target.matches(selector) || Boolean(target.closest(selector));
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 4.5 6v5.25c0 4.75 3.2 8.25 7.5 9.75 4.3-1.5 7.5-5 7.5-9.75V6L12 3Z" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/**
 * Browser-level friction against casual copying, dragging, printing and common
 * capture shortcuts. This is not DRM and cannot stop determined extraction or
 * operating-system/external-camera screenshots.
 */
export default function ContentProtection({
  enabled = true,
  brandName = 'Protected Content',
  description = 'Screen capture and background viewing are restricted to protect proprietary material.',
  watermarkText = 'CONFIDENTIAL & PROTECTED',
  clipboardReplacement,
  protectedRootSelector = '#root',
  editableSelector = 'input, textarea, [contenteditable="true"], .allow-select',
  toastDurationMs = 2800,
  shieldDurationMs = 2500,
  blockContextMenu = true,
  blockDrag = true,
  blockCopy = true,
  blockCut = true,
  blockSave = true,
  blockPrint = true,
  blockViewSource = true,
  blockDevtoolsShortcuts = true,
  reactToCaptureShortcuts = true,
  shieldOnWindowBlur = true,
  shieldOnTabHidden = true,
  messages = {},
}) {
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const rootRef = useRef(null);
  const toastTimerRef = useRef(null);
  const shieldTimerRef = useRef(null);
  const resolvedMessages = { ...DEFAULT_MESSAGES, ...messages };

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, toastDurationMs);
  }, [toastDurationMs]);

  const removeShield = useCallback(() => {
    rootRef.current?.classList.remove('cp-screen-protected');
    setShieldActive(false);
  }, []);

  const applyShield = useCallback((reason) => {
    rootRef.current?.classList.add('cp-screen-protected');
    setShieldActive(true);
    if (reason) showToast(reason);

    const replacement = clipboardReplacement ?? `${brandName} — protected content`;
    try {
      const write = navigator.clipboard?.writeText?.(replacement);
      write?.catch?.(() => {});
    } catch (_) {
      // Clipboard access is permission- and browser-dependent.
    }

    if (shieldTimerRef.current) window.clearTimeout(shieldTimerRef.current);
    shieldTimerRef.current = window.setTimeout(() => {
      if (document.hasFocus()) removeShield();
    }, shieldDurationMs);
  }, [brandName, clipboardReplacement, removeShield, shieldDurationMs, showToast]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    rootRef.current = document.querySelector(protectedRootSelector);
    rootRef.current?.classList.add('cp-content-locked');
    document.documentElement.classList.add('cp-print-protected');

    const handleContextMenu = (event) => {
      if (!blockContextMenu) return;
      event.preventDefault();
      showToast(resolvedMessages.contextMenu);
    };

    const handleDragStart = (event) => {
      if (!blockDrag || !(event.target instanceof Element)) return;
      if (event.target.closest('img, video, canvas, picture, svg, a')) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      const code = event.keyCode || event.which;
      const command = event.ctrlKey || event.metaKey;

      if (reactToCaptureShortcuts && (
        event.key === 'PrintScreen' ||
        code === 44 ||
        (command && event.shiftKey && ['s', '3', '4', '5'].includes(key))
      )) {
        event.preventDefault();
        applyShield(resolvedMessages.screenshot);
        return;
      }

      if (blockSave && command && key === 's') {
        event.preventDefault();
        showToast(resolvedMessages.save);
        return;
      }

      if (blockPrint && command && key === 'p') {
        event.preventDefault();
        showToast(resolvedMessages.print);
        return;
      }

      if (blockViewSource && command && key === 'u') {
        event.preventDefault();
        showToast(resolvedMessages.source);
        return;
      }

      const devtoolsShortcut =
        event.key === 'F12' ||
        code === 123 ||
        (command && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        (event.metaKey && event.altKey && ['i', 'j', 'c', 'u'].includes(key));

      if (blockDevtoolsShortcuts && devtoolsShortcut) {
        event.preventDefault();
        showToast(resolvedMessages.devtools);
      }
    };

    const handleKeyUp = (event) => {
      if (!reactToCaptureShortcuts) return;
      if (event.key === 'PrintScreen' || event.keyCode === 44) {
        applyShield(resolvedMessages.screenshot);
      }
    };

    const handleCopy = (event) => {
      if (!blockCopy || isEditableTarget(event.target, editableSelector)) return;
      event.preventDefault();
      showToast(resolvedMessages.copy);
    };

    const handleCut = (event) => {
      if (!blockCut || isEditableTarget(event.target, editableSelector)) return;
      event.preventDefault();
    };

    const handleWindowBlur = () => {
      if (!shieldOnWindowBlur || document.activeElement?.tagName === 'IFRAME') return;
      applyShield();
    };

    const handleWindowFocus = () => removeShield();

    const handleVisibilityChange = () => {
      if (!shieldOnTabHidden) return;
      if (document.visibilityState === 'hidden') applyShield();
      else removeShield();
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('dragstart', handleDragStart, true);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCut, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('dragstart', handleDragStart, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCut, true);
      rootRef.current?.classList.remove('cp-content-locked', 'cp-screen-protected');
      document.documentElement.classList.remove('cp-print-protected');
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (shieldTimerRef.current) window.clearTimeout(shieldTimerRef.current);
    };
  }, [
    applyShield,
    blockContextMenu,
    blockCopy,
    blockCut,
    blockDevtoolsShortcuts,
    blockDrag,
    blockPrint,
    blockSave,
    blockViewSource,
    editableSelector,
    enabled,
    protectedRootSelector,
    reactToCaptureShortcuts,
    removeShield,
    resolvedMessages.contextMenu,
    resolvedMessages.copy,
    resolvedMessages.devtools,
    resolvedMessages.print,
    resolvedMessages.save,
    resolvedMessages.screenshot,
    resolvedMessages.source,
    shieldOnTabHidden,
    shieldOnWindowBlur,
    showToast,
  ]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <div className="cp-layer" aria-live="polite">
      {toastMessage && (
        <div className="cp-toast" role="status">
          <span className="cp-toast-icon"><ShieldIcon /></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {shieldActive && (
        <button type="button" className="cp-shield" onClick={removeShield}>
          <span className="cp-shield-card">
            <span className="cp-lock-icon"><LockIcon /></span>
            <strong>{brandName}</strong>
            <span>{description}</span>
            <span className="cp-resume">Click anywhere to resume</span>
          </span>
          <span className="cp-watermarks" aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <span key={index}>{watermarkText}</span>
            ))}
          </span>
        </button>
      )}
    </div>,
    document.body,
  );
}
