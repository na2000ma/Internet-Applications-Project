const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
// Get the feature name from the command line arguments
const moduleName = process.argv[2];

let upperCaseModuleName;
let stateKey;
if (!moduleName.includes('-')) {
  stateKey = moduleName;
  upperCaseModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1, moduleName.length);
} else {
  const part1 = moduleName.split('-')[0];
  const part2 = moduleName.split('-')[1];
  stateKey = part1 + (part2.charAt(0).toUpperCase() + part2.slice(1, part2.length));
  upperCaseModuleName =
    (part1.charAt(0).toUpperCase() + part1.slice(1, part1.length)) +
    (part2.charAt(0).toUpperCase() + part2.slice(1, part2.length))
}

const directory = process.argv[3] || 'src/app/pages';

if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

// Define the directory structure
const directories = [
  'components',
  'directives',
  'pipes',
  'forms',
  'grids',
  'trees',
  'styles',
];

// Create the root directory
const rootDirectory = path.join(directory, moduleName);
execSync(`mkdir ${rootDirectory}`);

// Create subdirectories inside the feature directory
directories.forEach((dir) => {
  execSync(`mkdir ${path.join(rootDirectory, dir)}`);
});

// Create the module file
fs.writeFileSync(
  path.join(rootDirectory, `${moduleName}.module.ts`),
  `import {CommonModule} from '@angular/common';
import { NgModule } from "@angular/core";
import {${upperCaseModuleName}RoutingModule} from './${moduleName}-routing.module';
import {NgxsModule} from "@ngxs/store";
import {${upperCaseModuleName}State} from "@app/pages/${moduleName}/store/${moduleName}.state";
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ${upperCaseModuleName}RoutingModule,
    NgxsModule.forRoot([
      ${upperCaseModuleName}State
    ])
  ],
})
export class ${upperCaseModuleName}Module {}
`
);

// Create the routing module file
fs.writeFileSync(
  path.join(rootDirectory, `${moduleName}-routing.module.ts`),
  `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ${upperCaseModuleName}RoutingModule {}
`
);

// Create the store directory and files
const storeDirectory = path.join(rootDirectory, 'store');
execSync(`mkdir ${storeDirectory}`);
//action
fs.writeFileSync(
  path.join(storeDirectory, `${moduleName}.actions.ts`),
  `export class GetExampleAction {
    static readonly type = '[${moduleName}] Get Example';

    constructor(public payload: any[]) {
    }
}

export class SetExampleAction {
    static readonly type = '[${moduleName}] Set Example';

    constructor(public payload: any[]) {
    }
}
`
);

//state
const actionPath = `"./${moduleName}.actions"`;
fs.writeFileSync(
  path.join(storeDirectory, `${moduleName}.state.ts`),
  `import { Selector, Action, State, StateContext} from "@ngxs/store";
import { Injectable } from "@angular/core";
import { get } from "lodash-es";
import { GetExampleAction, SetExampleAction} from ${actionPath};

export interface ${upperCaseModuleName}Model {
  'example': any[]
}

const defaults = {
  example: []
}

@State({
  name: '${stateKey}',
  defaults
})
@Injectable()
export class ${upperCaseModuleName}State {

  @Selector()
  static example(state: ${upperCaseModuleName}State) {
    return get(state, 'example') || [];
  }

  @Action(GetExampleAction)
  getExampleAction({dispatch}: StateContext<${upperCaseModuleName}Model>, {payload}: GetExampleAction) {
    return dispatch(new SetExampleAction(payload));
  }

  @Action(SetExampleAction)
  setExampleAction({patchState}: StateContext<${upperCaseModuleName}Model>, {payload}: SetExampleAction) {
    return patchState({
      example: payload
    })
  }
}
`
);

// Create the services directory and files
const servicesDirectory = path.join(rootDirectory, 'services');
execSync(`mkdir ${servicesDirectory}`);
fs.writeFileSync(
  path.join(servicesDirectory, `${moduleName}.service.ts`),
  `import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ${upperCaseModuleName}Service {
}
`
);

// Create the utils services directory and files
const utilsServiceDirectory = path.join(rootDirectory, 'utils');
execSync(`mkdir ${utilsServiceDirectory}`);
fs.writeFileSync(
  path.join(utilsServiceDirectory, `${moduleName}-utils.service.ts`),
  `import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ${upperCaseModuleName}UtilsService {
}
`
);

// Create the drivers directory and files
const driversDirectory = path.join(rootDirectory, 'drivers');
execSync(`mkdir ${driversDirectory}`);
fs.writeFileSync(
  path.join(driversDirectory, `${moduleName}-driver.api.ts`),
  `export const ${upperCaseModuleName}DriverApis = {};
`
);

console.log(`'${upperCaseModuleName}' directories created successfully.`);
