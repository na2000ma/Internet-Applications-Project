import {InjectFlags, Injector, ProviderToken} from "@angular/core";

/**
 * global value save instance of injector
 */
let appInjector: Injector;

/**
 * to set instance of injector in appInjector
 * must injector the Injector in AppModule constructor and add this statement
 * {setAppInjector(this.injector);}
 * @param injector
 */
export function setAppInjector(injector: Injector): void {
  appInjector = injector;
}

/**
 * to inject any injector in any location
 * @param token
 * @param notFoundValue
 * @param flags
 */
export function inject<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
  return appInjector.get(token, notFoundValue, flags);
}
