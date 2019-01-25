#ifdef RENDER_API_OPENGL

// OpenGL
#include <glad/glad.h>

namespace Kepler {

class ShaderData {
public:
  GLuint vertex, fragment, program;
};

}

#endif
