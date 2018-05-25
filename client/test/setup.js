import jsdom from 'jsdom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.sendTo(console);
const { window } = new JSDOM('', { virtualConsole });
const { document } = window;
const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => delete store[key],
  };
};
const jQueryMock = {
  modal(action) {
    return action;
  },
};
const $ = () => jQueryMock;

global.$ = $;
global.alert = (msg) => { console.log(msg); };
global.scrollTo = () => {};
global.localStorage = mockLocalStorage();
global.window = window;
global.document = document;
global.setTimeout = (callback) => {
  callback();
};

