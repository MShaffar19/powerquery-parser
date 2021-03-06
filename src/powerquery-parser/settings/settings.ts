// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ICancellationToken } from "../common";
import { Ast, ExternalType } from "../language";
import { LexerSnapshot } from "../lexer";
import { DefaultLocale } from "../localization";
import { CombinatorialParser, IParser, IParseState, IParseStateUtils, TParseStateFactoryOverrides } from "../parser";

export interface CommonSettings {
    readonly maybeCancellationToken: ICancellationToken | undefined;
    readonly locale: string;
}

export type LexSettings = CommonSettings;

export interface ParseSettings<S extends IParseState = IParseState> extends CommonSettings {
    readonly parser: IParser<S>;
    readonly parseStateFactory: (
        lexerSnapshot: LexerSnapshot,
        maybeOverrides: TParseStateFactoryOverrides<S> | undefined,
    ) => S;
    readonly maybeParserEntryPointFn: ((state: S, parser: IParser<S>) => Ast.TNode) | undefined;
}

export interface InspectionSettings extends CommonSettings {
    readonly externalTypeResolver: ExternalType.TExternalTypeResolverFn;
}

export type Settings<S extends IParseState = IParseState> = LexSettings & ParseSettings<S> & InspectionSettings;

export const DefaultSettings: Settings<IParseState> = {
    maybeCancellationToken: undefined,
    locale: DefaultLocale,
    parser: CombinatorialParser,
    parseStateFactory: (
        lexerSnapshot: LexerSnapshot,
        maybeOverrides: TParseStateFactoryOverrides<IParseState> | undefined,
    ) => IParseStateUtils.stateFactory(lexerSnapshot, maybeOverrides),
    maybeParserEntryPointFn: undefined,
    externalTypeResolver: (_request: ExternalType.TExternalTypeRequest) => undefined,
};
