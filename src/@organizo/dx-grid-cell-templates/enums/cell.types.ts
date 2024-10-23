import {GridIconComponent} from "@organizo/dx-grid-cell-templates/components/grid-icon/grid-icon.component";
import {
  TypeWithIconComponent
} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {StatusComponent} from "@organizo/dx-grid-cell-templates/components/status/status.component";
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
  [CellTypeName.TypeWithIcon]: TypeWithIconComponent,
  [CellTypeName.Status]: StatusComponent,
  [CellTypeName.MatButton]: MatButtonComponent,
  [CellTypeName.MatMenu]: MatMenuComponent,
}
