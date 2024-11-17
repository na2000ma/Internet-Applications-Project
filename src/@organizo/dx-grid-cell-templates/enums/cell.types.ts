import {GridIconComponent} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {MatButtonComponent} from "@organizo/dx-grid-cell-templates/components/mat-button/mat-button.component";
import {MatMenuComponent} from "@organizo/dx-grid-cell-templates/components/mat-menu/mat-menu.component";
import {ValueGetterComponent} from "@organizo/dx-grid-cell-templates/components/value-getter/value-getter.component";


export enum CellTypeName {
  MatIcon = 'icon',
  ValueGetter = 'value-getter',
  TypeWithIcon = 'type-with-icon',
  Status = 'status',
  MatButton = 'mat-button',
  MatMenu = 'mat-menu',
}

export const CellType = {
  [CellTypeName.MatIcon]: GridIconComponent,
  [CellTypeName.ValueGetter]: ValueGetterComponent,
  [CellTypeName.MatButton]: MatButtonComponent,
  [CellTypeName.MatMenu]: MatMenuComponent,
}
