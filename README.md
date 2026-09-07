# Reusable content-protection kit

This folder contains two versions:

- `original-econstruct/` — the exact React component extracted from E-Construct, plus its required CSS. Use this in another React + Tailwind project that already has `lucide-react`.
- `react/` — the recommended portable version. It uses ordinary CSS and inline SVG icons, so it only requires React and React DOM.

## Recommended installation

Copy the `react` folder into your project's `src` directory, then mount the component once near the top of the application:

```jsx
import ContentProtection from './content-protection/ContentProtection';
import './content-protection/content-protection.css';

export default function App() {
  return (
    <>
      <ContentProtection
        brandName="MY PROJECT — PROTECTED CONTENT"
        watermarkText="MY PROJECT • CONFIDENTIAL"
        clipboardReplacement="Protected Content — myproject.com"
      />
      {/* Your application */}
    </>
  );
}
```

The default protected application root is `#root`, which matches Vite. For another root:

```jsx
<ContentProtection protectedRootSelector="#app" />
```

For Next.js App Router, mount it from a client component and use:

```jsx
<ContentProtection protectedRootSelector="#__next" />
```

Import `content-protection.css` from the application's global stylesheet or root layout.

## What it does

- Blocks the context menu.
- Blocks dragging images, video, canvas, SVG, and links.
- Blocks copy/cut outside inputs and `.allow-select` regions.
- Intercepts common save, print, view-source, developer-tools, Print Screen, and snipping shortcuts.
- Hides the document when printing.
- Applies a blackout/blur shield when the window loses focus or the tab becomes hidden.
- Shows branded warning toasts and a configurable watermark curtain.
- Cleans up every listener and CSS class when unmounted.

Add `className="allow-select"` to any region where users should be allowed to select and copy text.

Every protection can be switched off individually with component props such as `blockCopy={false}`, `blockContextMenu={false}`, or `shieldOnWindowBlur={false}`.

## Important limitation

This is deterrence, not true digital-rights management. Browser JavaScript cannot guarantee that an operating-system screenshot, browser extension, network inspection, cached asset, automated browser, external camera, or determined technical user will be blocked. The strongest protection for genuinely sensitive material is not sending the original asset to an unauthorized browser in the first place.

Also consider accessibility and legitimate user needs before enabling every restriction. Blocking selection, right-click, printing, and standard keyboard shortcuts can make a public website frustrating for users with assistive workflows.
