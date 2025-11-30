import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig, presetIcons, presetUno } from 'unocss'
import { themeOverrides } from './configs/theme'

export default defineConfig({
  shortcuts: [
    ['center', 'flex justify-center items-center'],
    [/^size(\d+)$/, ([, c]) => `w${c} h${c}`],
  ],
  rules: [[/^flex-([.\d]+)$/, ([_, num]) => ({ flex: `${num}` })]],
  theme: {
    colors: {
      primary: themeOverrides.common.primaryColor,
      hover: {
        primary: themeOverrides.common.primaryColorHover,
        error: themeOverrides.common.errorColorHover,
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetRemToPx({ baseFontSize: 4 }),
  ],
})
