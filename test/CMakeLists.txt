cmake_minimum_required(VERSION 3.7.1)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++14")

set (CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/out)
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/out)

set(ASSET_DIR "data")

project(kepler_test DESCRIPTION "Kepler Engine Test")

file(GLOB_RECURSE SOURCES *.cpp *.h)
FOREACH(item ${SOURCES})
  IF(${item} MATCHES "/*\\/CMakeFiles\\/*/")
    LIST(REMOVE_ITEM SOURCES ${item})
  ENDIF()
ENDFOREACH()
message(${SOURCES})

add_executable(
  kepler_test
  ${SOURCES}
)
# use, i.e. don't skip the full RPATH for the build tree
SET(CMAKE_SKIP_BUILD_RPATH  FALSE)

# when building, don't use the install RPATH already
# (but later on when installing)
SET(CMAKE_BUILD_WITH_INSTALL_RPATH FALSE)

# the RPATH to be used when installing
SET(CMAKE_INSTALL_RPATH "")

# don't add the automatically determined parts of the RPATH
# which point to directories outside the build tree to the install RPATH
SET(CMAKE_INSTALL_RPATH_USE_LINK_PATH FALSE)
set_target_properties(kepler_test PROPERTIES LINK_FLAGS "-Wl,-rpath,$ORIGIN/")

# Include Kepler library
include_directories(../framework)
find_library(KEPLER_LIBRARY kepler PATHS ../framework/build ./build NO_DEFAULT_PATH)
message(${KEPLER_LIBRARY})
get_filename_component(KEPLER_LIBRARY_NAME ${KEPLER_LIBRARY} NAME)
add_custom_command(TARGET kepler_test POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
        "${KEPLER_LIBRARY}"            # Input file
        ./out/${KEPLER_LIBRARY_NAME})  # Output file
target_link_libraries(kepler_test ${KEPLER_LIBRARY})

# Copy assets
file(
  GLOB_RECURSE ASSETS
  *.obj
  *.spv
  *.jpg
  *.png
)
add_custom_command(
  TARGET kepler_test PRE_BUILD COMMAND ${CMAKE_COMMAND} -E
  make_directory ./out/${ASSET_DIR}
)
FOREACH(item ${ASSETS})
  get_filename_component(item_name item NAME)
  add_custom_command(TARGET kepler_test POST_BUILD
      COMMAND ${CMAKE_COMMAND} -E copy_if_different
          "${item}"
        ./out/${ASSET_DIR}/${$item_name})
ENDFOREACH()

message(${ASSETS})
