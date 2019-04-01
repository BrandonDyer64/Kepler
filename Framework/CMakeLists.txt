cmake_minimum_required(VERSION 3.0)
set(CMAKE_BUILD_TYPE Release)

set(KEPLER_VERSION "0.1.0")

include(Config.cmake)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++17 -Wfatal-errors")

add_compile_definitions(LIB_KEPLER)
add_compile_definitions(ASSET_DIR="data")

message("                                     ")
message("┏━━━━━━━━━━━━━━━┓                    ")
message("┃ Kepler Engine ┃  v${KEPLER_VERSION}")
message("┗━━━━━━━━━━━━━━━┛                    ")
message("                                     ")

include(${CMAKE_SOURCE_DIR}/CMake/Messaging.cmake)

project(Kepler DESCRIPTION "Kepler Engine Library")

file(GLOB_RECURSE SOURCES
  ${CMAKE_SOURCE_DIR}/Source/*.cpp
  ${CMAKE_SOURCE_DIR}/Source/*.cc
)

add_library(Kepler SHARED ${SOURCES})

target_include_directories(
  Kepler PUBLIC
  ${CMAKE_SOURCE_DIR}/Include
)

install(
  TARGETS Kepler
  DESTINATION /usr/lib
)
