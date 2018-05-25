// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  globals: {
    vue: true,
    wx: true,
    CKEDITOR: true
  },
  extends: "standard",
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "indent": [2, 2, { "SwitchCase": 1,"VariableDeclarator": 2 }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
