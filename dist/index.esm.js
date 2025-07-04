import * as React from 'react';
import React__default, { createContext, useState, useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueries } from '@tanstack/react-query';

var GoldsteinDataContext = createContext(undefined);
function GoldsteinDataProvider(_a) {
    var children = _a.children, defaultData = _a.defaultData;
    var _b = useState(defaultData), goldsteinData = _b[0], setGoldsteinData = _b[1];
    return (React__default.createElement(GoldsteinDataContext.Provider, { value: { goldsteinData: goldsteinData, setGoldsteinData: setGoldsteinData } }, children));
}
var useGoldsteinClientDataContext = function () {
    var context = useContext(GoldsteinDataContext);
    if (context === undefined) {
        throw new Error('useAssociationContext must be used within an AssociationProvider');
    }
    return context;
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var ClientToServerMessage;
(function (ClientToServerMessage) {
    ClientToServerMessage[ClientToServerMessage["CONNECT"] = 1] = "CONNECT";
    ClientToServerMessage[ClientToServerMessage["GET_DATA"] = 3] = "GET_DATA";
    ClientToServerMessage[ClientToServerMessage["UPDATE_LISENING_DATA"] = 5] = "UPDATE_LISENING_DATA";
})(ClientToServerMessage || (ClientToServerMessage = {}));
var ServerToClientMessage;
(function (ServerToClientMessage) {
    ServerToClientMessage[ServerToClientMessage["CONNECTION_RESPONSE"] = 2] = "CONNECTION_RESPONSE";
    ServerToClientMessage[ServerToClientMessage["READED_DATA"] = 4] = "READED_DATA";
})(ServerToClientMessage || (ServerToClientMessage = {}));
function isWSPackage(data) {
    return (typeof data === "object" &&
        data !== null &&
        typeof data.package_type === "number" &&
        typeof data.payload === "string");
}
function sendWsMessage(ws, msg) {
    if (!ws) {
        console.log("Trying to send message to null ws");
        return;
    }
    var pkg = JSON.stringify(msg);
    try {
        ws.send(pkg);
    }
    catch (err) {
        console.error(err);
    }
}
function dataListener(event, readDataHandler) {
    var data;
    try {
        data = JSON.parse(event.data);
    }
    catch (_a) {
        console.error("Error parsing ws package");
        return;
    }
    if (!isWSPackage(data)) {
        console.error("Data is not a ws package: " + data);
        return;
    }
    switch (data.package_type) {
        case ServerToClientMessage.READED_DATA:
            var readedData = void 0;
            try {
                readedData = JSON.parse(data.payload);
            }
            catch (error) {
                console.error("Error parsing ws payload: " + error);
                return;
            }
            readDataHandler(readedData);
            break;
        default:
            console.log("Received unsuported message from ws server");
            break;
    }
}
function getWebSocket(serverUrl, apiKey) {
    return new Promise(function (resolve, reject) {
        var ws = new WebSocket(serverUrl);
        ws.onerror = reject;
        ws.onopen = function () {
            // Send the initial CONNECT message
            sendWsMessage(ws, {
                package_type: ClientToServerMessage.CONNECT,
                payload: JSON.stringify({ key: apiKey }),
            });
            // Wait for the handshake response message from server
            ws.addEventListener('message', function handler(event) {
                ws.removeEventListener('message', handler);
                try {
                    // Parse the handshake response from server
                    var response = JSON.parse(event.data);
                    var payload = JSON.parse(response.payload);
                    if (payload.authorized) {
                        resolve(ws);
                    }
                    else {
                        reject();
                    }
                }
                catch (err) {
                    reject(new Error("Failed to parse handshake response: " + err));
                }
            });
        };
    });
}

var AssociationEnum;
(function (AssociationEnum) {
    AssociationEnum["NOT_SET"] = "not_set";
    AssociationEnum["EQUIPMENT"] = "equipment";
})(AssociationEnum || (AssociationEnum = {}));
var Status;
(function (Status) {
    Status[Status["CLIENT_CONNECTED"] = 1] = "CLIENT_CONNECTED";
    Status[Status["CARD_READED"] = 2] = "CARD_READED";
    Status[Status["USER_AUTHENTICATED"] = 3] = "USER_AUTHENTICATED";
    Status[Status["CLIENT_DISCONNECTED"] = 4] = "CLIENT_DISCONNECTED";
})(Status || (Status = {}));
/**
 * With a Notification[] creates a map of the clients' statuses.
 * Returns the latest notification of each client.
 * If there is a notification with status 'Disconnect', delete it.
 * If the notification TTL has expired, create the entry without a status.
 * If there is a user authenticated with `usable = true`, use the loginTTL and overwrite future notifications.
 *
 * @param {NotificationEntry[]} notifications - Array of notifications from clients.
 * @param {Date} currentTime - The current time in format
 * @param {number} notificationsTTL - Time-to-live for notifications, in seconds.
 * @param {number} loginTTL - TTL for login-based notifications, in seconds.
 * @returns {Map<string, ClientStatus>} A map of client identifiers to their latest status.
 */
function getClientsStatus(notifications, currentTime, notificationsTTL, loginTTL) {
    var map = new Map();
    if (!notifications) {
        return map;
    }
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var key = "".concat(notif.association_item, ":").concat(notif.association_id);
        var status_1 = generateStatus(map.get(key), notif, currentTime, notificationsTTL, loginTTL);
        if (status_1 !== null)
            map.set(key, status_1);
        else
            map.delete(key);
    }
    return map;
}
function isUserAuthenticatedPayload(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj.user_id === 'number' &&
        typeof obj.badge_uuid === 'string' &&
        typeof obj.usable_status === 'number');
}
function isBadgeDetectedPayload(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        typeof obj.badge_uuid === 'string' &&
        (Object.keys(obj).length === 1) // Ensure it’s only a BadgeDetectedPayload
    );
}
function createEmptyStatus(timestamp) {
    return {
        status: Status.CLIENT_CONNECTED,
        timestamp: timestamp,
        message: {
            badgeUUID: "",
            userID: 0,
            usable: false
        }
    };
}
function generateMessageFromNotification(payload) {
    var parsedPayload;
    try {
        parsedPayload = JSON.parse(payload);
    }
    catch (_a) {
        return {
            badgeUUID: "",
            userID: 0,
            usable: false
        };
    }
    if (isUserAuthenticatedPayload(parsedPayload)) {
        return {
            badgeUUID: parsedPayload.badge_uuid,
            userID: parsedPayload.user_id,
            usable: parsedPayload.usable_status === 1
        };
    }
    if (isBadgeDetectedPayload(parsedPayload)) {
        return {
            badgeUUID: parsedPayload.badge_uuid,
            userID: 0,
            usable: false
        };
    }
    console.error("Received invalid notification payload: " + payload);
    return {
        badgeUUID: "",
        userID: 0,
        usable: false
    };
}
function generateStatus(oldStatus, newNotification, currentTime, notificationsTTL, loginTTL) {
    var status;
    if (typeof oldStatus === "object")
        status = createEmptyStatus(oldStatus.timestamp);
    else
        status = createEmptyStatus(new Date(newNotification.timestamp));
    if (typeof oldStatus === "object" &&
        oldStatus.status === Status.USER_AUTHENTICATED &&
        oldStatus.timestamp.getTime() >= currentTime.getTime() - loginTTL * 1000 &&
        oldStatus.message.usable === true) {
        // Parse the new message to see if it's a usable login
        var parsedMessage = generateMessageFromNotification(newNotification.message);
        if (!parsedMessage.usable) {
            return oldStatus;
        }
    }
    var notifTime = new Date(newNotification.timestamp);
    if (newNotification.message_type === Status.USER_AUTHENTICATED && notifTime.getTime() >= currentTime.getTime() - loginTTL * 1000) {
        var message = generateMessageFromNotification(newNotification.message);
        if (message.badgeUUID === "") {
            return null;
        }
        if (message.usable) {
            return {
                status: newNotification.message_type,
                timestamp: new Date(newNotification.timestamp),
                message: message
            };
        }
        else if (notifTime.getTime() >= currentTime.getTime() - notificationsTTL * 1000) {
            return {
                status: newNotification.message_type,
                timestamp: new Date(newNotification.timestamp),
                message: message
            };
        }
    }
    if (newNotification.message_type === Status.CARD_READED && notifTime.getTime() >= currentTime.getTime() - notificationsTTL * 1000) {
        var message = generateMessageFromNotification(newNotification.message);
        if (message.badgeUUID === "") {
            return null;
        }
        return {
            status: newNotification.message_type,
            timestamp: new Date(newNotification.timestamp),
            message: message
        };
    }
    if (newNotification.message_type === Status.CLIENT_DISCONNECTED) {
        return null;
    }
    return status;
}

