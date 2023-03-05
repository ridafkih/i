import { createMixin } from "schemix";

export default createMixin((CreatedUpdatedMixin) => {
  CreatedUpdatedMixin
    .dateTime("createdAt", { default: { now: true } })
    .dateTime("updatedAt", { updatedAt: true });
});
