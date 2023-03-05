import { createModel }  from "schemix";

import CreatedUpdatedMixin from "../mixins/CreatedUpdated.mixin";
import UUIDMixin from "../mixins/UUID.mixin";

createModel((APIKeyModel) => {
  APIKeyModel
    .mixin(UUIDMixin)
    .string("argon2")
    .mixin(CreatedUpdatedMixin);
});
