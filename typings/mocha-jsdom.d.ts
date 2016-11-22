// Thanks eschwartz https://github.com/eschwartz/FormTypes/blob/master/typings/mocha-jsdom/mocha-jsdom.d.ts

interface jsdom {
  ():void;
}

declare module 'mocha-jsdom' {
  export = jsdom;
}