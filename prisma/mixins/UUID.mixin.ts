import { createMixin } from "schemix";

export default createMixin((UUIDMixin) => {
  UUIDMixin
    .string("id", { default: { uuid: true }, id: true });
});