function ServerError() {
    return (React__default.createElement("div", { className: "text-center" },
        React__default.createElement("div", { className: "alert alert-danger mb-4", role: "alert" },
            React__default.createElement("h1", { className: "h4 alert-heading" }, "Server Error"),
            React__default.createElement("hr", null),
            React__default.createElement("p", { className: "mb-0" }, "Unable to connect to the server. Please check your connection and try again.")),
        React__default.createElement("div", { className: "d-grid gap-2 col-6 mx-auto" },
            React__default.createElement("button", { className: "btn btn-outline-secondary", type: "button", onClick: function () { return window.location.reload(); } }, "Refresh Page"))));
}

function WaitingCardDetection() {
    return (React__default.createElement("div", { className: "text-center" },
        React__default.createElement("h1", { className: "display-4 mb-3" }, "Waiting for card detection"),
        React__default.createElement("div", { className: "spinner-border text-primary", role: "status" },
            React__default.createElement("span", { className: "visually-hidden" }, "Loading..."))));
}

function registerBadge(serverURL, badgeUID) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, _a, _b, _c, respText;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    url = serverURL + "/api/register-badge";
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            body: JSON.stringify({
                                badge_uid: badgeUID,
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })];
                case 1:
                    response = _d.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    _c = (_b = "Response status: ".concat(response.status, " with body: ")).concat;
                    return [4 /*yield*/, response.text()];
                case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_d.sent()])]))();
                case 3: return [4 /*yield*/, response.text()];
                case 4:
                    respText = _d.sent();
                    return [2 /*return*/, respText];
            }
        });
    });
}

