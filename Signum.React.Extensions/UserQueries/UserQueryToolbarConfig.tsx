﻿import * as React from 'react'
import { Route } from 'react-router'
import { Dic, classes } from '../../../Framework/Signum.React/Scripts/Globals';
import { ajaxPost, ajaxPostRaw, ajaxGet, saveFile } from '../../../Framework/Signum.React/Scripts/Services';
import * as Navigator from '../../../Framework/Signum.React/Scripts/Navigator'
import * as Finder from '../../../Framework/Signum.React/Scripts/Finder'
import { FindOptions, ValueSearchControl } from '../../../Framework/Signum.React/Scripts/Search'
import { QueryEntity } from '../../../Framework/Signum.React/Scripts/Signum.Entities.Basics'
import { Lite, Entity, EntityPack, liteKey } from '../../../Framework/Signum.React/Scripts/Signum.Entities'
import { PseudoType, QueryKey, GraphExplorer, OperationType, Type, getTypeName } from '../../../Framework/Signum.React/Scripts/Reflection'
import { ToolbarEntity, ToolbarMenuEntity, ToolbarElementEmbedded, ToolbarElementType } from '../Toolbar/Signum.Entities.Toolbar'
import { ToolbarConfig, ToolbarResponse } from '../Toolbar/ToolbarClient'
import * as UserQueryClient from './UserQueryClient'
import { UserQueryEntity } from './Signum.Entities.UserQueries'

export default class UserQueryToolbarConfig extends ToolbarConfig<UserQueryEntity> {

    constructor() {
        super(UserQueryEntity);
    }

    countIcon?: CountUserQueryIcon | null;
    getIcon(element: ToolbarResponse<UserQueryEntity>) {

        if (element.iconName == "count")
            return <CountUserQueryIcon ref={ci => this.countIcon = ci} userQuery={element.content!} color={element.iconColor || "red"} autoRefreshPeriod={element.autoRefreshPeriod} />;

        return ToolbarConfig.coloredIcon(element.iconName || "fa fa-list-alt", element.iconColor || "dodgerblue");
    }

    handleNavigateClick(e: React.MouseEvent<any>, res: ToolbarResponse<any>) {
        if (!res.openInPopup)
            super.handleNavigateClick(e, res);
        else {
            Navigator.API.fetchAndForget(res.content!)
                .then(uq => UserQueryClient.Converter.toFindOptions(uq, undefined))
                .then(fo => Finder.explore(fo))
                .then(() => this.countIcon && this.countIcon.refreshValue())
                .done();
        }
    }

    navigateTo(res: ToolbarResponse<UserQueryEntity>): Promise<string> {
        return Navigator.API.fetchAndForget(res.content!)
            .then(uq => UserQueryClient.Converter.toFindOptions(uq, undefined))
            .then(fo => Finder.findOptionsPath(fo, { userQuery: liteKey(res.content!) }));
    }
}

interface CountUserQueryIconProps {
    userQuery: Lite<UserQueryEntity>;
    color?: string;
    autoRefreshPeriod?: number;
}

interface CountUserQueryIconState {
    findOptions?: FindOptions;
}


export class CountUserQueryIcon extends React.Component<CountUserQueryIconProps, CountUserQueryIconState>{

    constructor(props: CountUserQueryIconProps) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        Navigator.API.fetchAndForget(this.props.userQuery)
            .then(uq => UserQueryClient.Converter.toFindOptions(uq, undefined))
            .then(fo => this.setState({ findOptions: fo }))
            .done();
    }

    componentWillUnmount() {
        if (this.handler)
            clearTimeout(this.handler);

        this._isMounted = false;
    }

    _isMounted = true;
    handler: number | undefined;
    handleValueChanged = () => {
        if (this.props.autoRefreshPeriod && this._isMounted) {

            if (this.handler)
                clearTimeout(this.handler);

            this.handler = setTimeout(() => {
                this.refreshValue();
            }, this.props.autoRefreshPeriod * 1000);
        }
    }

    refreshValue() {
        this.valueSearchControl && this.valueSearchControl.refreshValue();
    }

    valueSearchControl?: ValueSearchControl | null;

    render() {

        if (!this.state.findOptions)
            return <span className="icon" style={{ color: this.props.color }}>…</span>;

        return <ValueSearchControl ref={vsc => this.valueSearchControl = vsc}
            findOptions={this.state.findOptions}
            customClass="icon"
            customStyle={{ color: this.props.color }}
            onValueChange={this.handleValueChanged}
            avoidNotifyPendingRequest={true}
        />;
    }
}