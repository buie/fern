import { HttpEndpoint, HttpMethod, HttpRequestBody, HttpService, PathParameter } from "@fern-fern/ir-model/http";
import { Package } from "@fern-fern/ir-model/ir";
import { convertHttpPathToExpressRoute, getTextOfTsNode, maybeAddDocs, PackageId } from "@fern-typescript/commons";
import { ExpressServiceContext, GeneratedExpressService } from "@fern-typescript/contexts";
import { ClassDeclaration, InterfaceDeclaration, Scope, ts } from "ts-morph";

export declare namespace GeneratedExpressServiceImpl {
    export interface Init {
        packageId: PackageId;
        package: Package;
        service: HttpService;
        serviceClassName: string;
        doNotHandleUnrecognizedErrors: boolean;
    }
}

export class GeneratedExpressServiceImpl implements GeneratedExpressService {
    private static ROUTER_PROPERTY_NAME = "router";
    private static METHODS_PROPERTY_NAME = "methods";
    private static ADD_MIDDLEWARE_METHOD_NAME = "addMiddleware";
    private static TO_ROUTER_METHOD_NAME = "toRouter";
    private static CATCH_BLOCK_ERROR_VARIABLE_NAME = "error";
    private static SEND_RESPONSE_PROPERTY_NAME = "send";
    private static SEND_COOKIE_RESPONSE_PROPERTY_NAME = "cookie";
    private static RESPONSE_BODY_PARAMETER_NAME = "responseBody";
    private static LOCALS_PROPERTY_NAME = "locals";

    private doNotHandleUnrecognizedErrors: boolean;
    private serviceClassName: string;
    private service: HttpService;
    private packageId: PackageId;
    private package_: Package;

    constructor({
        packageId,
        package: package_,
        serviceClassName,
        service,
        doNotHandleUnrecognizedErrors,
    }: GeneratedExpressServiceImpl.Init) {
        this.serviceClassName = serviceClassName;
        this.service = service;
        this.doNotHandleUnrecognizedErrors = doNotHandleUnrecognizedErrors;
        this.packageId = packageId;
        this.package_ = package_;
    }

