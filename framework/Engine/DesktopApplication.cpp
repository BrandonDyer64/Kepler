#include <cmath>
#include "DesktopApplication.h"

#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>

#define GLM_FORCE_RADIANS
#define GLM_FORCE_DEPTH_ZERO_TO_ONE
#include <glm/vec4.hpp>
#include <glm/mat4x4.hpp>

#include "Vulkan/Instancer.cpp"

#include <iostream>

namespace Kepler {

DesktopApplication::DesktopApplication(bool isFullscreen, const char* title) {
  glfwInit();

  glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);

  // Get monitor size
  GLFWmonitor* monitor = glfwGetPrimaryMonitor();
  const GLFWvidmode * mode = glfwGetVideoMode(monitor);
  int monitor_width = mode->width;
  int monitor_height = mode->height;

  // Create window
  GLFWwindow* window = nullptr;
  if (isFullscreen) {
    window = glfwCreateWindow(monitor_width, monitor_height, title, monitor, nullptr);
  } else {
    int window_leg = std::min(monitor_width, monitor_height) - 200;
    window = glfwCreateWindow(window_leg / 2 * 3 , window_leg, title, nullptr, nullptr);
  }
  this->window = window;

  VkInstance vulkanInstance = CreateVulkanInstance();
  this->vulkanInstance = &vulkanInstance;

  // Gather Vulkan extensions
  uint32_t extensionCount = 0;
  vkEnumerateInstanceExtensionProperties(nullptr, &extensionCount, nullptr);

  std::cout << extensionCount << " extensions supported" << std::endl;
}

void DesktopApplication::WaitForClose() {
  while(!glfwWindowShouldClose((GLFWwindow *) this->window)) {
      glfwPollEvents();
  }

  glfwDestroyWindow((GLFWwindow *) this->window);

  glfwTerminate();
}

}
