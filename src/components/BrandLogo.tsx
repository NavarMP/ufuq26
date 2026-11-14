import type { SVGProps } from 'react';

interface BrandLogoProps extends SVGProps<SVGSVGElement> {
  /** Use `inverse` when the logo sits on a fixed dark surface. */
  variant?: 'theme' | 'inverse';
  label?: string | null;
  priority?: boolean;
}

/**
 * Theme-aware inline version of the UFUQ emblem. Inline SVG lets its fills
 * inherit the active CSS color tokens, including the app's manually selected
 * theme (which an external SVG loaded through <img> cannot see).
 */
export default function BrandLogo({
  variant = 'theme',
  label = "UFUQ '26 logo",
  className,
  priority,
  ...props
}: BrandLogoProps) {
  const classes = [className, variant === 'inverse' ? 'brand-logo-inverse' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      {...props}
      viewBox="0 0 1080 1080"
      xmlns="http://www.w3.org/2000/svg"
      className={classes || undefined}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label && <title>{label}</title>}
      <g fill="var(--logo-ink)">
        <rect x="663.91" y="110.37" width="76.43" height="535" transform="translate(-61.55 607.16) rotate(-45)" />
        <path d="M702.13,485.96l-135.11,135.11,81.07,81.07-108.08,108.08-108.09-108.09,81.06-81.06-135.11-135.11-81.06,81.06-27.03-27.03,189.15-189.15,81.07,81.07,54.04-54.04-135.11-135.11-297.24,297.24,378.3,378.3,297.24-297.24-135.11-135.11ZM377.87,648.09l-27.02-27.02,27.02-27.02,27.02,27.02-27.02,27.02ZM702.13,648.1l-27.03-27.03,27.03-27.03,27.03,27.03-27.03,27.03Z" />
      </g>
      <g fill="var(--logo-teal)">
        <rect x="582.85" y="420.72" width="76.43" height="76.43" transform="translate(-142.61 573.58) rotate(-45)" />
        <rect x="501.79" y="501.79" width="76.43" height="76.43" transform="translate(-223.68 540) rotate(-45)" />
        <rect x="420.72" y="420.73" width="76.43" height="76.43" transform="translate(-190.1 458.94) rotate(-45)" />
      </g>
      <rect
        x="501.79"
        y="663.92"
        width="76.43"
        height="76.43"
        transform="translate(-338.32 587.49) rotate(-45)"
        fill="var(--logo-gold)"
      />
    </svg>
  );
}
