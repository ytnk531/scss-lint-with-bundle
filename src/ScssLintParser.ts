import * as vscode from "vscode";
import * as os from "os";

export class ScssLintParser {
  constructor() {}

  public process(input: string): vscode.Diagnostic[] {
    return input
      .split(os.EOL)
      .filter(v => v !== "")
      .map(line => this.processLine(line));
  }

  public processLine(line: string): vscode.Diagnostic {
    let matched: any;
    matched = line.match(/.+:(\d+):(\d+) \[([WE])\] (.+)/);
    if (!matched || matched.length < 4) {
      throw Error();
    }

    const lineNum = parseInt(matched[1], 10) - 1;
    const charNum = parseInt(matched[2], 10) - 1;
    const severity =
      matched[3] === "W"
        ? vscode.DiagnosticSeverity.Warning
        : vscode.DiagnosticSeverity.Error;
    const message = matched[4];
    return {
      range: new vscode.Range(lineNum, charNum, lineNum + 1, 0),
      severity,
      message,
      source: "ScssLintB"
    };
  }
}
