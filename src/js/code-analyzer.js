import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc :true});
};


export {parseCode};
const create_table = (codeToParse) => {
    return flattenArray(jsonToModel(parseCode(codeToParse)));
};
export {create_table};


function flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
}
function jsonToModel(parsecode){
    let models = [];
    if(parsecode.type === 'Program'|| parsecode.type === 'FunctionDeclaration'|| parsecode.type ==='BlockStatement'|| parsecode.type ==='VariableDeclaration'){
        models = models.concat(JsonToModelFunctionHead(parsecode));
    }
    else{
        models = models.concat(jsonToModelOther(parsecode));
    }
    return models;
}
function jsonToModelOther(parsecode){
    let models = [];
    if(parsecode.type === 'VariableDeclarator'|| parsecode.type === 'ExpressionStatement'|| parsecode.type ==='WhileStatement'){
        models = models.concat(JsonToModelBodys(parsecode));
    }
    else{
        models = models.concat(jsonToModelConds(parsecode));
    }
    return models;
}

function JsonToModelFunctionHead(parsecode){
    let models = [];
    switch (parsecode.type) {
    case 'Program' : parsecode.body.forEach(function (element) {models.push(jsonToModel(element));});break;
    case 'FunctionDeclaration': models.push(add_function_varaible(parsecode.id, parsecode.params));models.push(jsonToModel(parsecode.body ) ) ; break;
    case 'BlockStatement' : parsecode.body.forEach(function(element){models.push(jsonToModel(element));}); break;
    case 'VariableDeclaration' : parsecode.declarations.forEach(function (element) {models.push(jsonToModel(element));}) ;break;
    }
    return models;
}
function JsonToModelBodys(parsecode){
    let models = [];
    switch (parsecode.type) {
    case 'VariableDeclarator' : models.push({'line' : parsecode.id.loc.start.line ,'type':'VariableDeclarator','name' : parsecode.id.name ,'condition':'' ,'value' : parsecode.init == null? null : get_expression(parsecode.init) } );break;
    case 'ExpressionStatement' : models.push(handle_exprssion_statement(parsecode)); break;
    case 'WhileStatement' : models.push({'line': parsecode.loc.start.line, 'type' : 'WhileStatement', 'name' :'' , 'condition': create_condition(parsecode.test), 'value' : ''}); models.push(jsonToModel(parsecode.body ) );break;
    }
    return models;
}

