import DS from "ember-data";
const { Model, attr } = DS;
import { computed } from "@ember/object";
import { isPresent } from "@ember/utils";
import { notEmpty } from "@ember/object/computed";

export default Model.extend({
  // ATTRIBUTES
  order: attr(),
  url: attr(),
  outlet: attr(),
  text: attr(),
  title: attr(),
  featured: attr(),
  active: attr(),
  hasLogo: attr(),

  /*
  COMPUTED PROPERTIES
  */

  isActive: notEmpty("active"),
  isFeatured: notEmpty("featured"),

  logo: computed("id", "hasLogo", function() {
    if (isPresent(this.get("hasLogo"))) {
      return `/s/logos/press/color--ao/${this.get("id")}.png`;
    }

    return null;
  })
});
