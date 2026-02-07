import Component from '@ember/component';
import { computed } from '@ember/object';
import config from 'fairrentnyc/config/environment';

export default Component.extend({
  mailchimpActionUrl: config.mailchimp.actionUrl,
  mailchimpU: config.mailchimp.u,
  mailchimpId: config.mailchimp.id,
  mailchimpBotFieldName: config.mailchimp.botFieldName,
  mailchimpFallbackUrl: config.mailchimp.fallbackUrl,
  mailchimpSuccessMessage: config.mailchimp.successMessage,
  mailchimpMissingMessage:
    'Email signups are being updated. Please check back soon.',
  isMailchimpConfigured: computed(
    'mailchimpActionUrl',
    'mailchimpBotFieldName',
    function() {
      return (
        Boolean(this.get('mailchimpActionUrl')) &&
        Boolean(this.get('mailchimpBotFieldName'))
      );
    }
  )
});
