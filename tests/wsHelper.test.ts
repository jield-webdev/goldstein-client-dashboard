import {
    isWSPackage,
    sendWsMessage,
    dataListener,
    ClientToServerMessage,
    ServerToClientMessage,
    WSPackage,
} from '../src/core/wsHelper';

describe('isWSPackage', () => {
    it('should return true for valid WSPackage', () => {
        const pkg = { package_type: 1, payload: '{"key":"value"}' };
        expect(isWSPackage(pkg)).toBe(true);
    });

    it('should return false for invalid WSPackage', () => {
        expect(isWSPackage(null)).toBe(false);
        expect(isWSPackage({})).toBe(false);
        expect(isWSPackage({ package_type: '1', payload: 123 })).toBe(false);
    });
});

describe('sendWsMessage', () => {
    it('should call ws.send with JSON string', () => {
        const ws = { send: jest.fn() } as any;
        const message: WSPackage = {
            package_type: ClientToServerMessage.CONNECT,
            payload: '{"key":"abc"}'
        };
        sendWsMessage(ws, message);
        expect(ws.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should log error if ws.send throws', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const ws = {
            send: () => {
                throw new Error("send failed");
            }
        } as any;
        sendWsMessage(ws, { package_type: 1, payload: 'data' });
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
    });
});

describe('dataListener', () => {
    const readDataHandler = jest.fn();

    beforeEach(() => {
        readDataHandler.mockClear();
    });

    it('should handle valid READED_DATA message', () => {
        const event = {
            data: JSON.stringify({
                package_type: ServerToClientMessage.READED_DATA,
                payload: JSON.stringify({
                    notifications_list: {
                        id: 1,
                        association_item: "equipment",
                        association_id: 42,
                        time: "2023-01-01T00:00:00Z",
                        message_type: 1,
                        message: "Hello"
                    }
                })
            })
        };

        dataListener(event, readDataHandler);
        expect(readDataHandler).toHaveBeenCalled();
    });

    it('should handle invalid JSON data', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const event = { data: "not json" };
        dataListener(event, readDataHandler);
        expect(consoleError).toHaveBeenCalledWith("Error parsing ws package");
        expect(readDataHandler).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('should handle invalid WSPackage', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const event = { data: JSON.stringify({ not_package_type: 1 }) };
        dataListener(event, readDataHandler);
        expect(consoleError).toHaveBeenCalled();
        expect(readDataHandler).not.toHaveBeenCalled();
        consoleError.mockRestore();
    });

    it('should handle unsupported message type', () => {
        const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
        const event = {
            data: JSON.stringify({ package_type: 999, payload: '{}' })
        };
        dataListener(event, readDataHandler);
        expect(consoleLog).toHaveBeenCalledWith("Received unsuported message from ws server");
        expect(readDataHandler).not.toHaveBeenCalled();
        consoleLog.mockRestore();
    });
});
