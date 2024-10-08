import { RedisClientType, createClient } from "redis";
import { DbMessage } from "../types/DbMessage";
import { WsMessage } from "../types/toWs";
import { MessageToApi } from "../types/toApi";

export class RedisManager {
  private client: RedisClientType;
  private static instance: RedisManager;

  constructor() {
    this.client = createClient({url : process.env.REDIS_URL});
    this.client.connect();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  public pushMessage(message: DbMessage) {
    this.client.lPush("db_processor", JSON.stringify(message));
  }

  public publishMessage(channel: string, message: WsMessage) {
    this.client.publish(channel, JSON.stringify(message));
  }

  public sendToApi(clientId: string, message: MessageToApi) {
    this.client.publish(clientId, JSON.stringify(message));
  }
}
