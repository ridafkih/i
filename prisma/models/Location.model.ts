import { createModel } from "schemix";
import CreatedUpdatedMixin from "../mixins/CreatedUpdated.mixin";
import UUIDMixin from "../mixins/UUID.mixin";

export default createModel((LocationModel) => {
  LocationModel
    .mixin(UUIDMixin)
    .string("url")
    .string("city")
    .string("region")
    .float("longitude")
    .float("latitude")
    .mixin(CreatedUpdatedMixin);
});