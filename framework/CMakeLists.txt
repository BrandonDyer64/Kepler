cmake_minimum_required(VERSION 3.0)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS "")
set(CMAKE_SHARED_LIBRARY_LINK_CXX_FLAGS "")
SET(CMAKE_CROSSCOMPILING 1)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 -Wfatal-errors")

add_compile_definitions(LIB_KEPLER)
add_compile_definitions(ASSET_DIR="data")

option(PLATFORM "Target platform (Windows, Linux)" OFF)
if (NOT ${PLATFORM})
 set(PLATFORM Linux)
endif()
add_compile_definitions("__Platform${PLATFORM}")
add_compile_definitions(__Platform="${PLATFORM}")

option(RENDER_ENGINE "Target render engine (Vulkan, OpenGL, DX12, None)" OFF)
if (NOT ${RENDER_ENGINE})
  set(RENDER_ENGINE Vulkan)
endif()

option(IS_SERVER "Is this a server backend" OFF)
if (${IS_SERVER})
  add_compile_definitions("__Server")
  add_compile_definitions(__IsServer=true)
else()
  add_compile_definitions("__Client")
  add_compile_definitions(__IsServer=false)
  add_compile_definitions("__Render${RENDER_ENGINE}")
  add_compile_definitions(__RenderEngine="${RENDER_ENGINE}")
endif()

message("Kepler Engine")
message("Platform: ${PLATFORM}")
message("Render Engine: ${RENDER_ENGINE}")
message("Server: ${IS_SERVER}")

include(config.cmake)

project(kepler DESCRIPTION "Kepler Engine API")

file(GLOB_RECURSE SOURCES *.cpp *.c)
FOREACH(item ${SOURCES})
  IF(${item} MATCHES "/*\\/CMakeFiles\\/*/")
    LIST(REMOVE_ITEM SOURCES ${item})
  ENDIF()
ENDFOREACH()

add_library(kepler SHARED ${SOURCES})

#set_target_properties(kepler PROPERTIES VERSION ${PROJECT_VERSION})

include_directories(${VULKAN_SDK_PATH}/include)
find_library(VULKAN_LIBRARY vulkan HINTS ${VULKAN_SDK_PATH}/lib)
target_link_libraries(kepler ${VULKAN_LIBRARY})

find_package(PkgConfig REQUIRED)
pkg_search_module(GLFW REQUIRED glfw3)
include_directories(${GLFW_INCLUDE_DIRS})
target_link_libraries(kepler ${GLFW_LIBRARIES})
target_link_libraries(kepler ${GLFW_STATIC_LIBRARIES})

# Use "sudo make install" to apply
install(TARGETS kepler DESTINATION /usr/lib)
