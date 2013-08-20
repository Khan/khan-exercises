
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
([\.0-9]+)\b         return 'NUM'
"+"                   return '+'
"-"                   return '-'
"*"                   return '*'
"/"                   return '/'
"^"                   return '^'
"!"                   return '!'
"("                   return '('
")"                   return ')'
"e"                   return 'E'
"pi"                  return 'PI'
"ans"                 return 'ANS'
[a-z]+                return 'FN'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%right UMINUS
%right '^'
%right '!'

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e '+' e
        {$$ = ["+", $1, $3];}
    | e '-' e
        {$$ = ["-", $1, $3];}
    | e '*' e
        {$$ = ["*", $1, $3];}
    | e '/' e
        {$$ = ["/", $1, $3];}
    | e '^' e
        {$$ = ["^", $1, $3];}
    | e '!'
        {$$ = ["!", $1];}
    | '-' e %prec UMINUS
        {$$ = ["-", $2];}
    | FN '(' e ')'
        {$$ = [$1, $3];}
    | '(' e ')'
        {$$ = $2;}
    | E
        {$$ = $1;}
    | PI
        {$$ = $1;}
    | ANS
        {$$ = $1;}
    | NUM
        {$$ = Number(yytext);}
    ;