    public writeToFile(context: ExpressServiceContext): void {
        const methodsInterface = context.base.sourceFile.addInterface({
            name: this.getMethodsInterfaceName(),
            isExported: true,
        });

        for (const endpoint of this.service.endpoints) {
            this.addEndpointMethodToInterface({ endpoint, methodsInterface, context });
        }

        const serviceClass = context.base.sourceFile.addClass({
            name: this.serviceClassName,
            isExported: true,
        });
        maybeAddDocs(serviceClass, this.package_.docs);

        serviceClass.addProperty({
            scope: Scope.Private,
            name: GeneratedExpressServiceImpl.ROUTER_PROPERTY_NAME,
        });

        this.addConstructor(serviceClass, context);

        this.addAddMiddlewareMethod({ serviceClass, context });

        serviceClass.addMethod({
            scope: Scope.Public,
            name: GeneratedExpressServiceImpl.TO_ROUTER_METHOD_NAME,
            returnType: getTextOfTsNode(context.base.externalDependencies.express.Router._getReferenceToType()),
            statements: [
                ...this.service.endpoints.map((endpoint) => this.addRouteToRouter(endpoint, context)),
                ts.factory.createReturnStatement(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createThis(),
                        GeneratedExpressServiceImpl.ROUTER_PROPERTY_NAME
                    )
                ),
            ].map(getTextOfTsNode),
        });
    }

    private addConstructor(serviceClass: ClassDeclaration, context: ExpressServiceContext) {
        const middlewareParameterName = "middleware";
        serviceClass.addConstructor({
            parameters: [
                {
                    name: GeneratedExpressServiceImpl.METHODS_PROPERTY_NAME,
                    isReadonly: true,
                    scope: Scope.Private,
                    type: this.getMethodsInterfaceName(),
                },
                {
                    name: middlewareParameterName,
                    type: getTextOfTsNode(
                        ts.factory.createArrayTypeNode(context.base.externalDependencies.express.RequestHandler())
                    ),
                    initializer: getTextOfTsNode(ts.factory.createArrayLiteralExpression([])),
                },
            ],
            statements: [
                ts.factory.createExpressionStatement(
                    ts.factory.createBinaryExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createThis(),
                            GeneratedExpressServiceImpl.ROUTER_PROPERTY_NAME
                        ),
                        ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                        context.base.externalDependencies.express.Router.use({
                            referenceToRouter: context.base.externalDependencies.express.Router._instantiate({
                                mergeParams: true,
                            }),
                            handlers: [
                                context.base.externalDependencies.express.json({ strict: false }),
                                ts.factory.createSpreadElement(ts.factory.createIdentifier(middlewareParameterName)),
                            ],
                        })
                    )
                ),
            ].map(getTextOfTsNode),
        });
    }

    public toRouter(referenceToService: ts.Expression): ts.Expression {
        return ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                referenceToService,
                GeneratedExpressServiceImpl.TO_ROUTER_METHOD_NAME
            ),
            undefined,
            undefined
        );
    }

    private addEndpointMethodToInterface({
        endpoint,
        methodsInterface,
        context,
    }: {
        endpoint: HttpEndpoint;
        methodsInterface: InterfaceDeclaration;
        context: ExpressServiceContext;
    }) {
        const REQUEST_PARAMETER_NAME = "req";
        const RESPONSE_PARAMETER_NAME = "res";

        const COOKIE_PARAMETER_NAME = "cookie";
        const COOKIE_VALUE_PARAMETER_NAME = "value";
        const COOKIE_OPTIONS_PARAMETER_NAME = "options";

        const allPathParameters = [...this.service.pathParameters, ...endpoint.pathParameters];

        methodsInterface.addMethod({
            name: this.getEndpointMethodName(endpoint),
            parameters: [
                {
                    name: REQUEST_PARAMETER_NAME,
                    type: getTextOfTsNode(
                        context.base.externalDependencies.express.Request._getReferenceToType({
                            pathParameters:
                                allPathParameters.length > 0
                                    ? ts.factory.createTypeLiteralNode(
                                          allPathParameters.map((pathParameter) => {
                                              const type = context.typeSchema.getReferenceToRawType(
                                                  pathParameter.valueType
                                              );
                                              return ts.factory.createPropertySignature(
                                                  undefined,
                                                  this.getPathParameterName(pathParameter),
                                                  type.isOptional
                                                      ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                                                      : undefined,
                                                  type.typeNodeWithoutUndefined
                                              );
                                          })
                                      )
                                    : undefined,
                            queryParameters:
                                endpoint.queryParameters.length > 0
                                    ? ts.factory.createTypeLiteralNode(
                                          endpoint.queryParameters.map((queryParameter) => {
                                              const type = context.type.getReferenceToType(queryParameter.valueType);
                                              return ts.factory.createPropertySignature(
                                                  undefined,
                                                  ts.factory.createStringLiteral(queryParameter.name.wireValue),
                                                  type.isOptional
                                                      ? ts.factory.createToken(ts.SyntaxKind.QuestionToken)
                                                      : undefined,
                                                  type.typeNodeWithoutUndefined
                                              );
                                          })
                                      )
                                    : undefined,
                            request:
                                endpoint.requestBody != null
                                    ? this.getReferenceToParsedRequestBody({
                                          endpoint,
                                          requestBody: endpoint.requestBody,
                                          context,
                                      })
                                    : undefined,
                            response:
                                endpoint.response != null
                                    ? context.type.getReferenceToType(endpoint.response.responseBodyType).typeNode
                                    : undefined,
                        })
                    ),
                },
                {
                    name: RESPONSE_PARAMETER_NAME,
                    type: getTextOfTsNode(
                        ts.factory.createTypeLiteralNode([
                            ts.factory.createPropertySignature(
                                undefined,
                                ts.factory.createIdentifier(GeneratedExpressServiceImpl.SEND_RESPONSE_PROPERTY_NAME),
                                undefined,
                                ts.factory.createFunctionTypeNode(
                                    undefined,
                                    endpoint.response != null
                                        ? [
                                              ts.factory.createParameterDeclaration(
                                                  undefined,
                                                  undefined,
                                                  undefined,
                                                  GeneratedExpressServiceImpl.RESPONSE_BODY_PARAMETER_NAME,
                                                  undefined,
                                                  context.type.getReferenceToType(endpoint.response.responseBodyType)
                                                      .typeNode
                                              ),
                                          ]
                                        : [],
                                    ts.factory.createTypeReferenceNode("Promise", [
                                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
                                    ])
                                )
                            ),
                            ts.factory.createPropertySignature(
                                undefined,
                                ts.factory.createIdentifier(
                                    GeneratedExpressServiceImpl.SEND_COOKIE_RESPONSE_PROPERTY_NAME
                                ),
                                undefined,
                                ts.factory.createFunctionTypeNode(
                                    undefined,
                                    [
                                        ts.factory.createParameterDeclaration(
                                            undefined,
                                            undefined,
                                            undefined,
                                            COOKIE_PARAMETER_NAME,
                                            undefined,
                                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                                        ),
                                        ts.factory.createParameterDeclaration(
                                            undefined,
                                            undefined,
                                            undefined,
                                            COOKIE_VALUE_PARAMETER_NAME,
                                            undefined,
                                            ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                                        ),
                                        ts.factory.createParameterDeclaration(
                                            undefined,
                                            undefined,
                                            undefined,
                                            COOKIE_OPTIONS_PARAMETER_NAME,
                                            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                                            context.base.externalDependencies.express.CookieOptions._getReferenceToType()
                                        ),
                                    ],
                                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
                                )
                            ),
                            ts.factory.createPropertySignature(
                                undefined,
                                ts.factory.createIdentifier(GeneratedExpressServiceImpl.LOCALS_PROPERTY_NAME),
                                undefined,
                                ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                            ),
                        ])
                    ),
                },
            ],
            returnType: getTextOfTsNode(
                ts.factory.createUnionTypeNode([
                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
                    ts.factory.createTypeReferenceNode("Promise", [
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
                    ]),
                ])
            ),
        });
    }

    private addAddMiddlewareMethod({
        serviceClass,
        context,
    }: {
        serviceClass: ClassDeclaration;
        context: ExpressServiceContext;
    }) {
        const HANDLER_PARAMETER_NAME = "handler";

        serviceClass.addMethod({
            scope: Scope.Public,
            name: GeneratedExpressServiceImpl.ADD_MIDDLEWARE_METHOD_NAME,
            parameters: [
                {
                    name: HANDLER_PARAMETER_NAME,
                    type: getTextOfTsNode(context.base.externalDependencies.express.RequestHandler()),
                },
            ],
            returnType: getTextOfTsNode(ts.factory.createThisTypeNode()),
            statements: [
                ts.factory.createExpressionStatement(
                    context.base.externalDependencies.express.Router.use({
                        referenceToRouter: this.getReferenceToRouter(),
                        handlers: [ts.factory.createIdentifier(HANDLER_PARAMETER_NAME)],
                    })
                ),
                ts.factory.createReturnStatement(ts.factory.createThis()),
            ].map(getTextOfTsNode),
        });
    }

    private getEndpointMethodName(endpoint: HttpEndpoint): string {
        return endpoint.name.camelCase.unsafeName;
    }

    private addRouteToRouter(endpoint: HttpEndpoint, context: ExpressServiceContext): ts.Statement {
        return context.base.externalDependencies.express.Router._addRoute({
            referenceToRouter: this.getReferenceToRouter(),
            method: HttpMethod._visit<"get" | "post" | "put" | "patch" | "delete">(endpoint.method, {
                get: () => "get",
                post: () => "post",
                put: () => "put",
                patch: () => "patch",
                delete: () => "delete",
                _unknown: () => {
                    throw new Error("Unknown ");
                },
            }),
            path: convertHttpPathToExpressRoute(endpoint.path),
            buildHandler: ({ expressRequest, expressResponse, next }) => {
                return ts.factory.createBlock(
                    [
                        ...(endpoint.requestBody != null
                            ? this.getIfElseWithValidation({
                                  expressRequest,
                                  expressResponse,
                                  next,
                                  endpoint,
                                  context,
                                  requestBody: endpoint.requestBody,
                              })
                            : [
                                  this.getTryCatch({
                                      expressRequest,
                                      expressResponse,
                                      next,
                                      endpoint,
                                      context,
                                  }),
                              ]),
                    ],
                    true
                );
            },
        });
    }

    private getIfElseWithValidation({
        expressRequest,
        expressResponse,
        next,
        endpoint,
        requestBody,
        context,
    }: {
        expressRequest: ts.Expression;
        expressResponse: ts.Expression;
        next: ts.Expression;
        endpoint: HttpEndpoint;
        requestBody: HttpRequestBody;
        context: ExpressServiceContext;
    }): ts.Statement[] {
        const DESERIALIZED_REQUEST_VARIABLE_NAME = "request";

        const referenceToExpressBody = ts.factory.createPropertyAccessExpression(
            expressRequest,
            context.base.externalDependencies.express.Request.body
        );

        // no validation required for `unknown` requests
        if (
            requestBody.type === "reference" &&
            context.type.resolveTypeReference(requestBody.requestBodyType)._type === "unknown"
        ) {
            return [
                this.getTryCatch({
                    expressRequest,
                    expressResponse,
                    next,
                    endpoint,
                    context,
                }),
            ];
        }

        return [
            ts.factory.createVariableStatement(
                undefined,
                ts.factory.createVariableDeclarationList(
                    [
                        ts.factory.createVariableDeclaration(
                            DESERIALIZED_REQUEST_VARIABLE_NAME,
                            undefined,
                            undefined,
                            this.deserializeRequest({
                                endpoint,
                                requestBodyType: requestBody,
                                referenceToBody: referenceToExpressBody,
                                context,
                            })
                        ),
                    ],
                    ts.NodeFlags.Const
                )
            ),

            ...context.base.coreUtilities.zurg.Schema._visitMaybeValid(
                ts.factory.createIdentifier(DESERIALIZED_REQUEST_VARIABLE_NAME),
                {
                    valid: (validRequestBody) => [
                        ts.factory.createExpressionStatement(
                            ts.factory.createBinaryExpression(
                                referenceToExpressBody,
                                ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                                validRequestBody
                            )
                        ),
                        this.getTryCatch({
                            expressRequest,
                            expressResponse,
                            next,
                            endpoint,
                            context,
                        }),
                    ],
                    invalid: (requestErrors) => {
                        const ERROR_VARIABLE_NAME = "error";
                        return [
                            ts.factory.createExpressionStatement(
                                context.base.externalDependencies.express.Response.json({
                                    referenceToExpressResponse:
                                        context.base.externalDependencies.express.Response.status({
                                            referenceToExpressResponse: expressResponse,
                                            status: 422,
                                        }),
                                    valueToSend: ts.factory.createObjectLiteralExpression([
                                        ts.factory.createPropertyAssignment(
                                            "errors",
                                            ts.factory.createCallExpression(
                                                ts.factory.createPropertyAccessExpression(
                                                    requestErrors,
                                                    ts.factory.createIdentifier("map")
                                                ),
                                                undefined,
                                                [
                                                    ts.factory.createArrowFunction(
                                                        undefined,
                                                        undefined,
                                                        [
                                                            ts.factory.createParameterDeclaration(
                                                                undefined,
                                                                undefined,
                                                                undefined,
                                                                ERROR_VARIABLE_NAME
                                                            ),
                                                        ],
                                                        undefined,
                                                        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                        ts.factory.createBinaryExpression(
                                                            ts.factory.createBinaryExpression(
                                                                ts.factory.createCallExpression(
                                                                    ts.factory.createPropertyAccessExpression(
                                                                        ts.factory.createArrayLiteralExpression(
                                                                            [
                                                                                ts.factory.createStringLiteral(
                                                                                    "request"
                                                                                ),
                                                                                ts.factory.createSpreadElement(
                                                                                    ts.factory.createPropertyAccessExpression(
                                                                                        ts.factory.createIdentifier(
                                                                                            ERROR_VARIABLE_NAME
                                                                                        ),
                                                                                        context.base.coreUtilities.zurg
                                                                                            .ValidationError.path
                                                                                    )
                                                                                ),
                                                                            ],
                                                                            false
                                                                        ),
                                                                        ts.factory.createIdentifier("join")
                                                                    ),
                                                                    undefined,
                                                                    [ts.factory.createStringLiteral(" -> ")]
                                                                ),
                                                                ts.factory.createToken(ts.SyntaxKind.PlusToken),
                                                                ts.factory.createStringLiteral(": ")
                                                            ),
                                                            ts.factory.createToken(ts.SyntaxKind.PlusToken),
                                                            ts.factory.createPropertyAccessExpression(
                                                                ts.factory.createIdentifier(ERROR_VARIABLE_NAME),
                                                                context.base.coreUtilities.zurg.ValidationError.message
                                                            )
                                                        )
                                                    ),
                                                ]
                                            )
                                        ),
                                    ]),
                                })
                            ),
                            ts.factory.createExpressionStatement(
                                ts.factory.createCallExpression(next, undefined, [requestErrors])
                            ),
                        ];
                    },
                }
            ),
        ];
    }

    private getTryCatch({
        expressRequest,
        expressResponse,
        next,
        endpoint,
        context,
    }: {
        expressRequest: ts.Expression;
        expressResponse: ts.Expression;
        next: ts.Expression;
        endpoint: HttpEndpoint;
        context: ExpressServiceContext;
    }): ts.TryStatement {
        return ts.factory.createTryStatement(
            ts.factory.createBlock(
                this.getStatementsForTryBlock({ expressRequest, expressResponse, next, endpoint, context }),
                true
            ),
            this.getCatchClause({ expressResponse, next, context, endpoint }),
            undefined
        );
    }

    private getStatementsForTryBlock({
        expressRequest,
        expressResponse,
        next,
        endpoint,
        context,
    }: {
        expressRequest: ts.Expression;
        expressResponse: ts.Expression;
        next: ts.Expression;
        endpoint: HttpEndpoint;
        context: ExpressServiceContext;
    }): ts.Statement[] {
        const statements: ts.Statement[] = [];

        // call impl
        statements.push(
            ts.factory.createExpressionStatement(
                ts.factory.createAwaitExpression(
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createThis(),
                                GeneratedExpressServiceImpl.METHODS_PROPERTY_NAME
                            ),
                            this.getEndpointMethodName(endpoint)
                        ),
                        undefined,
                        [
                            ts.factory.createAsExpression(
                                expressRequest,
                                ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                            ),
                            ts.factory.createObjectLiteralExpression(
                                [
                                    ts.factory.createPropertyAssignment(
                                        GeneratedExpressServiceImpl.SEND_RESPONSE_PROPERTY_NAME,
                                        ts.factory.createArrowFunction(
                                            [ts.factory.createToken(ts.SyntaxKind.AsyncKeyword)],
                                            undefined,
                                            endpoint.response != null
                                                ? [
                                                      ts.factory.createParameterDeclaration(
                                                          undefined,
                                                          undefined,
                                                          undefined,
                                                          GeneratedExpressServiceImpl.RESPONSE_BODY_PARAMETER_NAME
                                                      ),
                                                  ]
                                                : [],
                                            undefined,
                                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.factory.createBlock(
                                                [
                                                    ts.factory.createExpressionStatement(
                                                        endpoint.response != null
                                                            ? context.base.externalDependencies.express.Response.json({
                                                                  referenceToExpressResponse: expressResponse,
                                                                  valueToSend: context.expressEndpointTypeSchemas
                                                                      .getGeneratedEndpointTypeSchemas(
                                                                          this.packageId,
                                                                          endpoint.name
                                                                      )
                                                                      .serializeResponse(
                                                                          ts.factory.createIdentifier(
                                                                              GeneratedExpressServiceImpl.RESPONSE_BODY_PARAMETER_NAME
                                                                          ),
                                                                          context
                                                                      ),
                                                              })
                                                            : context.base.externalDependencies.express.Response.sendStatus(
                                                                  {
                                                                      referenceToExpressResponse: expressResponse,
                                                                      status: 204,
                                                                  }
                                                              )
                                                    ),
                                                ],
                                                true
                                            )
                                        )
                                    ),
                                    ts.factory.createPropertyAssignment(
                                        GeneratedExpressServiceImpl.SEND_COOKIE_RESPONSE_PROPERTY_NAME,
                                        context.base.externalDependencies.express.Response.cookie._getBoundReference({
                                            referenceToExpressResponse: expressResponse,
                                        })
                                    ),
                                    ts.factory.createPropertyAssignment(
                                        GeneratedExpressServiceImpl.LOCALS_PROPERTY_NAME,
                                        context.base.externalDependencies.express.Response.locals({
                                            referenceToExpressResponse: expressResponse,
                                        })
                                    ),
                                ],
                                true
                            ),
                        ]
                    )
                )
            )
        );

        // call next()
        statements.push(
            ts.factory.createExpressionStatement(ts.factory.createCallExpression(next, undefined, undefined))
        );

        return statements;
    }

    private getCatchClause({
        expressResponse,
        next,
        context,
        endpoint,
    }: {
        expressResponse: ts.Expression;
        next: ts.Expression;
        context: ExpressServiceContext;
        endpoint: HttpEndpoint;
    }): ts.CatchClause {
        const ERROR_NAME = "error";

        return ts.factory.createCatchClause(
            ts.factory.createVariableDeclaration(ts.factory.createIdentifier(ERROR_NAME)),
            ts.factory.createBlock(
                [
                    ts.factory.createExpressionStatement(
                        ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("console"),
                                ts.factory.createIdentifier("error")
                            ),
                            undefined,
                            [ts.factory.createIdentifier(ERROR_NAME)]
                        )
                    ),
                    ts.factory.createIfStatement(
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier(ERROR_NAME),
                            ts.factory.createToken(ts.SyntaxKind.InstanceOfKeyword),
                            context.genericAPIExpressError.getReferenceToGenericAPIExpressError().getExpression()
                        ),
                        ts.factory.createBlock(
                            [
                                this.generateWarnForUnexpectedError(endpoint, context),
                                ts.factory.createExpressionStatement(
                                    context.genericAPIExpressError.getGeneratedGenericAPIExpressError().send({
                                        error: ts.factory.createIdentifier(ERROR_NAME),
                                        expressResponse,
                                    })
                                ),
                            ],
                            true
                        ),
                        this.doNotHandleUnrecognizedErrors
                            ? undefined
                            : ts.factory.createBlock(
                                  [
                                      ts.factory.createExpressionStatement(
                                          context.base.externalDependencies.express.Response.json({
                                              referenceToExpressResponse:
                                                  context.base.externalDependencies.express.Response.status({
                                                      referenceToExpressResponse: expressResponse,
                                                      status: 500,
                                                  }),
                                              valueToSend: ts.factory.createStringLiteral("Internal Server Error"),
                                          })
                                      ),
                                  ],
                                  true
                              )
                    ),
                    ts.factory.createExpressionStatement(
                        ts.factory.createCallExpression(next, undefined, [ts.factory.createIdentifier(ERROR_NAME)])
                    ),
                ],
                true
            )
        );
    }

    private generateWarnForUnexpectedError(endpoint: HttpEndpoint, context: ExpressServiceContext): ts.Statement {
        const warnStatement = ts.factory.createExpressionStatement(
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("console"),
                    ts.factory.createIdentifier("warn")
                ),
                undefined,
                [
                    ts.factory.createBinaryExpression(
                        ts.factory.createBinaryExpression(
                            ts.factory.createTemplateExpression(
                                ts.factory.createTemplateHead(
                                    `Endpoint '${endpoint.name.originalName}' unexpectedly threw `
                                ),
                                [
                                    ts.factory.createTemplateSpan(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier(
                                                    GeneratedExpressServiceImpl.CATCH_BLOCK_ERROR_VARIABLE_NAME
                                                ),
                                                ts.factory.createIdentifier("constructor")
                                            ),
                                            ts.factory.createIdentifier("name")
                                        ),
                                        ts.factory.createTemplateTail(".")
                                    ),
                                ]
                            ),
                            ts.factory.createToken(ts.SyntaxKind.PlusToken),
                            ts.factory.createTemplateExpression(
                                ts.factory.createTemplateHead(" If this was intentional, please add "),
                                [
                                    ts.factory.createTemplateSpan(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createIdentifier(
                                                    GeneratedExpressServiceImpl.CATCH_BLOCK_ERROR_VARIABLE_NAME
                                                ),
                                                ts.factory.createIdentifier("constructor")
                                            ),
                                            ts.factory.createIdentifier("name")
                                        ),
                                        ts.factory.createTemplateTail(" to")
                                    ),
                                ]
                            )
                        ),
                        ts.factory.createToken(ts.SyntaxKind.PlusToken),
                        ts.factory.createStringLiteral(" the endpoint's errors list in your Fern Definition.")
                    ),
                ]
            )
        );

        if (endpoint.errors.length === 0) {
            return warnStatement;
        }

        return ts.factory.createSwitchStatement(
            context.genericAPIExpressError.getGeneratedGenericAPIExpressError().getErrorClassName({
                referenceToError: ts.factory.createIdentifier(
                    GeneratedExpressServiceImpl.CATCH_BLOCK_ERROR_VARIABLE_NAME
                ),
            }),
            ts.factory.createCaseBlock([
                ...endpoint.errors.map((error, index) =>
                    ts.factory.createCaseClause(
                        ts.factory.createStringLiteral(context.expressError.getErrorClassName(error.error)),
                        index < endpoint.errors.length - 1 ? [] : [ts.factory.createBreakStatement()]
                    )
                ),
                ts.factory.createDefaultClause([warnStatement]),
            ])
        );
    }

    private getReferenceToRouter(): ts.Expression {
        return ts.factory.createPropertyAccessExpression(
            ts.factory.createThis(),
            GeneratedExpressServiceImpl.ROUTER_PROPERTY_NAME
        );
    }

    private getPathParameterName(pathParameter: PathParameter): string {
        return pathParameter.name.originalName;
    }

    private getReferenceToParsedRequestBody({
        endpoint,
        requestBody,
        context,
    }: {
        endpoint: HttpEndpoint;
        requestBody: HttpRequestBody;
        context: ExpressServiceContext;
    }): ts.TypeNode {
        return HttpRequestBody._visit(requestBody, {
            inlinedRequestBody: () =>
                context.expressInlinedRequestBody
                    .getReferenceToInlinedRequestBodyType(this.packageId, endpoint.name)
                    .getTypeNode(),
            reference: ({ requestBodyType }) => context.type.getReferenceToType(requestBodyType).typeNode,
            fileUpload: () => {
                throw new Error("File upload is not supported");
            },
            _unknown: () => {
                throw new Error("Unknown HttpRequestBody: " + requestBody.type);
            },
        });
    }

    private deserializeRequest({
        endpoint,
        requestBodyType,
        referenceToBody,
        context,
    }: {
        endpoint: HttpEndpoint;
        requestBodyType: HttpRequestBody;
        referenceToBody: ts.Expression;
        context: ExpressServiceContext;
    }): ts.Expression {
        return HttpRequestBody._visit(requestBodyType, {
            inlinedRequestBody: () =>
                context.expressInlinedRequestBodySchema
                    .getGeneratedInlinedRequestBodySchema(this.packageId, endpoint.name)
                    .deserializeRequest(referenceToBody, context),
            reference: () =>
                context.expressEndpointTypeSchemas
                    .getGeneratedEndpointTypeSchemas(this.packageId, endpoint.name)
                    .deserializeRequest(referenceToBody, context),
            fileUpload: () => {
                throw new Error("File upload is not supported");
            },
            _unknown: () => {
                throw new Error("Unknown HttpRequestBody: " + requestBodyType.type);
            },
        });
    }

    private getMethodsInterfaceName(): string {
        return `${this.serviceClassName}Methods`;
    }
}
