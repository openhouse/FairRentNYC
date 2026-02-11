import Component from "@ember/component";
import { computed } from "@ember/object";
import TIMELINE_ERAS from "fairrentnyc/data/timeline";

export default Component.extend({
  timelineEras: TIMELINE_ERAS,

  presentEra: computed("timelineEras.[]", function () {
    return this.get("timelineEras").findBy("isPresentEra", true);
  }),

  archivedEras: computed("timelineEras.[]", function () {
    return this.get("timelineEras").filter((era) => !era.isPresentEra);
  }),
});
