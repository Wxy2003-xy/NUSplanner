module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'src/test',
    'src/util/unused',
    'src/data/fetchModuleInfo.tsx',
    'src/pages/map/components/MapComponent.tsx',
    'src/pages/studyPlan/components/CustomToolTip.tsx',
    'src/pages/studyPlan/components/program.tsx',
    'src/pages/timetable/components/useFetchTimeSlotInfo.ts',
    'src/util/icsParser.ts',
    'src/util/parser.ts',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
