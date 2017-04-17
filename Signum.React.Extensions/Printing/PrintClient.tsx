﻿import * as React from 'react'
import { Route } from 'react-router'
import { Dic, classes } from '../../../Framework/Signum.React/Scripts/Globals';
import { Button, OverlayTrigger, Tooltip, MenuItem } from "react-bootstrap"
import { ajaxPost, ajaxGet } from '../../../Framework/Signum.React/Scripts/Services';
import { EntitySettings, ViewPromise } from '../../../Framework/Signum.React/Scripts/Navigator'
import * as Navigator from '../../../Framework/Signum.React/Scripts/Navigator'
import { Lite, Entity, EntityPack, ExecuteSymbol, DeleteSymbol, ConstructSymbol_From } from '../../../Framework/Signum.React/Scripts/Signum.Entities'
import { EntityOperationSettings } from '../../../Framework/Signum.React/Scripts/Operations'
import { PseudoType, QueryKey, GraphExplorer, OperationType, IType, Type, KindOfType } from '../../../Framework/Signum.React/Scripts/Reflection'
import * as Operations from '../../../Framework/Signum.React/Scripts/Operations'
import { PrintLineEntity, PrintLineState, PrintPackageEntity, PrintPermission, PrintPackageProcess } from './Signum.Entities.Printing'
import { ProcessEntity } from '../Processes/Signum.Entities.Processes'
import { FileTypeSymbol } from '../Files/Signum.Entities.Files'
import * as OmniboxClient from '../Omnibox/OmniboxClient'
import * as AuthClient from '../Authorization/AuthClient'
import { LoadRoute } from "../../../Framework/Signum.React/Scripts/LoadComponent";

export function start(options: { routes: JSX.Element[],}) {
  
    Navigator.addSettings(new EntitySettings(PrintLineEntity, e => _import('./Templates/PrintLine')));
    Navigator.addSettings(new EntitySettings(PrintPackageEntity, e => _import('./Templates/PrintPackage')));

    options.routes.push(<Route path="printing">
        <LoadRoute path="view" onLoadModule={() => _import("./PrintPanelPage")} />
    </Route>);

    
    OmniboxClient.registerSpecialAction({
        allowed: () => AuthClient.isPermissionAuthorized(PrintPermission.ViewPrintPanel),
        key: "PrintPanel",
        onClick: () => Promise.resolve(Navigator.currentHistory.createHref("~/printing/view"))
    });

}

export module API {
    export function getStats(): Promise<PrintStat[]> {
        return ajaxGet<PrintStat[]>({ url: `~/api/printing/stats` });
    }

    export function createPrintProcess(fileType: FileTypeSymbol): Promise<ProcessEntity> {
        return ajaxPost<ProcessEntity>({ url: `~/api/printing/createProcess` }, fileType);
    }
}

export interface PrintStat {
    fileType: FileTypeSymbol;
    count: number;
}