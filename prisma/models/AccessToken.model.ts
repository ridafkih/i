import { createModel }  from "schemix";

import CreatedUpdatedMixin from "../mixins/CreatedUpdated.mixin";
import UUIDMixin from "../mixins/UUID.mixin";

createModel((AccessTokenModel) => {
  AccessTokenModel
    .mixin(UUIDMixin)
    .string("argon2")
    .boolean("enabled", { default: false })
    .mixin(CreatedUpdatedMixin);
});
