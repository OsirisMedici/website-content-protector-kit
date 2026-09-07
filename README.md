# Website Content Protector Kit

A reusable React layer that helps businesses discourage casual copying, downloading, printing, and screen capture of valuable website content.

## Why I made this

Businesses spend real time and money creating original material: training resources, premium articles, research, course pages, designs, photographs, portfolios, reports, and proprietary methods. Once that material is published on a website, common browser actions can make casual copying feel effortless.

I created the Website Content Protector Kit to add a visible layer of protection around that work. It does not pretend that browser content can be made impossible to extract. Its purpose is practical: remove the easiest copying paths, communicate ownership clearly, and make misuse less convenient.

## What a business can achieve with it

- **Discourage casual content theft** by blocking common right-click, copy, cut, drag, save, print, and inspection actions.
- **Protect the perceived value of premium material** by making it clear that the content is proprietary rather than freely reusable.
- **Create a branded protection experience** with custom warning messages, business naming, and watermark text.
- **Reduce accidental sharing** by replacing familiar download and capture flows with an explicit warning or shield.
- **Reuse one protection standard across projects** instead of rebuilding the same browser controls for every website.
- **Choose the right balance for each audience** by turning individual restrictions on or off.

## What the visitor experiences

The protection layer runs quietly during normal browsing. When a visitor attempts a restricted action, the website explains why it was blocked. When the browser detects a common capture shortcut, window switch, or hidden tab, the page can blur and display a dark, watermarked shield.

The result should feel like a professional ownership notice—not a broken website.

## Good use cases

This kit is most useful for websites that publish valuable material directly in the browser, including:

- Online courses and educational resources
- Paid or members-only knowledge libraries
- Research, reports, frameworks, and premium articles
- Photography, design, architecture, and project portfolios
- Internal portals, demos, and client presentations
- Product documentation containing proprietary methods

## An honest security boundary

This kit is a **deterrent**, not digital-rights management and not a replacement for real access control.

Browser JavaScript cannot guarantee protection against operating-system screenshots, browser extensions, disabled JavaScript, network inspection, cached assets, automated browsers, or an external camera. A determined technical user may still retrieve content that has already been delivered to their browser.

For genuinely confidential or paid content, combine this kit with authentication, authorization, expiring signed URLs, server-side access rules, lower-resolution previews, and user-specific watermarking. The strongest protection is not sending the original asset to an unauthorized browser in the first place.

Also consider accessibility and legitimate visitor needs. Blocking selection, right-click, printing, and familiar shortcuts can interfere with assistive workflows. Enable only the restrictions that match the business risk and audience.

## What is included

This repository contains two implementations:

- `react/` — the recommended portable version. It uses ordinary CSS and inline SVG icons, requiring only React and React DOM.
- `original-econstruct/` — the original E-Construct implementation and its required CSS, retained as a reference for React + Tailwind projects using `lucide-react`.

## Quick installation

Copy the `react` folder into your project's `src` directory. Mount the component once near the top of the application and import its stylesheet:

```jsx
import ContentProtection from './content-protection/ContentProtection';
import './content-protection/content-protection.css';

export default function App() {
  return (
    <>
      <ContentProtection
        brandName="MY BUSINESS — PROTECTED CONTENT"
        watermarkText="MY BUSINESS • CONFIDENTIAL"
        clipboardReplacement="Protected Content — mybusiness.com"
      />
      {/* Your application */}
    </>
  );
}
```

The default protected application root is `#root`, which matches Vite. For a different root:

```jsx
<ContentProtection protectedRootSelector="#app" />
```

For Next.js App Router, mount it from a client component and use:

```jsx
<ContentProtection protectedRootSelector="#__next" />
```

Import `content-protection.css` from the global stylesheet or root layout.

## Protection features

- Blocks the browser context menu.
- Blocks dragging images, video, canvas, SVG, and links.
- Blocks copy and cut outside inputs and approved regions.
- Intercepts common save, print, view-source, developer-tools, Print Screen, and snipping shortcuts.
- Hides the document when printing.
- Applies a blackout and blur shield when the window loses focus or the tab becomes hidden.
- Shows branded warning messages and a configurable watermark curtain.
- Cleans up every listener and CSS class when unmounted.

Add `className="allow-select"` to any region where visitors should be allowed to select and copy text.

Every protection can be switched off individually with component props such as:

```jsx
<ContentProtection
  blockCopy={false}
  blockContextMenu={false}
  shieldOnWindowBlur={false}
/>
```

## Future direction

This repository is a foundation for stronger, business-ready protection. Useful future improvements include authenticated dynamic user watermarks, protected media delivery, signed URLs, access logging, membership integration, configurable policies, and accessibility-aware protection modes.

The goal is not to make impossible promises. The goal is to give businesses a clear, reusable protection layer and a practical path toward stronger server-side security when their content requires it.
