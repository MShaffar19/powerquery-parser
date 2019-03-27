import { expect } from "chai";
import "mocha";
import { ResultKind, Traverse } from "../../common";
import { lexAndParse } from "../../jobs";
import { Ast } from "../../parser";

interface State extends Traverse.IState<Ast.NodeKind[]> { }
interface Request extends Traverse.IRequest<State, Ast.NodeKind[]> { }

function tokenizeNodeKindFromAst(document: string): Ast.NodeKind[] {
    const parseResult = lexAndParse(document);
    if (parseResult.kind === ResultKind.Err) {
        throw new Error(`parseResult.kind === ResultKind.Err: ${JSON.stringify(parseResult)}`);
    }

    const request: Request = {
        ast: parseResult.value.ast,
        state: {
            result: [],
        },
        visitNodeFn,
        visitNodeStrategy: Traverse.VisitNodeStrategy.BreadthFirst,
        maybeEarlyExitFn: undefined,
    };

    const traverseRequest = Traverse.traverseAst(request);
    if (traverseRequest.kind === ResultKind.Err) {
        throw new Error(`traverseRequest.kind === ResultKind.Err: ${JSON.stringify(traverseRequest)}`);
    }

    return traverseRequest.value;
}

function visitNodeFn(node: Ast.TNode, state: State) {
    state.result.push(node.kind);
}

