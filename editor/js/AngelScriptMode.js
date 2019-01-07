// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// AngelScript mode.
// highlights keywords, strings, comments (no leveling supported! ("[==[")), tokens, basic indenting

;(function(mod) {
  if (typeof exports == 'object' && typeof module == 'object')
    // CommonJS
    mod(require('../../lib/codemirror'))
  else if (typeof define == 'function' && define.amd)
    // AMD
    define(['../../lib/codemirror'], mod)
  // Plain browser env
  else mod(CodeMirror)
})(function(CodeMirror) {
  'use strict'

  CodeMirror.defineMode('as', function(config, parserConfig) {
    var indentUnit = config.indentUnit

    function prefixRE(words) {
      return new RegExp('^(?:' + words.join('|') + ')', 'i')
    }
    function wordRE(words) {
      return new RegExp('^(?:' + words.join('|') + ')$', 'i')
    }
    var specials = wordRE(parserConfig.specials || [])

    // long list of standard functions from lua manual
    var builtins = wordRE(['_G', '_VERSION'])
    var keywords = wordRE([
      'and',
      'break',
      'class',
      'elseif',
      'false',
      'nil',
      'not',
      'or',
      'return',
      'true',
      'new',
      'if',
      'then',
      'else',
      'do',
      'while',
      'repeat',
      'until',
      'for',
      'in'
    ])
    var types = wordRE(['void', 'int', 'long', 'float'])

    var indentTokens = wordRE(['function', 'if', 'repeat', 'do', '\\(', '{'])
    var dedentTokens = wordRE(['\\)', '}'])
    var dedentPartial = prefixRE(['\\)', '}', 'else'])

    function readBracket(stream) {
      var level = 0
      while (stream.eat('=')) ++level
      stream.eat('[')
      return level
    }

    function normal(stream, state) {
      var ch = stream.next()
      if (ch == '/') {
        if (stream.eat('*')) {
          return (state.cur = bracketed(readBracket(stream), 'comment'))(
            stream,
            state
          )
        } else if (stream.eat('/')) {
          if (!stream.eat('*')) {
            stream.skipToEnd()
            return 'comment'
          } else {
            stream.skipToEnd()
            return 'meta'
          }
        }
      }
      if (ch == '"' || ch == "'") return (state.cur = string(ch))(stream, state)
      if (ch == '[' && /[\[=]/.test(stream.peek()))
        return (state.cur = bracketed(readBracket(stream), 'string'))(
          stream,
          state
        )
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w.%]/)
        return 'number'
      }
      if (/[\w_]/.test(ch)) {
        stream.eatWhile(/[\w\\_.]/)
        return 'variable'
      }
      if (ch == '#' && stream.eatWhile(/^((?! ).)*$/)) {
        return 'meta'
      }
      if (ch == '@' && stream.eatWhile(/^[a-zA-Z0-9_]/)) {
        return 'variable-2'
      }
      return null
    }

    function bracketed(level, style) {
      return function(stream, state) {
        var curlev = null,
          ch
        while ((ch = stream.next()) != null) {
          if (curlev == null) {
            if (ch == '*') curlev = 0
          } else if (ch == '=') ++curlev
          else if (ch == '/' && curlev == level) {
            state.cur = normal
            break
          } else curlev = null
        }
        return style
      }
    }

    function string(quote) {
      return function(stream, state) {
        var escaped = false,
          ch
        while ((ch = stream.next()) != null) {
          if (ch == quote && !escaped) break
          escaped = !escaped && ch == '\\'
        }
        if (!escaped) state.cur = normal
        return 'string'
      }
    }

    return {
      startState: function(basecol) {
        return { basecol: basecol || 0, indentDepth: 0, cur: normal }
      },

      token: function(stream, state) {
        if (stream.eatSpace()) return null
        var style = state.cur(stream, state)
        var word = stream.current()
        if (style == 'variable') {
          if (keywords.test(word)) style = 'keyword'
          else if (builtins.test(word)) style = 'builtin'
          else if (specials.test(word)) style = 'variable-2'
          else if (types.test(word)) style = 'type'
        }
        if (style != 'comment' && style != 'string') {
          if (indentTokens.test(word)) ++state.indentDepth
          else if (dedentTokens.test(word)) --state.indentDepth
        }
        return style
      },

      indent: function(state, textAfter) {
        var closing = dedentPartial.test(textAfter)
        return (
          state.basecol + indentUnit * (state.indentDepth - (closing ? 1 : 0))
        )
      },

      lineComment: '//',
      blockCommentStart: '/*',
      blockCommentEnd: '*/'
    }
  })

  CodeMirror.defineMIME('text/x-as', 'as')
})
