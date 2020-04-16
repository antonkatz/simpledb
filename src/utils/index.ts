// @ts-nocheck
export const IS_BROWSER = typeof process === 'undefined' ||
                          process.type === 'renderer' ||
                          process.browser === true ||
                          process.__nwjs;

export * from './debugUtils'
