import assert from 'assert';
import {create_table} from '../src/js/code-analyzer';
//import {describe} from 'nyc';

describe('Json To Model' , () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(create_table('')),
            '[]'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(create_table('let a = 1;')),
            '[{"line":1,"type":"VariableDeclarator","name":"a","condition":"","value":"1"}]'
        );
    });
});

describe('Json To Model' , () => {
    it('is parsing example ',()=>{
        assert.equal(
            JSON.stringify(create_table('function binarySearch(X, V, n){\n' +
                '    let low, high, mid; low = 0;' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')), '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclarator","name":"low","condition":"","value":null},{"line":2,"type":"VariableDeclarator","name":"high","condition":"","value":null},{"line":2,"type":"VariableDeclarator","name":"mid","condition":"","value":null},{"line":2,"type":"AssignmentExpression","name":"low","condition":"","value":"0"},{"line":2,"type":"AssignmentExpression","name":"high","condition":"","value":"n-1"},{"line":3,"type":"WhileStatement","name":"","condition":"low<=high","value":""},{"line":4,"type":"AssignmentExpression","name":"mid","condition":"","value":"low+high/2"},{"line":5,"type":"IfStatement","name":"","condition":"X<V[mid]","value":""},{"line":6,"type":"AssignmentExpression","name":"high","condition":"","value":"mid-1"},{"line":7,"type":"ElseIfStatement","name":"","condition":"X>V[mid]","value":""},{"line":8,"type":"AssignmentExpression","name":"low","condition":"","value":"mid+1"},{"line":9,"type":"ElseStatement","name":"","condition":"","value":""},{"line":10,"type":"ReturnStatement","name":"","condition":"","value":"mid"},{"line":12,"type":"ReturnStatement","name":"","condition":"","value":"-1"}]');
    });

});

describe ('JSON To Model , FOR Statment',()=>{
    it('for' ,()=>{
        assert.equal(
            JSON.stringify(create_table('function binarySearch(X, V, n){\n' +
               '    let low, high, mid;\n' +
               '    low = 0;\n' +
               '    high = n - 1;\n' +
               '    for(i =0 ; i<7 ; i++){\n' +
               '        low++;\n' +
               '    }\n' +
               '    return -1;\n' +
               '}')) , '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclarator","name":"low","condition":"","value":null},{"line":2,"type":"VariableDeclarator","name":"high","condition":"","value":null},{"line":2,"type":"VariableDeclarator","name":"mid","condition":"","value":null},{"line":3,"type":"AssignmentExpression","name":"low","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","name":"high","condition":"","value":"n-1"},{"line":5,"type":"ForStatement","name":"","condition":";i<7;i++"},{"line":6,"type":"UpdateExpression","name":"low","condition":"","value":"low++"},{"line":8,"type":"ReturnStatement","name":"","condition":"","value":"-1"}]');
    });
});
describe ('Prefix Unary ',()=>{
    it('for' ,()=>{
        assert.equal(
            JSON.stringify(create_table('let a =0 ;++a;')) , '[{"line":1,"type":"VariableDeclarator","name":"a","condition":"","value":"0"},{"line":1,"type":"UpdateExpression","name":"a","condition":"","value":"++a"}]');
    });
});

describe ('a=a+1 ',()=>{
    it('for' ,()=>{
        assert.equal(
            JSON.stringify(create_table('let a =0 ;a=a+1;')) , '[{"line":1,"type":"VariableDeclarator","name":"a","condition":"","value":"0"},{"line":1,"type":"AssignmentExpression","name":"a","condition":"","value":"a+1"}]');
    });
});

describe ('Prefix Unary 2',()=>{
    it('for' ,()=>{
        assert.equal(
            JSON.stringify(create_table('let a = -3;')) , '[{"line":1,"type":"VariableDeclarator","name":"a","condition":"","value":"-3"}]');
    });
});
describe ('Prefix if statement',()=>{
    it('if not nested' ,()=>{
        assert.equal(
            JSON.stringify(create_table('let a = 0;\n' +
                'if(a < 9){\n' +
                '    a++;\n' +
                '}\n' +
                'else{\n' +
                '    a--;\n' +
                '}')) , '[{"line":1,"type":"VariableDeclarator","name":"a","condition":"","value":"0"},{"line":2,"type":"IfStatement","name":"","condition":"a<9","value":""},{"line":3,"type":"UpdateExpression","name":"a","condition":"","value":"a++"},{"line":4,"type":"ElseStatement","name":"","condition":"","value":""},{"line":6,"type":"UpdateExpression","name":"a","condition":"","value":"a--"}]');
    });
});


describe ('while statment and update exp',()=>{
    it('while' ,()=>{
        assert.equal(
            JSON.stringify(create_table('let x = 3;\n' +
                'let i = -2;\n' +
                'while(x < i){\n' +
                '    i++;\n' +
                '}')) , '[{"line":1,"type":"VariableDeclarator","name":"x","condition":"","value":"3"},{"line":2,"type":"VariableDeclarator","name":"i"' +
            ',"condition":"","value":"-2"},{"line":3,"type":"WhileStatement","name":"","condition":"x<i","value":""},{"line":4,"type":"UpdateExpression","' +
            'name":"i","condition":"","value":"i++"}]');
    });
});
describe ('return stat',()=>{
    it('return' ,()=>{
        assert.equal(
            JSON.stringify(create_table('function x (i){return i;}')) , '[{"line":1,"type":"FunctionDeclaration","name":"x","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"i","condition":"","value":""},{"line":1,"type":"ReturnStatement","name":"","condition":"","value":"i"}]');
    });
});