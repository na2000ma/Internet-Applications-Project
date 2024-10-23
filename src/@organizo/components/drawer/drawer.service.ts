import {Injectable} from '@angular/core';
import {OrganizoDrawerComponent} from "@organizo/components/drawer/drawer.component";

@Injectable({providedIn: 'root'})
export class OrganizoDrawerService {
  private _componentRegistry: Map<string, OrganizoDrawerComponent> = new Map<string, OrganizoDrawerComponent>();

  /**
   * Constructor
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register drawer component
   *
   * @param name
   * @param component
   */
  registerComponent(name: string, component: OrganizoDrawerComponent): void {
    this._componentRegistry.set(name, component);
  }

  /**
   * Deregister drawer component
   *
   * @param name
   */
  deregisterComponent(name: string): void {
    this._componentRegistry.delete(name);
  }

  /**
   * Get drawer component from the registry
   *
   * @param name
   */
  getComponent(name: string): OrganizoDrawerComponent | undefined {
    return this._componentRegistry.get(name);
  }
}
