import { CSSInterpolation } from '@emotion/serialize'

/** Convenience alias for customCss props */
export type TwinCSS = CSSInterpolation

/**
 * Convenience type mix-in for customCss props
 *
 * Additional styles in any Twin format (css, tw, style object, array)
 * */
export type CustomCssProps = {
  customCss?: TwinCSS
}
