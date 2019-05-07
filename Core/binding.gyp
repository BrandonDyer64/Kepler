{
  'targets': [
    {
      'target_name': 'kepler-core-native',
      'sources': [ 'src/kepler_core.cc'],
      'include_dirs': [
        "node_modules/kepler-entities/include",
        "node_modules/kepler-display/include",
        "<!@(node -p \"require('node-addon-api').include\")",
        "include"
      ],
      'dependencies': [
        "node_modules/kepler-entities/binding.gyp:kepler-entities-native",
        "node_modules/kepler-display/binding.gyp:kepler-display-native",
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
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
