import { WebPartContext } from "@microsoft/sp-webpart-base";

export default interface IHelloUserPart {
    busyMessage: string;
    context: WebPartContext
    data: string;
    isValid: boolean;
}