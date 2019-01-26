#ifndef glfw3_h

// Render APIs
#if defined(RENDER_API_OPENGL)
  // OpenGL
  #include <glad/glad.h>
#elif defined(RENDER_API_VULKAN)
  // Vulkan
  #include <vulkan/vulkan.h>
#endif

#include <GLFW/glfw3.h>

#endif
