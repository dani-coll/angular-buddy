import * as vscode from 'vscode';

// TODO: take into account commented code
// If doesn't exists, returns the last line of the class component where we should add the function, otherwise undefined
export function getLineToAddFunction(functionName: string, componentDocument: vscode.TextDocument): number | undefined {
    const decoratorLine = getDecoratorLine(componentDocument);
    if (decoratorLine) {
        const classFirstLine = getClassFirstLine(decoratorLine, componentDocument);

        if (classFirstLine) {
            const classLastLine = getClassLastLine(classFirstLine, componentDocument);

            if (classLastLine && !existsFunctionInRange(functionName, classFirstLine.lineNumber, classLastLine.lineNumber, componentDocument)) {
                return classLastLine?.lineNumber;
            }
        }
    }

    return undefined;
}

function existsFunctionInRange(functionName: string, firstLine: number, lastLine: number, document: vscode.TextDocument): boolean {
    let openedBraces = 0;

    let functionFound = false;
    for (let i = firstLine; i <= lastLine; ++i) {
        const line = document.lineAt(i);
        let lineText = line.text;

        while (lineText.match('{')) {
            if (openedBraces === 1 && textMatchesFunction(lineText, functionName)) {
                functionFound = true;
                break;
            }

            ++openedBraces;
            lineText = lineText.substring(lineText.indexOf('{') + 1, lineText.length);
        }

        while (lineText.match('}')) {
            --openedBraces;
            lineText = lineText.substring(lineText.indexOf('}') + 1, lineText.length);

        }

        if (openedBraces === 1 && textMatchesFunction(lineText, functionName)) {
            functionFound = true;
            break;
        }
    }

    return functionFound;
}

function textMatchesFunction(text: string, functionName: string) {

    const bracedFunction = new RegExp(functionName + "\\((|.+)\\)");
    const arrowFunction = new RegExp(functionName + "(| +)=(| +)\\((|.+)\\)");

    return text.match(bracedFunction) || text.match(arrowFunction);
}


function getDecoratorLine(componentDocument: vscode.TextDocument): vscode.TextLine | null {
    for (let i = 0; i < componentDocument.lineCount; ++i) {
        const line = componentDocument.lineAt(i);

        if (line.text.includes('@Component')) {
            return line;
        }
    }

    return null;
}

function getClassFirstLine(decoratorLine: vscode.TextLine, componentDocument: vscode.TextDocument): vscode.TextLine | null {
    for (let i = decoratorLine.lineNumber; i < componentDocument.lineCount; ++i) {
        const line = componentDocument.lineAt(i);

        if (line.text.includes("export class ")) {
            return line;
        }
    }

    return null;
}

function getClassLastLine(firstLine: vscode.TextLine, componentDocument: vscode.TextDocument): vscode.TextLine | null {
    let openedBraces = 0;
    let opened = false;

    for (let i = firstLine.lineNumber; i < componentDocument.lineCount; ++i) {
        const line = componentDocument.lineAt(i);
        let lineText = line.text;

        while (lineText.match('{')) {
            opened = true;
            ++openedBraces;
            lineText = lineText.replace('{', '');
        }

        while (lineText.match('}')) {
            --openedBraces;
            lineText = lineText.replace('}', '');
        }

        if (opened && openedBraces === 0) {
            return line;
        }
    }

    return null;
}