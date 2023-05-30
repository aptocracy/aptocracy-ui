import { NotificationManager } from "react-notifications";

import { MESSAGE_TYPE } from "../common/constants/common.constants";

export const createNotification = (
  messageType: string,
  messageText: string,
  description?: string
) => {
  switch (messageType) {
    case MESSAGE_TYPE.SUCCESS:
      console.log(messageType, "MESSAGE");
      NotificationManager.success(messageText);
      break;
    case MESSAGE_TYPE.ERROR:
      NotificationManager.error(description, messageText);
      break;
  }
};
