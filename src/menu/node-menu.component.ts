import { Component, EventEmitter, Output, Renderer, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NodeMenuService } from './node-menu.service';
import { NodeMenuItemSelectedEvent, NodeMenuItemAction, NodeMenuAction } from './menu.events';
import { isLeftButtonClicked, isEscapePressed } from '../utils/event.utils';

@Component({
  selector: 'node-menu',
  template: `
    <div class="node-menu">
      <ul class="node-menu-content" #menuContainer>
        <li class="node-menu-item" *ngFor="let menuItem of availableMenuItems"
          (click)="onMenuItemSelected($event, menuItem)">
          <div class="node-menu-item-icon {{menuItem.cssClass}}"></div>
          <span class="node-menu-item-value">{{menuItem.name}}</span>
        </li>
      </ul>
    </div>
  `
})
export class NodeMenuComponent implements OnInit, OnDestroy {
  @Output()
  public menuItemSelected: EventEmitter<NodeMenuItemSelectedEvent> = new EventEmitter<NodeMenuItemSelectedEvent>();

  @ViewChild('menuContainer') public menuContainer: any;

  public availableMenuItems: NodeMenuItem[] = [
    {
      name: '新增分组',
      action: NodeMenuItemAction.CreateTag,
      cssClass: 'new-tag'
    },
    {
      name: '修改组名',
      action: NodeMenuItemAction.Rename,
      cssClass: 'rename'
    },
    {
      name: '删除分组',
      action: NodeMenuItemAction.RemoveTag,
      cssClass: 'remove'
    }
  ];

  private disposersForGlobalListeners: Function[] = [];

  public constructor(@Inject(Renderer) private renderer: Renderer,
                     @Inject(NodeMenuService) private nodeMenuService: NodeMenuService) {
  }

  public ngOnInit(): void {
    this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'keyup', this.closeMenu.bind(this)));
    this.disposersForGlobalListeners.push(this.renderer.listenGlobal('document', 'mousedown', this.closeMenu.bind(this)));
  }

  public ngOnDestroy(): void {
    this.disposersForGlobalListeners.forEach((dispose: Function) => dispose());
  }

  public onMenuItemSelected(e: MouseEvent, selectedMenuItem: NodeMenuItem): void {
    if (isLeftButtonClicked(e)) {
      this.menuItemSelected.emit({nodeMenuItemAction: selectedMenuItem.action});
      this.nodeMenuService.fireMenuEvent(e.target as HTMLElement, NodeMenuAction.Close);
    }
  }

  private closeMenu(e: MouseEvent | KeyboardEvent): void {
    const mouseClicked = e instanceof MouseEvent;
    // Check if the click is fired on an element inside a menu
    const containingTarget = (this.menuContainer.nativeElement !== e.target && this.menuContainer.nativeElement.contains(e.target));

    if (mouseClicked && !containingTarget || isEscapePressed(e as KeyboardEvent)) {
      this.nodeMenuService.fireMenuEvent(e.target as HTMLElement, NodeMenuAction.Close);
    }
  }
}

export interface NodeMenuItem {
  name: string;
  action: NodeMenuItemAction;
  cssClass: string;
}
