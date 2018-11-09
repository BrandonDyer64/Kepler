cmake_minimum_required(VERSION 3.0)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

project(kepler VERSION 0.0.1 DESCRIPTION "Kepler Engine API")

file(GLOB_RECURSE SOURCES *.cpp *.h)

add_library(kepler SHARED ${SOURCES})

set_target_properties(kepler PROPERTIES VERSION ${PROJECT_VERSION})
#set_target_properties(kepler PROPERTIES PUBLIC_HEADER Math/Vectors/Vec2.h)

# Use "sudo make install" to apply
install(TARGETS kepler DESTINATION /usr/lib)
