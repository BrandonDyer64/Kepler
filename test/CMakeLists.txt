cmake_minimum_required(VERSION 3.7.1)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

project(kepler_test DESCRIPTION "Kepler Engine Test")

file(GLOB_RECURSE SOURCES *.cpp *.h)
FOREACH(item ${SOURCES})
  IF(${item} MATCHES "/*\\/CMakeFiles\\/*/")
    LIST(REMOVE_ITEM SOURCES ${item})
  ENDIF(${item} MATCHES "/*\\/CMakeFiles\\/*/")
ENDFOREACH(item)
message(${SOURCES})

add_executable(
  kepler_test
  ${SOURCES}
)

#add_library(kepler SHARED IMPORTED)
#set_target_properties(kepler PROPERTIES IMPORTED_LOCATION ../bin/libkepler.so)
#target_include_directories(kepler_test PRIVATE ../)
include_directories(../framework)
#link_directories(../framework/bin)
find_library(KEPLER_LIBRARY kepler PATHS ../framework/build NO_DEFAULT_PATH)
message(${KEPLER_LIBRARY})
target_link_libraries(kepler_test ${KEPLER_LIBRARY})
