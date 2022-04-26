import React from "react";
import { NotificationProps } from "../types";
interface ApplicationProps {
    notification: NotificationProps;
    setNotification: (not: NotificationProps) => void;
    showCreatedAdd: boolean;
    setShowCreatedAdd: (val: boolean) => void;
}
export declare const AppContext: React.Context<ApplicationProps>;
export {};
//# sourceMappingURL=AppContext.d.ts.map