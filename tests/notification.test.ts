import { AssociationEnum, getClientsStatus, NotificationEntry, Status } from "../src/core/notifications";

describe('getClientsStatus', () => {
    it('only connected equipment', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:05:35Z"), 1, 100);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CLIENT_CONNECTED,
            timestamp: new Date("2025-05-22T13:04:32Z"),
            message: {
                badgeUUID: '',
                userID: 0,
                usable: false,
            },
        });
    });

    it('empty list of notifications', () => {
        const notifications: NotificationEntry[] = [];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:05:35Z"), 1, 100);
        expect(result.size).toBe(0);
    });

    it('expired notification ttl but not login ttl', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:30Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":1}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 1, 1000000);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.USER_AUTHENTICATED,
            timestamp: new Date("2025-05-22T13:04:30Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 1,
                usable: true,
            },
        });
    }); 

    it('not usable login after login usable', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:30Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":1}`
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"not_authorized","usable_status":0}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 1000, 1000000);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.USER_AUTHENTICATED,
            timestamp: new Date("2025-05-22T13:04:30Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 1,
                usable: true,
            },
        });
    }); 

    it('only one client card readed', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"62f9470a9000"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T13:04:33Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 0,
                usable: false,
            },
        });
    });

    it('wrong payload', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.CARD_READED,
                message: `asdjfhlasd`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(0);
    });

    it('only one wrong payload', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.CARD_READED,
                message: `asdjfhlasd`
            }, {
                id: 2,
                association_item: AssociationEnum.NOT_SET,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"62f9470a9000"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
    });

    it('only one client card user log authorized', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":1}`
            },
            {
                id: 3,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:34Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"62f9470a9000"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.USER_AUTHENTICATED,
            timestamp: new Date("2025-05-22T13:04:33Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 1,
                usable: true,
            },
        });
    });

    it('only one client card user log authorized with ttl expired', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:49:33Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:50:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":1}`
            },
            {
                id: 3,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:34Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"62f9470a9000"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T13:04:34Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 0,
                usable: false,
            },
        });
    });

    it('only one client card user not authorized', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":0}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.USER_AUTHENTICATED,
            timestamp: new Date("2025-05-22T13:04:33Z"),
            message: {
                badgeUUID: '62f9470a9000',
                userID: 1,
                usable: false,
            },
        });
    });

    it('only one client card user not authorized and more message', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:32Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":1,"badge_uuid":"62f9470a9000","usable_status":0}`
            },
            {
                id: 3,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:34Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"1234alskdjfh"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T13:04:34Z"),
            message: {
                badgeUUID: '1234alskdjfh',
                userID: 0,
                usable: false,
            },
        });
    });

    it('non notifications', () => {
        const notifications: NotificationEntry[] = [];
        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:35Z"), 360, 360);
        expect(result.size).toBe(0);
    });

    it('more than one client', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T10:00:00Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"aaa"}`
            },
            {
                id: 2,
                association_item: AssociationEnum.NOT_SET,
                association_id: 2,
                timestamp: "2025-05-22T10:00:01Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"bbb"}`
            }
        ];
        const result = getClientsStatus(notifications, new Date("2025-05-22T10:00:05Z"), 360, 360);
        expect(result.size).toBe(2);
        expect(result.get("equipment:1")).toMatchObject({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T10:00:00Z"),
            message: { badgeUUID: 'aaa' }
        });
        expect(result.get("not_set:2")).toMatchObject({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T10:00:01Z"),
            message: { badgeUUID: 'bbb' }
        });
    });

    it('with disconnect', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T11:00:00Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"xyz"}`
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T11:00:05Z",
                message_type: Status.CLIENT_DISCONNECTED,
                message: ""
            }
        ];
        const result = getClientsStatus(notifications, new Date("2025-05-22T11:00:10Z"), 360, 360);
        expect(result.size).toBe(0);
    });

    it('disconnect and reconnect', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:00:00Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ""
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:00:05Z",
                message_type: Status.CLIENT_DISCONNECTED,
                message: ""
            },
            {
                id: 3,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:00:10Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"reconnect"}`
            }
        ];
        const result = getClientsStatus(notifications, new Date("2025-05-22T12:00:15Z"), 360, 360);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CARD_READED,
            timestamp: new Date("2025-05-22T12:00:10Z"),
            message: {
                badgeUUID: 'reconnect',
                userID: 0,
                usable: false,
            }
        });
    });

    it('expired ttl', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:00:00Z",
                message_type: Status.CLIENT_CONNECTED,
                message: ``
            },
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T12:00:01Z",
                message_type: Status.CARD_READED,
                message: `{"badge_uuid":"old"}`
            }
        ];

        const result = getClientsStatus(notifications, new Date("2025-05-22T12:10:01Z"), 1, 1);
        expect(result.size).toBe(1);
        expect(result.get("equipment:1")).toEqual({
            status: Status.CLIENT_CONNECTED,
            timestamp: new Date("2025-05-22T12:00:00Z"),
            message: {
                badgeUUID: '',
                userID: 0,
                usable: false,
            },
        });
    });

    it('multiple USER_AUTHENTICATED entries for same client', () => {
        const notifications: NotificationEntry[] = [
            {
                id: 1,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:30Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":2,"badge_uuid":"old","usable_status":1}`
            },
            {
                id: 2,
                association_item: AssociationEnum.EQUIPMENT,
                association_id: 1,
                timestamp: "2025-05-22T13:04:33Z",
                message_type: Status.USER_AUTHENTICATED,
                message: `{"association_item":"equipment","association_id":1,"user_id":3,"badge_uuid":"new","usable_status":1}`
            }
        ];
        const result = getClientsStatus(notifications, new Date("2025-05-22T13:04:34Z"), 360, 360);
        expect(result.get("equipment:1")).toEqual({
            status: Status.USER_AUTHENTICATED,
            timestamp: new Date("2025-05-22T13:04:33Z"),
            message: {
                badgeUUID: 'new',
                userID: 3,
                usable: true,
            }
        });
    });
});

