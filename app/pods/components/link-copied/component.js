import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  notifications: service('toast'),

  actions: {
    copyLink() {
      let notifications = this.get('notifications');
      notifications.success('&#x1f517; Link Copied to Clipboard');
    },
  },
});
