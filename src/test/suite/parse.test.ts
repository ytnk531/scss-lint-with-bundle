import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { ScssLintParser } from "../../scssLintParser";
// import * as myExtension from '../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");
  const tested = new ScssLintParser();

  test("process", () => {
    assert.deepStrictEqual(
      tested.process(
        "a.scss:2:1 [W] Indentation: line should be indented 2 spaces, but was indented 4 spaces\na.scss:4:10 [E] Indentation: line should be indented 2 spaces, but was indented 4 spaces"
      )
      , [{
        range: new vscode.Range(1, 0, 2, 0),
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Indentation: line should be indented 2 spaces, but was indented 4 spaces",
        source: "ScssLintB"
      },
      {
        range: new vscode.Range(3, 9, 4, 0),
        severity: vscode.DiagnosticSeverity.Error,
        message: "Indentation: line should be indented 2 spaces, but was indented 4 spaces",
        source: "ScssLintB"
      }]
    );
  });

  test("process returns empty array", () => {
    assert.deepStrictEqual(
      tested.process("")
      ,
      []
    );
  });

  test("processLine", () => {
    assert.deepStrictEqual(
      tested.processLine(
        "a.scss:2:1 [W] Indentation: line should be indented 2 spaces, but was indented 4 spaces"
      ),
      {
        range: new vscode.Range(1, 0, 2, 0),
        severity: vscode.DiagnosticSeverity.Warning,
        message: "Indentation: line should be indented 2 spaces, but was indented 4 spaces",
        source: "ScssLintB"
      }
    );
  });
});
