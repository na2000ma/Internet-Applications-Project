import {Injectable} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
export class TitleStrategyService extends TitleStrategy {

  // currentTitle: string = 'Organizo';

  constructor(
    private readonly title: Title,
    // private readonly stringUtilsService: StringUtilsService
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.title.setTitle(title ? `${title} - IA` : 'IA');
    // this.currentTitle = title ? `${title} - Organizo` : 'Organizo';
    // this.setTitle();
  }

  // override getResolvedTitleForRoute(snapshot: ActivatedRouteSnapshot) {
  //   const dialogName = snapshot.queryParams['dialog'];
  //   const title = this.stringUtilsService.toSentenceCase(dialogName);
  //   this.setTitle(title);
  // }

  // private setTitle(title?: string) {
  //   this.title.setTitle(title ? `${title} - ${this.currentTitle}` : this.currentTitle);
  // }
}
