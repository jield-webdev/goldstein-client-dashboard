import * as React from "react";
import { useGoldsteinClientDataContext } from "../context/DataContext";
import {
  ClientToServerMessage,
  dataListener,
  getWebSocket,
  ReadedData,
  sendWsMessage,
  UpdateListeningData,
  WSPackage,
} from "../core/wsHelper";
import { getClientsStatus, Status } from "../core/notifications";
import ServerError from "./states/serverError";
import WaitingCardDetection from "./states/waitingCardDetection";
import NoUserInCard from "./states/noUserInCard";
import UserNotAuthorized from "./states/userNotAuthorized";
import EquipmentUsable from "./states/equipmentUsable";

const MOCK_API_TOKEN = "mock-token";

const NOTIFICATION_TTL = 10;

const LOGIN_TTL = 30;

enum RenderingEnum {
  SERVER_ERROR = 0,
  WAITING_CARD_DETECTION = 1,
  CARD_READ = 2,
  USER_NOT_AUTHORIZED = 3,
  EQUIPMENT_USABLE = 4,
}

type RenderingStatus = {
  status: RenderingEnum;
  association: string;
  badgeUUID: string;
  userName: string;
  userID: number;
};

function getUsername(userID: number, serverEndpoint: string): Promise<string> {
  const url = "https://" + serverEndpoint + `/api/onelab/view/user/${userID}`;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Response status: ${response.status} with body: ${await response.text()}`,
          );
        }

        const data = await response.json();
        resolve(data.full_name);
      } catch (error) {
        reject(error);
      }
    })();
  });
}

export function GoldsteinClientDashboard() {
  const { goldsteinData } = useGoldsteinClientDataContext();

  const wsRef = React.useRef<WebSocket | null>(null);

  async function handleReadedData(readedData: ReadedData) {
    console.log(readedData.notifications_list);
    const clientMap = getClientsStatus(
      readedData.notifications_list,
      new Date(),
      NOTIFICATION_TTL,
      LOGIN_TTL,
    );
    console.log(clientMap);

    const key = `${goldsteinData.associationType}:${goldsteinData.associationID}`;

    const clientStatus = clientMap.get(key);

    if (!clientStatus) {
      console.error("Invalid client map size: " + clientMap.size);

      setServerError();
      return;
    }

    const baseStatus = {
      status: RenderingEnum.WAITING_CARD_DETECTION,
      association: key,
      badgeUUID: clientStatus.message.badgeUUID,
      userName: "",
      userID: clientStatus.message.userID,
    };

    if (clientStatus.status === Status.CARD_READED) {
      baseStatus.status = RenderingEnum.CARD_READ;
      return setRenderingState(baseStatus);
    }

    if (clientStatus.status === Status.USER_AUTHENTICATED) {
      const userName = await getUsername(
        clientStatus.message.userID,
        goldsteinData.goldsteinFQDN,
      );
      baseStatus.userName = userName;
      if (clientStatus.message.usable) {
        baseStatus.status = RenderingEnum.EQUIPMENT_USABLE;
        const timeLeft =
          LOGIN_TTL -
          (new Date().getTime() - new Date(clientStatus.timestamp).getTime()) /
            1000;
        startTimer(Math.round(timeLeft));
        return setRenderingState(baseStatus);
      } else {
        baseStatus.status = RenderingEnum.USER_NOT_AUTHORIZED;
        return setRenderingState(baseStatus);
      }
    }

    if (clientStatus.status === Status.CLIENT_CONNECTED) {
      baseStatus.status = RenderingEnum.WAITING_CARD_DETECTION;
      return setRenderingState(baseStatus);
    }

    console.error("Invalid client map: ");
    console.error(clientMap);
    setServerError();
  }

  const connectWs = () => {
    getWebSocket("wss://" + goldsteinData.goldsteinFQDN + "/ws", MOCK_API_TOKEN)
      .then((ws) => {
        if (wsRef.current !== null) {
          wsRef.current.close();
        }
        ws.onmessage = (event) => {
          dataListener(event, handleReadedData);
        };
        ws.onclose = () => {
          console.log("WebSocket closed");
          setTimeout(() => {
            if (
              wsRef.current === null ||
              wsRef.current.readyState === WebSocket.CLOSED ||
              wsRef.current.readyState === WebSocket.CLOSING
            ) {
              connectWs();
            }
          }, 1000);
        };
        ws.onerror = (e) => {
          console.error("WebSocket error", e);
          setServerError();
        };

        wsRef.current = ws;
        console.log("WebSocket connected");

        setAssociationLisening();
      })
      .catch((error) => {
        setServerError();
        console.error("WebSocket connection failed", error);
      });
  };

  // initialize de ws and manages its life clicle
  React.useEffect(() => {
    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        console.log("Web socket disconnected");
      }
    };
  }, [goldsteinData]);

  const [renderingState, setRenderingState] = React.useState<RenderingStatus>({
    status: RenderingEnum.SERVER_ERROR,
    association: "",
    badgeUUID: "",
    userName: "",
    userID: 0,
  });

  const setServerError = () => {
    setRenderingState({
      status: RenderingEnum.SERVER_ERROR,
      association: "",
      badgeUUID: "",
      userName: "",
      userID: 0,
    });
  };

  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  function startTimer(time: number) {
    stopTimer();

    setTimeLeft(time);
    timeoutRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          const pkg: WSPackage = {
            package_type: ClientToServerMessage.GET_DATA,
            payload: "",
          };
          sendWsMessage(wsRef.current, pkg);
          clearInterval(timeoutRef.current as NodeJS.Timeout);
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

  async function setAssociationLisening() {
    const sqlStatement = `SELECT * FROM notifications 
                                WHERE association_item = "${goldsteinData.associationType}" 
                                AND association_id = ${goldsteinData.associationID}
`;

    const updateListeningData: UpdateListeningData = {
      listening_association: `${goldsteinData.associationType}:${goldsteinData.associationID}`,
      sql_statement: sqlStatement,
    };

    let pkg: WSPackage = {
      package_type: ClientToServerMessage.UPDATE_LISENING_DATA,
      payload: JSON.stringify(updateListeningData),
    };
    sendWsMessage(wsRef.current, pkg);

    pkg = {
      package_type: ClientToServerMessage.GET_DATA,
      payload: "",
    };
    sendWsMessage(wsRef.current, pkg);
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              {renderingState.status === RenderingEnum.SERVER_ERROR && (
                <ServerError />
              )}
              {renderingState.status ===
                RenderingEnum.WAITING_CARD_DETECTION && (
                <WaitingCardDetection />
              )}
              {renderingState.status === RenderingEnum.CARD_READ && (
                <NoUserInCard badgeUID={renderingState.badgeUUID} />
              )}
              {renderingState.status === RenderingEnum.USER_NOT_AUTHORIZED && (
                <UserNotAuthorized
                  badgeUUID={renderingState.badgeUUID}
                  userName={renderingState.userName}
                />
              )}
              {renderingState.status === RenderingEnum.EQUIPMENT_USABLE && (
                <EquipmentUsable
                  badgeUUID={renderingState.badgeUUID}
                  userName={renderingState.userName}
                  userID={renderingState.userID}
                  clientAssociation={`${renderingState.association}`}
                  timeLeft={timeLeft}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
