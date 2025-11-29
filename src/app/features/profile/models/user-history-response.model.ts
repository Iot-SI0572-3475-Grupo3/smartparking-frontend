// File: src/app/features/profile/models/user-history-list.model.ts
import {UserHistoryElement} from "./user-history-element.model";

export interface UserHistoryListResponse {
  items: UserHistoryElement[];
}

export type UserHistoryArray = UserHistoryElement[];
