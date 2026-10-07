function parseMudInfoJSON(str: string): any {
    return JSON.parse(str);
}

function parsePrerequisite(inputString: string): string[] | null {
    const regex = /\w+|[^\w\s]/g;
    return inputString.match(regex);
}

type TokenType = 'THEN' | 'AND' | 'OR' | 'COURSE_CODE' | 'PARENTHESIS' | 'OTHER';
type LogicalOp = 'AND' | 'OR' | 'NOT'

interface Token {
    type: TokenType;
    value: string;
}

interface PrereqTree {
    courseCode?: string;
    logicalOp?: LogicalOp;
    branches: PrereqTree[];
}

export function createEmptyPrereqTree(): PrereqTree {
    return { branches: [] };
}

export function tokenize(input: string): Token[] {
    const regex = /\b(AND|OR|THEN)\b|[\(\)]|[A-Z]{2,}\d{4,}[A-Z]*|\w+/g;
    const tokens: Token[] = [];
    let match: RegExpExecArray | null;

    while ((match = regex.exec(input))) {
        let tokenType: TokenType = 'OTHER';
        if (['AND', 'OR', 'THEN'].includes(match[0])) {
            tokenType = match[0] as TokenType;
        } else if (/^[A-Z]{2,}\d{4,}[A-Z]*$/.test(match[0])) {
            tokenType = 'COURSE_CODE';
        } else if (['(', ')'].includes(match[0])) {
            tokenType = 'PARENTHESIS';
        }
        tokens.push({ type: tokenType, value: match[0] });
    }
    return tokens;
}


export function parseTokens(tokens: Token[]): PrereqTree {
    const stack: PrereqTree[] = [createEmptyPrereqTree()];
    let currentTokenIndex = 0;

    while (currentTokenIndex < tokens.length) {
        const token = tokens[currentTokenIndex];

        switch (token.type) {
            case 'COURSE_CODE':
                stack[stack.length - 1].branches.push({ courseCode: token.value, branches: [] });
                break;
            case 'AND':
            case 'OR':
                const newNode = createEmptyPrereqTree();
                newNode.logicalOp = token.value as LogicalOp;
                stack[stack.length - 1].branches.push(newNode);
                stack.push(newNode);
                break;
            case 'PARENTHESIS':
                if (token.value === '(') {
                    const newNode = createEmptyPrereqTree();
                    stack[stack.length - 1].branches.push(newNode);
                    stack.push(newNode);
                } else {
                    stack.pop();
                }
                break;
        }
        currentTokenIndex++;
    }

    return stack[0].branches.length === 1 ? stack[0].branches[0] : stack[0];
}


// const inputText = "If undertaking an Undergraduate Degree THEN ( must have completed 1 of CS2040/CS2040C/CS2040S/YSC2229 at a grade of at least D AND must have completed 1 of CS1231/CS1231S/MA1100/MA1100T at a grade of at least D AND ( must have completed all of MA1511/MA1512 at a grade of at least D OR must have completed 1 of MA1102R/MA1312/MA1505/MA1507/MA1521/MA2002 at a grade of at least D))";
// const tokens = tokenize(inputText);
// const prereqTree = parseTokens(tokens);


/*
"If undertaking an Undergraduate Degree 
THEN ( must have completed 1 of CS2040/CS2040C/CS2040S/YSC2229 at a grade of at least D 
AND must have completed 1 of CS1231/CS1231S/MA1100/MA1100T at a grade of at least D 
AND ( must have completed all of MA1511/MA1512 at a grade of at least D 
        OR must have completed 1 of MA1102R/MA1312/MA1505/MA1507/MA1521/MA2002 at a grade of at least D))"
*/
