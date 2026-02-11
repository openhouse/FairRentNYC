import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  isLegacyEra: computed("era.renderMode", function () {
    return this.get("era.renderMode") === "legacy-2019";
  }),

  hasArtifacts: computed("era.artifacts.[]", function () {
    return (this.get("era.artifacts") || []).length > 0;
  }),
});
