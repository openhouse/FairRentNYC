import { bool } from '@ember/object/computed';
import { run } from '@ember/runloop';
import Service from '@ember/service';

/**
  ## TimepieceService
  The timepiece service is injected into all controllers and components.  The timepiece
  synchronizes to the local host's system timepiece and can be used to display the
  time or to update time sensitive properties.
  To use the timepiece in a template or in computed properties, bind to the timepiece's
  `hour`, `minute`, or `second` properties.
  In templates:
  ```
  {{timepiece.hour}}
  {{timepiece.minute}}
  {{timepiece.second}}
  ```
  In computed properties:
  ```
  property: Ember.computed('timepiece.second', function () {
    // this will update every second
  })
  ```
  @class TimepieceService
  @namespace EmberTimepiece
*/
export default Service.extend({

  /**
    @property hour
    @type {Integer}
  */
  hour: null,

  /**
    @property minute
    @type {Integer}
  */
  minute: null,

  /**
   @property second
   @type {Integer}
 */
  second: null,

  /**
    Stores the next tick, so that it can be cancelled and the timepiece stopped.
    @property nextTick
    @type {Object}
    @private
  */
  nextTick: null,

  /**
    @property isTicking
    @type {Boolean}
    @readonly
    @private
  */
  isTicking: bool('nextTick'),

  /**
    Call `start()`
    @method init
    @private
  */
  init() {
    this._super(...arguments);
    this.start();
  },

  /**
    Start the timepiece
    @method start
    @private
  */
  start() {
    this.tick();
  },

  /**
    Stop the timepiece
    @method stop
    @private
  */
  stop() {
    run.cancel(this.get('nextTick'));
    this.set('nextTick', null);
  },

  /**
    Set the time to the current time.
    @method setTime
    @private
  */
  setTime() {
    let now = new Date();
    this.setProperties({
      second: now.getSeconds(),
      minute: now.getMinutes(),
      hour:   now.getHours(),
    });
  },

  /**
    Ticks the timepiece
    @method tick
    @private
  */
  tick() {
    this.setTime();
    if (this.get('disabled')) {
      return;
    }

    this.set('nextTick', run.later(this, this.tick, 1000));
  },

  /**
    call `stop()`
    @event willDestroy
    @private
  */
  willDestroy() {
    this.stop();
  },
});
