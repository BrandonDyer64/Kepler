cmake_minimum_required(VERSION 3.0)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS "")
set(CMAKE_SHARED_LIBRARY_LINK_CXX_FLAGS "")
SET(CMAKE_CROSSCOMPILING 1)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17")

include(config.cmake)

project(kepler VERSION 0.0.1 DESCRIPTION "Kepler Engine API")

file(GLOB_RECURSE SOURCES *.cpp *.h)

add_library(kepler SHARED ${SOURCES})

set_target_properties(kepler PROPERTIES VERSION ${PROJECT_VERSION})

include_directories(${VULKAN_SDK_PATH}/include)
find_library(VULKAN_LIBRARY vulkan HINTS ${VULKAN_SDK_PATH}/lib)
target_link_libraries(kepler ${VULKAN_LIBRARY})

find_package(PkgConfig REQUIRED)
pkg_search_module(GLFW REQUIRED glfw3)
include_directories(${GLFW_INCLUDE_DIRS})
target_link_libraries(kepler ${GLFW_LIBRARIES})
target_link_libraries(kepler ${GLFW_STATIC_LIBRARIES})

# Use "sudo make install" to apply
#install(TARGETS kepler DESTINATION /usr/lib)