function NoUserInCard(_a) {
    var _this = this;
    var badgeUID = _a.badgeUID;
    var _b = useState(undefined), onboardingWord = _b[0], setOnboardingWord = _b[1];
    var goldsteinData = useGoldsteinClientDataContext().goldsteinData;
    var registerBadgeHelper = function () { return __awaiter(_this, void 0, void 0, function () {
        var rawOnboardingWord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, registerBadge("https://" + goldsteinData.goldsteinFQDN, JSON.parse(badgeUID).badge_uuid)];
                case 1:
                    rawOnboardingWord = _a.sent();
                    setOnboardingWord(JSON.parse(rawOnboardingWord).onboarding_word);
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        setOnboardingWord(undefined);
    }, [badgeUID]);
    return (React__default.createElement("div", { className: "text-center" },
        React__default.createElement("div", { className: "alert alert-warning mb-4", role: "alert" },
            React__default.createElement("h1", { className: "h4 alert-heading" }, "No user is registered in the card")),
        React__default.createElement("div", { className: "card mb-3" },
            React__default.createElement("div", { className: "card-header bg-light-subtle" }, "Card Information"),
            React__default.createElement("div", { className: "card-body" },
                React__default.createElement("p", { className: "card-text" },
                    React__default.createElement("strong", null, "Badge UUID:"),
                    " ",
                    React__default.createElement("code", null, badgeUID)),
                onboardingWord && (React__default.createElement("p", { className: "card-text" },
                    React__default.createElement("strong", null, "Your secret word:"),
                    " ",
                    React__default.createElement("code", null, onboardingWord))))),
        React__default.createElement("button", { type: "button", className: "btn btn-primary", onClick: registerBadgeHelper }, "Register badge")));
}

