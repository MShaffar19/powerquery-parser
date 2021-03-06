// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Ast, Constant } from "../../language";
import { TXorNode } from "../../parser";

export type TScopeItem =
    | EachScopeItem
    | KeyValuePairScopeItem
    | ParameterScopeItem
    | SectionMemberScopeItem
    | UndefinedScopeItem;

export const enum ScopeItemKind {
    Each = "Each",
    KeyValuePair = "KeyValuePair",
    Parameter = "Parameter",
    SectionMember = "SectionMember",
    Undefined = "Undefined",
}

export interface IScopeItem {
    readonly kind: ScopeItemKind;
    readonly id: number;
    readonly isRecursive: boolean;
}

export interface EachScopeItem extends IScopeItem {
    readonly kind: ScopeItemKind.Each;
    readonly eachExpression: TXorNode;
}

export interface KeyValuePairScopeItem extends IScopeItem {
    readonly kind: ScopeItemKind.KeyValuePair;
    readonly key: Ast.Identifier | Ast.GeneralizedIdentifier;
    readonly maybeValue: TXorNode | undefined;
}

export interface ParameterScopeItem extends IScopeItem {
    readonly kind: ScopeItemKind.Parameter;
    readonly name: Ast.Identifier;
    readonly isOptional: boolean;
    readonly isNullable: boolean;
    readonly maybeType: Constant.PrimitiveTypeConstantKind | undefined;
}

export interface SectionMemberScopeItem extends IScopeItem {
    readonly kind: ScopeItemKind.SectionMember;
    readonly key: Ast.Identifier;
    readonly maybeValue: TXorNode | undefined;
}

export interface UndefinedScopeItem extends IScopeItem {
    readonly kind: ScopeItemKind.Undefined;
    readonly xorNode: TXorNode;
}
