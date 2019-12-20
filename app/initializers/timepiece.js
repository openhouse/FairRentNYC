export function initialize(/* application */) {
  const app = arguments[1] || arguments[0];
  app.inject('controller', 'timepiece', 'service:timepiece');
  app.inject('component', 'timepiece', 'service:timepiece');
}

export default {
  name: 'timepiece',
  initialize: initialize,
};