describe("verify NodeKind tokens in AST", () => {
    it(`${Ast.NodeKind.ArithmeticExpression} ${Ast.ArithmeticOperator.Addition}`, () => {
        const actual = tokenizeNodeKindFromAst("1 + 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ArithmeticExpression} ${Ast.ArithmeticOperator.And}`, () => {
        const actual = tokenizeNodeKindFromAst("1 & 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ArithmeticExpression} ${Ast.ArithmeticOperator.Division}`, () => {
        const actual = tokenizeNodeKindFromAst("1 / 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ArithmeticExpression} ${Ast.ArithmeticOperator.Multiplication}`, () => {
        const actual = tokenizeNodeKindFromAst("1 * 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ArithmeticExpression} ${Ast.ArithmeticOperator.Subtraction}`, () => {
        const actual = tokenizeNodeKindFromAst("1 - 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ArithmeticExpression} with multiple ${Ast.NodeKind.UnaryExpressionHelper}`, () => {
        const actual = tokenizeNodeKindFromAst("1 + 1 + 1 + 1");
        const expected = [
            Ast.NodeKind.ArithmeticExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.AsExpression, () => {
        const actual = tokenizeNodeKindFromAst("1 as number");
        const expected = [
            Ast.NodeKind.AsExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.AsNullablePrimitiveType, () => {
        const actual = tokenizeNodeKindFromAst("1 as nullable number");
        const expected = [
            Ast.NodeKind.AsExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.NullablePrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.AsType, () => {
        const actual = tokenizeNodeKindFromAst("type function (x as number) as number");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.FunctionType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.AsType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.AsType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.Constant covered by many

    // Ast.NodeKind.Csv covered by many

    it(Ast.NodeKind.EachExpression, () => {
        const actual = tokenizeNodeKindFromAst("each 1");
        const expected = [
            Ast.NodeKind.EachExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.EqualityExpression} ${Ast.EqualityOperator.EqualTo}`, () => {
        const actual = tokenizeNodeKindFromAst("1 = 1");
        const expected = [
            Ast.NodeKind.EqualityExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.EqualityExpression} ${Ast.EqualityOperator.NotEqualTo}`, () => {
        const actual = tokenizeNodeKindFromAst("1 <> 1");
        const expected = [
            Ast.NodeKind.EqualityExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ErrorHandlingExpression} otherwise`, () => {
        const actual = tokenizeNodeKindFromAst("try 1");
        const expected = [
            Ast.NodeKind.ErrorHandlingExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ErrorHandlingExpression} otherwise`, () => {
        const actual = tokenizeNodeKindFromAst("try 1 otherwise 1");
        const expected = [
            Ast.NodeKind.ErrorHandlingExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.OtherwiseExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.ErrorRaisingExpression, () => {
        const actual = tokenizeNodeKindFromAst("error 1");
        const expected = [
            Ast.NodeKind.ErrorRaisingExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.FieldProjection, () => {
        const actual = tokenizeNodeKindFromAst("x[[y]]");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.FieldProjection,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldProjection}multiple`, () => {
        const actual = tokenizeNodeKindFromAst("x[[y], [z]]");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.FieldProjection,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldProjection} optional`, () => {
        const actual = tokenizeNodeKindFromAst("x[[y]]?");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.FieldProjection,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.FieldSelector, () => {
        const actual = tokenizeNodeKindFromAst("[x]");
        const expected = [
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldSelector} optional`, () => {
        const actual = tokenizeNodeKindFromAst("[x]?");
        const expected = [
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.FieldSpecification, () => {
        const actual = tokenizeNodeKindFromAst("type [x]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldSpecification} optional`, () => {
        const actual = tokenizeNodeKindFromAst("type [optional x]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldSpecification} FieldTypeSpecification`, () => {
        const actual = tokenizeNodeKindFromAst("type [x = number]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.FieldTypeSpecification,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.FieldSpecificationList, () => {
        const actual = tokenizeNodeKindFromAst("type [x]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FieldSpecificationList}`, () => {
        const actual = tokenizeNodeKindFromAst("type [x, ...]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.FieldTypeSpecification covered by FieldSpecification

    it(Ast.NodeKind.FunctionExpression, () => {
        const actual = tokenizeNodeKindFromAst("() => 1");
        const expected = [
            Ast.NodeKind.FunctionExpression,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FunctionExpression} ParameterList`, () => {
        const actual = tokenizeNodeKindFromAst("(x) => 1");
        const expected = [
            Ast.NodeKind.FunctionExpression,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FunctionExpression} multiple ParameterList`, () => {
        const actual = tokenizeNodeKindFromAst("(x, y, z) => 1");
        const expected = [
            Ast.NodeKind.FunctionExpression,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FunctionExpression} ParameterList with optional`, () => {
        const actual = tokenizeNodeKindFromAst("(optional x) => 1");
        const expected = [
            Ast.NodeKind.FunctionExpression,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.FunctionExpression} ParameterList with AsNullablePrimitiveType`, () => {
        const actual = tokenizeNodeKindFromAst("(x as nullable text) => 1");
        const expected = [
            Ast.NodeKind.FunctionExpression,
            Ast.NodeKind.ParameterList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.Parameter,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.AsNullablePrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.NullablePrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.FieldTypeSpecification covered by AsType

    it(Ast.NodeKind.GeneralizedIdentifier, () => {
        const actual = tokenizeNodeKindFromAst("[foo bar]");
        const expected = [
            Ast.NodeKind.FieldSelector,
            Ast.NodeKind.Constant,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.GeneralizedIdentifierPairedAnyLiteral, () => {
        const actual = tokenizeNodeKindFromAst("[x=1] section;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.RecordLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.GeneralizedIdentifierPairedAnyLiteral,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.GeneralizedIdentifierPairedExpression, () => {
        const actual = tokenizeNodeKindFromAst("[x=1]");
        const expected = [
            Ast.NodeKind.RecordExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.GeneralizedIdentifierPairedExpression,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.Identifier covered by many

    it(Ast.NodeKind.IdentifierExpression, () => {
        const actual = tokenizeNodeKindFromAst("@foo");
        const expected = [
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Identifier,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.IdentifierExpressionPairedExpression covered by LetExpression

    it(Ast.NodeKind.IdentifierPairedExpression, () => {
        const actual = tokenizeNodeKindFromAst("section; x = 1;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.IfExpression, () => {
        const actual = tokenizeNodeKindFromAst("if x then x else x");
        const expected = [
            Ast.NodeKind.IfExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.InvokeExpression, () => {
        const actual = tokenizeNodeKindFromAst("foo()");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.InvokeExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.IsExpression, () => {
        const actual = tokenizeNodeKindFromAst("1 is number");
        const expected = [
            Ast.NodeKind.IsExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.ItemAccessExpression, () => {
        const actual = tokenizeNodeKindFromAst("x{1}");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.ItemAccessExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ItemAccessExpression} optional`, () => {
        const actual = tokenizeNodeKindFromAst("x{1}?");
        const expected = [
            Ast.NodeKind.RecursivePrimaryExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.ItemAccessExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.LetExpression, () => {
        const actual = tokenizeNodeKindFromAst("let x = 1 in x");
        const expected = [
            Ast.NodeKind.LetExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.ListExpression, () => {
        const actual = tokenizeNodeKindFromAst("{1, 2}");
        const expected = [
            Ast.NodeKind.ListExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ListExpression} empty`, () => {
        const actual = tokenizeNodeKindFromAst("{}");
        const expected = [
            Ast.NodeKind.ListExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.ListLiteral, () => {
        const actual = tokenizeNodeKindFromAst("[foo = {1}] section;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.RecordLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.GeneralizedIdentifierPairedAnyLiteral,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.ListLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.ListLiteral} empty`, () => {
        const actual = tokenizeNodeKindFromAst("[foo = {}] section;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.RecordLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.GeneralizedIdentifierPairedAnyLiteral,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.ListLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.ListType, () => {
        const actual = tokenizeNodeKindFromAst("type {number}");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.ListType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Logical} true`, () => {
        const actual = tokenizeNodeKindFromAst("true");
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Logical} false`, () => {
        const actual = tokenizeNodeKindFromAst("false");
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Numeric} decimal`, () => {
        const actual = tokenizeNodeKindFromAst("1");
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Numeric} hex`, () => {
        const actual = tokenizeNodeKindFromAst("0x1");
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Numeric} float`, () => {
        const actual = tokenizeNodeKindFromAst("1.1");
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Str}`, () => {
        const actual = tokenizeNodeKindFromAst(`""`);
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Str} double quote escape`, () => {
        const actual = tokenizeNodeKindFromAst(`""""`);
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LiteralExpression} ${Ast.LiteralKind.Null}`, () => {
        const actual = tokenizeNodeKindFromAst(`null`);
        const expected = [ Ast.NodeKind.LiteralExpression ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LogicalExpression} and`, () => {
        const actual = tokenizeNodeKindFromAst("true and true");
        const expected = [
            Ast.NodeKind.LogicalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.LogicalExpression} or`, () => {
        const actual = tokenizeNodeKindFromAst("true or true");
        const expected = [
            Ast.NodeKind.LogicalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.MetadataExpression, () => {
        const actual = tokenizeNodeKindFromAst("1 meta 1");
        const expected = [
            Ast.NodeKind.MetadataExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.NotImplementedExpression, () => {
        const actual = tokenizeNodeKindFromAst("...");
        const expected = [
            Ast.NodeKind.NotImplementedExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.NullablePrimitiveType, () => {
        const actual = tokenizeNodeKindFromAst("x is nullable number");
        const expected = [
            Ast.NodeKind.IsExpression,
            Ast.NodeKind.IdentifierExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.NullablePrimitiveType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(Ast.NodeKind.NullableType, () => {
        const actual = tokenizeNodeKindFromAst("type nullable number");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.NullableType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.PrimitiveType,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.OtherwiseExpression covered by `${Ast.NodeKind.ErrorHandlingExpression} otherwise`

    // Ast.NodeKind.Parameter covered by many

    // Ast.NodeKind.ParameterList covered by many

    it(Ast.NodeKind.ParenthesizedExpression, () => {
        const actual = tokenizeNodeKindFromAst("(1)");
        const expected = [
            Ast.NodeKind.ParenthesizedExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.PrimitiveType covered by many

    it(`${Ast.NodeKind.RecordExpression}`, () => {
        const actual = tokenizeNodeKindFromAst("[x=1]");
        const expected = [
            Ast.NodeKind.RecordExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.GeneralizedIdentifierPairedExpression,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.RecordExpression} empty`, () => {
        const actual = tokenizeNodeKindFromAst("[]");
        const expected = [
            Ast.NodeKind.RecordExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.RecordLiteral covered by many

    it(`${Ast.NodeKind.RecordType}`, () => {
        const actual = tokenizeNodeKindFromAst("type [x]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.RecordType} open record marker`, () => {
        const actual = tokenizeNodeKindFromAst("type [x, ...]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.RecordType,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.RecursivePrimaryExpression covered by many

    it(`${Ast.NodeKind.RelationalExpression} ${Ast.RelationalOperator.GreaterThan}`, () => {
        const actual = tokenizeNodeKindFromAst("1 > 1");
        const expected = [
            Ast.NodeKind.RelationalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.RelationalExpression} ${Ast.RelationalOperator.GreaterThanEqualTo}`, () => {
        const actual = tokenizeNodeKindFromAst("1 >= 1");
        const expected = [
            Ast.NodeKind.RelationalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.RelationalExpression} ${Ast.RelationalOperator.LessThan}`, () => {
        const actual = tokenizeNodeKindFromAst("1 <= 1");
        const expected = [
            Ast.NodeKind.RelationalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.RelationalExpression} ${Ast.RelationalOperator.LessThanEqualTo}`, () => {
        const actual = tokenizeNodeKindFromAst("1 <= 1");
        const expected = [
            Ast.NodeKind.RelationalExpression,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.Section}`, () => {
        const actual = tokenizeNodeKindFromAst("section;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.Section} attributes`, () => {
        const actual = tokenizeNodeKindFromAst("[] section;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.RecordLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.Section} name`, () => {
        const actual = tokenizeNodeKindFromAst("section foo;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.Section} member`, () => {
        const actual = tokenizeNodeKindFromAst("section; x = 1;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.Section} members`, () => {
        const actual = tokenizeNodeKindFromAst("section; x = 1; y = 2;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.SectionMember}`, () => {
        const actual = tokenizeNodeKindFromAst("section; x = 1;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.SectionMember} attributes`, () => {
        const actual = tokenizeNodeKindFromAst("section; [] x = 1;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.RecordLiteral,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.SectionMember} shared`, () => {
        const actual = tokenizeNodeKindFromAst("section; shared x = 1;");
        const expected = [
            Ast.NodeKind.Section,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Constant,
            Ast.NodeKind.SectionMember,
            Ast.NodeKind.Constant,
            Ast.NodeKind.IdentifierPairedExpression,
            Ast.NodeKind.Identifier,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.TableType}`, () => {
        const actual = tokenizeNodeKindFromAst("type table [x]");
        const expected = [
            Ast.NodeKind.TypePrimaryType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.TableType,
            Ast.NodeKind.Constant,
            Ast.NodeKind.FieldSpecificationList,
            Ast.NodeKind.Constant,
            Ast.NodeKind.Csv,
            Ast.NodeKind.FieldSpecification,
            Ast.NodeKind.GeneralizedIdentifier,
            Ast.NodeKind.Constant,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    // Ast.NodeKind.TypePrimaryType covered by many

    it(`${Ast.NodeKind.UnaryExpression} ${Ast.UnaryOperator.Negative}`, () => {
        const actual = tokenizeNodeKindFromAst("-1");
        const expected = [
            Ast.NodeKind.UnaryExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.UnaryExpression} ${Ast.UnaryOperator.Positive}`, () => {
        const actual = tokenizeNodeKindFromAst("not 1");
        const expected = [
            Ast.NodeKind.UnaryExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });

    it(`${Ast.NodeKind.UnaryExpression} ${Ast.UnaryOperator.Positive}`, () => {
        const actual = tokenizeNodeKindFromAst("+1");
        const expected = [
            Ast.NodeKind.UnaryExpression,
            Ast.NodeKind.UnaryExpressionHelper,
            Ast.NodeKind.Constant,
            Ast.NodeKind.LiteralExpression,
        ];
        const details = {
            actual,
            expected,
        };
        expect(actual).members(expected, JSON.stringify(details, null, 4));
    });
});