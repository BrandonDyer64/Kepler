cmake_minimum_required(VERSION 3.0)
set(CMAKE_BUILD_TYPE Release)

# ------------------------------------------------------------------------------
set(KEPLER_VERSION "0.00.01")
set(KEPLER_CREDITS
  "Brandon Dyer"
  "Ian Green"
)
# ------------------------------------------------------------------------------

set(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS "")
set(CMAKE_SHARED_LIBRARY_LINK_CXX_FLAGS "")
SET(CMAKE_CROSSCOMPILING 1)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 -Wfatal-errors")

add_compile_definitions(LIB_KEPLER)
add_compile_definitions(ASSET_DIR="data")

message("┏━━━━━━━━━━━━━━━┓")
message("┃ Kepler Engine ┃  v${KEPLER_VERSION}")
message("┗━━━━━━━━━━━━━━━┛")

#include(config.cmake)

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
    _message("┃ ${ARGV}")
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

#libRocket
find_package(libRocket QUIET)
if (libRocket_FOUND)
  message(LOG "libRocket: Yes")
  include_directories(${LIBROCKET_INCLUDE_DIRS})
  target_link_libraries(kepler ${LIBROCKET_LIBRARIES})
  target_link_libraries(kepler ${LIBROCKET_STATIC_LIBRARIES})
else()
  message(LOG "libRocket: No")
endif()

# GLFW
find_package(glfw3 QUIET)
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
  target_link_libraries(kepler GL GLU GLEW)
  target_include_directories(kepler PUBLIC ./Engine/Glad/include)
endif()

add_compile_definitions(WINDOW_MANAGER="${WINDOW_MANAGER}")
message(LOG "Window Manager: ${WINDOW_MANAGER}")
add_compile_definitions(WINDOW_MANAGER_${WINDOW_MANAGER})

#_message("┡━━━━━━━━━━━━━━━━━━━━━━━━━━╸")
_message("")
_message("│ Made With </♥ > By")
FOREACH(item ${KEPLER_CREDITS})
  _message("│ ${item}")
ENDFOREACH()
#_message("└───────────────────────────")
_message("")

# Use "sudo make install" to apply
install(TARGETS kepler
  DESTINATION /usr/lib
)
