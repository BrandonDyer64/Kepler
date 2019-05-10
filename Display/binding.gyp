{
  'targets': [
    {
      'target_name': 'kepler-display-native',
      'sources': [ "<!@(node -p \"require('fs').readdirSync('./src').map(f=>'src/'+f).join(' ')\")" ],
      'include_dirs': [
        "node_modules/kepler-glfw/glfw/include",
        "<!@(node -p \"require('node-addon-api').include\")",
        "include"
      ],
      'dependencies': [
        "node_modules/kepler-glfw/binding.gyp:kepler-glfw-native",
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
