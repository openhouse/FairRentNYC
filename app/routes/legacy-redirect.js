import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

const ASSET_PREFIXES = ['/assets/', '/images/', '/s/', '/.well-known/'];
const FILE_EXT_RE = /\.[a-z0-9]+$/i;

export default Route.extend({
  fastboot: service(),

  beforeModel() {
    if (this.get('fastboot.isFastBoot')) {
      const requestPath = this.get('fastboot.request.path') || '';
      const isAssetLike =
        ASSET_PREFIXES.some((prefix) => requestPath.startsWith(prefix)) ||
        FILE_EXT_RE.test(requestPath);

      if (isAssetLike) {
        this.set('fastboot.response.statusCode', 404);
        return;
      }

      this.get('fastboot.response.headers').set('location', '/');
      this.set('fastboot.response.statusCode', 301);
      return;
    }

    window.location.replace('/');
  }
});
