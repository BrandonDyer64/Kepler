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

function(message)
  list(GET ARGV 0 MessageType)
  if(MessageType STREQUAL FATAL_ERROR OR
     MessageType STREQUAL SEND_ERROR OR
     MessageType STREQUAL WARNING OR
     MessageType STREQUAL AUTHOR_WARNING)
    list(REMOVE_AT ARGV 0)
    _message(${MessageType} "${ARGV}")
  endif()
  if(MessageType STREQUAL LOG)
    list(REMOVE_AT ARGV 0)
    _message("${ARGV}")
  endif()
endfunction()

project(kepler DESCRIPTION "Kepler Engine API")

file(GLOB_RECURSE SOURCES *.cpp *.c)
FOREACH(item ${SOURCES})
  IF(${item} MATCHES "/*\\/CMakeFiles\\/*/")
    LIST(REMOVE_ITEM SOURCES ${item})
  ENDIF()
ENDFOREACH()

add_library(kepler SHARED ${SOURCES})

target_include_directories(
  kepler PUBLIC
  ./                             # Engine
  ./Engine/Lua/Sources           # Lua
  ./ThirdParty/libRocket/Include # libRocket
)

# GLFW
find_package(glfw3)
if (glfw_FOUND)
  set(WINDOW_MANAGER GLFW3)
  include_directories(${GLFW_INCLUDE_DIRS})
  target_link_libraries(kepler ${GLFW_LIBRARIES})
else()
  find_package(PkgConfig)
  if (PkgConfig_FOUND)
    pkg_search_module(GLFW glfw3)
    if (GLFW_FOUND)
      set(WINDOW_MANAGER GLFW3)
      include_directories(${GLFW_INCLUDE_DIRS})
      target_link_libraries(kepler ${GLFW_LIBRARIES})
      target_link_libraries(kepler ${GLFW_STATIC_LIBRARIES})
    endif()
  endif()
endif()

if (GLFW_FOUND OR glfw_FOUND)
  find_package(OpenGL REQUIRED)
  target_link_libraries(kepler GL GLU)
endif()

add_compile_definitions(WINDOW_MANAGER="${WINDOW_MANAGER}")
message(LOG "Window Manager: ${WINDOW_MANAGER}")
add_compile_definitions(WINDOW_MANAGER_${WINDOW_MANAGER})

# Use "sudo make install" to apply
install(TARGETS kepler DESTINATION /usr/lib)