function UserNotAuthorized(_a) {
    var userName = _a.userName, badgeUUID = _a.badgeUUID;
    return (React__default.createElement("div", { className: "text-center" },
        React__default.createElement("div", { className: "alert alert-danger mb-4", role: "alert" },
            React__default.createElement("h1", { className: "h4 alert-heading" }, "This user cannot use the equipment"),
            React__default.createElement("hr", null),
            React__default.createElement("p", { className: "mb-0" }, "Access denied due to insufficient permissions")),
        React__default.createElement("div", { className: "card mb-3" },
            React__default.createElement("div", { className: "card-header bg-light-sublte" }, "User Information"),
            React__default.createElement("ul", { className: "list-group list-group-flush" },
                React__default.createElement("li", { className: "list-group-item d-flex justify-content-between align-items-center" },
                    React__default.createElement("span", null, "User:"),
                    React__default.createElement("span", { className: "badge bg-secondary" }, userName)),
                React__default.createElement("li", { className: "list-group-item d-flex justify-content-between align-items-center" },
                    React__default.createElement("span", null, "Badge UUID:"),
                    React__default.createElement("code", null, badgeUUID))))));
}

function parseAssociation(assoc) {
    var _a = assoc.split(":"), type = _a[0], idStr = _a[1];
    if (!type || !idStr) {
        throw new Error("Invalid association format: \"".concat(assoc, "\""));
    }
    var id = parseInt(idStr, 10);
    if (isNaN(id)) {
        throw new Error("Invalid ID part in association: \"".concat(idStr, "\""));
    }
    return [type, id];
}

function listEquipmentModules(serverEndpoint, equipmentID) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, resp, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://".concat(serverEndpoint, "/api/onelab/list/equipment/module/").concat(equipmentID);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    resp = _a.sent();
                    data = resp._embedded.items;
                    return [2 /*return*/, data];
            }
        });
    });
}

function listStatusOptions(serverEndpoint) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "https://".concat(serverEndpoint, "/api/onelab/list/equipment/status");
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch status options: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data._embedded.items];
            }
        });
    });
}

