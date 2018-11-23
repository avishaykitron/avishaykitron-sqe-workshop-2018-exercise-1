import $ from 'jquery';
import {create_table} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        //let parsedCode = parseCode(codeToParse);
        jsonToTable(create_table(codeToParse) ,'#avishay');
        //$('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});

function jsonToTable(model , sel) {
    $(sel).html('');
    let cols = create_col_header(model , sel);
    for(let i=0;i<model.length;i++){
        let row$ = $('<tr/>');
        for (let j = 0; j < cols.length; j++) {
            let cell = model[i][cols[j]];
            if (cell == null) cell = '';
            row$.append($('<td/>').html(cell));
        }
        $(sel).append(row$);
    }
}


function create_col_header(models , sel){
    let headerTr$ = $('<tr/>');
    let col = [];
    for(let i =0 ; i< models.length ; i++){
        let row = models[i];
        for(let key in row){
            if($.inArray(key , col) === -1){
                col.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(sel).append(headerTr$);
    return col;
}