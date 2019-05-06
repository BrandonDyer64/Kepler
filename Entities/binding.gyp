{
  'targets': [
    {
      'target_name': 'kepler-entities-native',
      'sources': [ 'src/kepler_entities.cc', 'src/Entity.cc', 'src/Event.cc', 'src/System.cc', 'src/help/Pool.cc', 'src/help/Timer.cc'],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")", "include"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      }
    }
  ]
}