// Create a client
var queryClient = new QueryClient();
// Wrapper component that provides QueryClientProvider
function UpdateStatusWrapper(props) {
    return (React__default.createElement(QueryClientProvider, { client: queryClient },
        React__default.createElement(UpdateStatus, __assign({}, props))));
}
function UpdateStatus(_a) {
    var _this = this;
    var _b, _c;
    var userID = _a.userID, equipmentID = _a.equipmentID;
    var _d = useState(null), selectedModuleId = _d[0], setSelectedModuleId = _d[1];
    var _e = useState(null), statusId = _e[0], setStatusId = _e[1];
    var _f = useState(""), description = _f[0], setDescription = _f[1];
    var _g = useState([]), statusOptions = _g[0], setStatusOptions = _g[1];
    var _h = useState(false), submitting = _h[0], setSubmitting = _h[1];
    var goldsteinData = useGoldsteinClientDataContext().goldsteinData;
    var queries = useQueries({
        queries: [
            {
                queryKey: ["status", "options"],
                queryFn: function () { return listStatusOptions(goldsteinData.goldsteinFQDN); },
            },
            {
                queryKey: ["equipment", "modules", equipmentID],
                queryFn: function () { return listEquipmentModules(goldsteinData.goldsteinFQDN, equipmentID); },
            },
        ],
    });
    var isLoading = queries.some(function (query) { return query.isLoading; });
    var dataAvailable = queries.every(function (query) { return query.isSuccess; });
    var statusOptionsQuery = queries[0], equipmentModulesQuery = queries[1];
    // Set status options when available
    useEffect(function () {
        if (statusOptionsQuery.isSuccess) {
            setStatusOptions(statusOptionsQuery.data || []);
        }
    }, [statusOptionsQuery.isSuccess, statusOptionsQuery.data]);
    // Initialize module selection and form state
    useEffect(function () {
        var _a, _b;
        if (dataAvailable && equipmentModulesQuery.data) {
            var modules = equipmentModulesQuery.data;
            // Reset if no modules available
            if (modules.length === 0) {
                setSelectedModuleId(null);
                setStatusId(null);
                setDescription("");
                return;
            }
            // Initialize with main tool module or first module
            var initialModule = modules.find(function (m) { return m.type.is_main_tool; }) || modules[0];
            setSelectedModuleId(initialModule.id);
            setStatusId(((_a = initialModule.latest_module_status) === null || _a === void 0 ? void 0 : _a.status.id) || null);
            setDescription(((_b = initialModule.latest_module_status) === null || _b === void 0 ? void 0 : _b.description) || "");
        }
    }, [dataAvailable, equipmentModulesQuery.data]);
    // Update form when selected module changes
    useEffect(function () {
        var _a, _b;
        if (selectedModuleId && equipmentModulesQuery.data) {
            var module_1 = equipmentModulesQuery.data.find(function (m) { return m.id === selectedModuleId; });
            if (module_1) {
                setStatusId(((_a = module_1.latest_module_status) === null || _a === void 0 ? void 0 : _a.status.id) || null);
                setDescription(((_b = module_1.latest_module_status) === null || _b === void 0 ? void 0 : _b.description) || "");
            }
        }
    }, [selectedModuleId, equipmentModulesQuery.data]);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, errorData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedModuleId) {
                        alert("Please select a module");
                        return [2 /*return*/];
                    }
                    if (statusId === null) {
                        alert("Please select a status");
                        return [2 /*return*/];
                    }
                    setSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("https://".concat(goldsteinData.goldsteinFQDN, "/api/onelab/update/equipment/status"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                user: userID,
                                module: selectedModuleId, // Updated to use selected module
                                status: statusId,
                                description: description,
                            }),
                        })];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    errorData = _a.sent();
                    alert("Failed to update status: ".concat(errorData.detail || res.statusText));
                    return [3 /*break*/, 5];
                case 4:
                    alert("Status updated successfully!");
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    alert("Error updating status: " + error_1);
                    return [3 /*break*/, 8];
                case 7:
                    setSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (React__default.createElement("div", { className: "card mb-4" },
        React__default.createElement("div", { className: "card-header bg-light-subtle" }, "Update Status"),
        React__default.createElement("form", { onSubmit: handleSubmit, className: "needs-validation p-3", noValidate: true },
            React__default.createElement("div", { className: "mb-3" },
                React__default.createElement("label", { htmlFor: "moduleSelect", className: "form-label" }, "Module"),
                isLoading ? (React__default.createElement("div", null, "Loading modules...")) : ((_b = equipmentModulesQuery.data) === null || _b === void 0 ? void 0 : _b.length) === 0 ? (React__default.createElement("div", null, "No modules available")) : (React__default.createElement("select", { className: "form-select", id: "moduleSelect", value: selectedModuleId || "", onChange: function (e) { return setSelectedModuleId(Number(e.target.value)); }, required: true, disabled: submitting }, (_c = equipmentModulesQuery.data) === null || _c === void 0 ? void 0 : _c.map(function (module) { return (React__default.createElement("option", { key: module.id, value: module.id },
                    module.name,
                    " (",
                    module.type.type,
                    ")")); })))),
            React__default.createElement("div", { className: "mb-3" },
                React__default.createElement("label", { htmlFor: "statusSelect", className: "form-label" }, "Status"),
                isLoading ? (React__default.createElement("div", null, "Loading status options...")) : (React__default.createElement("select", { className: "form-select", id: "statusSelect", value: statusId !== null && statusId !== void 0 ? statusId : "", onChange: function (e) { return setStatusId(Number(e.target.value)); }, required: true, disabled: submitting || !selectedModuleId }, statusOptions.map(function (option) { return (React__default.createElement("option", { key: option.id, value: option.id, style: {
                        color: option.front_color,
                        backgroundColor: option.back_color,
                    } }, option.status)); })))),
            React__default.createElement("div", { className: "mb-3" },
                React__default.createElement("label", { htmlFor: "description", className: "form-label" }, "Description (optional)"),
                React__default.createElement("textarea", { id: "description", className: "form-control", value: description, onChange: function (e) { return setDescription(e.target.value); }, rows: 3, placeholder: "Add a description about the status update", disabled: submitting || !selectedModuleId })),
            React__default.createElement("button", { type: "submit", className: "btn btn-primary", disabled: submitting || isLoading || !selectedModuleId }, submitting ? "Updating..." : "Update Status"))));
}

