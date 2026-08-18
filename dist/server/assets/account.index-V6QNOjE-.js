import { Navigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/account.index.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsx(Navigate, {
	to: "/account/profile",
	replace: true
});
//#endregion
export { SplitComponent as component };
