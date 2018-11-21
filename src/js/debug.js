

/*function flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
}
function jsonToModel(parsecode ){
    var models = [];
    if(parsecode == undefined) { return [];}
    switch (parsecode.type) {
    case 'Program' : parsecode.body.forEach(function (element) {models.push(jsonToModel(element));});break;
    case 'FunctionDeclaration': models.push(add_function_varaible(parsecode.id, parsecode.params));models.push(jsonToModel(parsecode.body ) ) ; break;
    case 'BlockStatement' : parsecode.body.forEach(function(element){models.push(jsonToModel(element));}); break;
    case 'VariableDeclaration' : parsecode.declarations.forEach(function (element) {models.push(jsonToModel(element));}) ;break;
    case 'VariableDeclarator' : models.push({'line' : parsecode.id.loc.start.line ,'type':'VariableDeclarator','name' : parsecode.id.name ,'condition':'' ,'value' : parsecode.init == null? null : get_expprsion(parsecode.init) } );break;
    case 'ExpressionStatement' : models.push(handle_exprssion_statement(parsecode)); break;
    case 'WhileStatement' : models.push({'line': parsecode.loc.start.line, 'type' : 'WhileStatement', 'name' :'' , 'condition': create_condition(parsecode.test), 'value' : ''}); models.push(jsonToModel(parsecode.body ) );break;
    case 'IfStatement' : models.push({'line': parsecode.loc.start.line, 'type' : 'IfStatement', 'name' :'' , 'condition': create_condition(parsecode.test), 'value' : ''}); models.push(if_handling(parsecode.consequent , parsecode.alternate));break;
    case 'ForStatement' : models.push({line : parsecode.loc.start.line , 'type' : 'ForStatement' , 'name' : '' ,'condition' : get_expprsion(parsecode.init) + ';' + create_condition(parsecode.test) + ';' + get_expprsion(parsecode.update)});models.push(jsonToModel(parsecode.body ) ); break;
    case 'ReturnStatement' : models.push({line: parsecode.loc.start.line , 'type': 'ReturnStatement' , 'name' : '' , 'condition':'','value': get_expprsion(parsecode.argument)});break;
    //case 'UpdateStatement' : models.push({'ine' : parsecode.loc.start.line , 'type' : parsecode.type , 'name' : get_expprsion(parsecode.argument) , 'condition' : '' , 'value' : get_expprsion(parsecode.argument) + parsecode.operator});break;
    //default : break;
    }
    return models;
}
function handle_exprssion_statement(parsecode){
    var models = [];
    if(parsecode.expression.type == 'AssignmentExpression' || parsecode.expression.type == 'BinaryExpression')
    {
        models.push({'line' :parsecode.expression.loc.start.line , 'type' : parsecode.expression.type , 'name' :parsecode.expression.left.name , 'condition' : '' , 'value' : get_expprsion(parsecode.expression.right)} );
    }
    else
    {
        if(parsecode.expression.prefix == false) {
            models.push({'ine': parsecode.expression.loc.start.line, 'type': parsecode.expression.type, 'name': get_expprsion(parsecode.expression.argument), 'condition': '', 'value': get_expprsion(parsecode.expression.argument) + parsecode.expression.operator});
        }else{
            models.push({'ine': parsecode.expression.loc.start.line, 'type': parsecode.expression.type, 'name': get_expprsion(parsecode.expression.argument), 'condition': '', 'value': parsecode.expression.operator +get_expprsion(parsecode.expression.argument)});
        }
    }
    return models;
}
function add_function_varaible(identifier , param ){
    var models = [];
    models.push({'line' : identifier.loc.start.line ,'type':'FunctionDeclaration','name' : identifier.name ,'condition':'' ,'value' : '' } );
    param.map(function (x){
        models.push({'line' : x.loc.start.line ,'type':'VariableDeclaration','name' : x.name,'condition':'' ,'value' : '' });
    });
    return models;
}
function get_expprsion(right){
    var res = '';
    switch(right.type){
        case 'Literal':  res = res + right.value; break;
        case 'Identifier' : res = res + right.name; break;
        case 'BinaryExpression' : res = res + get_expprsion(right.left) + right.operator + get_expprsion(right.right); break;
        case 'MemberExpression' : res = res + right.object.name +'[' + get_expprsion(right.property) + ']' ; break;
        case 'UnaryExpression' : res = res + handle_Unary_Expression(right); break;
        case 'UpdateExpression' : res = res + get_expprsion(right.argument) + right.operator; break;
    }
    return res;
}
function handle_Unary_Expression(exp){
    var res ='';
    if(exp.prefix == true){
        res = res + exp.operator + get_expprsion(exp.argument);
    }
    else{
        res = res + get_expprsion(exp.argument) + exp.operator ;
    }
    return res;
}
function create_condition(expression){
    var res = '';
    switch(expression.type){
        case 'BinaryExpression' : res = res + get_expprsion(expression.left) + expression.operator + get_expprsion(expression.right); break;
        //default : break;
    }
    return res;
}

function if_handling(con , alt){
    var models = [];
    if(con.type == 'BlockStatement') {
        con.body.forEach(function (element) {models.push(jsonToModel(element));});}
    else{
        models.push(jsonToModel(con));}
    if(alt.type == 'IfStatement'){
        models.push({'line': alt.loc.start.line, 'type' : 'ElseIfStatement', 'name' :'' , 'condition': create_condition(alt.test), 'value' : ''}); models.push(if_handling(alt.consequent , alt.alternate));
    }
    else{
        models.push({'line': alt.loc.start.line, 'type' : 'ElseStatement', 'name' :'' , 'condition': '', 'value' : ''});
        if(alt.type =='BlockStatement') {
            alt.body.forEach(function (element) {models.push(jsonToModel(element));});}
        else{
            models.push(jsonToModel(alt));}
    }
    return models;
}
var input = {
    'type': 'Program',
    'body': [
        {
            'type': 'FunctionDeclaration',
            'id': {
                'type': 'Identifier',
                'name': 'binarySearch',
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 9
                    },
                    'end': {
                        'line': 1,
                        'column': 21
                    }
                }
            },
            'params': [
                {
                    'type': 'Identifier',
                    'name': 'X',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 22
                        },
                        'end': {
                            'line': 1,
                            'column': 23
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'V',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 25
                        },
                        'end': {
                            'line': 1,
                            'column': 26
                        }
                    }
                },
                {
                    'type': 'Identifier',
                    'name': 'n',
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 28
                        },
                        'end': {
                            'line': 1,
                            'column': 29
                        }
                    }
                }
            ],
            'body': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'VariableDeclaration',
                        'declarations': [
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'low',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 11
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 8
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 11
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'high',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 13
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 17
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 13
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 17
                                    }
                                }
                            },
                            {
                                'type': 'VariableDeclarator',
                                'id': {
                                    'type': 'Identifier',
                                    'name': 'mid',
                                    'loc': {
                                        'start': {
                                            'line': 2,
                                            'column': 19
                                        },
                                        'end': {
                                            'line': 2,
                                            'column': 22
                                        }
                                    }
                                },
                                'init': null,
                                'loc': {
                                    'start': {
                                        'line': 2,
                                        'column': 19
                                    },
                                    'end': {
                                        'line': 2,
                                        'column': 22
                                    }
                                }
                            }
                        ],
                        'kind': 'let',
                        'loc': {
                            'start': {
                                'line': 2,
                                'column': 4
                            },
                            'end': {
                                'line': 2,
                                'column': 23
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 7
                                    }
                                }
                            },
                            'right': {
                                'type': 'Literal',
                                'value': 0,
                                'raw': '0',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 10
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 11
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 3,
                                    'column': 4
                                },
                                'end': {
                                    'line': 3,
                                    'column': 11
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 3,
                                'column': 4
                            },
                            'end': {
                                'line': 3,
                                'column': 12
                            }
                        }
                    },
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'AssignmentExpression',
                            'operator': '=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 8
                                    }
                                }
                            },
                            'right': {
                                'type': 'BinaryExpression',
                                'operator': '-',
                                'left': {
                                    'type': 'Identifier',
                                    'name': 'n',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 11
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 12
                                        }
                                    }
                                },
                                'right': {
                                    'type': 'Literal',
                                    'value': 1,
                                    'raw': '1',
                                    'loc': {
                                        'start': {
                                            'line': 4,
                                            'column': 15
                                        },
                                        'end': {
                                            'line': 4,
                                            'column': 16
                                        }
                                    }
                                },
                                'loc': {
                                    'start': {
                                        'line': 4,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 4,
                                        'column': 16
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 4,
                                    'column': 4
                                },
                                'end': {
                                    'line': 4,
                                    'column': 16
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 4,
                                'column': 4
                            },
                            'end': {
                                'line': 4,
                                'column': 17
                            }
                        }
                    },
                    {
                        'type': 'WhileStatement',
                        'test': {
                            'type': 'BinaryExpression',
                            'operator': '<=',
                            'left': {
                                'type': 'Identifier',
                                'name': 'low',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 11
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 14
                                    }
                                }
                            },
                            'right': {
                                'type': 'Identifier',
                                'name': 'high',
                                'loc': {
                                    'start': {
                                        'line': 5,
                                        'column': 18
                                    },
                                    'end': {
                                        'line': 5,
                                        'column': 22
                                    }
                                }
                            },
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 11
                                },
                                'end': {
                                    'line': 5,
                                    'column': 22
                                }
                            }
                        },
                        'body': {
                            'type': 'BlockStatement',
                            'body': [
                                {
                                    'type': 'ExpressionStatement',
                                    'expression': {
                                        'type': 'AssignmentExpression',
                                        'operator': '=',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'mid',
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 8
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 11
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'BinaryExpression',
                                            'operator': '/',
                                            'left': {
                                                'type': 'BinaryExpression',
                                                'operator': '+',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 15
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 18
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Identifier',
                                                    'name': 'high',
                                                    'loc': {
                                                        'start': {
                                                            'line': 6,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 6,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 15
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'Literal',
                                                'value': 2,
                                                'raw': '2',
                                                'loc': {
                                                    'start': {
                                                        'line': 6,
                                                        'column': 27
                                                    },
                                                    'end': {
                                                        'line': 6,
                                                        'column': 28
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 6,
                                                    'column': 14
                                                },
                                                'end': {
                                                    'line': 6,
                                                    'column': 28
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 6,
                                                'column': 8
                                            },
                                            'end': {
                                                'line': 6,
                                                'column': 28
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 6,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 6,
                                            'column': 29
                                        }
                                    }
                                },
                                {
                                    'type': 'IfStatement',
                                    'test': {
                                        'type': 'BinaryExpression',
                                        'operator': '<',
                                        'left': {
                                            'type': 'Identifier',
                                            'name': 'X',
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 13
                                                }
                                            }
                                        },
                                        'right': {
                                            'type': 'MemberExpression',
                                            'computed': true,
                                            'object': {
                                                'type': 'Identifier',
                                                'name': 'V',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 16
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 17
                                                    }
                                                }
                                            },
                                            'property': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 7,
                                                        'column': 18
                                                    },
                                                    'end': {
                                                        'line': 7,
                                                        'column': 21
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 7,
                                                    'column': 16
                                                },
                                                'end': {
                                                    'line': 7,
                                                    'column': 22
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 7,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 7,
                                                'column': 22
                                            }
                                        }
                                    },
                                    'consequent': {
                                        'type': 'ExpressionStatement',
                                        'expression': {
                                            'type': 'AssignmentExpression',
                                            'operator': '=',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'high',
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 16
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'BinaryExpression',
                                                'operator': '-',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 19
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'Literal',
                                                    'value': 1,
                                                    'raw': '1',
                                                    'loc': {
                                                        'start': {
                                                            'line': 8,
                                                            'column': 25
                                                        },
                                                        'end': {
                                                            'line': 8,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 8,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 8,
                                                        'column': 26
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 8,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 8,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 8,
                                                'column': 12
                                            },
                                            'end': {
                                                'line': 8,
                                                'column': 27
                                            }
                                        }
                                    },
                                    'alternate': {
                                        'type': 'IfStatement',
                                        'test': {
                                            'type': 'BinaryExpression',
                                            'operator': '>',
                                            'left': {
                                                'type': 'Identifier',
                                                'name': 'X',
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 17
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 18
                                                    }
                                                }
                                            },
                                            'right': {
                                                'type': 'MemberExpression',
                                                'computed': true,
                                                'object': {
                                                    'type': 'Identifier',
                                                    'name': 'V',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 21
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 22
                                                        }
                                                    }
                                                },
                                                'property': {
                                                    'type': 'Identifier',
                                                    'name': 'mid',
                                                    'loc': {
                                                        'start': {
                                                            'line': 9,
                                                            'column': 23
                                                        },
                                                        'end': {
                                                            'line': 9,
                                                            'column': 26
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 9,
                                                        'column': 21
                                                    },
                                                    'end': {
                                                        'line': 9,
                                                        'column': 27
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 9,
                                                    'column': 17
                                                },
                                                'end': {
                                                    'line': 9,
                                                    'column': 27
                                                }
                                            }
                                        },
                                        'consequent': {
                                            'type': 'ExpressionStatement',
                                            'expression': {
                                                'type': 'AssignmentExpression',
                                                'operator': '=',
                                                'left': {
                                                    'type': 'Identifier',
                                                    'name': 'low',
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 12
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 15
                                                        }
                                                    }
                                                },
                                                'right': {
                                                    'type': 'BinaryExpression',
                                                    'operator': '+',
                                                    'left': {
                                                        'type': 'Identifier',
                                                        'name': 'mid',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 18
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 21
                                                            }
                                                        }
                                                    },
                                                    'right': {
                                                        'type': 'Literal',
                                                        'value': 1,
                                                        'raw': '1',
                                                        'loc': {
                                                            'start': {
                                                                'line': 10,
                                                                'column': 24
                                                            },
                                                            'end': {
                                                                'line': 10,
                                                                'column': 25
                                                            }
                                                        }
                                                    },
                                                    'loc': {
                                                        'start': {
                                                            'line': 10,
                                                            'column': 18
                                                        },
                                                        'end': {
                                                            'line': 10,
                                                            'column': 25
                                                        }
                                                    }
                                                },
                                                'loc': {
                                                    'start': {
                                                        'line': 10,
                                                        'column': 12
                                                    },
                                                    'end': {
                                                        'line': 10,
                                                        'column': 25
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 10,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 10,
                                                    'column': 26
                                                }
                                            }
                                        },
                                        'alternate': {
                                            'type': 'ReturnStatement',
                                            'argument': {
                                                'type': 'Identifier',
                                                'name': 'mid',
                                                'loc': {
                                                    'start': {
                                                        'line': 12,
                                                        'column': 19
                                                    },
                                                    'end': {
                                                        'line': 12,
                                                        'column': 22
                                                    }
                                                }
                                            },
                                            'loc': {
                                                'start': {
                                                    'line': 12,
                                                    'column': 12
                                                },
                                                'end': {
                                                    'line': 12,
                                                    'column': 23
                                                }
                                            }
                                        },
                                        'loc': {
                                            'start': {
                                                'line': 9,
                                                'column': 13
                                            },
                                            'end': {
                                                'line': 12,
                                                'column': 23
                                            }
                                        }
                                    },
                                    'loc': {
                                        'start': {
                                            'line': 7,
                                            'column': 8
                                        },
                                        'end': {
                                            'line': 12,
                                            'column': 23
                                        }
                                    }
                                }
                            ],
                            'loc': {
                                'start': {
                                    'line': 5,
                                    'column': 24
                                },
                                'end': {
                                    'line': 13,
                                    'column': 5
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 5,
                                'column': 4
                            },
                            'end': {
                                'line': 13,
                                'column': 5
                            }
                        }
                    },
                    {
                        'type': 'ReturnStatement',
                        'argument': {
                            'type': 'UnaryExpression',
                            'operator': '-',
                            'argument': {
                                'type': 'Literal',
                                'value': 1,
                                'raw': '1',
                                'loc': {
                                    'start': {
                                        'line': 14,
                                        'column': 12
                                    },
                                    'end': {
                                        'line': 14,
                                        'column': 13
                                    }
                                }
                            },
                            'prefix': true,
                            'loc': {
                                'start': {
                                    'line': 14,
                                    'column': 11
                                },
                                'end': {
                                    'line': 14,
                                    'column': 13
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 14,
                                'column': 4
                            },
                            'end': {
                                'line': 14,
                                'column': 14
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 1,
                        'column': 30
                    },
                    'end': {
                        'line': 15,
                        'column': 1
                    }
                }
            },
            'generator': false,
            'expression': false,
            'async': false,
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 15,
                    'column': 1
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 15,
            'column': 1
        }
    }
}
var input2 =  {
    'type': 'Program',
    'body': [
        {
            'type': 'VariableDeclaration',
            'declarations': [
                {
                    'type': 'VariableDeclarator',
                    'id': {
                        'type': 'Identifier',
                        'name': 'a',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 5
                            }
                        }
                    },
                    'init': {
                        'type': 'UnaryExpression',
                        'operator': '-',
                        'argument': {
                            'type': 'Literal',
                            'value': 3,
                            'raw': '3',
                            'loc': {
                                'start': {
                                    'line': 1,
                                    'column': 9
                                },
                                'end': {
                                    'line': 1,
                                    'column': 10
                                }
                            }
                        },
                        'prefix': true,
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 8
                            },
                            'end': {
                                'line': 1,
                                'column': 10
                            }
                        }
                    },
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 4
                        },
                        'end': {
                            'line': 1,
                            'column': 10
                        }
                    }
                }
            ],
            'kind': 'let',
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 10
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 1,
            'column': 10
        }
    }
};

var inputt = {
    'type': 'Program',
    'body': [
        {
            'type': 'VariableDeclaration',
            'declarations': [
                {
                    'type': 'VariableDeclarator',
                    'id': {
                        'type': 'Identifier',
                        'name': 'a',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 4
                            },
                            'end': {
                                'line': 1,
                                'column': 5
                            }
                        }
                    },
                    'init': {
                        'type': 'Literal',
                        'value': 0,
                        'raw': '0',
                        'loc': {
                            'start': {
                                'line': 1,
                                'column': 8
                            },
                            'end': {
                                'line': 1,
                                'column': 9
                            }
                        }
                    },
                    'loc': {
                        'start': {
                            'line': 1,
                            'column': 4
                        },
                        'end': {
                            'line': 1,
                            'column': 9
                        }
                    }
                }
            ],
            'kind': 'let',
            'loc': {
                'start': {
                    'line': 1,
                    'column': 0
                },
                'end': {
                    'line': 1,
                    'column': 10
                }
            }
        },
        {
            'type': 'IfStatement',
            'test': {
                'type': 'BinaryExpression',
                'operator': '<',
                'left': {
                    'type': 'Identifier',
                    'name': 'a',
                    'loc': {
                        'start': {
                            'line': 2,
                            'column': 3
                        },
                        'end': {
                            'line': 2,
                            'column': 4
                        }
                    }
                },
                'right': {
                    'type': 'Literal',
                    'value': 9,
                    'raw': '9',
                    'loc': {
                        'start': {
                            'line': 2,
                            'column': 7
                        },
                        'end': {
                            'line': 2,
                            'column': 8
                        }
                    }
                },
                'loc': {
                    'start': {
                        'line': 2,
                        'column': 3
                    },
                    'end': {
                        'line': 2,
                        'column': 8
                    }
                }
            },
            'consequent': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'UpdateExpression',
                            'operator': '++',
                            'argument': {
                                'type': 'Identifier',
                                'name': 'a',
                                'loc': {
                                    'start': {
                                        'line': 3,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 3,
                                        'column': 5
                                    }
                                }
                            },
                            'prefix': false,
                            'loc': {
                                'start': {
                                    'line': 3,
                                    'column': 4
                                },
                                'end': {
                                    'line': 3,
                                    'column': 7
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 3,
                                'column': 4
                            },
                            'end': {
                                'line': 3,
                                'column': 8
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 2,
                        'column': 9
                    },
                    'end': {
                        'line': 4,
                        'column': 1
                    }
                }
            },
            'alternate': {
                'type': 'BlockStatement',
                'body': [
                    {
                        'type': 'ExpressionStatement',
                        'expression': {
                            'type': 'UpdateExpression',
                            'operator': '--',
                            'argument': {
                                'type': 'Identifier',
                                'name': 'a',
                                'loc': {
                                    'start': {
                                        'line': 6,
                                        'column': 4
                                    },
                                    'end': {
                                        'line': 6,
                                        'column': 5
                                    }
                                }
                            },
                            'prefix': false,
                            'loc': {
                                'start': {
                                    'line': 6,
                                    'column': 4
                                },
                                'end': {
                                    'line': 6,
                                    'column': 7
                                }
                            }
                        },
                        'loc': {
                            'start': {
                                'line': 6,
                                'column': 4
                            },
                            'end': {
                                'line': 6,
                                'column': 8
                            }
                        }
                    }
                ],
                'loc': {
                    'start': {
                        'line': 5,
                        'column': 4
                    },
                    'end': {
                        'line': 7,
                        'column': 1
                    }
                }
            },
            'loc': {
                'start': {
                    'line': 2,
                    'column': 0
                },
                'end': {
                    'line': 7,
                    'column': 1
                }
            }
        }
    ],
    'sourceType': 'script',
    'loc': {
        'start': {
            'line': 1,
            'column': 0
        },
        'end': {
            'line': 7,
            'column': 1
        }
    }
};


var result = (jsonToModel('{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0},"end":{}}}'));
var flat_res = flattenArray(result);

function remove_backSlash(str){
    return str.replace(/\\/gi, '');
}
var x =remove_backSlash('[{\\"line\\":1,\\"type\\":\\"VariableDeclarator\\",\\"name\\":\\"a\\",\\"condition\\":\\"\\",\\"value\\":\\"0\\"},{\\"line\\":1,\\"type\\":\\"AssignmentExpression\\",\\"name\\":\\"a\n' + '\\",\\"condition\\":\\"\\",\\"value\\":\\"a+1\\"}]');
console.log(x);*/