import ts from 'typescript'

export default {
  name: 'TS2JS',
  parse(source) {
    return ts.transpileModule(source, {}).outputText
  }
}
