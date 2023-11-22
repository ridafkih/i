import { createModel } from "schemix"
import UUIDMixin from "../mixins/UUID.mixin"
import CreatedUpdatedMixin from "../mixins/CreatedUpdated.mixin"

export default createModel((SpotifyKeyModel) => {
  SpotifyKeyModel
    .mixin(UUIDMixin)
    .string("refresh_token")
    .string("access_token")
    .string("code")
    .dateTime("expiresIn")
    .mixin(CreatedUpdatedMixin)
})