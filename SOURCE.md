# Source record

The original implementation was extracted read-only from:

- Repository: `OsirisMedici/e-construct.in`
- Branch: `review/freelancer-sync-through-2026-08-30`
- Commit: `375053c5f9e8e253842e65c8acb0801be117fe45`
- Component: `src/components/ContentProtection.jsx`
- Global rules: `src/index.css`, lines containing selection, drag, print, and `screen-protected` behavior
- Mount point: `src/App.jsx` immediately inside `AdminProvider`

The `original-econstruct` folder preserves the extracted component and the required CSS rules. Its CSS also defines the `fadeIn` keyframe referenced by the component but missing from the source stylesheet. The `react` folder is a portable adaptation with configurable wording, no Tailwind dependency, no icon dependency, stable event listeners, and a portal-based shield that sits outside the blurred application root.

No source repository files or deployments were changed while creating this kit.
