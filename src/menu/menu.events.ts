export enum NodeMenuItemAction {
  NewFolder,
  NewTag,
  Rename,
  Remove,
  RemoveTag,
  CreateTag
}

export enum NodeMenuAction {
  Close
}

export interface NodeMenuEvent {
  sender: HTMLElement;
  action: NodeMenuAction;
}

export interface NodeMenuItemSelectedEvent {
  nodeMenuItemAction: NodeMenuItemAction;
}