function EquipmentUsable(_a) {
    var userName = _a.userName, userID = _a.userID, badgeUUID = _a.badgeUUID, clientAssociation = _a.clientAssociation, timeLeft = _a.timeLeft;
    var _b = parseAssociation(clientAssociation), type = _b[0], id = _b[1];
    return (React__default.createElement("div", { className: "text-center" },
        React__default.createElement("div", { className: "alert alert-success mb-4", role: "alert" },
            React__default.createElement("h1", { className: "h4 alert-heading" }, "You can use the equipment"),
            React__default.createElement("hr", null),
            React__default.createElement("p", { className: "mb-0", id: "session-left-time" },
                "Session time remaining: ",
                timeLeft)),
        React__default.createElement("div", { className: "card mb-4" },
            React__default.createElement("div", { className: "card-header bg-light-sublte" }, "User Information"),
            React__default.createElement("ul", { className: "list-group list-group-flush" },
                React__default.createElement("li", { className: "list-group-item d-flex justify-content-between align-items-center" },
                    React__default.createElement("span", null, "User:"),
                    React__default.createElement("span", { className: "badge bg-primary" }, userName)),
                React__default.createElement("li", { className: "list-group-item d-flex justify-content-between align-items-center" },
                    React__default.createElement("span", null, "Badge UUID:"),
                    React__default.createElement("code", null, badgeUUID)),
                React__default.createElement("li", { className: "list-group-item d-flex justify-content-between align-items-center" },
                    React__default.createElement("span", null, "Client Association:"),
                    React__default.createElement("span", { className: "badge bg-info text-dark" }, clientAssociation)))),
        React__default.createElement(UpdateStatusWrapper, { userID: userID, equipmentID: type === 'equipment' ? Number(id) : -1 })));
}

