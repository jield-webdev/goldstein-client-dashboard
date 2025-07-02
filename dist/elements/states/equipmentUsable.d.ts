import React from "react";
interface EquipmentUsableProps {
    userName: string;
    userID: number;
    badgeUUID: string;
    clientAssociation: string;
    timeLeft: number;
}
export default function EquipmentUsable({ userName, userID, badgeUUID, clientAssociation, timeLeft, }: EquipmentUsableProps): React.JSX.Element;
export {};