function jsonToModelConds(parsecode ){
    let models = [];
    switch (parsecode.type) {
    case 'IfStatement' : models.push({'line': parsecode.loc.start.line, 'type' : 'IfStatement', 'name' :'' , 'condition': create_condition(parsecode.test), 'value' : ''}); models.push(if_handling(parsecode.consequent , parsecode.alternate));break;
    case 'ForStatement' : models.push({line : parsecode.loc.start.line , 'type' : 'ForStatement' , 'name' : '' ,'condition' : get_for_condition(parsecode)});models.push(jsonToModel(parsecode.body ) ); break;
    case 'ReturnStatement' : models.push({line: parsecode.loc.start.line , 'type': 'ReturnStatement' , 'name' : '' , 'condition':'','value': get_expression(parsecode.argument)});break;
    }
    return models;
}
function handle_exprssion_statement(parsecode){
    let models = [];
    if(parsecode.expression.type === 'AssignmentExpression' || parsecode.expression.type === 'BinaryExpression')
    {
        models.push({'line' :parsecode.expression.loc.start.line , 'type' : parsecode.expression.type , 'name' :get_expression(parsecode.expression.left) , 'condition' : '' , 'value' : get_expression(parsecode.expression.right)} );
    }
    else
    {
        if(parsecode.expression.prefix === false) {
            models.push({'line': parsecode.expression.loc.start.line, 'type': parsecode.expression.type, 'name': get_expression(parsecode.expression.argument), 'condition': '', 'value': get_expression(parsecode.expression.argument) + parsecode.expression.operator});
        }else{
            models.push({'line': parsecode.expression.loc.start.line, 'type': parsecode.expression.type, 'name': get_expression(parsecode.expression.argument), 'condition': '', 'value': parsecode.expression.operator +get_expression(parsecode.expression.argument)});
        }
    }
    return models;
}
function add_function_varaible(identifier , param ){
    let models = [];
    models.push({'line' : identifier.loc.start.line ,'type':'FunctionDeclaration','name' : identifier.name ,'condition':'' ,'value' : '' } );
    param.map(function (x){
        models.push({'line' : x.loc.start.line ,'type':'VariableDeclaration','name' : x.name,'condition':'' ,'value' : '' });
    });
    return models;
}
function get_expression(exp){
    let res = '';
    if(exp.type === 'Literal' || exp.type === 'Identifier'){
        res = res + get_expressin_basic(exp);
    }
    else{
        res = res + get_complex_expprsion(exp);
    }
    return res;
}
function get_expressin_basic(right){
    let res = '';
    switch(right.type) {
    case 'Literal': res = res + right.value; break;
    case 'Identifier' : res = res + right.name; break;
    }
    return res;
}
function get_for_condition(parsecode){
    let res = '';
    if(parsecode.init.type === 'VariableDeclaration'){
        res = parsecode.init.declarations[0].id.name + ' = ' +parsecode.init.declarations[0].init.value + ';' ;
    }
    else
        res += get_expression(parsecode.init) + ';' ;
    res += create_condition(parsecode.test) + ';';
    res +=  get_expression(parsecode.update);
    return res;

}

function get_complex_expprsion(right){
    let res = '';
    switch(right.type){
    case 'BinaryExpression' : res = res + get_expression(right.left) + right.operator + get_expression(right.right); break;
    case 'MemberExpression' : res = res + handle_member_expression(right) ; break;
    case 'UnaryExpression' : res = res + handle_Unary_Expression(right); break;
    case 'UpdateExpression' : res = res + get_expression(right.argument) + right.operator; break;
    }
    return res;
}
function handle_member_expression(exp){
    let res ='';
    if (exp.computed === true){
        res = res + exp.object.name +'[' + get_expression(exp.property) + ']' ;
    }
    else{
        res = res + exp.object.name + '.' + exp.property.name;
    }
    return res;
}

function handle_Unary_Expression(exp){
    let res ='';
    //if(exp.prefix == true){
    res = res + exp.operator + get_expression(exp.argument);
    /*}
    else{
        res = res + get_expprsion(exp.argument) + exp.operator ;
    }*/
    return res;
}
function create_condition(expression){
    let res = '';
    switch(expression.type){
    case 'BinaryExpression' : res = res + get_expression(expression.left) + expression.operator + get_expression(expression.right); break;
    //default : break;
    }
    return res;
}

function if_handling(con , alt){
    let models = [];
    if (alt === null)
        return if_handling_without_alt(con);
    if(con.type === 'BlockStatement') {
        con.body.forEach(function (element) {models.push(jsonToModel(element));});}
    else{
        models.push(jsonToModel(con));}
    if(alt.type === 'IfStatement'){
        models.push({'line': alt.loc.start.line, 'type' : 'ElseIfStatement', 'name' :'' , 'condition': create_condition(alt.test), 'value' : ''}); models.push(if_handling(alt.consequent , alt.alternate));
    }
    else{
        models.push({'line': alt.loc.start.line -1, 'type' : 'ElseStatement', 'name' :'' , 'condition': '', 'value' : ''});
        if(alt.type ==='BlockStatement') {
            alt.body.forEach(function (element) {models.push(jsonToModel(element));});}
        else{
            models.push(jsonToModel(alt));}
    }
    return models;
}
function if_handling_without_alt(con) {
    let models = [];
    con.body.forEach(function (element) {
        models.push(jsonToModel(element));
    });
    return models;
}