var MOCK_API_TOKEN = "mock-token";
var NOTIFICATION_TTL = 10;
var LOGIN_TTL = 30;
var RenderingEnum;
(function (RenderingEnum) {
    RenderingEnum[RenderingEnum["SERVER_ERROR"] = 0] = "SERVER_ERROR";
    RenderingEnum[RenderingEnum["WAITING_CARD_DETECTION"] = 1] = "WAITING_CARD_DETECTION";
    RenderingEnum[RenderingEnum["CARD_READ"] = 2] = "CARD_READ";
    RenderingEnum[RenderingEnum["USER_NOT_AUTHORIZED"] = 3] = "USER_NOT_AUTHORIZED";
    RenderingEnum[RenderingEnum["EQUIPMENT_USABLE"] = 4] = "EQUIPMENT_USABLE";
})(RenderingEnum || (RenderingEnum = {}));
function getUsername(userID, serverEndpoint) {
    var _this = this;
    var url = "https://" + serverEndpoint + "/api/onelab/view/user/".concat(userID);
    return new Promise(function (resolve, reject) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var response, _a, _b, _c, data, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = Error.bind;
                        _c = (_b = "Response status: ".concat(response.status, " with body: ")).concat;
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_d.sent()])]))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        data = _d.sent();
                        resolve(data.full_name);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _d.sent();
                        reject(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); })();
    });
}
function GoldsteinClientDashboard() {
    var goldsteinData = useGoldsteinClientDataContext().goldsteinData;
    var wsRef = React.useRef(null);
    function handleReadedData(readedData) {
        return __awaiter(this, void 0, void 0, function () {
            var clientMap, key, clientStatus, baseStatus, userName, timeLeft_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(readedData.notifications_list);
                        clientMap = getClientsStatus(readedData.notifications_list, new Date(), NOTIFICATION_TTL, LOGIN_TTL);
                        console.log(clientMap);
                        key = "".concat(goldsteinData.associationType, ":").concat(goldsteinData.associationID);
                        clientStatus = clientMap.get(key);
                        if (!clientStatus) {
                            console.error("Invalid client map size: " + clientMap.size);
                            setServerError();
                            return [2 /*return*/];
                        }
                        baseStatus = {
                            status: RenderingEnum.WAITING_CARD_DETECTION,
                            association: key,
                            badgeUUID: clientStatus.message.badgeUUID,
                            userName: "",
                            userID: clientStatus.message.userID,
                        };
                        if (clientStatus.status === Status.CARD_READED) {
                            baseStatus.status = RenderingEnum.CARD_READ;
                            return [2 /*return*/, setRenderingState(baseStatus)];
                        }
                        if (!(clientStatus.status === Status.USER_AUTHENTICATED)) return [3 /*break*/, 2];
                        return [4 /*yield*/, getUsername(clientStatus.message.userID, goldsteinData.goldsteinFQDN)];
                    case 1:
                        userName = _a.sent();
                        baseStatus.userName = userName;
                        if (clientStatus.message.usable) {
                            baseStatus.status = RenderingEnum.EQUIPMENT_USABLE;
                            timeLeft_1 = LOGIN_TTL -
                                (new Date().getTime() - new Date(clientStatus.timestamp).getTime()) /
                                    1000;
                            startTimer(Math.round(timeLeft_1));
                            return [2 /*return*/, setRenderingState(baseStatus)];
                        }
                        else {
                            baseStatus.status = RenderingEnum.USER_NOT_AUTHORIZED;
                            return [2 /*return*/, setRenderingState(baseStatus)];
                        }
                    case 2:
                        if (clientStatus.status === Status.CLIENT_CONNECTED) {
                            baseStatus.status = RenderingEnum.WAITING_CARD_DETECTION;
                            return [2 /*return*/, setRenderingState(baseStatus)];
                        }
                        console.error("Invalid client map: ");
                        console.error(clientMap);
                        setServerError();
                        return [2 /*return*/];
                }
            });
        });
    }
    var connectWs = function () {
        getWebSocket("wss://" + goldsteinData.goldsteinFQDN + "/ws", MOCK_API_TOKEN)
            .then(function (ws) {
            if (wsRef.current !== null) {
                wsRef.current.close();
            }
            ws.onmessage = function (event) {
                dataListener(event, handleReadedData);
            };
            ws.onclose = function () {
                console.log("WebSocket closed");
                setTimeout(function () {
                    if (wsRef.current === null ||
                        wsRef.current.readyState === WebSocket.CLOSED ||
                        wsRef.current.readyState === WebSocket.CLOSING) {
                        connectWs();
                    }
                }, 1000);
            };
            ws.onerror = function (e) {
                console.error("WebSocket error", e);
                setServerError();
            };
            wsRef.current = ws;
            console.log("WebSocket connected");
            setAssociationLisening();
        })
            .catch(function (error) {
            setServerError();
            console.error("WebSocket connection failed", error);
        });
    };
    // initialize de ws and manages its life clicle
    React.useEffect(function () {
        connectWs();
        return function () {
            if (wsRef.current) {
                wsRef.current.close();
                console.log("Web socket disconnected");
            }
        };
    }, [goldsteinData]);
    var _a = React.useState({
        status: RenderingEnum.SERVER_ERROR,
        association: "",
        badgeUUID: "",
        userName: "",
        userID: 0,
    }), renderingState = _a[0], setRenderingState = _a[1];
    var setServerError = function () {
        setRenderingState({
            status: RenderingEnum.SERVER_ERROR,
            association: "",
            badgeUUID: "",
            userName: "",
            userID: 0,
        });
    };
    var _b = React.useState(0), timeLeft = _b[0], setTimeLeft = _b[1];
    var timeoutRef = React.useRef(null);
    function startTimer(time) {
        stopTimer();
        setTimeLeft(time);
        timeoutRef.current = setInterval(function () {
            setTimeLeft(function (prev) {
                if (prev <= 0) {
                    var pkg = {
                        package_type: ClientToServerMessage.GET_DATA,
                        payload: "",
                    };
                    sendWsMessage(wsRef.current, pkg);
                    clearInterval(timeoutRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    function stopTimer() {
        if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
        }
    }
    function setAssociationLisening() {
        return __awaiter(this, void 0, void 0, function () {
            var sqlStatement, updateListeningData, pkg;
            return __generator(this, function (_a) {
                sqlStatement = "SELECT * FROM notifications \n                                WHERE association_item = \"".concat(goldsteinData.associationType, "\" \n                                AND association_id = ").concat(goldsteinData.associationID, "\n");
                updateListeningData = {
                    listening_association: "".concat(goldsteinData.associationType, ":").concat(goldsteinData.associationID),
                    sql_statement: sqlStatement,
                };
                pkg = {
                    package_type: ClientToServerMessage.UPDATE_LISENING_DATA,
                    payload: JSON.stringify(updateListeningData),
                };
                sendWsMessage(wsRef.current, pkg);
                pkg = {
                    package_type: ClientToServerMessage.GET_DATA,
                    payload: "",
                };
                sendWsMessage(wsRef.current, pkg);
                return [2 /*return*/];
            });
        });
    }
    return (React.createElement("div", { className: "container mt-4" },
        React.createElement("div", { className: "row justify-content-center" },
            React.createElement("div", { className: "col-md-10 col-lg-8" },
                React.createElement("div", { className: "card shadow" },
                    React.createElement("div", { className: "card-body" },
                        renderingState.status === RenderingEnum.SERVER_ERROR && (React.createElement(ServerError, null)),
                        renderingState.status ===
                            RenderingEnum.WAITING_CARD_DETECTION && (React.createElement(WaitingCardDetection, null)),
                        renderingState.status === RenderingEnum.CARD_READ && (React.createElement(NoUserInCard, { badgeUID: renderingState.badgeUUID })),
                        renderingState.status === RenderingEnum.USER_NOT_AUTHORIZED && (React.createElement(UserNotAuthorized, { badgeUUID: renderingState.badgeUUID, userName: renderingState.userName })),
                        renderingState.status === RenderingEnum.EQUIPMENT_USABLE && (React.createElement(EquipmentUsable, { badgeUUID: renderingState.badgeUUID, userName: renderingState.userName, userID: renderingState.userID, clientAssociation: "".concat(renderingState.association), timeLeft: timeLeft }))))))));
}

export { GoldsteinClientDashboard, GoldsteinDataContext, GoldsteinDataProvider, useGoldsteinClientDataContext };
