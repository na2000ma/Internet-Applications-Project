import {camelCase, kebabCase, lowerCase, snakeCase, startCase, upperCase, upperFirst} from "lodash-es";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class StringUtilsService {
  /**
   * lowercase (this is lower case)
   * @param str
   */
  toLowerCase = (str: string) => lowerCase(str);

  /**
   * UPPERCASE (THIS IS UPPER CASE)
   * @param str
   */
  toUpperCase = (str: string) => upperCase(str);

  /**
   * camelCase (thisIsCamelCase)
   * @param str
   */
  toCamelCase = (str: string) => camelCase(str);

  /**
   * kebab-case (this-is-kebab-case)
   * @param str
   */
  toKebabCase = (str: string) => kebabCase(str);

  /**
   * snake_case (this_is_snake_case)
   * @param str
   */
  toSnakeCase = (str: string) => snakeCase(str);

  /**
   * PascalCase (ThisIsPascalCase)
   * @param str
   */
  toPascalCase = (str: string) => startCase(camelCase(str)).replace(/ /g, '');

  /**
   * CONSTANT_CASE (THIS_IS_CONSTANT_CASE)
   * @param str
   */
  toConstantCase = (str: string) => upperCase(str).replace(/ /g, '_');

  /**
   * dot.case (this.is.dot.case)
   * @param str
   */
  toDotCase = (str: string) => lowerCase(str).replace(/ /g, '.');

  /**
   * path/case (this/is/path/case)
   * @param str
   */
  toPathCase = (str: string) => lowerCase(str).replace(/ /g, '/');

  /**
   * Sentence case (This is sentence case)
   * @param str
   */
  toSentenceCase = (str: string) => upperFirst(lowerCase(str));

  /**
   * Title Case (This Is Title Case)
   * @param str
   */
  toTitleCase = (str: string) => startCase(camelCase(str));
}
